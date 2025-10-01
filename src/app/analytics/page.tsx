import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AnalyticsPage() {
  // Conversion funnel data from dashboard
  const funnelData = [
    { name: "Leads Captured", value: 1200 },
    { name: "Contacted", value: 900 },
    { name: "Attended Demo", value: 650 },
    { name: "Site Visit Booked", value: 420 },
    { name: "Token Issued", value: 210 },
    { name: "Registered", value: 135 },
  ];

  // Monthly lead data
  const monthlyLeadData = [
    { name: "Jan", leads: 150 },
    { name: "Feb", leads: 180 },
    { name: "Mar", leads: 210 },
    { name: "Apr", leads: 240 },
    { name: "May", leads: 270 },
    { name: "Jun", leads: 320 },
  ];

  // Property performance data
  const propertyPerformanceData = [
    { name: "Olive Heights", leads: 98, siteVisits: 33, tokens: 21 },
    { name: "Riveria Complex", leads: 55, siteVisits: 25, tokens: 20 },
    { name: "Sapphire Greens", leads: 60, siteVisits: 39, tokens: 30 },
    { name: "Royal Classic", leads: 49, siteVisits: 19, tokens: 15 },
  ];

  // Lead source distribution
  const leadSourceData = [
    { name: "Website", value: 35 },
    { name: "Referral", value: 25 },
    { name: "Property Portal", value: 20 },
    { name: "Social Media", value: 15 },
    { name: "Other", value: 5 },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Conversion Funnel */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={funnelData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Lead Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly Lead Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={monthlyLeadData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="leads"
                      stroke="#3b82f6"
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Lead Source Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Lead Source Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={leadSourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }: any) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {leadSourceData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Property Performance */}
          <Card className="col-span-1 md:col-span-2">
            <CardHeader>
              <CardTitle>Property Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={propertyPerformanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="leads" fill="#3b82f6" name="Leads" />
                    <Bar dataKey="siteVisits" fill="#10b981" name="Site Visits" />
                    <Bar dataKey="tokens" fill="#f59e0b" name="Tokens" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}