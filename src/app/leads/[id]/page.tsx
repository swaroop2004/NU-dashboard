'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dataService } from "@/services/dataService";
import { useData } from "@/context/DataContext";
import { Lead } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SlideIn } from "@/components/ui/slide-in";
import { ArrowLeft, MessageSquare, Calendar, FileText, Upload } from 'lucide-react';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params with React.use
  const unwrappedParams = React.use(params as unknown as React.Usable<{ id: string }>);
  const leadId = unwrappedParams.id;

  const router = useRouter();
  const { leads, loading: globalLoading } = useData();
  const [lead, setLead] = useState<Lead | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (globalLoading) {
      return;
    }

    const foundLead = leads.find(l => l.id === leadId);

    if (foundLead) {
      setLead(foundLead);
      setLoading(false);
    } else {
      // Fallback to API if not found in context (e.g. direct link to new lead)
      const fetchLead = async () => {
        try {
          setLoading(true);
          const response = await dataService.getLeadById(leadId);
          if (response.success) {
            setLead(response.data);
          }
        } catch (error) {
          console.error('Error fetching lead:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchLead();
    }
  }, [leadId, leads, globalLoading]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!lead) {
    return <div className="flex items-center justify-center h-screen">Lead not found</div>;
  }

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

        <h1 className="text-3xl font-bold">{lead.name}</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Status */}
          <SlideIn direction="left" delay={0.1}>
            <Card className="bg-blue-50">
              <CardHeader>
                <CardTitle>Lead Status</CardTitle>
              </CardHeader>
              <CardContent>
                <h3 className="text-xl font-medium">Demo Completion</h3>
                <div className="mt-2">
                  <Progress value={78} className="h-4" />
                  <div className="text-3xl font-bold text-blue-600 mt-2">78%</div>
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Preferences */}
          <SlideIn direction="left" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm text-gray-500">Most viewed</h4>
                    <p>Balcony View</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Skipped</h4>
                    <p>Studio Section</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Completion</h4>
                    <p>78%</p>
                  </div>
                  <div>
                    <h4 className="text-sm text-gray-500">Rewatched</h4>
                    <p>Balcony (2X)</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-gray-50 rounded-md text-sm">
                  <p>Focused on 3BHK units with balcony. Ignored Studio section. Likely high intent.</p>
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Properties viewed */}
          <SlideIn direction="left" delay={0.3}>
            <Card>
              <CardHeader>
                <CardTitle>Properties viewed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Badge variant="outline" className="text-blue-600 bg-blue-50">Active</Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">2BHK - Olive Heights</h4>
                    <p className="text-sm text-gray-500">Walked</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">2BHK -Sapphire Greens</h4>
                    <p className="text-sm text-gray-500">Booked</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">3BHK - Riveria Complex</h4>
                    <p className="text-sm text-gray-500">Walked</p>
                  </div>
                  <div className="border rounded-md p-3">
                    <h4 className="font-medium">Demo Stage</h4>
                    <p className="text-sm text-gray-500">78% done</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Interaction Timeline */}
          <SlideIn direction="left" delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Interaction Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Site Visit Scheduled</h4>
                      <p className="text-sm text-gray-500">15 June, 11:00 AM</p>
                      <p className="text-sm mt-1">Customer confirmed site visit to Riveria Complex</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-green-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">WhatsApp Conversation</h4>
                      <p className="text-sm text-gray-500">26 Jan, 3:45 PM</p>
                      <p className="text-sm mt-1">Discussed pricing options and available units</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-purple-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium">Property Brochure Sent</h4>
                      <p className="text-sm text-gray-500">24 Jan, 10:15 AM</p>
                      <p className="text-sm mt-1">Sent detailed brochures for 2BHK and 3BHK options</p>
                    </div>
                  </div>
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
                    <AvatarImage src="/avatar-placeholder.jpg" alt="Sales Rep" />
                    <AvatarFallback>VG</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">Vikram Gupta</div>
                    <div className="text-sm text-gray-500">34A20</div>
                  </div>
                </div>
                <div className="mt-2 text-sm text-gray-500">Last contact 26 Jan</div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Engagement Heat-Map */}
          <SlideIn direction="right" delay={0.2}>
            <Card>
              <CardHeader>
                <CardTitle>Engagement Heat-Map</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-40 w-full bg-gray-100 rounded-md mb-3">
                  {/* Placeholder for heat map visualization */}
                  <div className="h-full w-full p-4 flex items-center justify-center">
                    <div className="text-center text-gray-500">Heat map visualization</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Time spent across units indicates a clear leaning toward spacious, premium flats with balcony access.
                </div>
                <div className="mt-4">
                  <div className="mb-2">
                    <div className="text-sm">Riveria Complex</div>
                    <div className="text-xs text-gray-500">3 BHK Tower B, 9th Floor</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '70%' }}></div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="text-sm">Studio Tower A</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '20%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm">2 BHK Tower C, 5th floor</div>
                    <div className="h-2 w-full bg-gray-200 rounded-full mt-1">
                      <div className="h-2 bg-blue-600 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Visit Status */}
          <SlideIn direction="right" delay={0.3}>
            <Card className="bg-green-50">
              <CardHeader>
                <CardTitle>Visit Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xl font-medium text-green-600">Booked</div>
                <div className="text-gray-600 mt-1">15 June, 11:00</div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Action Center */}
          <SlideIn direction="right" delay={0.4}>
            <Card>
              <CardHeader>
                <CardTitle>Action Center</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Send Whatsapp Message
                </Button>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Schedule Site Visit
                </Button>
                <Button className="w-full">
                  Send Property Deck
                </Button>
                <Button className="w-full">
                  Request Documents
                </Button>
                <Button className="w-full">
                  Allot Token
                </Button>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Documents & KYC */}
          <SlideIn direction="right" delay={0.5}>
            <Card>
              <CardHeader>
                <CardTitle>Documents & KYC</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div>PAN Card</div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Aadhar Card</div>
                    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Submission Requested</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Address Proof</div>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>Booking Receipt</div>
                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>
                  </div>
                  <Button className="w-full mt-4 flex items-center justify-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload KYC Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </SlideIn>

          {/* Sales Rep Notes */}
          <SlideIn direction="right" delay={0.6}>
            <Card>
              <CardHeader>
                <CardTitle>Sales Rep Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">Client is very interested in 3BHK units with balcony views. Budget is flexible but prefers premium amenities. Follow up after site visit on 15th June.</p>
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        </div>
      </div>
    </div>
  );
}