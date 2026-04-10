import React from 'react';

/**
 * SummaryStats Component
 * Renders a standardized grid of stat cards with translucent icons
 * @param {Array} stats - Array of objects: { label, value, icon: Icon, color, bgColor, textColor }
 */
const SummaryStats = ({ stats = [] }) => {
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className='bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 p-6 flex items-center gap-5 transition-all shadow-sm hover:shadow-md'>
            <div className={`p-4 rounded-full ${stat.bgColor || 'bg-gray-50 dark:bg-gray-900/40'}`}>
              <Icon className={`w-6 h-6 ${stat.textColor || 'text-gray-600 dark:text-gray-400'}`} />
            </div>
            <div>
              <p className='text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1'>
                {stat.label}
              </p>
              <p className='text-2xl font-bold text-gray-900 dark:text-white leading-none'>
                {stat.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SummaryStats;
