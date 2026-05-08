"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import useAxios from "@/lib/axios.service";
import useAuthStore from "@/lib/store/authStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { LoadingSpin } from "../components/Loading";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { apiPublic } = useAxios();
  const { login } = useAuthStore();
  const router = useRouter();

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
        const res = await apiPublic.post("/login", formData, { 
            withCredentials: true 
        });

        const { user, accessToken } = res.data;
        login(user, accessToken); 
        toast.success(`Selamat datang kembali, ${user.username}!`);
        router.push("/dashboard");
        
    } catch (err: any) {
        console.error("Login error:", err);
        const errorMessage = err.response?.data?.message || "Username atau Password salah!";
        toast.error(errorMessage);
    } finally {
        setLoading(false);
    }
};

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-blue-600 text-white shadow-lg shadow-blue-200 mb-4">
            <Lock size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Selamat Datang</h1>
          <p className="text-gray-500 mt-2">Silakan masuk ke akun Anda</p>
        </div>

        {/* Card Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/50 focus:bg-white"
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700">Lupa password?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-600 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all bg-gray-50/50 focus:bg-white"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all mt-8"
            >
              {loading ? <LoadingSpin text="Processing" /> : "Masuk"}
              <ArrowRight size={18} />
            </button>
          </form>

          {/* Footer Card */}
          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{" "}
              <a href="#" className="font-bold text-blue-600 hover:text-blue-700 transition-colors">
                Daftar sekarang
              </a>
            </p>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center mt-8 text-xs text-gray-400">
          © 2026 Evolve WA Platform. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}