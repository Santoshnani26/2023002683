import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell } from 'lucide-react';
import NotificationCard from './NotificationCard';

export default function NotificationList({ notifications, loading, isPriorityView = false }) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 bg-surface border border-border rounded-xl animate-pulse"></div>
        ))}
      </div>
    );
  }

  if (!notifications || notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-2xl bg-surface/50">
        <div className="w-12 h-12 bg-surface rounded-full flex items-center justify-center mb-4 border border-border">
          <Bell className="w-6 h-6 text-secondary opacity-50" />
        </div>
        <h3 className="text-lg font-medium text-primary">No notifications found</h3>
        <p className="text-secondary text-sm mt-1 max-w-sm">You're all caught up! There are no alerts to display right now.</p>
      </div>
    );
  }

  return (
    <motion.div layout className="space-y-1">
      <AnimatePresence>
        {notifications.map((notif, index) => (
          <NotificationCard 
            key={notif.id || index} 
            notification={notif} 
            isPriorityView={isPriorityView}
          />
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
