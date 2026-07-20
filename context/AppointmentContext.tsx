"use client";
import React, { createContext, useContext, useState } from "react";

interface AppointmentContextType {
  isAppointmentModalOpen: boolean;
  setIsAppointmentModalOpen: (isOpen: boolean) => void;
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
}

const AppointmentContext = createContext<AppointmentContextType | undefined>(undefined);

export function AppointmentProvider({ children }: { children: React.ReactNode }) {
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("");

  return (
    <AppointmentContext.Provider value={{
      isAppointmentModalOpen,
      setIsAppointmentModalOpen,
      selectedDepartment,
      setSelectedDepartment
    }}>
      {children}
    </AppointmentContext.Provider>
  );
}

export function useAppointment() {
  const context = useContext(AppointmentContext);
  if (!context) throw new Error("useAppointment must be used within AppointmentProvider");
  return context;
}
