import React, { useState, useEffect } from 'react';
import { notificationApi } from '../api/notificationApi';
import DashboardLayout from '../layouts/DashboardLayout';
import StatCard from '../components/StatCard';
import NotificationList from '../components/NotificationList';
import PaginationControls from '../components/PaginationControls';
import { Bell, Briefcase, FileText, Calendar, AlertCircle } from 'lucide-react';

export default function AllNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [counts, setCounts] = useState({ placement: 0, result: 0, event: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    itemsPerPage: 10,
    totalPages: 1,
    totalItems: 0
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch counts for statistics cards
      try {
        const countsRes = await notificationApi.getCounts();
        if (countsRes.success) setCounts(countsRes.counts);
      } catch (e) {
        console.warn("Could not fetch counts:", e);
      }

      // Fetch paginated notification list
      const typeParam = activeFilter === 'all' ? null : activeFilter;
      const res = await notificationApi.getNotifications(typeParam, pagination.currentPage, pagination.itemsPerPage);
      if (res.success) {
        setNotifications(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeFilter, pagination.currentPage, pagination.itemsPerPage]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setPagination(p => ({ ...p, currentPage: 1 }));
  };

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
        <h1 className="text-2xl font-bold tracking-tight text-primary mb-2">Dashboard Overview</h1>
        <p className="text-secondary text-sm">Monitor all your campus placements, results, and events in one place.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Alerts" value={total || pagination.totalItems} icon={Bell} trend="+12%" />
        <StatCard title="Placements" value={counts.placement} icon={Briefcase} />
        <StatCard title="Results" value={counts.result} icon={FileText} />
        <StatCard title="Events" value={counts.event} icon={Calendar} />
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-2 mb-6 border-b border-border pb-4">
        {['all', 'placement', 'result', 'event'].map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
              activeFilter === f 
                ? 'bg-primary text-background font-semibold shadow-md' 
                : 'bg-surface border border-border text-secondary hover:text-primary hover:bg-surfaceHover'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Error State */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start space-x-3 text-red-500">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold">Error Loading Notifications</h4>
            <p className="text-sm mt-1 opacity-80">{error}</p>
          </div>
        </div>
      )}

      {/* Notifications List Container */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <NotificationList 
          notifications={notifications} 
          loading={loading} 
          isPriorityView={false}
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
