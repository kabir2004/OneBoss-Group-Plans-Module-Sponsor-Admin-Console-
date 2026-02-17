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
import type { InterfaceType } from '@/context/InterfaceContext';
import { useRoles } from '@/context/RoleContext';

export const getInterfaceDisplayName = (interfaceType: InterfaceType, roleName?: string): string => {
  return roleName ?? 'Administrator';
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
  const { rolesOrdered, getRoleById } = useRoles();
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const currentRole = getRoleById(currentInterface);
  const currentDisplayName = currentRole?.name ?? 'Administrator';

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="h-9 px-3 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 border-gray-300"
        >
          <span className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            <span>Sterling Mutuals | Current: {currentDisplayName}</span>
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
            {rolesOrdered.map((role) => (
              <button
                key={role.id}
                onClick={() => {
                  setCurrentInterface(role.id);
                  setIsPopoverOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between",
                  "hover:bg-gray-100 text-gray-900 cursor-pointer",
                  currentInterface === role.id && "bg-blue-50"
                )}
              >
                <span>{role.name}</span>
                {currentInterface === role.id && (
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

