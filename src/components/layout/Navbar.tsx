import React, { useState } from 'react';
import { Bell, User, Mail, ShoppingCart as ShoppingCartIcon, Eye, EyeOff, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Attestations } from '@/components/Attestations';
import { InterfaceSwitcher } from '@/components/InterfaceSwitcher';
import { ShoppingCart } from '@/components/ShoppingCart';
import { useMenuVisibility } from '@/context/MenuVisibilityContext';
import { useSponsor } from '@/context/SponsorContext';

interface NavbarProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Navbar({ className, onMenuClick }: NavbarProps) {
  const { isMenuHidden, toggleMenuVisibility } = useMenuVisibility();
  const { currentSponsorName, setCurrentSponsorName, hasMultipleSponsors, availableSponsors } = useSponsor();
  const [switchSponsorOpen, setSwitchSponsorOpen] = useState(false);

  return (
    <header className={cn("bg-white z-30", className)}>
      <div className="w-full flex items-center justify-between h-16 px-4 lg:px-6">
        <div className="flex items-center gap-4 flex-wrap">
          <InterfaceSwitcher />
          <div className="h-6 w-px bg-gray-200" aria-hidden />
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">Sponsor: {currentSponsorName}</p>
              <p className="text-xs text-gray-500 leading-tight">Viewing: Group Plans</p>
            </div>
            {hasMultipleSponsors && (
              <Popover open={switchSponsorOpen} onOpenChange={setSwitchSponsorOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-8 text-xs shrink-0">
                    Switch Sponsor
                    <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-56 p-2" align="start">
                  {availableSponsors.map((name) => (
                    <button
                      key={name}
                      type="button"
                      className={cn(
                        'w-full text-left rounded-md px-2 py-1.5 text-sm hover:bg-gray-100',
                        currentSponsorName === name && 'bg-gray-100 font-medium'
                      )}
                      onClick={() => {
                        setCurrentSponsorName(name);
                        setSwitchSponsorOpen(false);
                      }}
                    >
                      {name}
                    </button>
                  ))}
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 text-gray-600 hover:text-gray-900"
            onClick={toggleMenuVisibility}
            title={isMenuHidden ? "Show all menu items" : "Hide menu items (except Dashboard, Plan Members, Group Contributions, Administrator)"}
          >
            {isMenuHidden ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </Button>
          
          <ShoppingCart>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 text-gray-600 hover:text-gray-900"
            >
              <ShoppingCartIcon className="h-5 w-5" />
            </Button>
          </ShoppingCart>
          
          <Attestations>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative h-9 w-9 text-gray-600 hover:text-gray-900"
            >
              <Mail className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            </Button>
          </Attestations>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative h-9 w-9 text-gray-600 hover:text-gray-900"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          </Button>
          
          <Avatar className="h-9 w-9 transition-transform duration-200 hover:scale-105">
            <AvatarFallback className="bg-gray-100 text-gray-900">
              <User className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
