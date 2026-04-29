import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Trikriti Studio — Where Ideas Get Printed",
  description:
    "Premium custom printing services — T-shirts, mugs, tote bags, business cards and more. Quality printing, fast delivery.",
  keywords: ["custom printing", "t-shirt printing", "mug printing", "Trikriti Studio"],
  icons: {
    icon: "/favicon-32x32.png",
  },
  openGraph: {
    title: "Trikriti Studio",
    description: "Where Ideas Get Printed",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <CartProvider>
            <Toaster
              position="top-center"
              toastOptions={{
                style: {
                  fontFamily: "DM Sans, sans-serif",
                  borderRadius: "2px",
                  border: "1px solid #e0e0e0",
                },
                success: { iconTheme: { primary: "#E8191A", secondary: "#fff" } },
              }}
            />
            <Navbar />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
