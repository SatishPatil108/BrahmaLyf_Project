import React from "react";
import { SquarePen, Trash2, Eye } from "lucide-react";

const BASE_URL = import.meta.env.VITE_BASE_URL_IMG;

const CustomTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onRowClick,
  onView,
  loading = false,
  emptyMessage = "No data available",
  striped = true,
  hoverable = true
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
          {/* Header */}
          <thead className="bg-gray-50 dark:bg-gray-800/50">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                >
                  <div className="flex items-center gap-1">
                    <span>{col.header}</span>
                    {col.sortable && (
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      </button>
                    )}
                  </div>
                </th>
              ))}

              {/* Actions Header */}
              {(onEdit || onDelete || onView) && (
                <th
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-gray-900 dark:text-gray-100 uppercase tracking-wider"
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {/* Loading State */}
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <tr key={`skeleton-${index}`} className="animate-pulse">
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                  ))}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4">
                      <div className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    </td>
                  )}
                </tr>
              ))
            ) : data.length > 0 ? (
              // Data Rows
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`
                    ${hoverable ? 'hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer' : ''}
                    ${striped && rowIndex % 2 === 0 ? 'bg-gray-50/50 dark:bg-gray-900/50' : ''}
                    transition-colors duration-150
                  `}
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300 whitespace-nowrap"
                    >
                      {col.accessor === "domain_thumbnail" ||
                        col.accessor === "subdomain_thumbnail" ||
                        col.accessor === "image" ? (
                        <div className="flex items-center">
                          <img
                            src={`${BASE_URL}${row[col.accessor]}`}
                            alt={`${BASE_URL}${row[col.accessor]}`}
                            className="h-10 w-10 rounded-lg object-cover border border-gray-300 dark:border-gray-700 shadow-sm"
                            onError={(e) => {
                              e.target.src = `https://ui-avatars.com/api/?name=${row.name || 'N/A'}&background=indigo&color=fff`;
                            }}
                          /> 
                        </div>
                      ) : col.cell ? (
                        // Custom cell renderer
                        col.cell(row)
                      ) : (
                        // Default text display
                        <span className="truncate max-w-xs block">
                          {row[col.accessor] || (
                            <span className="text-gray-400 dark:text-gray-500 italic">—</span>
                          )}
                        </span>
                      )}
                    </td>
                  ))}

                  {/* Action Buttons */}
                  {(onEdit || onDelete || onView) && (
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        {/* View Button */}
                        {onView && (
                          <button
                            type="button"
                            aria-label="View"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(row);
                            }}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 
                                     hover:bg-gray-200 dark:hover:bg-gray-700
                                     text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300
                                     transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        )}

                        {/* Edit Button */}
                        {onEdit && (
                          <button
                            type="button"
                            aria-label="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 
                                     hover:bg-blue-200 dark:hover:bg-blue-800/50
                                     text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300
                                     transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <SquarePen className="w-4 h-4" />
                          </button>
                        )}

                        {/* Delete Button */}
                        {onDelete && (
                          <button
                            type="button"
                            aria-label="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
                            className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 
                                     hover:bg-red-200 dark:hover:bg-red-800/50
                                     text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300
                                     transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              // Empty State
              <tr>
                <td
                  colSpan={columns.length + ((onEdit || onDelete || onView) ? 1 : 0)}
                  className="px-6 py-12 text-center"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="text-gray-400 dark:text-gray-600">
                      <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300">
                      {emptyMessage}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
                      No records found in the database. Try adjusting your filters or add new data.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      {data.length > 0 && !loading && (
        <div className="px-6 py-3 border-t border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-4">
              <span className="font-medium">
                Total: <span className="text-gray-900 dark:text-gray-300">{data.length}</span> records
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-gray-200 dark:bg-gray-800 px-2 py-1 rounded">
                Click rows to select
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTable;