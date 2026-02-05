import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, ClipboardList, FileText, Upload } from 'lucide-react';

const kycChecklist = [
  { client: 'Smith Family Trust', status: 'Complete', due: 'Reviewed Nov 2024', variant: 'secondary' as const },
  { client: 'Johnson Retirement Fund', status: 'Awaiting Sign-Off', due: 'Due Dec 12, 2024', variant: 'outline' as const },
  { client: 'Williams Education Savings', status: 'Docs Outstanding', due: 'Upload beneficiary update', variant: 'destructive' as const },
];

const outstandingTasks = [
  { label: 'Upload signed suitability letter for Johnson Retirement Fund', type: 'Document Upload' },
  { label: 'Schedule annual KYC review with Brown Emergency Fund', type: 'KYC Review' },
  { label: 'Provide trade rationale for switch order – Maple Leaf Holdings', type: 'Trade Review' },
];

const regulatoryForms = [
  { name: 'Client Relationship Disclosure', updated: 'Nov 3, 2024', status: 'Active' },
  { name: 'Risk Profile Questionnaire', updated: 'Oct 18, 2024', status: 'Active' },
  { name: 'Suitability Assessment Template', updated: 'Sep 22, 2024', status: 'Draft' },
];

const Compliance = () => {
  return (
    <PageLayout title="Compliance & KYC">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>KYC & Suitability Status</CardTitle>
            <CardDescription>Track suitability and KYC obligations for each client household.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {kycChecklist.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.client}</p>
                  <p className="text-xs text-gray-500">{item.due}</p>
                </div>
                <Badge variant={item.variant}>{item.status}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full border-gray-300 text-sm">
              <ClipboardList className="h-4 w-4 mr-2" />
              View KYC summary report
            </Button>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Outstanding Compliance Tasks</CardTitle>
            <CardDescription>Address pending tasks to maintain suitability and documentation.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {outstandingTasks.map((task, idx) => (
              <div key={idx} className="rounded-lg border border-gray-100 px-3 py-2">
                <p className="text-sm font-medium text-gray-900">{task.label}</p>
                <p className="text-xs text-gray-500">{task.type}</p>
              </div>
            ))}
            <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white text-sm">
              <ShieldCheck className="h-4 w-4 mr-2" />
              Record compliance attestation
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4">
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Regulatory Forms & Templates</CardTitle>
            <CardDescription>Keep disclosure documents and suitability templates up to date.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {regulatoryForms.map((form, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">{form.name}</p>
                  <p className="text-xs text-gray-500">Updated {form.updated}</p>
                </div>
                <Badge variant={form.status === 'Active' ? 'secondary' : 'outline'}>{form.status}</Badge>
              </div>
            ))}
            <Button variant="outline" className="w-full border-gray-300 text-sm">
              <Upload className="h-4 w-4 mr-2" />
              Upload new regulatory document
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Compliance;


