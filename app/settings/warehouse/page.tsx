import { getLocations } from "@/app/actions";
import WarehouseClient from "./WarehouseClient";

export default async function WarehousePage() {
  const warehouses = await getLocations('INTERNAL');

  return <WarehouseClient initialWarehouses={warehouses} />;
}
