"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  Menu
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

const routes = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Leads",
    href: "/leads",
  },
  {
    label: "Properties",
    href: "/properties",
  },
  {
    label: "Analytics",
    href: "/analytics",
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <div className="space-y-4 py-4 flex flex-col h-full bg-white/80 backdrop-blur-xl text-slate-800 border-r border-white/40">
            <div className="px-3 py-2 flex items-center gap-2 bg-white/60 backdrop-blur-sm border-b border-white/30">
              <div className="bg-blue-600 text-white p-2 rounded-md shadow-md">
                <span className="font-bold">Nu</span>
              </div>
              <span className="font-bold text-xl text-gray-800 drop-shadow-sm">Real Estate</span>
            </div>
            <div className="flex flex-col px-3 py-2 space-y-2 bg-white/40 backdrop-blur-sm">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-blue-500 hover:text-white hover:shadow-md",
                    pathname === route.href ? "bg-blue-500 text-white shadow-md" : "bg-white/40 backdrop-blur-sm border border-white/30"
                  )}
                >
                  <span>{route.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className={cn("hidden md:flex h-full w-[200px] flex-col bg-white/60 backdrop-blur-xl border-r border-white/40 shadow-lg", className)}>
        <div className="px-3 py-4 flex items-center gap-2 bg-white/40 backdrop-blur-sm border-b border-white/30">
          <div className="bg-blue-600 text-white p-2 rounded-md shadow-md">
            <span className="font-bold">Nu</span>
          </div>
          <span className="font-bold text-xl text-gray-800 drop-shadow-sm">Real Estate</span>
        </div>
        <div className="flex flex-col flex-1 px-3 py-2 space-y-2 bg-white/30 backdrop-blur-sm">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-all hover:bg-blue-500 hover:text-white hover:shadow-md",
                pathname === route.href ? "bg-blue-500 text-white shadow-md" : "bg-white/40 backdrop-blur-sm border border-white/30"
              )}
            >
              <span>{route.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}