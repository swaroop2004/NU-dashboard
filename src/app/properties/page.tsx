"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PropertyTable } from "@/components/table";
import { Property, PropertyStatus } from '@/types';
import { dataService } from '@/services/dataService';
import { PropertyDetailsModal } from '@/components/PropertyDetailsModal';
import { 
  ChevronLeft, 
  ChevronRight, 
  Filter,
  Plus
} from "lucide-react";

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter] = useState<PropertyStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await dataService.getProperties();
      setProperties(response.data || []);
    } catch (error) {
      console.error('Error loading properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setIsModalOpen(true);
  };

  const handleEditProperty = (property: Property) => {
    console.log('Edit property:', property);
  };

  const handleAddProperty = () => {
    console.log('Add new property');
  };

  const handleFilter = () => {
    console.log('Open filter dialog');
  };

  const filteredProperties = properties.filter(property => {
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl font-bold">Properties Management</h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="flex-1 sm:flex-initial">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleFilter}>
              <Filter className="h-4 w-4 mr-1" />
              Filter
            </Button>
            <Button size="sm" onClick={handleAddProperty}>
              <Plus className="h-4 w-4 mr-1" />
              Add Property
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-6">
            <PropertyTable
              properties={filteredProperties}
              loading={loading}
              onPropertyClick={handleViewProperty}
              onPropertyAction={(action, property) => {
                if (action === 'view') {
                  setSelectedProperty(property);
                  setIsModalOpen(true);
                } else if (action === 'edit') {
                  handleEditProperty(property);
                } else {
                  console.log(`Property ${action}:`, property);
                }
              }}
            />
            
            {!loading && filteredProperties.length > 0 && (
              <div className="flex items-center justify-end p-4 space-x-2 border-t">
                <Button variant="outline" size="sm">
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <Button variant="outline" size="sm">
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <PropertyDetailsModal
        property={selectedProperty}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={(property) => {
          console.log('Edit property:', property);
          setIsModalOpen(false);
        }}
      />
    </DashboardLayout>
  );
}