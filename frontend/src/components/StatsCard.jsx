import React from 'react';
import {
  Users,
  Calendar,
  DollarSign,
  Bed,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { stats } from '../data/dummyData.js';

const StatsCard = () => {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className='bg-white rounded-lg border border-gray-200 p-6'>
            <div className='flex items-start justify-between'>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className='w-6 h-6' />
              </div>
              <div
                className={`flex items-center gap-1 text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? (
                  <TrendingUp className='w-4 h-4' />
                ) : (
                  <TrendingDown className='w-4 h-4' />
                )}
                <span>{stat.change}</span>
              </div>
            </div>
            <div className='mt-4'>
              <p className='text-2xl font-semibold text-gray-900'>
                {stat.value}
              </p>
              <p className='text-sm text-gray-500 mt-1'>{stat.label}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StatsCard;
