# Kargo - Inventory OS

**Kargo** is a modern, real-time Inventory Management System designed for efficiency and clarity. It allows businesses to track stock movements, manage warehouses and locations, and oversee operations like receipts, deliveries, and adjustments.

## 🚀 Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (v4)
*   **Database:** PostgreSQL
*   **ORM:** Prisma
*   **Icons:** Lucide React
*   **Notifications:** Sonner

## ✨ Key Features

*   **Real-time Stock Tracking:** View live stock levels and movement history.
*   **Operations Management:**
    *   **Receipts:** Track incoming goods from vendors.
    *   **Deliveries:** Manage outgoing shipments to customers.
    *   **Adjustments:** Handle inventory loss or found items.
*   **Multi-Location Support:** Manage multiple warehouses, vendors, and customers.
*   **Responsive Design:** Fully optimized for desktop and mobile devices.
*   **Modern UI:** Clean, data-rich interface with dark mode accents.

## 🛠️ Setup & Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd kargo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    Ensure you have a PostgreSQL database running and update your `.env` file with the `DATABASE_URL`.

    ```bash
    # Push schema to database
    npx prisma db push
    ```

4.  **Seed the database (Demo Data):**
    Populate the database with realistic demo data (Products, Locations, Move History).
    ```bash
    npx prisma db seed
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

*   `app/`: Next.js App Router pages and layouts.
    *   `actions.ts`: Server Actions for data mutations.
    *   `lib/services.ts`: Business logic and database interactions.
*   `components/`: Reusable UI components (Sidebar, Skeleton, etc.).
*   `prisma/`: Database schema and seed scripts.
    *   `schema.prisma`: Data model definition.
    *   `seed-demo.ts`: Script to generate demo data.

## 🧪 Verification

To verify the system is working correctly:
1.  Run the seed script: `npx prisma db seed`
2.  Start the app: `npm run dev`
3.  Navigate to **Move History** to see the seeded transactions.
4.  Check **Settings > Warehouse** and **Settings > Locations** to see the seeded locations.

---
*Built for the odoo hackathon*
---
*login cresidentials.*
Login Credentials
Email: admin@kargo.com or staff@kargo.com
Password: password123
OTP (One-Time Password): 111111

---
Team Name : Spybytes

Team Leader : Dhaval Rathva
Age : 19
Email : dmr19104@gmail.com

Member 1 : Harsh J Patel
Age : 19
Email : harshjpatel2005@gmail.com

Member 2 : Garasiya Jaykumar Nandlal
Age : 20
Email : garasiyajay@gmail.com


Reviewer:- Aman Patel(ampa)
--- 
problem statement:-Build a modular Inventory Management System (IMS) that digitizes and
streamlines all stock-related operations within a business. The goal is to replace
manual registers, Excel sheets, and scattered tracking methods with a centralized,
real-time, easy-to-use app.
---
Demo Video Link:-
---
