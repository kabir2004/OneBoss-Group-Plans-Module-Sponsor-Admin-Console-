import React, { useState } from 'react';
import { Check, ChevronDown, Monitor } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { useInterface } from '@/context/InterfaceContext';

export type InterfaceType = 'super-admin' | 'admin' | 'admin-assistant';

interface InterfaceOption {
  id: InterfaceType;
  label: string;
  available: boolean;
}

const interfaceOptions: InterfaceOption[] = [
  { id: 'super-admin', label: 'Super Administrator', available: true },
  { id: 'admin', label: 'Administrator', available: true },
  { id: 'admin-assistant', label: 'Administrator Assistant', available: true },
];

export const getInterfaceDisplayName = (interfaceType: InterfaceType): string => {
  const option = interfaceOptions.find(opt => opt.id === interfaceType);
  return option?.label || 'Administrator';
};

const getInterfaceColor = (interfaceType: InterfaceType): string => {
  switch (interfaceType) {
    case 'super-admin':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'admin':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'admin-assistant':
      return 'bg-gray-100 text-gray-700 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export function InterfaceSwitcher() {
  const { currentInterface, setCurrentInterface } = useInterface();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const handleSelectInterface = (interfaceType: InterfaceType) => {
    const option = interfaceOptions.find(opt => opt.id === interfaceType);
    if (option?.available) {
      setCurrentInterface(interfaceType);
    }
  };

  const currentDisplayName = getInterfaceDisplayName(currentInterface);

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 px-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300"
        >
          <span className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Current: {currentDisplayName}</span>
            <Badge 
              variant="outline" 
              className={cn("font-semibold", getInterfaceColor(currentInterface))}
            >
              Marsh, Antoine
            </Badge>
            <ChevronDown className="h-4 w-4 ml-1" />
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[320px] p-0" align="start" side="bottom">
        <div className="p-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Switch Interface</h3>
        </div>
        <div className="p-2">
          <div className="space-y-1">
            {interfaceOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  handleSelectInterface(option.id);
                  if (option.available) {
                    setIsPopoverOpen(false);
                  }
                }}
                disabled={!option.available}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                  option.available
                    ? "hover:bg-gray-100 text-gray-900 cursor-pointer"
                    : "text-gray-400 cursor-not-allowed opacity-50",
                  currentInterface === option.id && "bg-blue-50"
                )}
              >
                <span>{option.label}</span>
                {currentInterface === option.id && option.available && (
                  <Check className="h-4 w-4 text-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

