import React from "react";
import {
  BarChart,
  Calendar,
  Home,
  LogOut,
  Menu,
  Search,
  Shuffle,
  User,
  Users,
  X,
} from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const navigationLinks = [
  {
    name: "Dashboard",
    href: "/",
    icon: Home,
  },
  {
    name: "Activity",
    href: "/activity",
    icon: BarChart,
  },
  {
    name: "Schedule",
    href: "/schedule",
    icon: Calendar,
  },
  {
    name: "Buddy Finder",
    href: "/buddy-finder",
    icon: Users,
  },
  {
    name: "Skill Swap",
    href: "/skill-swap",
    icon: Shuffle,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
];

const Navigation = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm" className="mr-2 md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Explore the different sections of our app.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) =>
                    `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${
                      isActive ? "font-bold" : ""
                    }`
                  }
                  onClick={() => setOpen(false)}
                >
                  <link.icon className="h-4 w-4" />
                  <span>{link.name}</span>
                </NavLink>
              ))}
            </div>
          </SheetContent>
        </Sheet>
        <Label className="hidden md:block font-bold">Fitness App</Label>
        <div className="ml-auto flex items-center space-x-4">
          <Input type="search" placeholder="Search..." className="max-w-sm" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="hidden md:block">
        <div className="mx-auto max-w-7xl">
          <div className="flex space-x-4 px-4 py-2">
            {navigationLinks.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `flex items-center space-x-2 rounded-md p-2 text-sm font-medium hover:underline ${
                    isActive ? "font-bold" : ""
                  }`
                }
              >
                <link.icon className="h-4 w-4" />
                <span>{link.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
