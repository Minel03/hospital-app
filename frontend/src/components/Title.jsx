import React from 'react';

const Title = ({ title, subtitle }) => {
  return (
    <div>
      <h2 className='text-2xl font-semibold text-gray-900 dark:text-white'>{title}</h2>
      <p className='text-gray-500 dark:text-gray-400 mt-1'>{subtitle}</p>
    </div>
  );
};

export default Title;
