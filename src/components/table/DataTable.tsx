import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

export interface ColumnConfig<T> {
  key: keyof T | string;
  header: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  render?: (value: unknown, record: T, index: number) => React.ReactNode;
  className?: string;
}

export interface DataTableProps<T> {
  data: T[];
  columns: ColumnConfig<T>[];
  className?: string;
  loading?: boolean;
  emptyMessage?: string;
  onRowClick?: (record: T, index: number) => void;
  rowClassName?: (record: T, index: number) => string;
  headerClassName?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  className,
  loading = false,
  emptyMessage = 'No data available',
  onRowClick,
  rowClassName,
  headerClassName,
}: DataTableProps<T>) {
  const renderCellContent = (column: ColumnConfig<T>, record: T, index: number) => {
    const value = column.key in record ? record[column.key] : undefined;
    
    if (column.render) {
      return column.render(value, record, index);
    }
    
    return value !== undefined && value !== null ? String(value) : '-';
  };

  const getCellAlignment = (align: 'left' | 'center' | 'right' = 'left') => {
    return align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
  };

  if (loading) {
    return (
      <div className={cn('w-full border rounded-lg', className)}>
        <div className="p-8 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          Loading data...
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className={cn('w-full border rounded-lg', className)}>
        <div className="p-8 text-center text-gray-500">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-600">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-hidden border rounded-lg', className)}>
      <Table>
        <TableHeader>
          <TableRow className={headerClassName}>
            {columns.map((column) => (
              <TableHead
                key={String(column.key)}
                className={cn(
                  'font-medium text-gray-700',
                  getCellAlignment(column.align),
                  column.width,
                  column.className
                )}
                style={{ width: column.width }}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow
              key={index}
              className={cn(
                'border-b transition-colors hover:bg-gray-50',
                onRowClick && 'cursor-pointer',
                rowClassName && rowClassName(record, index)
              )}
              onClick={() => onRowClick?.(record, index)}
            >
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  className={cn(
                    'py-3 px-4',
                    getCellAlignment(column.align),
                    column.className
                  )}
                >
                  {renderCellContent(column, record, index)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}