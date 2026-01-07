import {
  ChevronRight,
  Folder,
  Home,
  Package,
  Grid3x3,
  type LucideIcon,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";

export function NavMain({
  projects,
}: {
  projects: {
    name: string;
    url: string;
    icon: LucideIcon;
  }[];
}) {
  const location = useLocation();

  console.log("location", location);

  const getIconForUrl = (url: string) => {
    if (url === "/home") return Home;
    if (url === "/category") return Grid3x3;
    if (url === "/subcategory") return Grid3x3;
    if (url === "/products") return Package;
    return Folder;
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarMenu>
        {projects.map((item) => {
          const Icon = getIconForUrl(item.url);
          const isActive = location.pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                asChild
                className={`py-6 px-4 ${
                  isActive
                    ? "bg-purple-100 text-purple-700 border-l-4 border-purple-600"
                    : "text-gray-700 hover:bg-gray-100 hover:text-gray-900 "
                }`}
              >
                <Link to={item.url} className="flex items-center ">
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              </SidebarMenuButton>
              <SidebarMenuAction className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 py-2">
                <ChevronRight className="h-4 w-4" />
              </SidebarMenuAction>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
