"use client"
import React, { useState, useEffect } from 'react'
import { Plus, BedDouble, Trash2, LayoutGrid, Layers, Home } from 'lucide-react'

export default function BedsAdminPage() {
  // State for Rooms and Beds
  const [rooms, setRooms] = useState<any[]>([]);
  const [beds, setBeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal States
  const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
  const [isBedModalOpen, setIsBedModalOpen] = useState(false);
  
  // Forms
  const [newRoom, setNewRoom] = useState({ floor: 'Floor 1', room_number: '', purpose: 'General Ward' });
  const [newBed, setNewBed] = useState({ floor: '', room_number: '', bed_number: '', type: 'Standard' });

  // Filter state for displaying beds
  const [activeFloor, setActiveFloor] = useState('All');

  useEffect(() => {
    // Load from localStorage for demo persistence since DB tables don't exist
    const savedRooms = localStorage.getItem('demo_hospital_rooms');
    const savedBeds = localStorage.getItem('demo_hospital_beds');
    
    if (savedRooms) setRooms(JSON.parse(savedRooms));
    if (savedBeds) setBeds(JSON.parse(savedBeds));
    
    setIsLoading(false);
  }, []);

  const saveToStorage = (key: string, data: any[]) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const room = { id: Date.now().toString(), ...newRoom };
    const updatedRooms = [...rooms, room];
    setRooms(updatedRooms);
    saveToStorage('demo_hospital_rooms', updatedRooms);
    setIsRoomModalOpen(false);
    setNewRoom({ floor: 'Floor 1', room_number: '', purpose: 'General Ward' });
  };

  const handleAddBed = (e: React.FormEvent) => {
    e.preventDefault();
    const bed = { id: Date.now().toString(), ...newBed, status: 'Available' };
    const updatedBeds = [...beds, bed];
    setBeds(updatedBeds);
    saveToStorage('demo_hospital_beds', updatedBeds);
    setIsBedModalOpen(false);
    setNewBed({ floor: '', room_number: '', bed_number: '', type: 'Standard' });
  };

  const deleteBed = (id: string) => {
    if (!confirm('Are you sure you want to delete this bed?')) return;
    const updatedBeds = beds.filter(b => b.id !== id);
    setBeds(updatedBeds);
    saveToStorage('demo_hospital_beds', updatedBeds);
  };

  const deleteRoom = (id: string) => {
    if (!confirm('Are you sure you want to delete this room? (All beds inside must be deleted manually)')) return;
    const updatedRooms = rooms.filter(r => r.id !== id);
    setRooms(updatedRooms);
    saveToStorage('demo_hospital_rooms', updatedRooms);
  };

  const floors = ['All', ...Array.from(new Set(rooms.map(r => r.floor)))];
  
  const displayedBeds = activeFloor === 'All' 
    ? beds 
    : beds.filter(b => b.floor === activeFloor);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Bed & Room Registration</h1>
          <p className="text-sm text-slate-500">Manage physical layout (Floors, Rooms, Beds).</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsRoomModalOpen(true)} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors">
            <LayoutGrid size={16} /> Add Room
          </button>
          <button onClick={() => setIsBedModalOpen(true)} className="flex items-center gap-2 bg-[#0a4d40] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#073a30] transition-colors">
            <Plus size={16} /> Add Bed
          </button>
        </div>
      </div>

      {/* Floors Filter & Stats */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-2 overflow-x-auto w-full pb-2 sm:pb-0">
          <Layers size={18} className="text-slate-400 mr-2 shrink-0" />
          {floors.map(f => (
            <button 
              key={f}
              onClick={() => setActiveFloor(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${activeFloor === f ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100'}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-sm whitespace-nowrap shrink-0">
          <span className="font-semibold text-slate-700">{rooms.length} Total Rooms</span>
          <span className="text-slate-300">|</span>
          <span className="font-semibold text-slate-700">{beds.length} Total Beds</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center text-slate-500 py-12">Loading data...</div>
          ) : displayedBeds.length === 0 ? (
            <div className="col-span-full text-center text-slate-500 py-12">No beds found. Register a Room first, then add a Bed to it.</div>
          ) : (
            displayedBeds.map(bed => {
              const parentRoom = rooms.find(r => r.floor === bed.floor && r.room_number === bed.room_number);
              return (
                <div key={bed.id} className="border border-slate-200 rounded-lg p-5 flex flex-col relative group bg-slate-50 hover:bg-white transition-colors hover:shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${bed.status === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      <BedDouble size={24} />
                    </div>
                    <button onClick={() => deleteBed(bed.id)} className="text-slate-400 hover:text-red-600 hidden group-hover:block transition-colors p-1 bg-white rounded shadow-sm border border-slate-100">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{bed.bed_number}</h3>
                  <div className="text-xs text-slate-500 font-medium space-y-1 mb-4 flex-1">
                    <p className="flex items-center gap-1.5"><Layers size={12}/> {bed.floor}</p>
                    <p className="flex items-center gap-1.5"><Home size={12}/> {bed.room_number} {parentRoom ? `(${parentRoom.purpose})` : ''}</p>
                    <p className="text-emerald-700 pt-1 font-semibold">{bed.type} Bed</p>
                  </div>
                  <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold mt-auto self-start border uppercase tracking-wider ${
                    bed.status === 'Available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'
                  }`}>
                    {bed.status}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Add Room Modal */}
      {isRoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsRoomModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Register New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Floor</label>
                <select required value={newRoom.floor} onChange={e => setNewRoom({...newRoom, floor: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="Floor 1">Floor 1</option>
                  <option value="Floor 2">Floor 2</option>
                  <option value="Floor 3">Floor 3</option>
                  <option value="Floor 4">Floor 4</option>
                  <option value="Floor 5">Floor 5</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Room Number / Name</label>
                <input required type="text" placeholder="e.g. 101 or Ward A" value={newRoom.room_number} onChange={e => setNewRoom({...newRoom, room_number: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Purpose / Department</label>
                <select required value={newRoom.purpose} onChange={e => setNewRoom({...newRoom, purpose: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                  <option value="General Ward">General Ward</option>
                  <option value="ICU">ICU</option>
                  <option value="Operation Theater">Operation Theater</option>
                  <option value="Maternity">Maternity</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Emergency (ER)">Emergency (ER)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                <button type="button" onClick={() => setIsRoomModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0a4d40] text-white rounded-lg text-sm font-medium hover:bg-[#073a30]">Save Room</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Bed Modal */}
      {isBedModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsBedModalOpen(false)}></div>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Register New Bed</h2>
            {rooms.length === 0 ? (
              <div className="text-amber-600 bg-amber-50 p-4 rounded-lg text-sm border border-amber-200">
                You must register at least one Room before you can add a Bed.
              </div>
            ) : (
              <form onSubmit={handleAddBed} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Floor</label>
                  <select required value={newBed.floor} onChange={e => setNewBed({...newBed, floor: e.target.value, room_number: ''})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="" disabled>Select Floor</option>
                    {Array.from(new Set(rooms.map(r => r.floor))).map(f => (
                      <option key={f as string} value={f as string}>{f as string}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                  <select required disabled={!newBed.floor} value={newBed.room_number} onChange={e => setNewBed({...newBed, room_number: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none disabled:opacity-50">
                    <option value="" disabled>Select Room</option>
                    {rooms.filter(r => r.floor === newBed.floor).map(r => (
                      <option key={r.id} value={r.room_number}>{r.room_number} - {r.purpose}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bed Number / Identifier</label>
                  <input required type="text" placeholder="e.g. Bed-01" value={newBed.bed_number} onChange={e => setNewBed({...newBed, bed_number: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Bed Type</label>
                  <select required value={newBed.type} onChange={e => setNewBed({...newBed, type: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                    <option value="Standard">Standard</option>
                    <option value="Motorized (ICU)">Motorized (ICU)</option>
                    <option value="Pediatric">Pediatric</option>
                    <option value="Maternity">Maternity</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
                  <button type="button" onClick={() => setIsBedModalOpen(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-[#0a4d40] text-white rounded-lg text-sm font-medium hover:bg-[#073a30]">Save Bed</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
