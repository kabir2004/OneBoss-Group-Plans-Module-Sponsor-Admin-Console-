import React, { useState } from 'react';
import { ShoppingCart as ShoppingCartIcon, ChevronRight, ChevronDown, DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface Trade {
  id: string;
  symbol: string;
  amount: number;
}

interface Plan {
  id: string;
  name: string;
  type: string;
  amount: number;
  tradeCount: number;
  trades: Trade[];
}

interface ClientCart {
  id: string;
  name: string;
  amount: number;
  planCount: number;
  plans: Plan[];
  type: 'client';
}

interface AdvisorCart {
  id: string;
  name: string;
  amount: number;
  clientCount: number;
  clients: ClientCart[];
  type: 'advisor';
}

interface ShoppingCartProps {
  children: React.ReactNode;
}

export function ShoppingCart({ children }: ShoppingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  // Mock data - matching the image exactly
  const cartData: (AdvisorCart | ClientCart)[] = [
    {
      id: 'advisor-1',
      name: 'John Smith',
      type: 'advisor',
      amount: 179792.50,
      clientCount: 2,
      clients: [
        {
          id: 'client-1',
          name: 'Client A',
          amount: 100000,
          planCount: 1,
          plans: [],
          type: 'client',
        },
        {
          id: 'client-2',
          name: 'Client B',
          amount: 79792.50,
          planCount: 1,
          plans: [],
          type: 'client',
        },
      ],
    },
    {
      id: 'client-1',
      name: 'Sarah Johnson',
      type: 'client',
      amount: 98572.50,
      planCount: 2,
      plans: [
        {
          id: 'plan-1',
          name: 'Plan A',
          type: 'RRSP',
          amount: 30050.00,
          tradeCount: 2,
          trades: [
            { id: 'trade-1', symbol: 'AAPL', amount: 15000 },
            { id: 'trade-2', symbol: 'MSFT', amount: 15050 },
          ],
        },
        {
          id: 'plan-2',
          name: 'Plan B',
          type: 'TFSA',
          amount: 68522.50,
          tradeCount: 2,
          trades: [
            { id: 'trade-3', symbol: 'GOOGL', amount: 35000 },
            { id: 'trade-4', symbol: 'TSLA', amount: 33522.50 },
          ],
        },
      ],
    },
    {
      id: 'client-2',
      name: 'Michael Brown',
      type: 'client',
      amount: 81220.00,
      planCount: 2,
      plans: [
        {
          id: 'plan-3',
          name: 'Plan C',
          type: 'RRSP',
          amount: 40000,
          tradeCount: 1,
          trades: [],
        },
        {
          id: 'plan-4',
          name: 'Plan D',
          type: 'TFSA',
          amount: 41220,
          tradeCount: 1,
          trades: [],
        },
      ],
    },
    {
      id: 'advisor-2',
      name: 'Emily Davis',
      type: 'advisor',
      amount: 303332.50, // Adjusted to match total of $662,917.50
      clientCount: 2,
      clients: [
        {
          id: 'client-3',
          name: 'Client C',
          amount: 150000,
          planCount: 1,
          plans: [],
          type: 'client',
        },
        {
          id: 'client-4',
          name: 'Client D',
          amount: 153332.50,
          planCount: 1,
          plans: [],
          type: 'client',
        },
      ],
    },
  ];

  const totalAmount = cartData.reduce((sum, item) => sum + item.amount, 0);

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const togglePlan = (id: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedPlans(newExpanded);
  };

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <>
      <div onClick={() => setIsOpen(true)}>{children}</div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="pb-4 border-b">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <ShoppingCartIcon className="h-5 w-5" />
              Shopping Cart
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-3 py-4">
            {cartData.map((item) => {
              const isAdvisor = 'clientCount' in item;
              const isExpanded = expandedItems.has(item.id);

              return (
                <div key={item.id} className="border border-gray-200 rounded-lg">
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleItem(item.id)}
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <Checkbox
                        checked={selectedItems.has(item.id)}
                        onCheckedChange={() => {
                          const newSelected = new Set(selectedItems);
                          if (newSelected.has(item.id)) {
                            newSelected.delete(item.id);
                          } else {
                            newSelected.add(item.id);
                          }
                          setSelectedItems(newSelected);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="mr-1"
                      />
                      <div className="flex items-center gap-2">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-500" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-500" />
                        )}
                        <ShoppingCartIcon className="h-4 w-4 text-gray-500" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-600">
                          {isAdvisor
                            ? `${item.clientCount} clients with pending trades`
                            : `${item.planCount} plans`}
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold text-gray-900">
                      {formatCurrency(item.amount)}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t border-gray-200 bg-gray-50">
                      {isAdvisor ? (
                        <div className="p-3 space-y-2">
                          {item.clients.map((client) => (
                            <div
                              key={client.id}
                              className="flex items-center justify-between p-3 bg-white rounded border border-gray-200"
                            >
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{client.name}</div>
                                <div className="text-sm text-gray-600">
                                  {client.planCount} plan{client.planCount !== 1 ? 's' : ''}
                                </div>
                              </div>
                              <div className="font-semibold text-gray-900">
                                {formatCurrency(client.amount)}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-3 space-y-2">
                          {item.plans.map((plan) => {
                            const isPlanExpanded = expandedPlans.has(plan.id);
                            return (
                              <div
                                key={plan.id}
                                className="border border-gray-200 rounded bg-white"
                              >
                                <div
                                  className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    togglePlan(plan.id);
                                  }}
                                >
                                  <div className="flex items-center gap-2 flex-1">
                                    <ChevronRight className="h-3 w-3 text-gray-500" />
                                    <ShoppingCartIcon className="h-3 w-3 text-gray-500" />
                                    <div>
                                      <div className="font-medium text-sm text-gray-900">
                                        {plan.name} - {plan.type}
                                      </div>
                                      <div className="text-xs text-gray-600">
                                        {plan.tradeCount} trade{plan.tradeCount !== 1 ? 's' : ''}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="font-semibold text-sm text-gray-900">
                                    {formatCurrency(plan.amount)}
                                  </div>
                                </div>
                                {isPlanExpanded && plan.trades.length > 0 && (
                                  <div className="border-t border-gray-200 p-2 bg-gray-50">
                                    {plan.trades.map((trade) => (
                                      <div
                                        key={trade.id}
                                        className="flex items-center justify-between p-2 text-xs"
                                      >
                                        <span className="text-gray-700">{trade.symbol}</span>
                                        <span className="font-medium text-gray-900">
                                          {formatCurrency(trade.amount)}
                                        </span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Total items across all advisors</span>
              <span className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalAmount)}
              </span>
            </div>
            <div className="flex gap-3">
              <Button
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Handle checkout
                  console.log('Checkout all trades');
                }}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Checkout All Trades
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsOpen(false)}
              >
                Close Cart
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

