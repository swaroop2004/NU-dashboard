'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useData } from "@/context/DataContext";
import { Lead, Activity, ActivityType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SlideIn } from "@/components/ui/slide-in";
import { ArrowLeft, MessageSquare, Calendar, FileText, Phone, Mail, User } from 'lucide-react';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params with React.use
  const unwrappedParams = React.use(params as unknown as React.Usable<{ id: string }>);
  const leadId = unwrappedParams.id;

  const router = useRouter();
  const { leads, loading: globalLoading } = useData();
  const [lead, setLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalLoading) return;

    const currentLead = leads.find(l => l.id === leadId);

    if (currentLead) {
      setLead(currentLead);

      // Generate activities locally based on lead data instead of fetching from API
      const generatedActivities: Activity[] = [{
        id: `activity-${currentLead.id}`,
        type: currentLead.status === 'Converted' ? ActivityType.STATUS_CHANGED :
          currentLead.status === 'Hot' ? ActivityType.LEAD_ASSIGNED : ActivityType.LEAD_ASSIGNED,
        title: `New ${currentLead.status} Lead`,
        description: `New ${currentLead.status} lead: ${currentLead.name}`,
        timestamp: currentLead.createdAt ? new Date(currentLead.createdAt).toISOString() : new Date().toISOString(),
        performedBy: currentLead.assignedTo || 'system',
        relatedEntity: {
          id: currentLead.id,
          name: currentLead.name,
          type: 'lead'
        },
        metadata: {
          leadId: currentLead.id,
          leadName: currentLead.name
        }
      }];

      setActivities(generatedActivities);
    }

    setLoading(false);
  }, [leadId, leads, globalLoading]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!lead) {
    return <div className="flex items-center justify-center h-screen">Lead not found</div>;
  }

  // Helper to get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to get icon for activity type
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'call': return <Phone className="h-5 w-5 text-blue-600" />;
      case 'email': return <Mail className="h-5 w-5 text-purple-600" />;
      case 'meeting': return <Calendar className="h-5 w-5 text-green-600" />;
      case 'note': return <FileText className="h-5 w-5 text-gray-600" />;
      default: return <MessageSquare className="h-5 w-5 text-orange-600" />;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 mb-4"
          onClick={() => router.push('/leads')}
        >
          <ArrowLeft size={16} />
          Back to All Leads
        </Button>

        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{lead.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-gray-600">
              <span className="flex items-center gap-1"><Mail size={14} /> {lead.email}</span>
              <span className="flex items-center gap-1"><Phone size={14} /> {lead.phone}</span>
            </div>
          </div>
          <Badge className={`text-lg px-4 py-1 ${lead.status === 'Converted' ? 'bg-green-100 text-green-800' :
            lead.status === 'Hot' ? 'bg-red-100 text-red-800' :
              lead.status === 'Warm' ? 'bg-orange-100 text-orange-800' :
                'bg-blue-100 text-blue-800'
            }`}>
            {lead.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Score / Conversion Probability */}
          <SlideIn direction="left" delay={0.1}>
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle>Conversion Probability</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mt-2">
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Likelihood to Convert</span>
                    <span className="font-bold text-blue-600">{lead.conversion}%</span>
                  </div>
                  <Progress value={lead.conversion} className="h-4" />
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Properties of Interest */}
          <SlideIn direction="left" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Property Interest</CardTitle>
              </CardHeader>
              <CardContent>
                {lead.properties && lead.properties.length > 0 ? (
                  lead.properties.map((prop, index) => (
                    <div key={index} className="border rounded-md p-4 flex justify-between items-center mb-2 last:mb-0">
                      <div>
                        <h4 className="font-medium text-lg">{prop}</h4>
                        <p className="text-sm text-gray-500">Viewed Property</p>
                      </div>
                      <Badge variant="outline">Active Inquiry</Badge>
                    </div>
                  ))
                ) : (
                  <div className="border rounded-md p-4 flex justify-between items-center">
                    <div>
                      <h4 className="font-medium text-lg">{lead.property}</h4>
                      <p className="text-sm text-gray-500">Primary Interest</p>
                    </div>
                    <Badge variant="outline">Active Inquiry</Badge>
                  </div>
                )}
              </CardContent>
            </Card>
          </SlideIn>

          {/* Interaction Timeline */}
          <SlideIn direction="left" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Interaction Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activities.length > 0 ? (
                    activities.map((activity) => (
                      <div key={activity.id} className="flex gap-4">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                            {getActivityIcon(activity.type)}
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium">{activity.title}</h4>
                          <p className="text-sm text-gray-500">{new Date(activity.timestamp).toLocaleString()}</p>
                          <p className="text-sm mt-1">{activity.description}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      No activities recorded yet.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Assigned Sales Rep */}
          <SlideIn direction="right" delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Assigned Sales Rep</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{getInitials(lead.assignedTo || 'Unassigned')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{lead.assignedTo}</div>
                    <div className="text-sm text-gray-500">Sales Executive</div>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-500">Last Contact</div>
                  <div className="font-medium">{new Date(lead.lastContact).toLocaleDateString()}</div>
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Action Center */}
          <SlideIn direction="right" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Action Center</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => console.log('WhatsApp clicked')}>
                  <MessageSquare className="mr-2 h-4 w-4" /> Send Whatsapp
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={() => console.log('Call clicked')}>
                  <Phone className="mr-2 h-4 w-4" /> Call Lead
                </Button>
                <Button className="w-full" variant="outline" onClick={() => console.log('Email clicked')}>
                  <Mail className="mr-2 h-4 w-4" /> Send Email
                </Button>
                <Button className="w-full" variant="outline" onClick={() => console.log('Schedule clicked')}>
                  <Calendar className="mr-2 h-4 w-4" /> Schedule Visit
                </Button>
              </CardContent>
            </Card>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}