# Innovillage Platform

<div align="center">
  <img src="https://res.cloudinary.com/dyfi4bwkp/image/upload/v1779622391/Screenshot_from_2026-05-24_18-31-40_oybwzo.png" alt="Innovillage Logo" width="100%" style="border-radius: 10px; box-shadow: 0 4px 8px rgba(0,0,0,0.1);"/>
</div>

<br />

<p align="center">
  <strong>A Modern Multi-Vendor Marketplace for Village Innovation & UMKM</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16"/>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19"/>
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"/>
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS"/>
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Midtrans-0052CC?style=for-the-badge&logo=mastercard&logoColor=white" alt="Midtrans"/>
</p>

<div align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a> •
  <a href="#-deployment">Deployment</a>
</div>

---

## 🚀 Overview

**Innovillage** is a sophisticated multi-vendor marketplace platform designed to empower local village innovations and UMKMs. It enables multiple stores to operate under one platform, offering a seamless experience for both sellers (Admin/Artisan) and buyers.

Built with **Next.js 16 (App Router)** and **Server Actions**, it offers a blazing fast, secure, and SEO-friendly experience.

## ✨ Key Features

### 🏢 Marketplace Architecture
-   **Multi-Vendor Support**: Platform supports multiple independent stores managed by different owners.
-   **Super Admin Role**: Centralized management for creating stores, overseeing platform statistics, and managing users.
-   **Role-Based Access**:
    -   **Super Admin**: Full platform control.
    -   **Store Admin (Owner)**: Management of their specific store, products, and staff.
    -   **Artisan (Staff)**: Order processing and product management within their assigned store.

### 🛍️ Client Experience
-   **Multi-Store Shopping**: Browse products from various local village stores.
-   **Smart Checkout**: Integrated logical shipping calculation.
-   **Secure Payments**: Seamless payment processing via Midtrans Gateway.
-   **Order Tracking**: Real-time status updates from production to delivery.
-   **Responsive Design**: Fully optimized for mobile, tablet, and desktop using Tailwind CSS.

### 🛡️ Dashboard & Management
-   **Store Management**: Admins can manage products, categories, and view store-specific analytics.
-   **Order Lifecycle**: Full management of orders (Pending -> Processing -> Shipped -> Completed).
-   **Financials**: Revenue tracking and sales reports per store.
-   **Staff Management**: Store owners can add Artisans to help manage operations.

## 🛠️ Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **UI Library**: [React 19](https://react.dev/), [shadcn/ui](https://ui.shadcn.com/), [Lucide Icons](https://lucide.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) (Animations)
-   **Backend & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Auth, Realtime)
-   **Storage**: [Cloudinary](https://cloudinary.com/) (Optimized Image Delivery)
-   **Forms**: [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/) Validation
-   **Payments**: [Midtrans](https://midtrans.com/)

## 🚀 Getting Started

### Prerequisites
-   Node.js 18.17+
-   npm, pnpm, or yarn

### Installation

1.  **Clone the repository**
    ```bash
    ```bash
    git clone https://github.com/Gioezzy/innovillage.git
    cd innovillage
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Setup Environment Variables**
    Create a `.env.local` file and add the following keys:

    ```env
    # Supabase (Database & Auth)
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

    # Cloudinary (Media Storage)
    CLOUDINARY_CLOUD_NAME=your_cloud_name
    CLOUDINARY_API_KEY=your_api_key
    CLOUDINARY_API_SECRET=your_api_secret

    # Midtrans (Payment Gateway)
    MIDTRANS_SERVER_KEY=your_server_key
    MIDTRANS_CLIENT_KEY=your_client_key
    MIDTRANS_IS_PRODUCTION=false
    ```

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000` to view the app.

## 📂 Project Structure

```bash
/
├── app/                  # Next.js 16 App Router
│   ├── (auth)/           # Login/Register routes group
│   ├── (main)/           # Public shopping pages (Cart, Shop, etc.)
│   ├── (protected)/      # User account & Design Studio
│   ├── admin/            # Admin Dashboard features
│   └── api/              # Server-side API endpoints
├── components/           # React Components
│   ├── admin/            # Admin-specific UI
│   ├── checkout/         # Checkout logic & Shipping rates
│   ├── design/           # Design Studio & Preview logic
│   └── ui/               # Shadcn UI primitives
├── lib/                  # Utilities
│   ├── actions/          # Server Actions (Orders, Analytics)
│   └── supabase/         # Database clients
└── public/               # Static assets
```

## 🔒 Security Measures

-   **Role-Based Access Control (RBAC)**: Strict separation between User and Admin routes.
-   **Server-Side Validation**: All inputs validated with Zod on the server.
-   **Secure Payments**: No credit card data stored locally; handled via tokenization.
-   **Patched**: Running on the latest secure version of Next.js 16.

## 🤝 Contributing

Contributions are welcome!
1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Did you find this project useful? Give it a ⭐ on GitHub!
  <br/>
  Created by <a href="https://github.com/Gioezzy">Gioezzy</a>
</p>
