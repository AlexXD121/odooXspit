import { prisma } from "../lib/prisma";
import StockClient from "./StockClient";

export default async function StockPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return <StockClient products={products} />;
}
