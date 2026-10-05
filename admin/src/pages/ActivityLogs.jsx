'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '../utils/api';
import { ClipboardList, ShieldAlert } from 'lucide-react';

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.get('/admin/activity-logs.php')
      .then(res => {
        setLogs(res.logs || []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="bg-white border border-gray-200 p-6 shadow-sm font-sans text-xs text-gray-600 space-y-6">
      <div className="border-b border-gray-200 pb-3">
        <h3 className="text-sm font-bold uppercase tracking-wider text-gray-700">Security Audit Logs</h3>
        <p className="text-[10px] text-gray-400 mt-1">Audit log records of actions performed by administrators inside the panel.</p>
      </div>

      {loading ? (
        <p className="text-center py-10 text-gray-500">Loading audit history...</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="p-3">Log ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Event Action</th>
                <th className="p-3">Details</th>
                <th className="p-3">IP Address</th>
                <th className="p-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-600">
              {logs.map(log => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="p-3 font-semibold text-gray-400">#{log.id}</td>
                  <td className="p-3 text-gray-800 font-bold">{log.username || 'System/Guest'}</td>
                  <td className="p-3">
                    <span className={`inline-block px-2 py-0.5 font-bold uppercase tracking-widest text-[8px] ${
                      log.action.includes('DELETE') 
                        ? 'bg-red-50 text-red-700' 
                        : log.action.includes('FAILED')
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-gray-600 max-w-sm truncate" title={log.description}>{log.description}</td>
                  <td className="p-3 text-gray-500">{log.ip_address}</td>
                  <td className="p-3 text-gray-400">{log.created_at}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-3 text-center text-gray-500">No logs registered in database audit tables.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
