"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Lead, Property, Activity, DashboardStats, ActivityType, PropertyStatus } from '@/types';
import { dataService } from '@/services/dataService';

interface DataContextType {
    leads: Lead[];
    properties: Property[];
    activities: Activity[];
    stats: DashboardStats | null;
    loading: boolean;
    error: string | null;
    refreshData: () => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: ReactNode }) {
    const [leads, setLeads] = useState<Lead[]>([]);
    const [properties, setProperties] = useState<Property[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const fetchedRef = React.useRef(false);

    const loadData = async () => {
        // Prevent double fetching in Strict Mode
        if (fetchedRef.current) return;
        fetchedRef.current = true;

        try {
            setLoading(true);
            setError(null);

            // Fetch only base data in parallel
            const [leadsResponse, propertiesResponse] = await Promise.all([
                dataService.getLeads(),
                dataService.getProperties()
            ]);

            const leadsData = leadsResponse.data || [];
            const propertiesData = propertiesResponse.data || [];

            setLeads(leadsData);
            setProperties(propertiesData);

            // Derive activities from leads (simulating backend logic)
            const derivedActivities: Activity[] = leadsData.map(lead => ({
                id: `activity-${lead.id}`,
                type: lead.status === 'Converted' ? ActivityType.STATUS_CHANGED :
                    lead.status === 'Hot' ? ActivityType.LEAD_ASSIGNED : ActivityType.LEAD_ASSIGNED,
                title: `New ${lead.status} Lead`,
                description: `New ${lead.status} lead: ${lead.name}`,
                timestamp: lead.createdAt ? new Date(lead.createdAt).toISOString() : new Date().toISOString(),
                userId: lead.assignedTo || 'system',
                relatedEntity: {
                    id: lead.id,
                    name: lead.name,
                    type: 'lead'
                },
                metadata: {
                    leadId: lead.id,
                    leadName: lead.name
                }
            }));
            // Sort by timestamp (newest first) and take top 20
            derivedActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setActivities(derivedActivities.slice(0, 20));

            // Derive stats from leads and properties
            const derivedStats: DashboardStats = {
                totalLeads: leadsData.length,
                hotLeads: leadsData.filter(l => l.status === 'Hot').length,
                totalProperties: propertiesData.length,
                activeProperties: propertiesData.filter(p => p.status === PropertyStatus.ACTIVE).length,
                conversionRate: leadsData.length > 0 ? Math.round((leadsData.filter(l => l.status === 'Converted').length / leadsData.length) * 100) : 0,
                totalRevenue: 1250000, // Static for now
                monthlyGrowth: 12.5 // Static for now
            };
            setStats(derivedStats);

        } catch (err) {
            console.error('Error loading global data:', err);
            setError('Failed to load data');
            // Reset ref so we can try again if needed
            fetchedRef.current = false;
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const refreshData = async () => {
        fetchedRef.current = false; // Allow re-fetch
        await loadData();
    };

    return (
        <DataContext.Provider value={{ leads, properties, activities, stats, loading, error, refreshData }}>
            {children}
        </DataContext.Provider>
    );
}

export function useData() {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
}
