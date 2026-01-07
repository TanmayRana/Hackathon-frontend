"use client";

import * as React from "react";
import {
  BookOpen,
  Bot,
  CircleDot,
  Command,
  Frame,
  Home,
  LifeBuoy,
  Map,
  PieChart,
  Send,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { NavMain } from "./NavMain";

const data = {
  navlinks: [
    {
      name: "Home",
      url: "/home",
      icon: Home,
    },
    {
      name: "Category",
      url: "/category",
      icon: CircleDot,
    },
    {
      name: "Subcategory",
      url: "/subcategory",
      icon: Map,
    },
    {
      name: "Products",
      url: "/products",
      icon: Map,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarContent>
        <NavMain projects={data.navlinks} />
      </SidebarContent>
    </Sidebar>
  );
}
