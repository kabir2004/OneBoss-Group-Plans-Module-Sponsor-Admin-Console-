import React, { useState } from 'react';
import { X, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type AttestationDocument = {
  id: string;
  title: string;
  version: string;
  author: string;
  date: string;
  content: {
    introduction: string;
    keyPrinciples: string[];
    complianceRequirements: string;
  };
};

const initialDocuments: AttestationDocument[] = [
  {
    id: '1',
    title: 'Code of Business Conduct and Ethics 2024',
    version: '-',
    author: 'Som Houmphanh',
    date: 'January 24, 2025',
    content: {
      introduction: 'This document outlines the Code of Business Conduct and Ethics that all employees must follow. It establishes the standards of behavior expected from our team members and provides guidance on ethical decision-making in the workplace.',
      keyPrinciples: [
        'Integrity and honesty in all business dealings',
        'Respect for colleagues, clients, and stakeholders',
        'Compliance with applicable laws and regulations',
        'Confidentiality of company and client information',
        'Fair and ethical treatment of all parties',
      ],
      complianceRequirements: 'All employees are required to read, understand, and acknowledge this document. Failure to comply with these standards may result in disciplinary action up to and including termination of employment. Regular training and updates will be provided to ensure ongoing compliance with these principles.',
    },
  },
  {
    id: '2',
    title: 'PPM',
    version: '2023',
    author: 'Som Houmphanh',
    date: 'June 28, 2024',
    content: {
      introduction: 'This Private Placement Memorandum (PPM) outlines the terms and conditions for investment opportunities. It provides detailed information about investment strategies, risks, and regulatory compliance requirements.',
      keyPrinciples: [
        'Full disclosure of investment risks',
        'Transparency in fee structures',
        'Compliance with securities regulations',
        'Accurate representation of investment performance',
        'Protection of investor interests',
      ],
      complianceRequirements: 'All advisors must review and acknowledge this PPM to ensure they understand the investment products and can properly advise clients. Acknowledgment is required before recommending these investment options.',
    },
  },
  {
    id: '3',
    title: 'Code of Business Conduct',
    version: '2023',
    author: 'Som Houmphanh',
    date: 'October 10, 2023',
    content: {
      introduction: 'This Code of Business Conduct establishes the ethical framework for all business activities. It defines acceptable behavior and provides guidance for handling conflicts of interest and ethical dilemmas.',
      keyPrinciples: [
        'Ethical decision-making in all business matters',
        'Avoidance of conflicts of interest',
        'Protection of confidential information',
        'Fair dealing with all parties',
        'Compliance with regulatory requirements',
      ],
      complianceRequirements: 'All team members must acknowledge this code annually. Failure to comply may result in disciplinary action. Regular training sessions will be conducted to reinforce these principles.',
    },
  },
  {
    id: '4',
    title: 'Client Focused Reforms',
    version: '2021',
    author: 'Som Houmphanh',
    date: 'December 16, 2021',
    content: {
      introduction: 'The Client Focused Reforms represent significant changes to how financial advisors must interact with clients. These reforms enhance client protection and require greater transparency in client relationships.',
      keyPrinciples: [
        'Client-first approach in all recommendations',
        'Enhanced disclosure of conflicts of interest',
        'Suitability assessment for all recommendations',
        'Ongoing client relationship management',
        'Documentation of client interactions',
      ],
      complianceRequirements: 'All advisors must acknowledge understanding of these reforms and commit to implementing them in their practice. Regular compliance reviews will ensure adherence to these requirements.',
    },
  },
];

interface AttestationsProps {
  children: React.ReactNode;
}

export function Attestations({ children }: AttestationsProps) {
  const [documents, setDocuments] = useState<AttestationDocument[]>(initialDocuments);
  const [acknowledgedIds, setAcknowledgedIds] = useState<Set<string>>(new Set());
  const [selectedDocument, setSelectedDocument] = useState<AttestationDocument | null>(null);
  const [showDocumentDialog, setShowDocumentDialog] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const pendingDocuments = documents.filter(doc => !acknowledgedIds.has(doc.id));
  const acknowledgedDocuments = documents.filter(doc => acknowledgedIds.has(doc.id));
  const allDocuments = [...pendingDocuments, ...acknowledgedDocuments];

  const handleViewAndAcknowledge = (document: AttestationDocument) => {
    setSelectedDocument(document);
    setShowDocumentDialog(true);
  };

  const handleAcknowledge = () => {
    if (selectedDocument) {
      setAcknowledgedIds(prev => new Set([...prev, selectedDocument.id]));
      setShowDocumentDialog(false);
      setSelectedDocument(null);
      // Keep the popover open so user can see the acknowledged status
    }
  };

  return (
    <>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          {children}
        </PopoverTrigger>
        <PopoverContent 
          align="end" 
          side="bottom" 
          className="w-[500px] p-0 max-h-[70vh] overflow-hidden"
          sideOffset={8}
        >
          <div className="flex flex-col h-full">
            <div className="px-4 pt-4 pb-3 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Attestations</h2>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {pendingDocuments.length} documents require your attention
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    <Filter className="h-3 w-3 mr-1" />
                    Filter
                  </Button>
                </div>
              </div>
            </div>
            
            <ScrollArea className="flex-1 px-4 py-3 max-h-[50vh]">
              <div className="space-y-2">
                {allDocuments.map((document) => {
                  const isAcknowledged = acknowledgedIds.has(document.id);
                  return (
                    <Card key={document.id} className="border border-gray-200 shadow-sm bg-white">
                      <CardContent className="p-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-sm font-semibold text-gray-900 mb-1.5">
                              {document.title}
                            </h3>
                            <div className="text-xs text-gray-600 space-y-0.5">
                              <div>
                                <span className="font-medium">Version:</span> {document.version}
                              </div>
                              <div>
                                <span className="font-medium">Author:</span> {document.author}
                              </div>
                              <div>
                                <span className="font-medium">Date:</span> {document.date}
                              </div>
                              {isAcknowledged && (
                                <div className="text-green-600 font-medium mt-1">
                                  ✓ Acknowledged
                                </div>
                              )}
                            </div>
                          </div>
                          {!isAcknowledged && (
                            <Button
                              onClick={() => handleViewAndAcknowledge(document)}
                              className="bg-blue-600 hover:bg-blue-700 text-white ml-3 text-xs h-8 px-3"
                            >
                              View and Acknowledge
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </PopoverContent>
      </Popover>

      {/* Document View Dialog */}
      <Dialog open={showDocumentDialog} onOpenChange={setShowDocumentDialog}>
        <DialogContent className="max-w-3xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-gray-900">Attestations</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-6">
              {/* Document Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Document:</span>{' '}
                    <span className="text-gray-900">{selectedDocument?.title}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Date:</span>{' '}
                    <span className="text-gray-900">{selectedDocument?.date}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Author:</span>{' '}
                    <span className="text-gray-900">{selectedDocument?.author}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Status:</span>{' '}
                    <span className="text-gray-900">Pending Acknowledgment</span>
                  </div>
                </div>
              </div>

              {/* Document Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Document Content</h3>
                <div className="space-y-4 text-sm text-gray-700">
                  <p>{selectedDocument?.content.introduction}</p>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Key Principles:</h4>
                    <ul className="list-disc list-inside space-y-1 ml-2">
                      {selectedDocument?.content.keyPrinciples.map((principle, idx) => (
                        <li key={idx}>{principle}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Compliance Requirements:</h4>
                    <p>{selectedDocument?.content.complianceRequirements}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-4">
            <p className="text-sm text-gray-600">
              By clicking "Acknowledge", you confirm that you have read and understood this document.
            </p>
            <Button
              onClick={handleAcknowledge}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Acknowledge
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

