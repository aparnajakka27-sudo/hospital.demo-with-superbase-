import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppointmentProvider } from "../context/AppointmentContext";
import BookAppointmentModal from "../components/BookAppointmentModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "HORIZON Super Speciality Hospital",
  description: "Advanced Healthcare. Compassionate Care.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <AppointmentProvider>
          {children}
          <BookAppointmentModal />
        </AppointmentProvider>
      </body>
    </html>
  );
}
