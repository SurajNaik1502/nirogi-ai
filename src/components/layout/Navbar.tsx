
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';
import { Menu, X, Bell, Settings, User } from 'lucide-react';
import MobileSidebar from './MobileSidebar';
import ThemeToggle from './ThemeToggle';

const Navbar: React.FC = () => {
  const isMobile = useIsMobile();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="glass-morphism sticky top-0 z-10 py-3 px-4 md:px-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMobileMenuOpen(true)}
              className="text-foreground"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          
          <div className="flex items-center">
            <span className="health-gradient text-xl font-bold">HealthGlow Nexus</span>
          </div>
        </div>
        
        <div className="flex items-center gap-x-2">
          <Button variant="ghost" size="icon" className="text-foreground">
            <Bell className="h-5 w-5" />
          </Button>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="text-foreground">
            <Settings className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="text-foreground">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {isMobile && (
        <MobileSidebar 
          isOpen={isMobileMenuOpen} 
          onClose={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </nav>
  );
};

export default Navbar;
