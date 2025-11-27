'use client';

import { useState, useEffect } from 'react';
import { useData } from "@/context/DataContext";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, Users } from "lucide-react";
import { FadeIn, SlideIn } from "@/components/ui/animations";
import { Lead, Property, Activity, LeadStatus, PropertyStatus, ActivityType } from '@/types';
import { LeadTable } from '@/components/table';
import { PropertyDetailsModal } from '@/components/PropertyDetailsModal';

export default function DashboardPage() {
  const { stats, leads, properties, activities, loading } = useData();
  const [highIntentLeads, setHighIntentLeads] = useState<Lead[]>([]);
  const [topProperties, setTopProperties] = useState<Property[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Filter HOT leads for High Intent section
      setHighIntentLeads(leads.filter(l => l.status === LeadStatus.HOT));
      // Filter ACTIVE properties
      setTopProperties(properties.filter(p => p.status === PropertyStatus.ACTIVE));
      setRecentActivities(activities);
    }
  }, [leads, properties, activities, loading]);

  const handleViewLead = (lead: Lead) => {
    console.log('View lead:', lead);
  };

  const handleEditLead = (lead: Lead) => {
    console.log('Edit lead:', lead);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 bg-gray-100">
        {/* Main layout with right sidebar for properties */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main content area */}
          <div className="lg:w-2/3">
            {/* Stats Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3 mb-6">
              <FadeIn delay={0.1}>
                <Card className="border-l-4 border-l-blue-500 transition-colors duration-300 hover:bg-blue-600 hover:text-white group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium text-blue-600 group-hover:text-white">Total Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-blue-600 group-hover:text-white">
                      {loading ? '...' : stats?.totalLeads || 0}
                    </div>
                    <p className="text-sm mt-2 flex items-center text-green-500 group-hover:text-green-200">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      +{loading ? '...' : stats?.monthlyGrowth || 0}% this week
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
              <FadeIn delay={0.2}>
                <Card className="border-l-4 border-l-blue-500 transition-colors duration-300 hover:bg-blue-600 hover:text-white group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium text-blue-600 group-hover:text-white">Active Leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-blue-600 group-hover:text-white">
                      {loading ? '...' : stats?.hotLeads || 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 group-hover:text-blue-100">This month</p>
                  </CardContent>
                </Card>
              </FadeIn>
              <FadeIn delay={0.3}>
                <Card className="border-l-4 border-l-blue-500 transition-colors duration-300 hover:bg-blue-600 hover:text-white group">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-medium text-blue-600 group-hover:text-white">Dormant leads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-4xl font-bold text-blue-600 group-hover:text-white">
                      {loading ? '...' : (stats?.totalLeads || 0) - (stats?.hotLeads || 0)}
                    </div>
                    <p className="text-sm mt-2 flex items-center text-red-500 group-hover:text-red-200">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      +{loading ? '...' : stats?.monthlyGrowth || 0}% this week
                    </p>
                  </CardContent>
                </Card>
              </FadeIn>
            </div>

            {/* Conversion Funnel */}
            <SlideIn direction="right" delay={0.2}>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Conversion Funnel</h2>
                  <a href="/analytics" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">view all</a>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
                    <div className="bg-blue-100 p-4  transform transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-semibold truncate">1,200 leads</div>
                      <div className="text-sm text-gray-600 truncate">Leads Captured</div>
                      <div className="mt-4"></div>
                    </div>
                    <div className="bg-blue-200 p-4 transform transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-semibold truncate">900 leads</div>
                      <div className="text-sm text-gray-600 truncate">Contacted</div>
                      <div className="mt-4 text-sm">↑25%</div>
                    </div>
                    <div className="bg-blue-300 p-4 transform transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-semibold truncate">650 leads</div>
                      <div className="text-sm text-gray-600 truncate">Attended Demo</div>
                      <div className="mt-4 text-sm">↑28%</div>
                    </div>
                    <div className="bg-blue-400 p-4 transform transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-semibold truncate">420 leads</div>
                      <div className="text-sm text-gray-600 truncate">Site Visit Booked</div>
                      <div className="mt-4 text-sm">↑35%</div>
                    </div>
                    <div className="bg-blue-500 p-4 transform transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-semibold truncate">210 leads</div>
                      <div className="text-sm text-gray-600 truncate">Token Issued</div>
                      <div className="mt-4 text-sm">↑50%</div>
                    </div>
                    <div className="bg-blue-600 p-4 transform transition-all duration-300 hover:scale-105">
                      <div className="text-lg font-semibold truncate">135 leads</div>
                      <div className="text-sm text-gray-600 truncate">Registered</div>
                      <div className="mt-4 text-sm">↑35.7%</div>
                    </div>
                  </div>
                </div>
              </div>
            </SlideIn>

            {/* High Intent Leads - Hot Leads Only */}
            <SlideIn direction="right" delay={0.3}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold">Hot Leads</h2>
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                      High Priority
                    </span>
                  </div>
                  <a href="/leads" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">view all</a>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm border border-red-100">
                  {highIntentLeads.length === 0 && !loading ? (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-12 h-12 mx-auto mb-2 bg-red-100 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <p className="text-sm">No hot leads at the moment</p>
                      <p className="text-xs mt-1">Check back later for new high-intent leads</p>
                    </div>
                  ) : (
                    <LeadTable
                      leads={highIntentLeads.slice(0, 8)}
                      loading={loading}
                      onLeadClick={handleViewLead}
                      onLeadAction={(action, lead) => {
                        if (action === 'view') handleViewLead(lead);
                        if (action === 'edit') handleEditLead(lead);
                      }}
                      className="compact"
                    />
                  )}
                </div>
              </div>
            </SlideIn>

          </div>

          {/* Top Performing Properties - Fixed right sidebar spanning full height */}
          <div className="lg:w-1/3">
            <div className=" top-4">
              <FadeIn delay={0.5}>
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Top Performing Properties</h2>
                    <a href="/properties" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">view all</a>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="space-y-4">
                      {topProperties.slice(0, 4).map((property, i) => (
                        <SlideIn key={property.id} direction="up" delay={0.15 * i}>
                          <Card className="hover:shadow-lg transition-all duration-300">
                            <CardContent className="px-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                  <h3 className="font-semibold">{property.name}</h3>
                                  <p className="text-sm text-gray-500">{property.location} - {property.type}</p>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="hover:bg-blue-50 transition-colors"
                                  onClick={() => handleViewProperty(property)}
                                >
                                  View property
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="flex items-center gap-2">
                                  <Users className="h-4 w-4 text-blue-500" />
                                  <div>
                                    <div className="font-medium">{property.leads} Leads</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  <div>
                                    <div className="font-medium">{property.demoViews} Demo Views</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  <div>
                                    <div className="font-medium">{property.siteVisits} Site Visits</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                                  <div>
                                    <div className="font-medium">{property.tokens} Tokens Issued</div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </SlideIn>
                      ))}
                    </div>
                  </div>
                </div>
              </FadeIn>

              {/* Activity Panel */}
              <FadeIn delay={0.7}>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">view all</a>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="space-y-4">
                      {loading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg animate-pulse">
                              <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                              <div className="flex-1 space-y-2">
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {recentActivities.slice(0, 4).map((activity) => (
                            <div key={activity.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                              <div className={`w-2 h-2 rounded-full ${activity.type === ActivityType.LEAD_ASSIGNED ? 'bg-green-500' :
                                activity.type === ActivityType.SITE_VISIT ? 'bg-blue-500' :
                                  activity.type === ActivityType.FOLLOW_UP ? 'bg-yellow-500' :
                                    activity.type === ActivityType.TOKEN_ISSUED ? 'bg-purple-500' :
                                      'bg-gray-500'
                                }`}></div>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{activity.description}</p>
                                <p className="text-xs text-gray-500">
                                  {activity.relatedEntity?.name || 'System'} - {new Date(activity.timestamp).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                          {recentActivities.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                              No recent activities
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>

        <PropertyDetailsModal
          property={selectedProperty}
          isOpen={isModalOpen}
          onClose={() => setSelectedProperty(null)}
        />
      </div>
    </DashboardLayout>
  );
}