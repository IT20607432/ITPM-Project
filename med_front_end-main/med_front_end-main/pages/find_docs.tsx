import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import nearestCity from "../utils/nearestCity";
import useGeolocation from "../hooks/useGeolocation";
import ICity from "../interfaces/ICity";

const ProtectedPage = () => {
  const [docData, setDocData] = useState(null);
  const [isFilter, setIsFilter] = useState(false);
  const [city, setCity] = useState<ICity | null>(null);

  const { latitude, longitude } = useGeolocation();
  const router = useRouter();

  const getDocData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/on_boarding/doc/data/`
    );

    if (res.status === 200) {
      const json = await res.json();
      setDocData(json);
    }
  };

  useEffect(() => {
    getDocData();
  }, []);

  useEffect(() => {
    if (longitude && latitude) {
      setCity(nearestCity({ longitude, latitude }));
    }
  }, [longitude, latitude]);

  return (
    <div className="min-h-screen h-full bg-slate-800">
      <section className="px-10 text-slate-200 font-medium">
        <div>
          Your City:{" "}
          {latitude && longitude
            ? nearestCity({ latitude, longitude }).name
            : "Location Access Not Given"}
        </div>
        <div className="flex space-x-4">
          <button
            className="bg-sky-700 rounded-lg px-4 py-2 text-slate-300 mt-2"
            onClick={() => setIsFilter((initFilter) => !initFilter)}
          >
            {isFilter ? "Remove Filter" : "Filter Nearby Docs"}
          </button>
          <button
            className="bg-red-500 rounded-lg bg-opacity-80 px-4 py-2 text-slate-300 mt-2"
            onClick={() => router.push("/inquires")}
          >
            Back to inquires
          </button>
        </div>
      </section>
      <section>
        <div className="grid grid-cols-3 px-10 gap-y-6 gap-x-10 pt-10">
          {docData?.map((item) => {
            if (!isFilter)
              return (
                <div className="text-slate-200 bg-slate-700 p-4 rounded-lg">
                  <section className="flex justify-between">
                    <h3>{item.doc_name}</h3>
                    {/* <p>{getRating().toFixed(1)}/5.0</p> */}
                  </section>
                  <p className="text-xs">{item.registration_number}</p>
                  <p className="text-xs">
                    {item?.locationData
                      ? nearestCity({
                          latitude: item?.locationData?.latitude,
                          longitude: item?.locationData?.longitude,
                        }).name
                      : "No Location Data"}
                  </p>
                </div>
              );
            if (
              item?.locationData &&
              nearestCity({
                latitude: item?.locationData?.latitude,
                longitude: item?.locationData?.longitude,
              }).name === city.name
            )
              return (
                <div className="text-slate-200 bg-slate-700 p-4 rounded-lg">
                  <section className="flex justify-between">
                    <h3>{item.doc_name}</h3>
                    {/* <p>{getRating().toFixed(1)}/5.0</p> */}
                  </section>
                  <p className="text-xs">{item.registration_number}</p>
                  <p className="text-xs">
                    {item?.locationData
                      ? nearestCity({
                          latitude: item?.locationData?.latitude,
                          longitude: item?.locationData?.longitude,
                        }).name
                      : "No Location Data"}
                  </p>
                </div>
              );
          })}
        </div>
      </section>
    </div>
  );
};

export default function FindDocs(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
