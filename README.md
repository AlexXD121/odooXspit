# Kargo - Inventory Management System

A high-performance Inventory Management System built with Next.js 14, TypeScript, Prisma, and PostgreSQL.

## Key Features

- **Double-Entry Inventory System**: Every stock change is tracked as a move from source to destination
- **Products Management**: Create and manage products with SKU, category, and minimum stock levels
- **Locations**: Track warehouses, vendors, customers, and inventory loss locations
- **Operations**: Handle receipts, deliveries, internal transfers, and adjustments
- **Stock Moves**: Complete audit trail of all inventory movements

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Styling**: Tailwind CSS
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 20.9+
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up your database connection in `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/kargo?schema=public"
```

3. Run Prisma migrations:
```bash
npx prisma migrate dev --name init
```

4. (Optional) Seed the database with default locations:
```bash
npx prisma db seed
```

5. Generate Prisma Client:
```bash
npx prisma generate
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Database Schema

The system uses a double-entry inventory model with these core entities:

- **User**: Simple authentication
- **Product**: Product catalog with current stock
- **Location**: Warehouses, vendors, customers, and loss locations
- **Operation**: Groups of stock moves (receipts, deliveries, etc.)
- **StockMove**: Individual inventory movements from source to destination

## Next Steps

1. Set up your PostgreSQL database
2. Update the `.env` file with your database connection string
3. Run migrations to create the database schema
4. Create seed data for default locations
5. Start building the UI components

## Project Structure

```
kargo/
├── app/              # Next.js app directory
├── prisma/           # Prisma schema and migrations
│   └── schema.prisma # Database schema
├── public/           # Static assets
└── .env             # Environment variables
```
