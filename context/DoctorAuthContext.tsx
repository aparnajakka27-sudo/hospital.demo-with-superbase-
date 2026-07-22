"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "../lib/supabase";

interface DoctorUser {
  id: number | string;
  name: string;
  specialty: string;
  room: string;
}

interface DoctorAuthContextType {
  user: DoctorUser | null;
  login: (userId: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const DoctorAuthContext = createContext<DoctorAuthContextType | undefined>(undefined);

export function DoctorAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DoctorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session on mount
    const savedUser = localStorage.getItem("hospital_doctor_session");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Invalid session data");
        localStorage.removeItem("hospital_doctor_session");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (userId: string, pass: string) => {
    setIsLoading(true);
    try {
      // Offline fallback for testing
      const demoDoctors: Record<string, any> = {
        "smith": { id: "doc-1", name: "Dr. Smith (Cardiology)", specialty: "Cardiology", room: "OPD-101" },
        "jones": { id: "doc-2", name: "Dr. Jones (Neurology)", specialty: "Neurology", room: "OPD-102" },
        "patel": { id: "doc-3", name: "Dr. Patel (Orthopaedics)", specialty: "Orthopaedics", room: "OPD-103" },
        "kumar": { id: "doc-4", name: "Dr. Kumar (General)", specialty: "General", room: "OPD-104" }
      };

      if (pass === "demo" && demoDoctors[userId.toLowerCase()]) {
        const demoUser = demoDoctors[userId.toLowerCase()];
        setUser(demoUser);
        localStorage.setItem("hospital_doctor_session", JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true };
      }

      if (userId === "doctor123" && pass === "demo") {
        const demoUser = {
          id: "doc-demo-101",
          name: "Dr. Rohit",
          specialty: "Cardiology",
          room: "OPD-102"
        };
        setUser(demoUser);
        localStorage.setItem("hospital_doctor_session", JSON.stringify(demoUser));
        setIsLoading(false);
        return { success: true };
      }

      // Supabase verification (assume a Doctors table with User Id and Password columns)
      const { data, error } = await supabase
        .from("Doctors")
        .select("*")
        .eq("User Id", userId)
        .eq("Password", pass)
        .single();

      if (error || !data) {
        setIsLoading(false);
        return { success: false, error: "Invalid credentials or doctor not found." };
      }

      // Map Supabase columns to our interface
      const docUser: DoctorUser = {
        id: data.id || data["User Id"],
        name: data["Doctor Name"] || data.name || "Dr. " + userId,
        specialty: data.Specialization || data.specialty || "General Medicine",
        room: data.Room || "OPD-General",
      };

      setUser(docUser);
      localStorage.setItem("hospital_doctor_session", JSON.stringify(docUser));
      setIsLoading(false);
      return { success: true };

    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || "Login failed" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("hospital_doctor_session");
  };

  return (
    <DoctorAuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </DoctorAuthContext.Provider>
  );
}

export function useDoctorAuth() {
  const context = useContext(DoctorAuthContext);
  if (context === undefined) {
    throw new Error("useDoctorAuth must be used within a DoctorAuthProvider");
  }
  return context;
}
