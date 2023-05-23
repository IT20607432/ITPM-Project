import { useEffect, useState } from "react";

const useGeolocation = () => {
  const [locationData, setLocationData] = useState({
    longitude: null,
    latitude: null,
  });

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocationData({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }

    return () =>
      setLocationData({
        longitude: null,
        latitude: null,
      });
  }, [navigator]);

  return locationData;
};

export default useGeolocation;
