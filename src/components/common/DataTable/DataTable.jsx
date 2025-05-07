import React, { useState, useEffect, useMemo } from 'react';
import { useTable, usePagination, useSortBy, useGlobalFilter } from 'react-table';
import { CSVLink } from "react-csv";
import {
  FiChevronsLeft,
  FiChevronsRight,
  FiChevronLeft,
  FiChevronRight,
  FiArrowDown,
  FiPlus,
  FiFilter
} from 'react-icons/fi';
import { useSelector } from 'react-redux';

function DataTable({ searchText, fun, columns, data: propData, addBtn, ...rest }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const isAdmin = user?.role === 'ADMIN';

  const [isHoveringExport, setIsHoveringExport] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [internalData, setInternalData] = useState(propData);

  // Update internal data when propData changes
  useEffect(() => {
    setInternalData(propData);
  }, [propData]);

  const memoizedColumns = useMemo(() => columns, [columns]);
  const memoizedData = useMemo(() => internalData, [internalData]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    setPageSize,
    state: { pageIndex, pageSize, selectedRowIds, globalFilter },
  } = useTable(
    {
      columns: memoizedColumns,
      data: memoizedData,
      initialState: { pageIndex: 0 },
      autoResetPage: false,
      autoResetSortBy: false,
      autoResetFilters: false,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  // Debounce the search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setGlobalFilter(inputValue);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [inputValue, setGlobalFilter]);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Table Header with Search and Actions */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder={searchText || "Search..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Export Button (Admin Only) */}
          {isAdmin && (
            <button
              className="relative flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:from-blue-600 hover:to-blue-700"
              onMouseEnter={() => setIsHoveringExport(true)}
              onMouseLeave={() => setIsHoveringExport(false)}
            >
              <CSVLink data={memoizedData} className="flex items-center">
                Export
                <FiArrowDown className={`ml-2 transition-transform duration-300 ${isHoveringExport ? 'translate-y-1' : ''}`} />
              </CSVLink>
              {isHoveringExport && (
                <span className="absolute -top-8 -right-2 bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                  Download CSV
                </span>
              )}
            </button>
          )}

          {/* Add Button */}
          {addBtn && (
            <button className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow-sm hover:bg-green-600 transition-all duration-200">
              <FiPlus className="mr-2" />
              Add New
            </button>
          )}
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.getHeaderGroupProps().key} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    key={column.getHeaderProps().key}
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>{column.render('Header')}</span>
                      <span className="ml-1">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                            </svg>
                          )
                        ) : (
                          <FiFilter className="w-3 h-3 opacity-50" />
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.getRowProps().key} {...row.getRowProps()} className="hover:bg-gray-50 transition-colors duration-150">
                  {row.cells.map((cell) => (
                    <td
                      key={cell.getCellProps().key}
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-700"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-700">
            Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
            <span className="font-medium">
              {Math.min((pageIndex + 1) * pageSize, memoizedData.length)}
            </span>{' '}
            of <span className="font-medium">{memoizedData.length}</span> results
          </span>
        </div>

        <div className="hidden sm:flex items-center text-nowrap">
          <span className="text-sm text-gray-700">
            Page{' '}
            <span className="font-medium">{pageIndex + 1}</span>{' '}
            of <span className="font-medium">{pageOptions.length}</span>
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className={`p-2 rounded-md ${!canPreviousPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronsLeft />
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className={`p-2 rounded-md ${!canPreviousPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronLeft />
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className={`p-2 rounded-md ${!canNextPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronRight />
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className={`p-2 rounded-md ${!canNextPage ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FiChevronsRight />
            </button>
          </div>

          <select
            value={pageSize}
            onChange={e => setPageSize(Number(e.target.value))}
            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md bg-gray-50 border"
          >
            {[5, 10, 20, 30, 40, 50].map(size => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default DataTable;