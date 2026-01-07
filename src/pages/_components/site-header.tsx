"use client";

import { SidebarIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Separator } from "../../components/ui/separator";
import { useSidebar } from "../../components/ui/sidebar";
import {
  Avatar,
  AvatarFallback,
} from "../../components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { logout } from "../../store/slices/authSlice";

export function SiteHeader() {
  const { toggleSidebar } = useSidebar();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state: any) => state.auth);



  const handleLogout = () => {
    dispatch(logout());
    setIsLogoutDialogOpen(false);
    navigate("/");
  };

  const getInitials = (name: string) => {
    if (!name) return "AD";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-[#662671]">
      <div className="flex h-(--header-height) w-full items-center gap-4 px-4">
        <Button
          className="h-4 w-4 text-white hover:bg-white/20 md:hidden"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <SidebarIcon />
        </Button>
        <Separator
          orientation="vertical"
          className="mr-2 h-4 bg-white/30 md:hidden"
        />

        <div className="flex items-center gap-3">
          <img
            src="/img2.png"
            alt="Digitalflake"
            className="h-9 w-50 rounded-lg"
          />
        </div>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full hover:bg-white/20"
                >
                  <Avatar className="h-8 w-8">
                    {/* <AvatarImage src="https://github.com/shadcn.png" alt="User" /> */}
                    <AvatarFallback className="bg-white text-[#662671]">
                      {getInitials(user.name || user.fullName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.name || user.fullName}</p>
                    <p className="w-50 truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setIsLogoutDialogOpen(true)}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              className="text-white hover:bg-white/20"
              onClick={() => navigate("/")}
            >
              Login
            </Button>
          )}
        </div>
      </div>

      <AlertDialog
        open={isLogoutDialogOpen}
        onOpenChange={setIsLogoutDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
}
