import { prisma } from "../../lib/prisma";
import AdjustmentClient from "./AdjustmentClient";

export default async function AdjustmentPage() {
  const [adjustments, products] = await Promise.all([
    prisma.operation.findMany({
      where: { type: 'ADJUSTMENT' },
      orderBy: { updatedAt: 'desc' },
      include: {
        moves: {
          include: {
            product: true,
            sourceLocation: true,
            destLocation: true
          }
        }
      }
    }),
    prisma.product.findMany()
  ]);

  return <AdjustmentClient initialAdjustments={adjustments} products={products} />;
}
