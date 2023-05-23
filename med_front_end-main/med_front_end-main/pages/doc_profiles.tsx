import { Select } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import SessionReact from "supertokens-auth-react/recipe/session";
import { useSessionContext } from "supertokens-auth-react/recipe/session";

const ProtectedPage = () => {
  const router = useRouter();
  const [docData, setDocData] = useState([]);

  const getDocData = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API_URL}/api/on_boarding/doc/data/`
    );

    if (res.status === 200) {
      const json = await res.json();
      setDocData(json);
    }
  };

  const getRating = () => {
    return Math.random() * (4.5 - 1.5) + 1.5;
  };

  useEffect(() => {
    getDocData();
  }, []);

  return (
    <div className="bg-slate-800 min-h-screen h-full">
      <section className="flex justify-end p-4">
        <button
          className="bg-sky-700 rounded-lg px-4 py-2 text-slate-300"
          onClick={() => router.push("/inquires")}
        >
          Back to Inquires
        </button>
      </section>
      <div className="grid grid-cols-3 px-10 space-y-6  space-x-10">
        {docData.map((item) => (
          <div className="text-slate-200 bg-slate-700 p-4 rounded-lg">
            <section className="flex justify-between">
              <h3>{item.doc_name}</h3>
              <p>{getRating().toFixed(1)}/5.0</p>
            </section>
            <p className="text-xs">{item.registration_number}</p>
            <p className="text-xs">{item.qualifications}</p>

            <Select
              placeholder="Pick one"
              variant="filled"
              data={[
                { value: "react", label: "Great" },
                { value: "ng", label: "Good" },
                { value: "svelte", label: "Moderate" },
                { value: "vue", label: "Unsatisfactory" },
              ]}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default function Index(props) {
  return (
    <SessionReact.SessionAuth>
      <ProtectedPage />
    </SessionReact.SessionAuth>
  );
}
