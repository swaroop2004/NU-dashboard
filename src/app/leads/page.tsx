'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadTable } from "@/components/table/LeadTable";
import { dataService } from "@/services/dataService";
import { Lead, LeadStatus, LeadSource } from '@/types';
import { 
  Filter, 
  Download,
  Plus
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function LeadsPage() {
  const router = useRouter();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: 'all',
    source: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        const response = await dataService.getLeads({
          status: filters.status !== 'all' ? [filters.status as LeadStatus] : undefined,
          source: filters.source !== 'all' ? [filters.source as LeadSource] : undefined,
          search: filters.search || undefined
        });
        
        if (response.success) {
          setLeads(response.data);
        }
      } catch (error) {
        console.error('Error fetching leads:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeads();
  }, [filters]);

  const handleLeadClick = (lead: Lead) => {
    router.push(`/leads/${lead.id}`);
  };

  const handleLeadAction = (action: string, lead: Lead) => {
    if (action === 'view') {
      router.push(`/leads/${lead.id}`);
    } else {
      console.log(`Lead action: ${action}`, lead);
    }
  };

  const handleAddLead = () => {
    console.log('Add new lead');
    // Open add lead modal or navigate to create page
  };

  const handleExport = () => {
    console.log('Export leads');
    // Export leads data
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leads Management</h1>
            <p className="text-sm text-gray-600 mt-1">
              Manage and track your sales leads efficiently
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm" onClick={handleAddLead}>
              <Plus className="h-4 w-4 mr-2" />
              Add Lead
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2 flex-1">
                <Filter className="h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search leads..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="max-w-xs"
                />
              </div>
              <div className="flex gap-2">
                <Select
                  value={filters.status}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {Object.values(LeadStatus).map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select
                  value={filters.source}
                  onValueChange={(value) => setFilters(prev => ({ ...prev, source: value }))}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {Object.values(LeadSource).map(source => (
                      <SelectItem key={source} value={source}>{source}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Leads Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Leads</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <LeadTable
              leads={leads}
              onLeadClick={handleLeadClick}
              onLeadAction={handleLeadAction}
              loading={loading}
              className="border-0"
            />
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}