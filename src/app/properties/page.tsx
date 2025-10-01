import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ChevronLeft, 
  ChevronRight, 
  Users, 
  Eye, 
  MapPin,
  Building 
} from "lucide-react";

export default function PropertiesPage() {
  // Top performing properties data from dashboard
  const topProperties = [
    { 
      id: 1,
      name: "Olive Heights", 
      location: "Baner, Pune",
      type: "3BHK Premium Tower",
      price: "₹1.2 Cr onwards",
      leads: 98, 
      demoViews: 21, 
      siteVisits: 33, 
      tokens: 21,
      status: "Active"
    },
    { 
      id: 2,
      name: "Riveria Complex", 
      location: "Kharadi, Pune",
      type: "2BHK Luxury Apartments",
      price: "₹85 L onwards",
      leads: 55, 
      demoViews: 40, 
      siteVisits: 25, 
      tokens: 20,
      status: "Active"
    },
    { 
      id: 3,
      name: "Sapphire Greens", 
      location: "Wakad, Pune",
      type: "4BHK Villa",
      price: "₹2.5 Cr onwards",
      leads: 60, 
      demoViews: 44, 
      siteVisits: 39, 
      tokens: 30,
      status: "Active"
    },
    { 
      id: 4,
      name: "Royal Classic", 
      location: "Hinjewadi, Pune",
      type: "3BHK Apartments",
      price: "₹95 L onwards",
      leads: 49, 
      demoViews: 21, 
      siteVisits: 19, 
      tokens: 15,
      status: "Active"
    },
  ];

  // Additional properties for the table
  const additionalProperties = [
    { 
      id: 5,
      name: "Green Valley", 
      location: "Bavdhan, Pune",
      type: "2BHK Apartments",
      price: "₹75 L onwards",
      leads: 35, 
      demoViews: 18, 
      siteVisits: 12, 
      tokens: 8,
      status: "Pre-launch"
    },
    { 
      id: 6,
      name: "Serene Heights", 
      location: "Aundh, Pune",
      type: "1BHK Studio Apartments",
      price: "₹45 L onwards",
      leads: 42, 
      demoViews: 15, 
      siteVisits: 10, 
      tokens: 5,
      status: "Pre-launch"
    },
  ];

  // Combine all properties
  const allProperties = [...topProperties, ...additionalProperties];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Properties Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Filter</Button>
            <Button size="sm">Add Property</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Property</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allProperties.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell className="pl-4">
                        <div className="font-medium">{property.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" />
                          {property.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Building className="mr-1 h-3 w-3" />
                          {property.type}
                        </div>
                      </TableCell>
                      <TableCell>{property.price}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          property.status === 'Active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {property.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm">
                            <Users className="mr-1 h-3 w-3 text-blue-500" />
                            <span className="font-medium">{property.leads} Leads</span>
                          </div>
                          <div className="flex items-center text-sm">
                            <Eye className="mr-1 h-3 w-3 text-blue-500" />
                            <span>{property.demoViews} Demo Views, {property.siteVisits} Site Visits</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Edit</Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-end p-4 space-x-2">
              <Button variant="outline" size="sm">
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}