
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Home,
  Heart,
  Brain,
  Pill,
  Calendar,
  ImagePlus,
  PieChart,
  FileText,
  MapPin,
  Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  href: string;
}

const NavItem: React.FC<NavItemProps> = ({ icon: Icon, label, active, href }) => {
  return (
    <a 
      href={href}
      className={cn(
        "flex items-center gap-x-3 px-3 py-2 rounded-md transition-colors text-sm",
        active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span>{label}</span>
    </a>
  );
};

const Sidebar: React.FC = () => {
  return (
    <aside className="glass-morphism w-64 flex-shrink-0 border-r border-white/5 p-4 hidden md:flex flex-col h-[calc(100vh-64px)]">
      <div className="flex flex-col flex-1 overflow-y-auto space-y-6 pt-4">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-2 pl-3">DASHBOARD</p>
          <NavItem icon={Home} label="Overview" active href="/" />
          <NavItem icon={Heart} label="Health Consultant" href="/consultant" />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground mb-2 pl-3">FEATURES</p>
          <NavItem icon={Brain} label="Mental Health" href="/mental-health" />
          <NavItem icon={ImagePlus} label="Skin Analysis" href="/skin-analysis" />
          <NavItem icon={Calendar} label="Appointments" href="/appointments" />
          <NavItem icon={Pill} label="Medicine Tracker" href="/medicine-tracker" />
          <NavItem icon={PieChart} label="Diet & Workout" href="/diet-workout" />
          <NavItem icon={FileText} label="Report Analyzer" href="/report-analyzer" />
          <NavItem icon={MapPin} label="Hospital Tracker" href="/hospital-tracker" />
        </div>
      </div>
      
      <div className="mt-auto py-4">
        <Button variant="secondary" className="w-full">
          <Bell className="h-4 w-4 mr-2" />
          SOS Emergency
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;
