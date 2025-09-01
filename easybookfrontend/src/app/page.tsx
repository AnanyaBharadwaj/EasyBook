'use client';

import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import {
  Slot,
  BookSlotData,
  bookSlotAPI,
  fetchSlotsAPI,
} from '../api';

export default function HomePage() {
  const [courtId, setCourtId] = useState('Court-1');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);

  // ------------------- Fetch Slots -------------------
  const fetchSlots = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchSlotsAPI(courtId, date);
      setSlots(res.data);
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      console.error(error.response?.data?.message || error.message);
    }
    setLoading(false);
  }, [courtId, date]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  // ------------------- Book Slot -------------------
  const bookSlot = async (slot: Slot) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      window.location.href = '/login';
      return;
    }

    const name = prompt('Enter your name:');
    if (!name) return;

    const email = prompt('Enter your email:');
    if (!email) return;

    const phone = prompt('Enter your phone number:');
    if (!phone) return;

    const bookingData: BookSlotData = {
      name,
      email,
      phone,
      courtId: slot.courtId,
      date: slot.date,
      start: slot.start,
      end: slot.end,
    };

    try {
      const res = await bookSlotAPI(bookingData, token);
      alert(res.data.message || 'Booking successful!');
      fetchSlots();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || 'Booking failed');
    }
  };

  //Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  //Render 
  return (
    <main className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <div className="text-center sm:text-left">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-wide">
            EasyBook
          </h1>
          <p className="text-gray-500 mt-1 text-lg sm:text-xl italic">
            Your hassle-free court booking solution
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          {localStorage.getItem('token') ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 shadow-md transition-colors"
            >
              Logout
            </button>
          ) : (
            <a
              href="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-colors"
            >
              Login
            </a>
          )}
        </div>
      </div>
  
      <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
        <select
          value={courtId}
          onChange={(e) => setCourtId(e.target.value)}
          className="border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        >
          <option>Court-1</option>
          <option>Court-2</option>
        </select>
  
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none transition"
        />
  
        <button
          onClick={fetchSlots}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 shadow-md transition-colors"
        >
          Refresh
        </button>
      </div>
  
      {loading ? (
        <p className="text-center text-gray-600 text-lg">Loading...</p>
      ) : slots.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No available slots</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {slots.map((s, idx) => (
            <button
              key={`${s._id}-${idx}`}
              onClick={() => bookSlot(s)}
              className={`border rounded-lg p-4 text-left shadow hover:shadow-md transition-all duration-200 ${
                s.status === 'booked' ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              disabled={s.status === 'booked'}
            >
              <div className="font-semibold text-lg">{s.start} – {s.end}</div>
              <div className="text-gray-600">{s.courtId}</div>
              <div className="mt-1 text-blue-600 font-medium">₹{s.price ?? 0}</div>
              <div className="mt-2 text-sm text-gray-500">
                {s.status === 'available' ? 'Tap to book' : 'Booked'}
              </div>
            </button>
          ))}
        </div>
      )}
    </main>
  );
}  
