import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Sidebar from "./Sidebar";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileSidebar: React.FC<MobileSidebarProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black z-50" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-black border-r border-white/5 z-50 animate-in slide-in-from-left">
        <div className="flex items-center justify-between p-4">
          <span className="health-gradient text-xl font-bold">
            HealthGlow Nexus
          </span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-64px)]">
          <Sidebar />
        </div>
      </div>
    </>
  );
};

export default MobileSidebar;
