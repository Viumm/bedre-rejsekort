import { getPassengers, getFavoriteStations } from "@/features/check-in/actions";
import { HomeClient } from "./home-client";

export default async function Home() {
  const [passengers, favoriteStations] = await Promise.all([
    getPassengers(),
    getFavoriteStations(),
  ]);

  return (
    <HomeClient
      initialPassengers={passengers}
      initialStations={favoriteStations}
              />
  );
}
