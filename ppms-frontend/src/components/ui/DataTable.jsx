import React from 'react';
import clsx from 'clsx';

/**
 * DataTable Component - Reusable table for displaying data
 * Props: columns, data, loading, pagination, onSort, onPageChange
 */
export const DataTable = ({
  columns,
  data,
  loading,
  pagination,
  onPageChange,
  onSort,
  onRowClick,
  rowActions,
  actions, // ✅ NEW SUPPORT
}) => {
  const dataArray = Array.isArray(data) ? data : [];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-6">
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 bg-neutral-200 rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!dataArray.length) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-neutral-100 p-12 text-center">
        <p className="text-neutral-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl shadow-sm border border-neutral-100">
      <table className="w-full text-sm text-neutral-900">
        <thead className="bg-neutral-50 border-b border-neutral-200">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left font-semibold text-xs uppercase text-neutral-600 cursor-pointer hover:bg-neutral-100"
                onClick={() => onSort?.(col.key)}
              >
                {col.label}
              </th>
            ))}
            {(rowActions || actions) && (
              <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600">
                Actions
              </th>
            )}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-neutral-100">
          {dataArray.map((row, idx) => {
            const resolvedActions = rowActions
              ? rowActions(row)
              : actions?.filter(a => a.visible !== false);

            return (
              <tr
                key={row._id || idx}
                className="hover:bg-neutral-50"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4">
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}

                {(rowActions || actions) && (
                  <td className="px-6 py-4 flex gap-2">
                    {resolvedActions?.map((action, i) => (
                      <button
                        key={i}
                        onClick={(e) => {
                          e.stopPropagation();
                          action.onClick(row);
                        }}
                        className={clsx(
                          'text-sm px-3 py-1 rounded',
                          action.isDanger
                            ? 'bg-red-100 text-red-700'
                            : 'bg-blue-100 text-blue-700'
                        )}
                      >
                        {action.label}
                      </button>
                    ))}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination unchanged */}
      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 bg-neutral-50 border-t">
          <p className="text-sm text-neutral-600">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span>{pagination.page}</span>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
/**
 * Table Cells - Helper components for custom cell rendering
 */
export const StatusCell = ({ status }) => {
  const styles = {
    active: 'bg-success-50 text-success-700',
    inactive: 'bg-neutral-100 text-neutral-700',
    pending: 'bg-warning-50 text-warning-700',
  };

  return (
    <span className={clsx('px-3 py-1 rounded-full text-xs font-medium', styles[status])}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

export const CurrencyCell = ({ value }) => {
  return <span className="font-medium">PKR {Number(value).toLocaleString()}</span>;
};

export const DateCell = ({ date }) => {
  return <span>{new Date(date).toLocaleDateString('en-PK')}</span>;
};

export default DataTable;
