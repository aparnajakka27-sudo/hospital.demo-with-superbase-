"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function PrescriptionPage() {
  const params = useParams();
  const phone = params.phone as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPrescriptionData() {
      if (!phone) return;
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const createdParam = searchParams.get('created');

        let query = supabase.from('Booking Appointment').select('*');
        if (createdParam) {
          query = query.eq('created_at', createdParam);
        } else {
          query = query.eq('Phone', phone).order('created_at', { ascending: false }).limit(1);
        }

        const { data: records, error } = await query;

        if (error) throw error;
        if (records && records.length > 0) {
          setData(records[0]);
        }
      } catch (err) {
        console.log("Error fetching prescription data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrescriptionData();
  }, [phone]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-semibold">Generating Prescription...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 font-semibold">Prescription not found for this patient.</div>;
  }

  const handlePrint = () => {
    window.print();
  };
  
  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans print:bg-white print:py-0">
      
      {/* Non-printable action bar */}
      <div className="max-w-[900px] mx-auto mb-6 flex justify-between items-center print:hidden px-4">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <ArrowLeft size={16} /> Back
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          <Printer size={18} /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Prescription Paper */}
      <div className="max-w-[900px] mx-auto bg-white p-10 md:p-14 shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b-4 border-emerald-600 pb-6 mb-6 gap-6 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 flex items-center justify-center rounded-xl border-2 border-emerald-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-[#0B1B36] tracking-tight">HORIZON <span className="font-light">SUPER SPECIALITY</span> HOSPITAL</h1>
              <div className="text-[11px] text-gray-500 mt-1 space-y-0.5 font-medium">
                <p>123, HealthCare Road, Banjara Hills, Hyderabad, Telangana - 500034</p>
                <p>Phone: +91 40 1234 5678 | Email: info@horizonhospital.com</p>
                <p>Website: www.horizonhospital.com</p>
              </div>
            </div>
          </div>
          
          <div className="text-center sm:text-right flex flex-col items-center sm:items-end w-full sm:w-auto gap-2">
            <div className="bg-emerald-600 text-white font-bold tracking-widest text-sm py-1.5 px-6 inline-block rounded-full sm:rounded-l-full sm:rounded-r-none">e-PRESCRIPTION</div>
            <div className="bg-emerald-50 border-2 border-emerald-200 text-emerald-700 rounded-lg px-4 py-1.5 text-center inline-block">
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider mb-0.5">Token Number</p>
              <p className="text-3xl font-black leading-none">{data.token_number || 'N/A'}</p>
            </div>
            <div className="text-xs font-semibold text-gray-600 mt-1">
              <p>Consultation Date: {new Date(data.created_at || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
            </div>
          </div>
        </div>

        {/* Doctor Details */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center sm:items-end text-center sm:text-left">
          <div>
            <h2 className="text-xl font-extrabold text-emerald-900">{data.Doctor || 'Unassigned Doctor'}</h2>
            <p className="text-sm font-semibold text-gray-600 mt-1">{data.Department || 'General Department'}</p>
            <p className="text-xs text-gray-500 mt-0.5">Registration No: MED{Math.floor(10000 + Math.random() * 90000)}</p>
          </div>
        </div>

        {/* Patient Details Banner */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 md:p-5 mb-8 text-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Patient Name</p>
            <p className="font-bold text-gray-900">{data.Name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Age / Gender</p>
            <p className="font-bold text-gray-900">{data.age ? `${data.age} Years` : 'N/A'} / {data.gender || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Mobile</p>
            <p className="font-bold text-gray-900">{data.Phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Address</p>
            <p className="font-bold text-gray-900">Hyderabad, Telangana</p>
          </div>
          <div className="col-span-2 sm:col-span-4">
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Vitals Recorded</p>
            <p className="font-bold text-gray-900">Wt: {data.weight || '--'} | BP: {data["Blood Pressure"] || '--'} | Temp: {data.temperature || '--'}</p>
          </div>
        </div>

        {/* Diagnosis */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-2xl font-serif font-bold text-emerald-800 italic">Rx</span>
          </div>
          
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Diagnosis & Clinical Notes</h3>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{data.diagnosis_notes || "No clinical notes recorded."}</p>
          </div>

          {/* Medicines Table */}
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Prescribed Medicines</h3>
          
          {data.medicines_list && data.medicines_list.length > 0 ? (
            <table className="w-full mb-8 text-sm">
              <thead>
                <tr className="bg-emerald-50 text-emerald-900">
                  <th className="py-2.5 px-4 text-left font-bold rounded-l-lg">Medicine Name</th>
                  <th className="py-2.5 px-4 text-left font-bold">Dosage (Frequency)</th>
                  <th className="py-2.5 px-4 text-left font-bold rounded-r-lg">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data.medicines_list.map((med: any, idx: number) => (
                  <tr key={idx}>
                    <td className="py-4 px-4 font-bold text-gray-900">{idx + 1}. {med.name}</td>
                    <td className="py-4 px-4 font-semibold text-gray-700">{med.frequency}</td>
                    <td className="py-4 px-4 font-semibold text-gray-700">{med.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-gray-500 italic mb-8">No medicines prescribed.</p>
          )}
        </div>

        <div className="mb-12">
          <h3 className="text-sm font-bold text-gray-800 border-b border-gray-200 pb-2 mb-3">Special Instructions / Follow-up</h3>
          <p className="text-sm text-gray-700">Please review with the doctor after completion of the prescribed course. Maintain a healthy diet and stay hydrated.</p>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-end pt-6 mt-10">
          <div>
            <p className="text-[11px] text-gray-500 max-w-xs">This is a digitally generated e-prescription and does not require a physical signature if shared via the hospital's official channels.</p>
          </div>
          <div className="text-center">
            <div className="h-10 w-40 mx-auto flex items-end justify-center mb-1">
              <span className="font-serif italic text-xl text-emerald-900 opacity-80 leading-3">Approved</span>
            </div>
            <div className="w-40 border-t-2 border-gray-800 mx-auto pt-1">
              <p className="text-xs font-bold text-gray-900">{data.Doctor || 'Consulting Doctor'}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
