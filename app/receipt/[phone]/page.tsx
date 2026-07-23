"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabase";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ReceiptPage() {
  const params = useParams();
  const phone = params.phone as string;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchReceiptData() {
      if (!phone) return;
      try {
        const searchParams = new URLSearchParams(window.location.search);
        const idParam = searchParams.get('id');

        let query = supabase.from('Booking Appointment').select('*');
        if (idParam) {
          query = query.eq('id', idParam);
        } else {
          query = query.eq('Phone', phone).order('created_at', { ascending: false }).limit(1);
        }

        const { data: records, error } = await query;

        if (error) throw error;
        if (records && records.length > 0) {
          setData(records[0]);
        }
      } catch (err) {
        console.log("Error fetching receipt data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReceiptData();
  }, [phone]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-semibold">Generating Receipt...</div>;
  }

  if (!data) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500 font-semibold">Receipt not found for this patient.</div>;
  }

  const handlePrint = () => {
    window.print();
  };

  // Generate deterministic receipt number based on phone and date
  const phoneStr = phone.toString();
  const receiptHash = phoneStr.split('').reduce((a, b) => { a = ((a << 5) - a) + b.charCodeAt(0); return a & a }, 0);
  const receiptNo = `RCP/${new Date(data.created_at).getFullYear()}/07/${Math.abs(receiptHash).toString().slice(0,4) || 1945}`;
  
  return (
    <div className="min-h-screen bg-gray-100 py-10 font-sans print:bg-white print:py-0">
      
      {/* Non-printable action bar */}
      <div className="max-w-[900px] mx-auto mb-6 flex justify-between items-center print:hidden px-4">
        <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
          <ArrowLeft size={16} /> Back
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg shadow-md transition-colors"
        >
          <Printer size={18} /> Print / Save as PDF
        </button>
      </div>

      {/* Printable Receipt Paper */}
      <div className="max-w-[900px] mx-auto bg-white p-10 md:p-14 shadow-lg border border-gray-200 print:shadow-none print:border-none print:p-0">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start border-b-2 border-blue-600 pb-6 mb-6 gap-6 sm:gap-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 flex items-center justify-center rounded-xl border-2 border-blue-100">
              {/* Simulated Hospital Logo */}
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
          
          <div className="text-center sm:text-right w-full sm:w-auto">
            <div className="bg-[#1A56A9] text-white font-bold tracking-widest text-sm py-1.5 px-6 inline-block mb-3">RECEIPT</div>
            <table className="text-xs text-left mx-auto sm:ml-auto sm:mr-0">
              <tbody>
                <tr><td className="pr-3 text-gray-500 font-semibold py-0.5">Receipt No</td><td className="font-bold text-gray-800">: {receiptNo}</td></tr>
                <tr><td className="pr-3 text-gray-500 font-semibold py-0.5">Date</td><td className="font-bold text-gray-800">: {new Date(data.created_at || new Date()).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td></tr>
                <tr><td className="pr-3 text-gray-500 font-semibold py-0.5">Time</td><td className="font-bold text-gray-800">: {new Date(data.created_at || new Date()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</td></tr>
                <tr><td className="pr-3 text-gray-500 font-semibold py-0.5">UHID</td><td className="font-bold text-gray-800">: HSP{Math.floor(100000 + Math.random() * 900000)}</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Patient & Doctor Details Grid */}
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
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Doctor Name</p>
            <p className="font-bold text-gray-900">{data.Doctor || 'Unassigned'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Department</p>
            <p className="font-bold text-gray-900">{data.Department || 'General'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Visit Type</p>
            <p className="font-bold text-gray-900">{data.booking_type === 'Online' ? 'Tele/Online' : 'OPD Consultation'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold mb-0.5">Token Number</p>
            <p className="font-bold text-gray-900">{data.token_number || 'N/A'}</p>
          </div>
        </div>

        {/* Billing Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="bg-[#1A56A9] text-white text-xs uppercase tracking-wider">
              <th className="py-2.5 px-4 text-center w-16">S.No.</th>
              <th className="py-2.5 px-4 text-left">Description</th>
              <th className="py-2.5 px-4 text-right w-40">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="text-sm font-semibold text-gray-800 border-b border-gray-200">
            <tr className="border-b border-dashed border-gray-200">
              <td className="py-3 px-4 text-center">1</td>
              <td className="py-3 px-4">OPD Consultation Fee</td>
              <td className="py-3 px-4 text-right">500.00</td>
            </tr>
            <tr className="border-b border-dashed border-gray-200">
              <td className="py-3 px-4 text-center">2</td>
              <td className="py-3 px-4">Service Charges</td>
              <td className="py-3 px-4 text-right">100.00</td>
            </tr>
          </tbody>
        </table>

        {/* Totals Section */}
        <div className="flex justify-end mb-10">
          <table className="text-sm text-right w-72">
            <tbody>
              <tr>
                <td className="py-1 text-gray-600 font-semibold text-left">Sub Total</td>
                <td className="py-1 font-bold text-gray-900">:</td>
                <td className="py-1 font-bold text-gray-900">₹ 600.00</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-600 font-semibold text-left">Discount</td>
                <td className="py-1 font-bold text-gray-900">:</td>
                <td className="py-1 font-bold text-gray-900">₹ 0.00</td>
              </tr>
              <tr className="text-base">
                <td className="py-1.5 text-gray-900 font-extrabold text-left">Total Amount</td>
                <td className="py-1.5 font-extrabold text-gray-900">:</td>
                <td className="py-1.5 font-extrabold text-gray-900">₹ 600.00</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-600 font-semibold text-left">Paid Amount</td>
                <td className="py-1 font-bold text-gray-900">:</td>
                <td className="py-1 font-bold text-gray-900">₹ 600.00</td>
              </tr>
              <tr>
                <td className="py-1 text-gray-600 font-semibold text-left">Payment Mode</td>
                <td className="py-1 font-bold text-gray-900">:</td>
                <td className="py-1 font-bold text-gray-900">Card (**** 4587)</td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-3">
                  <div className="border border-blue-300 bg-blue-50/50 flex justify-between items-center py-2 px-3 text-blue-900">
                    <span className="font-bold">Balance Amount</span>
                    <span className="font-bold">:</span>
                    <span className="font-extrabold">₹ 0.00</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer Section */}
        <div className="flex justify-between items-end border-t border-gray-200 pt-6">
          <div>
            <p className="text-xs font-bold text-gray-900 mb-1">Amount in Words:</p>
            <p className="text-sm font-semibold text-gray-700 mb-6">Six Hundred Rupees Only</p>
            
            <p className="text-xs font-bold text-blue-800">Thank you for choosing HORIZON SUPER SPECIALITY HOSPITAL.</p>
            <p className="text-xs font-medium text-gray-600 mt-0.5">We wish you good health!</p>
          </div>
          <div className="text-center">
            <p className="text-xs font-medium text-gray-600 mb-2">Authorized Signature</p>
            <div className="h-10 w-32 border-b border-gray-400 mx-auto flex items-end justify-center mb-1">
              <span className="font-serif italic text-2xl text-blue-900 opacity-80 leading-3 -mb-1">Manager</span>
            </div>
            <p className="text-[10px] font-bold text-gray-700">For HORIZON SUPER SPECIALITY HOSPITAL</p>
          </div>
        </div>

      </div>
    </div>
  );
}
