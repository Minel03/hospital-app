import React from 'react';
import { Icons } from '../context/AppContext';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  setItemsPerPage, 
  totalItems 
}) => {
  const { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } = Icons;

  if (totalPages <= 1 && !setItemsPerPage) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 px-2 py-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm transition-all duration-300">
      <div className="flex items-center gap-4">
        {setItemsPerPage && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium whitespace-nowrap">Show:</span>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block w-full p-2 transition-all outline-none"
            >
              {[5, 10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </div>
        )}
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
          Showing <span className="text-gray-900 dark:text-white font-bold">{Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)}</span> to{' '}
          <span className="text-gray-900 dark:text-white font-bold">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of{' '}
          <span className="text-gray-900 dark:text-white font-bold">{totalItems}</span> results
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onPageChange(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 dark:text-gray-400 transition-all"
            title="First Page"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 dark:text-gray-400 transition-all"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-1">
          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-9 h-9 flex items-center justify-center rounded-xl text-sm font-bold transition-all ${
                currentPage === num
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 dark:shadow-none'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="flex items-center bg-gray-50 dark:bg-gray-900/50 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 dark:text-gray-400 transition-all"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-white dark:hover:bg-gray-700 disabled:opacity-30 disabled:hover:bg-transparent text-gray-600 dark:text-gray-400 transition-all"
            title="Last Page"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
