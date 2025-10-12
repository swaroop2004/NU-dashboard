'use client';

import React from 'react';
import { Property } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { SlideIn } from "@/components/ui/slide-in";
import { X, MapPin, Home, Tag, Users, Calendar, Phone, Mail, Clock, Eye, Edit } from 'lucide-react';

interface PropertyDetailsModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (property: Property) => void;
}

export function PropertyDetailsModal({ property, isOpen, onClose, onEdit }: PropertyDetailsModalProps) {
  if (!isOpen || !property) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800 border-green-200';
      case 'Pre-launch': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Under Construction': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Ready to Move': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Sold Out': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'On Hold': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-2 sm:p-4 md:pl-[var(--sidebar-width,16rem)] md:pr-4"
      onClick={handleBackdropClick}
      style={{
        "--sidebar-width": "16rem"
      } as React.CSSProperties}
    >
      <div className="bg-white rounded-lg w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-[90%] lg:max-w-5xl max-h-[95vh] overflow-hidden shadow-xl">
        <div className="sticky top-0 bg-white z-10 flex justify-between items-center p-3 sm:p-4 border-b">
          <h2 className="text-base sm:text-lg md:text-xl font-bold truncate">Property Details</h2>
          <div className="flex space-x-1 sm:space-x-2">
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs sm:text-sm py-1 px-2 sm:py-2 sm:px-3"
                onClick={() => onEdit(property)}
              >
                <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Edit
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose} className="p-1 sm:p-2 flex-shrink-0">
              <X className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(95vh-64px)]">
          <div className="p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
            <SlideIn>
              <Card>
                <CardContent className="p-0">
                  <div className="relative h-36 sm:h-40 md:h-48 bg-gray-100">
                    {property.images && property.images.length > 0 ? (
                      <img 
                        src={property.images[0]}
                        alt={property.name} 
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Home className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 sm:p-4 md:p-6">
                    <div className="flex justify-between items-start mb-2 sm:mb-4">
                      <div className="max-w-[60%]">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold truncate">{property.name}</h2>
                        <div className="flex items-center text-gray-500 mt-0.5 sm:mt-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="text-xs sm:text-sm truncate">{property.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base sm:text-xl md:text-2xl font-bold">₹{property.price.toLocaleString()}</div>
                        <div className="text-xs sm:text-sm text-gray-500">{property.type}</div>
                      </div>
                    </div>
                    <Badge className={`${getStatusColor(property.status)} mb-4 text-xs sm:text-sm`}>
                      {property.status}
                    </Badge>
                    {/* Property image would go here */}
                    {/* <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3">
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm">
                        View Gallery
                      </Badge>
                    </div> */}
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6 px-6">
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-md">
                      <div className="text-xs sm:text-sm text-gray-500">Type</div>
                      <div className="text-sm sm:text-base font-medium flex items-center">
                        <Home className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
                        <span className="truncate">{property.type}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-md">
                      <div className="text-xs sm:text-sm text-gray-500">Price</div>
                      <div className="text-sm sm:text-base font-medium flex items-center">
                        <Tag className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
                        <span className="truncate">{property.price}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-md">
                      <div className="text-xs sm:text-sm text-gray-500">Leads</div>
                      <div className="text-sm sm:text-base font-medium flex items-center">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
                        <span className="truncate">{property.leads}</span>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-2 sm:p-3 rounded-md">
                      <div className="text-xs sm:text-sm text-gray-500">Site Visits</div>
                      <div className="text-sm sm:text-base font-medium flex items-center">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-blue-500" />
                        <span className="truncate">{property.siteVisits}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4 px-6">
                    <h3 className="text-base sm:text-lg font-semibold">Description</h3>
                    <p className="text-sm sm:text-base text-gray-700">{property.description}</p>
                    
                    {property.amenities && property.amenities.length > 0 && (
                      <div className="mt-4 sm:mt-6">
                        <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">Amenities</h3>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {property.amenities.map((amenity, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-xs sm:text-sm py-0.5">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <SlideIn direction="up">
                <Card>
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Property Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 sm:space-y-4">
                    {property.builder && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">Builder</span>
                        <span className="text-xs sm:text-sm font-medium truncate max-w-[60%] text-right">{property.builder}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-500">Status</span>
                      <Badge className="text-xs">{property.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-500">Demo Views</span>
                      <span className="text-xs sm:text-sm font-medium">{property.demoViews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs sm:text-sm text-gray-500">Tokens</span>
                      <span className="text-xs sm:text-sm font-medium">{property.tokens}</span>
                    </div>
                    {property.possessionDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">Possession Date</span>
                        <span className="text-xs sm:text-sm font-medium">{new Date(property.possessionDate).toLocaleDateString()}</span>
                      </div>
                    )}
                    {property.reraNumber && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs sm:text-sm text-gray-500">RERA Number</span>
                        <span className="text-xs sm:text-sm font-medium truncate max-w-[60%] text-right">{property.reraNumber}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </SlideIn>

              <SlideIn direction="up">
                <Card>
                  <CardHeader className="pb-2 sm:pb-4">
                    <CardTitle className="text-base sm:text-lg">Performance Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs sm:text-sm text-gray-500">Lead Conversion</span>
                        <span className="text-xs sm:text-sm font-medium">{Math.round((property.tokens / property.leads) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((property.tokens / property.leads) * 100)} className="h-1.5 sm:h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs sm:text-sm text-gray-500">Site Visit Conversion</span>
                        <span className="text-xs sm:text-sm font-medium">{Math.round((property.siteVisits / property.leads) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((property.siteVisits / property.leads) * 100)} className="h-1.5 sm:h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs sm:text-sm text-gray-500">Demo Effectiveness</span>
                        <span className="text-xs sm:text-sm font-medium">{Math.round((property.tokens / property.demoViews) * 100)}%</span>
                      </div>
                      <Progress value={Math.round((property.tokens / property.demoViews) * 100)} className="h-1.5 sm:h-2" />
                    </div>
                  </CardContent>
                </Card>
              </SlideIn>
            </div>

            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              {onEdit && (
                <Button onClick={() => onEdit(property)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Property
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}