"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDoctorAuth } from "../../context/DoctorAuthContext";
import { Hospital, Lock, User, Eye, EyeOff, ArrowLeft, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import { supabase } from '../../lib/supabase';

export default function DoctorLogin() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isResetView, setIsResetView] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  
  const { login, isLoading } = useDoctorAuth();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!userId || !password) {
      setError("Please enter both User ID and Password");
      return;
    }

    const { success, error: loginError } = await login(userId, password);
    if (success) {
      router.push("/doctor-dashboard");
    } else {
      setError(loginError || "Invalid credentials");
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsResetLoading(true);
    setError("");
    setSuccessMsg("");
    
    try {
      if (!resetEmail) {
        throw new Error("Please enter your email address");
      }
      
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: window.location.origin + '/reset-password',
      });
      
      if (error) throw error;
      
      setSuccessMsg("Password reset link has been sent to your email.");
    } catch (err: any) {
      setError(err.message || "Failed to send reset email.");
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 flex flex-col justify-center items-center p-4 relative">
      
      {/* Back Button */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8">
        <Link href="/" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-medium bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 hover:shadow-md">
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden border border-gray-100/60"
      >
        <div className="bg-gradient-to-r from-primary to-[#1853b8] p-8 text-center relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white rounded-full blur-2xl"></div>
          </div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-sm mb-5 border border-white/20 shadow-inner">
              <ShieldCheck className="text-white" size={32} />
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              {isResetView ? "Reset Password" : "Clinical Portal"}
            </h2>
            <p className="text-blue-100 text-sm mt-1.5 font-medium">
              {isResetView ? "Enter your email to receive a reset link" : "Secure Access for Medical Professionals"}
            </p>
          </div>
        </div>

        <div className="p-8 pb-10">
          {error && (
            <div className="mb-5 bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-semibold text-center border border-red-100 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-5 bg-emerald-50 text-emerald-600 p-3.5 rounded-xl text-sm font-semibold text-center border border-emerald-100 flex items-center justify-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
              {successMsg}
            </div>
          )}

          {isResetView ? (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  </div>
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-gray-900"
                    placeholder="doctor@horizon.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isResetLoading}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(12,68,168,0.39)] hover:shadow-[0_6px_20px_rgba(12,68,168,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex justify-center items-center mt-4"
              >
                {isResetLoading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  "Send Reset Link"
                )}
              </button>

              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsResetView(false);
                    setError("");
                    setSuccessMsg("");
                  }}
                  className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Doctor User ID</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-gray-900"
                      placeholder="e.g. doctor123"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider ml-1">Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-12 py-3.5 bg-gray-50/50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm font-medium text-gray-900"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setIsResetView(true);
                      setError("");
                    }}
                    className="text-sm font-semibold text-primary hover:text-primary-hover transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-4 rounded-xl transition-all shadow-[0_4px_14px_0_rgb(12,68,168,0.39)] hover:shadow-[0_6px_20px_rgba(12,68,168,0.23)] hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex justify-center items-center mt-4"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </form>
              
              <div className="mt-8 text-center text-xs font-medium text-gray-400/80 space-y-2">
                <p>Authorized Personnel Only • IP Logged</p>
                <div className="text-gray-500 font-semibold bg-gray-50 py-2 px-3 rounded-lg inline-block border border-gray-100">
                  <p className="mb-1 text-gray-800">Demo User IDs (Password: <strong>demo</strong>)</p>
                  <div className="grid grid-cols-2 gap-2 text-left mt-2">
                    <div>• <span className="text-primary">smith</span> (Cardiology)</div>
                    <div>• <span className="text-primary">jones</span> (Neurology)</div>
                    <div>• <span className="text-primary">patel</span> (Orthopaedics)</div>
                    <div>• <span className="text-primary">kumar</span> (General)</div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
