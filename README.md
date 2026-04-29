# 🎨 Trikriti Studio — Where Ideas Get Printed

A complete, production-ready eCommerce web application for a custom printing business.

---

## 🗂 Project Structure

```
trikriti-studio/
├── client/                    # Next.js 14 frontend (App Router)
│   ├── app/
│   │   ├── page.tsx           # Home page
│   │   ├── products/          # Products listing + detail pages
│   │   ├── custom/            # Custom products page
│   │   ├── blog/              # Blog & reels page
│   │   ├── track-order/       # Order tracking
│   │   ├── contact/           # Contact form
│   │   ├── checkout/          # Checkout with guest/UPI/COD
│   │   ├── order-success/     # Post-order confirmation
│   │   ├── privacy-policy/    # Privacy policy
│   │   ├── terms/             # Terms & conditions
│   │   └── admin/             # Admin panel (protected)
│   │       ├── login/
│   │       ├── orders/
│   │       └── products/
│   ├── components/
│   │   ├── layout/            # Navbar, Footer
│   │   ├── home/              # HeroSlider, FeaturedProducts, etc.
│   │   ├── product/           # ProductCard
│   │   └── ui/                # CartDrawer
│   ├── context/               # AuthContext, CartContext
│   └── lib/                   # Firebase, API client
│
├── server/                    # Node.js + Express backend
│   ├── models/                # Mongoose models (Product, Order)
│   ├── routes/                # Express routes
│   ├── controllers/           # Business logic
│   ├── middleware/            # Firebase auth verification
│   ├── config/                # Firebase admin, Cloudinary
│   └── seed/
│       ├── products.js        # ⭐ Pre-seeded product data (6 products)
│       └── seedProducts.js    # ⭐ Seed script runner
│
└── README.md
```

---

## ⚡ Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Firebase project (for auth)
- Cloudinary account (for images)

---

### 1. Clone & Install

```bash
git clone <your-repo>
cd trikriti-studio

# Install all dependencies at once
npm run install:all

# OR manually:
cd client && npm install
cd ../server && npm install
```

---

### 2. Configure Environment Variables

**Server — copy and fill:**
```bash
cd server
cp .env.example .env
```

Edit `server/.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/trikriti-studio
CLIENT_URL=http://localhost:3000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_service_account_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

# OR: Drop serviceAccountKey.json in /server/config/

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

ADMIN_EMAIL=studiotrikriti@gmail.com
```

**Client — copy and fill:**
```bash
cd client
cp .env.example .env.local
```

Edit `client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_ADMIN_EMAIL=studiotrikriti@gmail.com
```

---

### 3. 🌱 Seed the Database

```bash
# From root directory:
npm run seed

# OR from server directory:
cd server && npm run seed
```

**This seeds 6 products:**
- ✅ 3 normal products (T-shirt, Mug, Tote Bag)
- ✅ 3 custom products (Custom T-Shirt, Photo Mug, Business Cards)

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared 0 existing products
🌱 Seeded 6 products:
   1. [NORMAL] Classic Unisex T-Shirt — ₹509
   2. [NORMAL] Ceramic Coffee Mug — Printed — ₹314
   3. [NORMAL] Premium Canvas Tote Bag — ₹449
   4. [CUSTOM] Custom Name T-Shirt — ₹799
   5. [CUSTOM] Personalized Photo Mug — ₹399
   6. [CUSTOM] Custom Logo Business Cards — ₹299

✨ Seeding complete! Trikriti Studio is ready to go.
```

---

### 4. Run the Application

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App running on http://localhost:3000
```

---

## 🔑 Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable **Authentication → Email/Password**
4. Create a user: `studiotrikriti@gmail.com` with your password
5. Get **Web config** → paste into `client/.env.local`
6. Go to **Project Settings → Service Accounts → Generate new private key**
7. Save as `server/config/serviceAccountKey.json` OR copy values to `server/.env`

---

## ☁️ Cloudinary Setup

