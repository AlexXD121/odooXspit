import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create Locations
  const locations = [
    { name: 'Main Warehouse', type: 'INTERNAL' },
    { name: 'Default Vendor', type: 'VENDOR' },
    { name: 'Default Customer', type: 'CUSTOMER' },
    { name: 'Inventory Loss', type: 'INVENTORY_LOSS' },
  ];

  for (const loc of locations) {
    const exists = await prisma.location.findFirst({
      where: { name: loc.name, type: loc.type },
    });

    if (!exists) {
      await prisma.location.create({ data: loc });
      console.log(`  Created Location: ${loc.name}`);
    } else {
      console.log(`  Location already exists: ${loc.name}`);
    }
  }

  // 2. Create Initial Products
  const products = [
    {
      name: 'Laptop Pro X1',
      sku: 'TECH-LAP-001',
      category: 'Electronics',
      description: 'High-performance laptop',
      minStock: 5,
    },
    {
      name: 'Ergonomic Chair',
      sku: 'FURN-CHR-002',
      category: 'Furniture',
      description: 'Comfortable office chair',
      minStock: 10,
    },
    {
      name: 'Wireless Mouse',
      sku: 'TECH-ACC-003',
      category: 'Electronics',
      description: 'Silent click mouse',
      minStock: 20,
    },
  ];

  for (const prod of products) {
    const exists = await prisma.product.findUnique({
      where: { sku: prod.sku },
    });

    if (!exists) {
      await prisma.product.create({ data: prod });
      console.log(`  Created Product: ${prod.name}`);
    } else {
      console.log(`  Product already exists: ${prod.name}`);
    }
  }

  // 3. Create Users
  const passwordHash = await bcrypt.hash('password123', 10);

  const users = [
    {
      email: 'admin@kargo.com',
      password: passwordHash,
      name: 'Admin User',
      role: 'MANAGER',
    },
    {
      email: 'staff@kargo.com',
      password: passwordHash,
      name: 'Staff User',
      role: 'STAFF',
    },
  ];

  for (const user of users) {
    const exists = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!exists) {
      await prisma.user.create({ data: user });
      console.log(`  Created User: ${user.email}`);
    } else {
      console.log(`  User already exists: ${user.email}`);
    }
  }

  console.log('✅ Seed completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
