import React from 'react';
import { DataTable, ColumnConfig } from './DataTable';
import { Property, PropertyStatus, PropertyType } from '@/types';
import { 
  TextField, 
  StatusField, 
  ProgressField 
} from '@/components/fields';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Eye, Edit } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface PropertyTableProps {
  properties: Property[];
  onPropertyClick?: (property: Property) => void;
  onPropertyAction?: (action: string, property: Property) => void;
  loading?: boolean;
  className?: string;
}

export function PropertyTable({ 
  properties, 
  onPropertyClick, 
  onPropertyAction,
  loading,
  className 
}: PropertyTableProps) {
  const columns: ColumnConfig<Record<string, unknown>>[] = [
    {
      key: 'name',
      header: 'Property',
      width: '200px',
      render: (value, record) => {
        const property = record as unknown as Property;
        return (
          <div className="min-w-0">
            <TextField value={property.name} variant="primary" />
            <TextField value={property.location} variant="secondary" className="text-xs" />
          </div>
        );
      },
    },
    {
      key: 'type',
      header: 'Type',
      width: '100px',
      render: (value) => (
        <TextField value={String(value)} variant="secondary" />
      ),
    },
    {
      key: 'price',
      header: 'Price',
      width: '120px',
      render: (value) => (
        <TextField value={String(value)} variant="accent" />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '120px',
      render: (value) => (
        <StatusField value={String(value)} size="sm" variant="badge" />
      ),
    },
    {
      key: 'leads',
      header: 'Leads',
      width: '80px',
      align: 'center',
      render: (value) => (
        <TextField value={String(value)} variant="primary" />
      ),
    },
    {
      key: 'demoViews',
      header: 'Demos',
      width: '80px',
      align: 'center',
      render: (value) => (
        <TextField value={String(value)} variant="secondary" />
      ),
    },
    {
      key: 'siteVisits',
      header: 'Visits',
      width: '80px',
      align: 'center',
      render: (value) => (
        <TextField value={String(value)} variant="secondary" />
      ),
    },
    {
      key: 'tokens',
      header: 'Tokens',
      width: '80px',
      align: 'center',
      render: (value) => (
        <ProgressField 
          value={Number(value)} 
          variant="badge" 
          color={Number(value) >= 5 ? 'green' : Number(value) >= 3 ? 'blue' : 'red'}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '80px',
      align: 'center',
      render: (value, record) => {
        const property = record as unknown as Property;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPropertyAction?.('view', property)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPropertyAction?.('edit', property)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Property
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleRowClick = (record: Record<string, unknown>) => {
    const property = record as unknown as Property;
    onPropertyClick?.(property);
  };

  const getRowClassName = (record: Record<string, unknown>) => {
    const property = record as unknown as Property;
    if (property.status === PropertyStatus.ACTIVE) {
      return 'bg-green-50 border-l-4 border-green-400';
    }
    if (property.status === PropertyStatus.PRELAUNCH) {
      return 'bg-blue-50 border-l-4 border-blue-400';
    }
    return '';
  };

  return (
    <DataTable
      data={properties as unknown as Record<string, unknown>[]}
      columns={columns}
      loading={loading}
      className={className}
      onRowClick={handleRowClick}
      rowClassName={getRowClassName}
      emptyMessage="No properties found"
    />
  );
}