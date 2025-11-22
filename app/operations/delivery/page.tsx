import { prisma } from "../../lib/prisma";
import DeliveryClient from "./DeliveryClient";

export default async function DeliveryPage() {
  const [deliveries, products] = await Promise.all([
    prisma.operation.findMany({
      where: { type: 'DELIVERY' },
      orderBy: { updatedAt: 'desc' },
      include: { moves: true }
    }),
    prisma.product.findMany()
  ]);

  return <DeliveryClient initialDeliveries={deliveries} products={products} />;
}
