'use client';

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowUp, ChevronUp, Users, Building2 } from "lucide-react";
import { FadeIn, SlideIn } from "@/components/ui/animations";

export default function DashboardPage() {
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
                    <div className="text-4xl font-bold text-blue-600 group-hover:text-white">320</div>
                    <p className="text-sm mt-2 flex items-center text-green-500 group-hover:text-green-200">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      +12% this week
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
                    <div className="text-4xl font-bold text-blue-600 group-hover:text-white">220</div>
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
                    <div className="text-4xl font-bold text-blue-600 group-hover:text-white">100</div>
                    <p className="text-sm mt-2 flex items-center text-red-500 group-hover:text-red-200">
                      <ArrowUp className="mr-1 h-4 w-4" />
                      +5% this week
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

            {/* High Intent Leads */}
            <SlideIn direction="right" delay={0.3}>
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">High Intent Leads</h2>
                  <a href="/leads" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">view all</a>
                </div>                <div className="bg-white p-4 rounded-lg shadow-sm">
                  {/* Search bar - doubled width */}
                  <div className="mb-4">
                    <input 
                      type="text" 
                      placeholder="Search leads..." 
                      className="w-full md:w-2/3 lg:w-3/4 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  {/* Grid for leads - 2 per row on larger screens, 1 per row on smaller */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Lead 1 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>SG</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Samiksha Ghole</h3>
                        <p className="text-sm text-gray-500">Interested in 3BHK at Olive Heights</p>
                      </div>
                      <div>
                        <Button size="sm">Follow up</Button>
                      </div>
                    </div>
                    
                    {/* Lead 2 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>RK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Rahul Kumar</h3>
                        <p className="text-sm text-gray-500">Interested in 2BHK at Sapphire Greens</p>
                      </div>
                      <div>
                        <Button size="sm" >Follow up</Button>
                      </div>
                    </div>
                    
                    {/* Lead 3 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>AP</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Ananya Patel</h3>
                        <p className="text-sm text-gray-500">Interested in 4BHK at Royal Classic</p>
                      </div>
                      <div>
                        <Button size="sm">Follow up</Button>
                      </div>
                    </div>
                    
                    {/* Lead 4 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>VS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Vikram Singh</h3>
                        <p className="text-sm text-gray-500">Interested in 3BHK at Riveria Complex</p>
                      </div>
                      <div>
                        <Button size="sm">Follow up</Button>
                      </div>
                    </div>
                    
                    {/* Lead 5 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>MD</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Meera Desai</h3>
                        <p className="text-sm text-gray-500">Interested in 2BHK at Olive Heights</p>
                      </div>
                      <div>
                        <Button size="sm">Follow up</Button>
                      </div>
                    </div>
                    
                    {/* Lead 6 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>AK</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Arjun Kapoor</h3>
                        <p className="text-sm text-gray-500">Interested in 3BHK at Sapphire Greens</p>
                      </div>
                      <div>
                        <Button size="sm">Follow up</Button>
                      </div>
                    </div>
                    
                    {/* Lead 7 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>PS</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Priya Sharma</h3>
                        <p className="text-sm text-gray-500">Interested in 4BHK at Riveria Complex</p>
                      </div>
                      <div>
                        <Button size="sm">Follow up</Button>
                      </div>
                    </div>
                    
                    {/* Lead 8 */}
                    <div className="flex items-center gap-4 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                      <Avatar className="h-10 w-10 bg-blue-100 text-blue-600">
                        <AvatarFallback>RJ</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-medium">Raj Joshi</h3>
                        <p className="text-sm text-gray-500">Interested in 3BHK at Royal Classic</p>
                      </div>
                      <div>
                        <Button size="sm">Follow up</Button>
                      </div>
                    </div>
                  </div>
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
                      {[
                        { name: "Olive Heights", leads: 98, demoViews: 21, siteVisits: 33, tokens: 21 },
                        { name: "Riveria Complex", leads: 55, demoViews: 40, siteVisits: 25, tokens: 20 },
                        { name: "Sapphire Greens", leads: 60, demoViews: 44, siteVisits: 39, tokens: 30 },
                        { name: "Royal Classic", leads: 49, demoViews: 21, siteVisits: 19, tokens: 15 }
                      ].map((property, i) => (
                        <SlideIn key={i} direction="up" delay={0.15 * i}>
                          <Card className="hover:shadow-lg transition-all duration-300">
                            <CardContent className="px-4">
                              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                                <div>
                                  <h3 className="font-semibold">{property.name}</h3>
                                  <p className="text-sm text-gray-500">Baner, Pune - 3BHK Premium Tower</p>
                                </div>
                                <Button variant="outline" size="sm" className="hover:bg-blue-50 transition-colors">View property</Button>
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
                      <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New lead assigned to you</p>
                          <p className="text-xs text-gray-500">Rahul Kumar - 2 minutes ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Site visit completed</p>
                          <p className="text-xs text-gray-500">Olive Heights - 15 minutes ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Follow-up scheduled</p>
                          <p className="text-xs text-gray-500">Samiksha Ghole - 1 hour ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 border border-gray-100 rounded-lg hover:bg-blue-50 transition-colors">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Token issued</p>
                          <p className="text-xs text-gray-500">Ananya Patel - 2 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
        
        {/* Action Buttons - Responsive placement */}
        
      </div>
      
    </DashboardLayout>
  );
}