import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, Calendar, BarChart3, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Home',
      href: '/',
      icon: Home
    },
    {
      name: 'Food Log',
      href: '/food-log',
      icon: Calendar
    },
    {
      name: 'Weekly Dashboard',
      href: '/weekly-dashboard',
      icon: BarChart3
    }
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-hero-gradient flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">NutriTrack</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "flex items-center gap-2 transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-soft" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pb-4">
          <div className="flex flex-col gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={cn(
                      "w-full justify-start gap-2 transition-colors",
                      isActive 
                        ? "bg-primary text-primary-foreground shadow-soft" 
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;