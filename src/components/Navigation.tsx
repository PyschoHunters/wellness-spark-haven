import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Activity as ActivityIcon, BarChart2, Calendar, Users, BookOpen, Heart, Coins, Camera, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

const Navigation = () => {
  const { user, signOut } = useAuth();
  const pathName = useLocation().pathname;
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      })
    }
  };

  return (
    <div className="flex flex-col h-full pb-4 relative">
      <nav className="space-y-1 flex-1 mt-2 px-2">
        {[
          { name: 'Dashboard', href: '/', icon: ActivityIcon, active: pathName === '/' },
          { name: 'Activity', href: '/activity', icon: BarChart2, active: pathName === '/activity' },
          { name: 'Schedule', href: '/schedule', icon: Calendar, active: pathName === '/schedule' },
          { name: 'Form Analysis', href: '/form-analysis', icon: Camera, active: pathName === '/form-analysis' },
          { name: 'Buddy Finder', href: '/buddy-finder', icon: Users, active: pathName === '/buddy-finder' },
          { name: 'Expert Advice', href: '/expert-advice', icon: BookOpen, active: pathName.startsWith('/expert-advice') },
          { name: 'Nari Shakti', href: '/nari-shakti', icon: Heart, active: pathName === '/nari-shakti' },
          { name: 'FitChain', href: '/fitchain', icon: Coins, active: pathName === '/fitchain' },
        ].map((item, index) => (
          <Link
            key={index}
            to={item.href}
            className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors ${item.active ? 'bg-gray-100 text-gray-900' : 'text-gray-500'}`}
          >
            <item.icon className="mr-2.5 h-4 w-4 opacity-70 group-hover:opacity-100" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
      
      <div className="absolute bottom-0 left-0 w-full p-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-gray-100 transition-colors w-full justify-between">
              <div className="flex items-center">
                <Avatar className="mr-2.5 h-6 w-6">
                  <AvatarImage src={user?.avatar_url || `https://avatar.vercel.sh/${user?.email}.png`} />
                  <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span>{user?.email}</span>
              </div>
              <Settings className="ml-2.5 h-4 w-4 opacity-70 group-hover:opacity-100" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              toast({
                title: "Not implemented!",
                description: "This feature is not implemented yet.",
              })
            }}>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>Sign Out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navigation;
