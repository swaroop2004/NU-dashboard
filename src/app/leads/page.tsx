import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  Phone, 
  Mail, 
  Calendar 
} from "lucide-react";

export default function LeadsPage() {
  // High intent leads data from dashboard
  const highIntentLeads = [
    { 
      id: 1,
      name: "Samiksha Ghole", 
      email: "samiksha.g@example.com",
      phone: "+91 98765 43210",
      source: "Website",
      status: "Hot",
      lastContact: "2 days ago",
      conversion: 84,
      property: "Olive Heights"
    },
    { 
      id: 2,
      name: "Priya Khanna", 
      email: "priya.k@example.com",
      phone: "+91 87654 32109",
      source: "Referral",
      status: "Hot",
      lastContact: "1 day ago",
      conversion: 80,
      property: "Riveria Complex"
    },
    { 
      id: 3,
      name: "Tanya Sharma", 
      email: "tanya.s@example.com",
      phone: "+91 76543 21098",
      source: "Property Portal",
      status: "Warm",
      lastContact: "3 days ago",
      conversion: 48,
      property: "Sapphire Greens"
    },
    { 
      id: 4,
      name: "Sagar Amin", 
      email: "sagar.a@example.com",
      phone: "+91 65432 10987",
      source: "Social Media",
      status: "Warm",
      lastContact: "5 days ago",
      conversion: 24,
      property: "Royal Classic"
    },
  ];

  // Additional leads for the table
  const additionalLeads = [
    { 
      id: 5,
      name: "Rahul Mehta", 
      email: "rahul.m@example.com",
      phone: "+91 54321 09876",
      source: "Website",
      status: "Cold",
      lastContact: "1 week ago",
      conversion: 15,
      property: "Olive Heights"
    },
    { 
      id: 6,
      name: "Ananya Patel", 
      email: "ananya.p@example.com",
      phone: "+91 43210 98765",
      source: "Property Portal",
      status: "Cold",
      lastContact: "2 weeks ago",
      conversion: 10,
      property: "Sapphire Greens"
    },
  ];

  // Combine all leads
  const allLeads = [...highIntentLeads, ...additionalLeads];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Leads Management</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">Export</Button>
            <Button size="sm">Add New Lead</Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-4">Lead</TableHead>
                    <TableHead>Contact</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Contact</TableHead>
                    <TableHead>Conversion</TableHead>
                    <TableHead>Property</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allLeads.map((lead) => (
                    <TableRow key={lead.id}>
                      <TableCell className="pl-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8 bg-blue-100 text-blue-600">
                            <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Mail className="mr-1 h-3 w-3" />
                            {lead.email}
                          </div>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Phone className="mr-1 h-3 w-3" />
                            {lead.phone}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{lead.source}</TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          lead.status === 'Hot' 
                            ? 'bg-green-100 text-green-800' 
                            : lead.status === 'Warm' 
                              ? 'bg-yellow-100 text-yellow-800' 
                              : 'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-1 h-3 w-3" />
                          {lead.lastContact}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`text-sm font-medium ${
                          lead.conversion > 50 
                            ? 'text-green-600' 
                            : lead.conversion > 20 
                              ? 'text-amber-600' 
                              : 'text-gray-600'
                        }`}>
                          {lead.conversion}%
                        </div>
                      </TableCell>
                      <TableCell>{lead.property}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">Follow Up</Button>
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