import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { notificationApi } from '../api/notificationApi';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import NotificationList from '../components/NotificationList';
import PaginationControls from '../components/PaginationControls';
import { Flame, Briefcase, FileText, Calendar, AlertCircle } from 'lucide-react';

export default function PriorityInbox() {
  const [notifications, setNotifications] = useState([]);
  const [counts, setCounts] = useState({ placement: 0, result: 0, event: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    totalItems: 0
  });

  const fetchPriorityData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch counts for statistics
      try {
        const countsRes = await notificationApi.getCounts();
        if (countsRes.success) setCounts(countsRes.counts);
      } catch (e) {
        console.warn("Could not fetch counts:", e);
      }

      // Fetch prioritized and paginated list
      const res = await notificationApi.getPriorityNotifications(pagination.currentPage, pagination.itemsPerPage);
      if (res.success) {
        setNotifications(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch priority notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorityData();
  }, [pagination.currentPage, pagination.itemsPerPage]);

  const handlePageChange = (page) => {
    setPagination(p => ({ ...p, currentPage: page }));
  };

  const handleLimitChange = (limit) => {
    setPagination(p => ({ ...p, itemsPerPage: limit, currentPage: 1 }));
  };

  const total = counts.placement + counts.result + counts.event;

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Flame className="w-5 h-5 text-red-500 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Priority Inbox</h1>
        </div>
        <p className="text-secondary text-sm">Smart sorted by priority weight (Placement &gt; Result &gt; Event) and recency.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Alerts" value={total || pagination.totalItems} icon={Flame} trend="Priority Active" />
        <StatCard title="Placements" value={counts.placement} icon={Briefcase} />
        <StatCard title="Results" value={counts.result} icon={FileText} />
        <StatCard title="Events" value={counts.event} icon={Calendar} />
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold">Error Loading Priority Data</h4>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Notifications List Container */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <NotificationList 
          notifications={notifications} 
          loading={loading} 
          isPriorityView={true}
        />
        
        {!loading && (
          <PaginationControls 
            pagination={pagination} 
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        )}
      </div>
    </DashboardLayout>
  );
}
