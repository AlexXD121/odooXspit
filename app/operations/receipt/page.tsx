import { prisma } from "../../lib/prisma";
import ReceiptClient from "./ReceiptClient";

export default async function ReceiptPage() {
  const [receipts, products] = await Promise.all([
    prisma.operation.findMany({
      where: { type: 'RECEIPT' },
      orderBy: { updatedAt: 'desc' },
      include: { moves: true }
    }),
    prisma.product.findMany()
  ]);

  return <ReceiptClient initialReceipts={receipts} products={products} />;
}
