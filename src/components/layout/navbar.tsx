"use client";

import { Bell, ChevronDown, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sidebar } from "./sidebar";

export function Navbar() {
  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="md:hidden mr-2">
          <Sidebar className="hidden" />
        </div>
        <div className="flex items-center text-xl font-bold md:hidden">
          Dashboard
        </div>
        <div className="flex-1 flex justify-center items-center space-x-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search leads, properties..."
              className="w-[250px] rounded-full border border-slate-200 bg-white px-8 py-2 text-sm outline-none focus:border-slate-300 focus:ring-slate-300"
            />
          </div>
          <div className="relative">
            <button className="flex items-center gap-2 text-sm bg-white px-4 py-2 rounded-full border border-slate-200">
              This month <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Bell className="h-5 w-5 text-slate-500" />
          </div>
          <Avatar>
            <AvatarFallback>NU</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </div>
  );
}