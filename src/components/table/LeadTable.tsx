import React from 'react';
import { DataTable, ColumnConfig } from './DataTable';
import { Lead, LeadStatus, LeadSource } from '@/types';
import { 
  TextField, 
  StatusField, 
  ProgressField, 
  AvatarField, 
  ContactField 
} from '@/components/fields';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Phone, Mail } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export interface LeadTableProps {
  leads: Lead[];
  onLeadClick?: (lead: Lead) => void;
  onLeadAction?: (action: string, lead: Lead) => void;
  loading?: boolean;
  className?: string;
}

export function LeadTable({ 
  leads, 
  onLeadClick, 
  onLeadAction,
  loading,
  className 
}: LeadTableProps) {
  const columns: ColumnConfig<Record<string, unknown>>[] = [
    {
      key: 'name',
      header: 'Lead',
      width: '200px',
      render: (value, record) => {
        const lead = record as unknown as Lead;
        return (
          <div className="flex items-center gap-3">
            <AvatarField name={lead.name} size="sm" />
            <div className="min-w-0">
              <TextField value={lead.name} variant="primary" />
              <TextField value={lead.property} variant="secondary" className="text-xs" />
            </div>
          </div>
        );
      },
    },
    {
      key: 'contact',
      header: 'Contact',
      width: '180px',
      render: (value, record) => {
        const lead = record as unknown as Lead;
        return (
          <ContactField 
            phone={lead.phone} 
            email={lead.email} 
            variant="compact"
            showIcons={true}
          />
        );
      },
    },
    {
      key: 'source',
      header: 'Source',
      width: '120px',
      render: (value) => (
        <TextField value={String(value)} variant="secondary" />
      ),
    },
    {
      key: 'status',
      header: 'Status',
      width: '100px',
      render: (value) => (
        <StatusField value={String(value)} size="sm" variant="badge" />
      ),
    },
    {
      key: 'conversion',
      header: 'Conversion',
      width: '100px',
      align: 'center',
      render: (value) => (
        <ProgressField
          value={Number(value)}
          variant="badge"
          color={Number(value) >= 80 ? 'green' : Number(value) >= 50 ? 'blue' : 'red'}
        />
      ),
    },
    {
      key: 'lastContact',
      header: 'Last Contact',
      width: '120px',
      render: (value) => (
        <TextField value={String(value)} variant="secondary" />
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      width: '80px',
      align: 'center',
      render: (value, record) => {
        const lead = record as unknown as Lead;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onLeadAction?.('call', lead)}>
                <Phone className="mr-2 h-4 w-4" />
                Call Lead
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLeadAction?.('email', lead)}>
                <Mail className="mr-2 h-4 w-4" />
                Send Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onLeadAction?.('view', lead)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const handleRowClick = (record: Record<string, unknown>) => {
    const lead = record as unknown as Lead;
    onLeadClick?.(lead);
  };

  const getRowClassName = (record: Record<string, unknown>) => {
    const lead = record as unknown as Lead;
    if (lead.status === LeadStatus.HOT) {
      return 'bg-red-50 border-l-4 border-red-400';
    }
    if (lead.status === LeadStatus.WARM) {
      return 'bg-orange-50 border-l-4 border-orange-400';
    }
    return '';
  };

  return (
    <DataTable
      data={leads as unknown as Record<string, unknown>[]}
      columns={columns}
      loading={loading}
      className={className}
      onRowClick={handleRowClick}
      rowClassName={getRowClassName}
      emptyMessage="No leads found"
    />
  );
}