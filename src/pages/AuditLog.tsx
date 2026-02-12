import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { History, Filter } from 'lucide-react';
import { useAuditLog } from '@/context/AuditLogContext';

const AuditLog = () => {
  const { entries: auditEntries } = useAuditLog();

  return (
    <PageLayout title="Audit Log & Activity">
      <Card className="border border-gray-200 shadow-sm bg-white">
        <CardHeader className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <CardTitle>Activity Feed</CardTitle>
              <CardDescription>Review every dealer action and system event for compliance oversight.</CardDescription>
            </div>
            <Button variant="outline" className="border-gray-300 text-sm">
              <Filter className="h-4 w-4 mr-2" />
              Export activity log
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Input placeholder="Search by client, plan, or user…" className="text-sm" />
            <Select defaultValue="all">
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All activity</SelectItem>
                <SelectItem value="trade">Trades</SelectItem>
                <SelectItem value="document">Documents</SelectItem>
                <SelectItem value="compliance">Compliance</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="tombstone">Tombstone</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="30days">
              <SelectTrigger className="text-sm">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="custom">Custom range…</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[540px]">
            <div className="divide-y divide-gray-100">
              {auditEntries.map((entry, idx) => (
                <div key={idx} className="px-4 py-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <History className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                    </div>
                    <span className="text-xs text-gray-500">{entry.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500">{entry.detail}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>By {entry.user}</span>
                    <span className="uppercase tracking-wide">{entry.type}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </PageLayout>
  );
};

export default AuditLog;


