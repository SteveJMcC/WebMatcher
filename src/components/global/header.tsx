
"use client";

import Link from 'next/link';
import { Briefcase, Users, Tag, UserCircle, LogIn, LogOut, Settings, LayoutDashboard, Sparkles, Menu, Mail } from 'lucide-react';
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
import { useAuth } from '@/context/auth-context';
import { Skeleton } from '@/components/ui/skeleton';

export function Header() {
  const { 
    isAuthenticated, 
    userType, 
    email, 
    displayName, 
    isLoading, 
    logout,
    designerAvatarUrl, // Used for designer's custom avatar
    // userAvatarUrl, // If clients were to have custom avatars, it would be here
  } = useAuth();

  const getInitials = (name: string | null) => {
    if (!name) return 'U';
    const nameToUse = name.trim() || 'User'; // Fallback if name is empty string
    return nameToUse.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  const currentDisplayNameForAvatar = displayName || (email ? email.split('@')[0] : 'User');

  let avatarSrc: string;
  if (userType === 'designer' && designerAvatarUrl && designerAvatarUrl.trim() !== '') {
    avatarSrc = designerAvatarUrl;
  } else if (userType === 'user' /* && userAvatarUrl && userAvatarUrl.trim() !== '' */) {
    // Placeholder for client-specific avatar if implemented in the future
    // For now, clients will use the default Pravatar image
    avatarSrc = `https://i.pravatar.cc/150?u=${email || 'default-client-avatar'}`;
  } else {
    // Default for any authenticated user if no specific avatar is found, or for designers without avatar
    avatarSrc = `https://i.pravatar.cc/150?u=${email || 'default-avatar-seed'}`;
  }


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
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={avatarSrc} alt={currentDisplayNameForAvatar || 'User'} data-ai-hint="user avatar" />
                    <AvatarFallback>{getInitials(currentDisplayNameForAvatar)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{displayName || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground flex items-center">
                       <Mail className="mr-1.5 h-3 w-3"/> {email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground mt-1">
                      Role: {userType === 'designer' ? 'Web Professional' : 'Client'}
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
