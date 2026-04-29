"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";
import { Lock, Mail } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "studiotrikriti@gmail.com";
    if (email !== adminEmail) {
      toast.error("Access denied. Admin only.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Welcome back, Admin!");
      router.push("/admin");
    } catch {
      toast.error("Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="mx-auto flex items-center justify-center mb-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src="/trikriti.%20(4).png"
                alt="Trikriti Studio"
                width={100}
                height={50}
                priority
                className="h-20 w-20 object-contain"
              />
            </Link>
          </div>
          <h1 className="font-heading font-bold text-white text-2xl">Trikriti Studio</h1>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>

        <div className="bg-white/5 border border-white/10 p-8">
          <h2 className="font-heading font-semibold text-white text-xl mb-6">Sign In</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="studiotrikriti@gmail.com"
                  className="w-full bg-white/5 border border-white/10 pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-red placeholder-gray-600 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1.5 uppercase tracking-wide">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 pl-9 pr-4 py-3 text-white text-sm focus:outline-none focus:border-brand-red placeholder-gray-600 transition-colors"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-red text-white py-3 text-sm font-semibold hover:bg-brand-red-dark transition-colors mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Trikriti Studio Admin Panel v1.0
        </p>
      </div>
    </div>
  );
}
