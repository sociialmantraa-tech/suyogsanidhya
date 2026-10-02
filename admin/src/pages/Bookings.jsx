import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { Calendar, Mail, Phone, ChevronRight, User } from 'lucide-react';

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [apiMsg, setApiMsg] = useState('');

  const fetchBookings = () => {
    setLoading(true);
    adminApi.get('/admin/bookings.php')
      .then(res => {
        setBookings(res.bookings || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSelectBooking = (id) => {
    adminApi.get(`/admin/bookings.php?id=${id}`)
      .then(res => {
        if (res && res.booking) {
          setSelectedBooking(res.booking);
          setUpdateStatus(res.booking.booking_status);
          setNotes(res.booking.notes || '');
          setApiMsg('');
        }
      })
      .catch(err => console.error(err));
  };

  const handleUpdateSubmit = async () => {
    if (!selectedBooking) return;
    setApiMsg('Updating booking...');

    try {
      const res = await adminApi.post('/admin/bookings.php', {
        id: selectedBooking.id,
        booking_status: updateStatus,
        notes: notes
      });

      if (res && res.success) {
        setApiMsg('Booking updated successfully!');
        // Refresh details
        handleSelectBooking(selectedBooking.id);
        fetchBookings();
      } else {
        throw new Error(res.error || "Failed to update.");
      }
    } catch (err) {
      setApiMsg(`Error: ${err.message}`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
      
      {/* Bookings List (7 Columns) */}
      <div className="lg:col-span-7 bg-white border border-gray-200 p-6 shadow-sm space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700 border-b border-gray-150 pb-3">Active Schedules</h3>
        
        {loading ? (
          <p className="text-xs text-gray-500 py-6 text-center">Loading list...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="p-3">Reference</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Session Date</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map(b => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="p-3 font-semibold text-gray-700">{b.booking_reference}</td>
                    <td className="p-3 text-gray-600">{b.customer_name}</td>
                    <td className="p-3 text-gray-600">{b.booking_date} @ {b.booking_time.substring(0, 5)}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 font-bold uppercase tracking-widest text-[8px] ${
                        b.booking_status === 'confirmed' 
                          ? 'bg-green-50 text-green-700' 
                          : b.booking_status === 'pending_payment' 
                          ? 'bg-yellow-50 text-yellow-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {b.booking_status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button 
                        onClick={() => handleSelectBooking(b.id)}
                        className="text-darkCyan font-bold uppercase tracking-wider text-[10px] hover:text-brightTurquoise"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Booking Inspector Card (5 Columns) */}
      <div className="lg:col-span-5">
        {selectedBooking ? (
          <div className="bg-white border border-gray-200 p-6 shadow-sm sticky top-32 space-y-6">
            <div className="border-b border-gray-200 pb-3">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest block">Reference: {selectedBooking.booking_reference}</span>
              <h3 className="font-serif text-lg text-gray-800 mt-1">{selectedBooking.service_title}</h3>
            </div>

            {apiMsg && (
              <div className="bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-3 text-xs">
                {apiMsg}
              </div>
            )}

            <div className="space-y-4 text-xs text-gray-600">
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer Details</span>
                <p className="flex items-center gap-2"><User className="w-3.5 h-3.5 text-darkCyan" /><strong>{selectedBooking.customer_name}</strong></p>
                <p className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-darkCyan" />{selectedBooking.customer_email}</p>
                <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-darkCyan" />{selectedBooking.country_code} {selectedBooking.customer_phone}</p>
              </div>

              <div className="space-y-1 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Timing Parameters</span>
                <p>Date: {selectedBooking.booking_date}</p>
                <p>Time: {selectedBooking.booking_time} (IST)</p>
                <p>Duration: {selectedBooking.duration} Mins</p>
              </div>

              <div className="space-y-1 pt-2 border-t border-gray-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Customer Concern</span>
                <p className="bg-gray-50 p-3 border border-gray-100 italic leading-relaxed text-gray-600">
                  {selectedBooking.concern_message || 'No concern message entered.'}
                </p>
              </div>
            </div>

            {/* Edit actions */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Edit Schedule Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs bg-white focus:border-darkCyan focus:outline-none"
                >
                  <option value="pending_payment">Pending Payment</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="refunded">Refunded</option>
                  <option value="no_show">No Show</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Internal Advisory Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full border border-gray-300 rounded p-2.5 text-xs h-20 resize-none focus:border-darkCyan focus:outline-none"
                  placeholder="Enter private counseling summaries..."
                ></textarea>
              </div>

              <button
                onClick={handleUpdateSubmit}
                className="w-full bg-darkCyan text-white text-xs font-bold uppercase tracking-wider py-3 hover:bg-brightTurquoise transition-all"
              >
                Save Inspector Session
              </button>
            </div>

          </div>
        ) : (
          <div className="bg-gray-50 border border-dashed border-gray-300 p-8 text-center text-xs text-gray-500">
            Select a session schedule from the list to inspect details.
          </div>
        )}
      </div>

    </div>
  );
}
