import React from 'react';
import { motion } from 'framer-motion';

/**
 * PremiumStatsCard Component
 * 
 * A high-quality, glassmorphism-styled stats card for dashboards.
 * Features:
 * - Glass background
 * - Smooth hover lift and shadow
 * - Glowing icon container
 * - Trend indicator support
 * - Dynamic coloring
 */
export const PremiumStatsCard = ({
    icon: Icon,
    label,
    value,
    subValue,
    trend, // 'up', 'down', 'neutral'
    trendValue, // e.g. "+12%"
    color = "var(--primary-cyan)", // Hex or var
    onClick
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClick}
            className={`
        relative overflow-hidden
        rounded-2xl p-6
        border border-[var(--border)]
        bg-[var(--card-background)]
        backdrop-blur-xl
        transition-all duration-300
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]
        hover:border-[var(--border-hover)]
        group
        ${onClick ? 'cursor-pointer' : ''}
      `}
        >
            {/* Background Glow Effect */}
            <div
                className="absolute -right-6 -top-6 w-24 h-24 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: color }}
            />

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <h3 className="text-sm font-medium uppercase tracking-wider text-[var(--text-muted)] mb-1">
                        {label}
                    </h3>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                            {value}
                        </span>
                        {subValue && (
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                                {subValue}
                            </span>
                        )}
                    </div>

                    {trendValue && (
                        <div className={`flex items-center mt-2 text-sm font-medium ${trend === 'up' ? 'text-[var(--success)]' :
                                trend === 'down' ? 'text-[var(--error)]' :
                                    'text-[var(--text-secondary)]'
                            }`}>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>

                {/* Icon Container */}
                <div
                    className="p-3 rounded-xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-inner"
                    style={{
                        backgroundColor: `${color}15`, // 15 = roughly 10% opacity hex
                        color: color,
                        boxShadow: `0 0 20px ${color}10`
                    }}
                >
                    {Icon ? <Icon size={24} /> : null}
                </div>
            </div>
        </motion.div>
    );
};
