import React from 'react';

const Pagination = ({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  maxPaginationLinks = 5,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (totalPages <= 1) return null;

  let startPage = Math.max(1, currentPage - Math.floor(maxPaginationLinks / 2));
  let endPage = startPage + maxPaginationLinks - 1;

  if (endPage > totalPages) {
    endPage = totalPages;
    startPage = Math.max(1, endPage - maxPaginationLinks + 1);
  }

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const buttonClass = (active) =>
    `px-3 py-1 rounded border border-gray-300 hover:bg-gray-200 ${
      active ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-700'
    }`;

  return (
    <nav aria-label="Page navigation" className="mt-4 flex justify-center">
      <ul className="flex space-x-1">
        {/* Previous button */}
        <li>
          <button
            className={buttonClass(false)}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &laquo;
          </button>
        </li>

        {/* First page */}
        {startPage > 1 && (
          <>
            <li>
              <button className={buttonClass(false)} onClick={() => onPageChange(1)}>
                1
              </button>
            </li>
            {startPage > 2 && (
              <li className="px-3 py-1 text-gray-500">...</li>
            )}
          </>
        )}

        {/* Page numbers */}
        {pages.map((page) => (
          <li key={page}>
            <button
              className={buttonClass(page === currentPage)}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          </li>
        ))}

        {/* Last page */}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <li className="px-3 py-1 text-gray-500">...</li>
            )}
            <li>
              <button
                className={buttonClass(false)}
                onClick={() => onPageChange(totalPages)}
              >
                {totalPages}
              </button>
            </li>
          </>
        )}

        {/* Next button */}
        <li>
          <button
            className={buttonClass(false)}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
