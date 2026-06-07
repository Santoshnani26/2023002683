import React from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { Briefcase, FileText, Calendar, Clock } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const TYPE_CONFIG = {
  placement: {
    color: 'bg-placement',
    bg: 'bg-placement/10',
    border: 'border-placement/20',
    text: 'text-placement',
    icon: Briefcase,
    label: 'Placement'
  },
  result: {
    color: 'bg-result',
    bg: 'bg-result/10',
    border: 'border-result/20',
    text: 'text-result',
    icon: FileText,
    label: 'Result'
  },
  event: {
    color: 'bg-event',
    bg: 'bg-event/10',
    border: 'border-event/20',
    text: 'text-event',
    icon: Calendar,
    label: 'Event'
  }
};

export default function NotificationCard({ notification, isPriorityView = false }) {
  const typeKey = notification.type?.toLowerCase() || 'event';
  const config = TYPE_CONFIG[typeKey] || TYPE_CONFIG.event;
  const Icon = config.icon;
  
  const timeAgo = notification.timestamp 
    ? formatDistanceToNow(new Date(notification.timestamp), { addSuffix: true })
    : 'Just now';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className={cn(
        "group relative flex items-start p-5 mb-3 bg-surface border border-border rounded-xl transition-all hover:shadow-lg hover:shadow-black/20",
        isPriorityView && typeKey === 'placement' && "border-placement/30 bg-gradient-to-r from-placement/5 to-transparent",
        isPriorityView && typeKey === 'result' && "border-result/20",
      )}
    >
      {/* Priority Indicator Line */}
      {isPriorityView && (
        <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-l-xl", config.color)} />
      )}

      {/* Icon */}
      <div className={cn("flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 border", config.bg, config.text, config.border)}>
        <Icon className="w-5 h-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-3">
            <h4 className="text-base font-medium text-primary truncate">{notification.title}</h4>
            <span className={cn("px-2 py-0.5 text-xs font-medium rounded-full border", config.bg, config.text, config.border)}>
              {config.label}
            </span>
          </div>
          <div className="flex items-center text-xs text-secondary whitespace-nowrap ml-4">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {timeAgo}
          </div>
        </div>
        <p className="text-sm text-secondary line-clamp-2 mt-1 leading-relaxed">
          {notification.description || notification.message || 'No additional details provided.'}
        </p>
      </div>

      {/* Hover Action */}
      <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-5 top-1/2 -translate-y-1/2 bg-background border border-border px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer hover:bg-surfaceHover">
        View Details
      </div>
    </motion.div>
  );
}
