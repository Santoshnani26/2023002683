import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, icon: Icon, trend }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-panel p-5 relative overflow-hidden group hover:border-border/80 transition-colors"
    >
      {/* Subtle background glow effect */}
      <div className="absolute -inset-px bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl -z-10 blur-sm"></div>
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2.5 bg-surface rounded-lg border border-border">
          <Icon className="w-5 h-5 text-secondary" />
        </div>
        {trend && (
          <span className="text-xs font-medium text-placement bg-placement/10 px-2 py-1 rounded-md">
            {trend}
          </span>
        )}
      </div>
      <div>
        <h3 className="text-sm font-medium text-secondary mb-1">{title}</h3>
        <p className="text-3xl font-semibold tracking-tight">{value}</p>
      </div>
    </motion.div>
  );
}
