import { getMoveHistory } from "@/app/actions";
import MoveHistoryClient from "./MoveHistoryClient";

export default async function MoveHistoryPage() {
    const movements = await getMoveHistory();

    return <MoveHistoryClient initialMovements={movements} />;
}
