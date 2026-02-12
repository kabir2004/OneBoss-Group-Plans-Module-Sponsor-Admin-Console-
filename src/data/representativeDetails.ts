/** Representative detail view - built from client + mock fields for the full profile. */
export type RepDetails = {
  id: string;
  nrdNumber: string;
  surname: string;
  name: string;
  dateOfBirth: string;
  mr72OnFile: string;
  mr72OnFileDate: string;
  businessName: string;
  federalBN: string;
  provincialBN: string;
  startDate: string;
  endDate: string;
  serviceLevel: string;
  note: string;
  officeContact: { phone: string; fax: string; cell: string; email: string; residentialAddress: string };
  homeContact: { phone: string; fax: string; cell: string; email: string; residentialAddress: string };
  codesUnderRep: string[];
  codesUnderT4A: string[];
  dealerMaximums: string;
  managerMaximums: string;
  officeAddress: { address: string; city: string; province: string; postal: string; country: string };
  residentialAddress: { address: string; city: string; province: string; postal: string; country: string };
  officeMailingAddress: { address: string; city: string; province: string; postal: string; country: string };
  residentialMailingAddress: { address: string; city: string; province: string; postal: string; country: string };
  documents: { uploadedBy: string; dateCreated: string; description: string; visibleToRepCode: string }[];
  registrations: { type: string; province: string; number: string; startDate: string; endDate: string }[];
};

function parseName(fullName: string): { surname: string; name: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { surname: parts[0] ?? '', name: '' };
  return { surname: parts[parts.length - 1] ?? '', name: parts.slice(0, -1).join(' ') };
}

export function getRepresentativeDetails(
  clientId: string,
  client: { name: string; email: string; city: string; province: string; accountNumber: string }
): RepDetails {
  const { surname, name } = parseName(client.name);
  const addr = { address: '800 4th St.', city: client.city, province: client.province, postal: 'N1N1N1', country: 'CAN' };
  const docList = [
    { uploadedBy: '', dateCreated: '01/15/2022', description: 'SSEOP ERP-VL exp 04 2022', visibleToRepCode: 'Yes' },
    { uploadedBy: '', dateCreated: '03/22/2021', description: 'Form 33-109F1', visibleToRepCode: 'Yes' },
    { uploadedBy: '', dateCreated: '06/10/2020', description: 'Letter of Resignation', visibleToRepCode: 'Yes' },
    { uploadedBy: '', dateCreated: '02/01/2019', description: 'Sales Rep Agreement', visibleToRepCode: 'Yes' },
    { uploadedBy: '', dateCreated: '12/05/2018', description: '2018 Annual Compliance Questionnaire', visibleToRepCode: 'Yes' },
  ];
  const regList = [
    { type: 'Mutual Fund', province: 'BC', number: 'MF-12345', startDate: 'Jul 3, 2002', endDate: '' },
    { type: 'Mutual Fund', province: 'ON', number: 'MF-67890', startDate: 'Jul 3, 2002', endDate: '' },
    { type: 'Mutual Fund', province: 'AB', number: 'MF-11223', startDate: 'Jan 15, 2005', endDate: '' },
    { type: 'Mutual Fund', province: 'QC', number: 'MF-44556', startDate: 'Mar 22, 2008', endDate: '' },
    { type: 'Insurance', province: 'ON', number: 'LLQP-78901', startDate: 'Sep 1, 2010', endDate: '' },
    { type: 'Insurance', province: 'BC', number: 'LLQP-23456', startDate: 'Nov 12, 2012', endDate: '' },
    { type: 'Securities', province: 'ON', number: 'Sec-33445', startDate: 'Feb 28, 2015', endDate: '' },
    { type: 'Mutual Fund', province: 'NS', number: 'MF-99887', startDate: 'Jun 10, 2018', endDate: 'Apr 11, 2019' },
  ];
  return {
    id: clientId,
    nrdNumber: '',
    surname,
    name,
    dateOfBirth: 'Aug 17, 1967',
    mr72OnFile: 'No',
    mr72OnFileDate: '',
    businessName: 'Full Service Advisory',
    federalBN: '',
    provincialBN: '',
    startDate: 'Jul 3, 2002',
    endDate: 'Apr 11, 2019',
    serviceLevel: 'Full Service',
    note: '',
    officeContact: {
      phone: '555-555-5556',
      fax: '555-555-5558',
      cell: '555-555-5557',
      email: client.email,
      residentialAddress: `800 4th St., ${client.city}`,
    },
    homeContact: {
      phone: '555-555-5556',
      fax: '555-555-5558',
      cell: '555-555-5557',
      email: client.email,
      residentialAddress: '',
    },
    codesUnderRep: [`3257-1145 ${client.name}`, `7912-1145 ${client.name}`, `9823-1145 ${client.name}`],
    codesUnderT4A: [`3257-1145 ${client.name}`, `7912-1145 ${client.name}`],
    dealerMaximums: 'No dealer maximums for person',
    managerMaximums: 'No manager maximums for person',
    officeAddress: addr,
    residentialAddress: { ...addr, postal: '' },
    officeMailingAddress: { ...addr, postal: 'K2E 7T7' },
    residentialMailingAddress: { ...addr, postal: '' },
    documents: docList,
    registrations: regList,
  };
}
