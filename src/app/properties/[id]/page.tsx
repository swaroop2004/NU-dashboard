'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { dataService } from "@/services/dataService";
import { Property } from '@/types';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SlideIn } from "@/components/ui/slide-in";
import { ArrowLeft, MapPin, Home, Tag, Users, Calendar, Phone, Mail, Clock } from 'lucide-react';

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  // Unwrap params with React.use
  const unwrappedParams = React.use(params as unknown as React.Usable<{ id: string }>);
  const propertyId = unwrappedParams.id;
  
  const router = useRouter();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await dataService.getPropertyById(propertyId);
        if (response.success) {
          setProperty(response.data);
        }
      } catch (error) {
        console.error('Error fetching property:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const handleBackClick = () => {
    router.push('/properties/listing');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!property) {
    return <div className="flex items-center justify-center h-screen">Property not found</div>;
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex items-center gap-2 mb-6">
          <Button variant="ghost" size="sm" onClick={handleBackClick}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to All Properties
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <SlideIn>
              <Card>
                <CardHeader className="pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-2xl font-bold">{property.name}</CardTitle>
                      <div className="flex items-center text-gray-500 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span>{property.location}</span>
                      </div>
                    </div>
                    <Badge className="text-sm">{property.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="aspect-video bg-gray-200 rounded-md mb-6 relative">
                    {/* Property image would go here */}
                    {/* <div className="absolute bottom-3 right-3">
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
                        View Gallery
                      </Badge>
                    </div> */}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">Type</div>
                      <div className="font-medium flex items-center">
                        <Home className="h-4 w-4 mr-1 text-blue-500" />
                        {property.type}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">Price</div>
                      <div className="font-medium flex items-center">
                        <Tag className="h-4 w-4 mr-1 text-blue-500" />
                        {property.price}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">Leads</div>
                      <div className="font-medium flex items-center">
                        <Users className="h-4 w-4 mr-1 text-blue-500" />
                        {property.leads}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-500">Site Visits</div>
                      <div className="font-medium flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-blue-500" />
                        {property.siteVisits}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Description</h3>
                    <p className="text-gray-700">{property.description}</p>
                    
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-2">
                          {property.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50">
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </SlideIn>
          </div>

          <div className="space-y-6">
            <SlideIn direction="right">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {property.builder && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Builder</span>
                      <span className="font-medium">{property.builder}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-500">Status</span>
                    <Badge>{property.status}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Demo Views</span>
                    <span className="font-medium">{property.demoViews}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Tokens</span>
                    <span className="font-medium">{property.tokens}</span>
                  </div>
                  {property.possessionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">Possession Date</span>
                      <span className="font-medium">{new Date(property.possessionDate).toLocaleDateString()}</span>
                    </div>
                  )}
                  {property.reraNumber && (
                    <div className="flex justify-between">
                      <span className="text-gray-500">RERA Number</span>
                      <span className="font-medium">{property.reraNumber}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </SlideIn>

            <SlideIn direction="right" delay={0.1}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Performance Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Lead Conversion</span>
                      <span className="text-sm font-medium">{Math.round((property.tokens / property.leads) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((property.tokens / property.leads) * 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Site Visit Conversion</span>
                      <span className="text-sm font-medium">{Math.round((property.siteVisits / property.leads) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((property.siteVisits / property.leads) * 100)} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-500">Demo Effectiveness</span>
                      <span className="text-sm font-medium">{Math.round((property.tokens / property.demoViews) * 100)}%</span>
                    </div>
                    <Progress value={Math.round((property.tokens / property.demoViews) * 100)} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </SlideIn>

            <SlideIn direction="right" delay={0.2}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full">Schedule Site Visit</Button>
                  <Button variant="outline" className="w-full">View Property Brochure</Button>
                  <Button variant="outline" className="w-full">Share Property</Button>
                </CardContent>
              </Card>
            </SlideIn>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}