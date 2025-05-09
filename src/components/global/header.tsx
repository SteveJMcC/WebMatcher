
"use client";

import Link from 'next/link';
import { Briefcase, Users, Tag, UserCircle, LogIn, LogOut, Settings, LayoutDashboard, Sparkles, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthMock } from '@/hooks/use-auth-mock';
import { Skeleton } from '@/components/ui/skeleton';

export function Header() {
  const { isAuthenticated, userType, username, displayName, isLoading, logout } = useAuthMock();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    const nameToUse = name || 'User';
    return nameToUse.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const currentDisplayName = displayName || username;


  return (
    <header className="bg-background border-b sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-primary">
          <Sparkles className="h-7 w-7" />
          WebConnect
        </Link>

        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/post-job">
              <Briefcase className="mr-2 h-4 w-4" /> Post a Job
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/designers">
              <Users className="mr-2 h-4 w-4" /> Find Talent
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/pricing">
              <Tag className="mr-2 h-4 w-4" /> Pricing
            </Link>
          </Button>
        </nav>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={`https://i.pravatar.cc/150?u=${username}`} alt={currentDisplayName || 'User'} data-ai-hint="user avatar" />
                    <AvatarFallback>{getInitials(currentDisplayName)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentDisplayName}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {userType === 'designer' ? 'Designer' : 'Client'}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={userType === 'designer' ? "/designer-dashboard" : "/user-dashboard"}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {(userType === 'designer' || userType === 'user') && (
                  <DropdownMenuItem asChild>
                    <Link href={userType === 'designer' ? "/designer/setup-profile" : "/user/setup-profile"}>
                      <UserCircle className="mr-2 h-4 w-4" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href="/login">
                  <LogIn className="mr-2 h-4 w-4" /> Login
                </Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
           {/* Mobile Menu Trigger */}
           <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5"/>
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild><Link href="/post-job">Post a Job</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/designers">Find Talent</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link href="/pricing">Pricing</Link></DropdownMenuItem>
                 <DropdownMenuSeparator />
                 {isAuthenticated ? (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href={userType === 'designer' ? "/designer-dashboard" : "/user-dashboard"}>
                          Dashboard
                        </Link>
                      </DropdownMenuItem>
                       <DropdownMenuItem asChild>
                        <Link href={userType === 'designer' ? "/designer/setup-profile" : "/user/setup-profile"}>
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={logout}>
                        Log out
                      </DropdownMenuItem>
                    </>
                 ) : (
                    <>
                      <DropdownMenuItem asChild><Link href="/login">Login</Link></DropdownMenuItem>
                      <DropdownMenuItem asChild><Link href="/signup">Sign Up</Link></DropdownMenuItem>
                    </>
                 )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
