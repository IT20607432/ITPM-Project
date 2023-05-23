import { findNearest } from "geolib";
import colomboCities from "../const/geoloationDefaults";
import ICity from "../interfaces/ICity";

const nearestCity = ({
  longitude,
  latitude,
}: {
  longitude: number;
  latitude: number;
}) => {
  const nearestCity: any = findNearest(
    {
      latitude: latitude,
      longitude: longitude,
    },
    colomboCities
  );

  return nearestCity;
};

export default nearestCity;
