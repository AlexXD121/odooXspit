import { getLocations } from "@/app/actions";
import LocationsClient from "./LocationsClient";

export default async function LocationsPage() {
  const locations = await getLocations('EXTERNAL');

  return <LocationsClient initialLocations={locations} />;
}
