import React from 'react';
import Title from './Title';
import SummaryStats from './SummaryStats';
import { Icons } from '../context/AppContext';

const PageHeader = ({ 
  title, 
  subtitle, 
  buttonLabel, 
  buttonIcon: ButtonIcon, 
  onButtonClick, 
  actions = [],
  stats 
}) => {
  const { Plus } = Icons;

  const headerActions = actions.length > 0 
    ? actions 
    : onButtonClick 
      ? [{ label: buttonLabel, onClick: onButtonClick, icon: ButtonIcon || Plus, color: 'bg-blue-600 hover:bg-blue-700 shadow-blue-200' }]
      : [];

  return (
    <div className='space-y-8'>
      <div className='flex flex-col md:flex-row md:items-center justify-between gap-4'>
        <Title
          title={title}
          subtitle={subtitle}
        />
        <div className='flex items-center gap-3'>
          {headerActions.map((action, index) => {
            const Icon = action.icon || Plus;
            const colorClass = action.color || 'bg-blue-600 hover:bg-blue-700 shadow-blue-200';
            return (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex items-center gap-2 text-white px-6 py-3 rounded-2xl transition-all shadow-lg dark:shadow-none font-bold ${colorClass}`}>
                <Icon className='w-5 h-5' />
                <span>{action.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {stats && stats.length > 0 && <SummaryStats stats={stats} />}
    </div>
  );
};

export default PageHeader;