1. Create account at [cloudinary.com](https://cloudinary.com)
2. Copy Cloud Name, API Key, API Secret from dashboard
3. Paste into `server/.env`

---

## 🔐 Admin Panel

- URL: `http://localhost:3000/admin`
- Login: `studiotrikriti@gmail.com`
- Admin can:
  - ✅ View dashboard stats
  - ✅ Update product price
  - ✅ Update product discount
  - ✅ Toggle product stock (inStock)
  - ✅ View all orders
  - ✅ Update order status (Pending → Confirmed → Shipped → Delivered)
- Admin cannot:
  - ❌ Add products (use seed script)
  - ❌ Delete products (use seed script)

---

## 📦 Product Management

Products are **ONLY** managed via seed script:

```bash
# Edit products data:
nano server/seed/products.js

# Re-seed (clears and re-inserts all products):
cd server && npm run seed
```

---

## 🧾 API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List all products |
| GET | `/api/products/:id` | Single product |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/track/:orderId` | Track by order ID |
| GET | `/api/orders/track?email=` | Track by email |
| GET | `/api/admin/stats` | Dashboard stats (admin) |
| PATCH | `/api/admin/products/:id` | Update price/discount/stock (admin) |
| GET | `/api/admin/orders` | All orders (admin) |
| PATCH | `/api/admin/orders/:orderId` | Update order status (admin) |
| POST | `/api/contact` | Contact form submission |

---

## 🎨 Customization

### Replace Placeholder Images
- Banner images: Update `HeroSlider.tsx` image URLs
- Product images: Update product `image` field in `server/seed/products.js` with Cloudinary URLs, then re-seed
- Logo: Replace the logo placeholder in `Navbar.tsx` with an `<Image>` component pointing to your logo file

### Update UPI Details
- Edit `client/app/checkout/page.tsx` → search for "studiotrikriti@upi" and replace with your actual UPI ID

### Update Contact Info
- Edit `components/layout/Footer.tsx` and `app/contact/page.tsx`

### 3D Product Preview
- The custom section has a placeholder for Three.js or Spline 3D integration
- Edit `components/home/CustomSection.tsx` to integrate your 3D viewer

---

## 🚀 Production Deployment

**Backend (Railway / Render / VPS):**
```bash
cd server
npm start
```

**Frontend (Vercel — recommended for Next.js):**
```bash
cd client
npm run build
# Deploy to Vercel via CLI or GitHub integration
```

Set all environment variables in your deployment platform's settings.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | Firebase Auth (optional for users, required for admin) |
| Image Storage | Cloudinary |
| Fonts | Playfair Display + DM Sans (Google Fonts) |
| State | React Context (Auth + Cart) |
| Animations | CSS animations + Tailwind |

---

## 📧 Support

Email: studiotrikriti@gmail.com

---

*Built with ❤️ for Trikriti Studio — Where Ideas Get Printed*

---

## 🔑 Admin Credentials

| Field | Value |
|-------|-------|
| Email | studiotrikriti@gmail.com |
| Password | Shri@pranav2025 |

> Set this password in **Firebase Console → Authentication → Users → Create User** with the email above.

---

## 💳 UPI Payment Details

| Field | Value |
|-------|-------|
| UPI ID | 9175825605-2@ybl |

This is already configured in `/client/app/checkout/page.tsx`. Update it there if it changes.

---

## 🛍 Real Products (from official catalog)

| # | Product | Price | Discount | Final Price |
|---|---------|-------|----------|-------------|
| 1 | Mini Tumbler Lip Balm Holder Keychain | ₹250 | 40% | ₹150 |
| 2 | Aurora Prism Lamp | ₹2000 | 40% | ₹1200 |
| 3 | Luna Swirl Lamp | ₹2167 | 40% | ₹1300 |
| 4 | Custom Name Tumbler Keychain | ₹350 | 0% | ₹350 |
| 5 | Custom Engraved Lamp | ₹2500 | 0% | ₹2500 |
| 6 | Custom 3D Printed Gift | ₹499 | 0% | ₹499 |

> Add real product images to `/client/public/` matching the image filenames in seed/products.js when available.
