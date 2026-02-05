// Comprehensive Canadian mutual fund data based on actual fund providers
// Fund codes follow industry-standard prefixes for each provider

export interface Product {
  code: string;
  name: string;
  marketValue: string;
  status: string;
}

export interface Company {
  id: string;
  name: string;
  productsReviewed: string;
  value: string;
  products: Product[];
}

export interface Client {
  id: string;
  name: string;
  productsReviewed: string;
  totalValue: string;
  companies: Company[];
}

export const fundsData: Client[] = [
  {
    id: 'client-1',
    name: '(9823-2232) Antoine Marsh',
    productsReviewed: '4 / 229',
    totalValue: '$9,507,408.92',
    companies: [
      { 
        id: '000', 
        name: 'Prime Funds Inc.', 
        productsReviewed: '0 / 5', 
        value: '$124,550.75',
        products: [
          { code: '000-101', name: 'Prime Canadian Equity Fund', marketValue: '$45,230.50', status: 'Not Reviewed' },
          { code: '000-202', name: 'Prime Balanced Growth Fund', marketValue: '$32,150.75', status: 'Not Reviewed' },
          { code: '000-303', name: 'Prime Income Fund', marketValue: '$28,890.20', status: 'Not Reviewed' },
          { code: '000-404', name: 'Prime Global Equity Fund', marketValue: '$12,679.30', status: 'Not Reviewed' },
          { code: '000-505', name: 'Prime Bond Fund', marketValue: '$5,600.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'aaa', 
        name: 'AXA Assurances Inc.', 
        productsReviewed: '0 / 4', 
        value: '$98,340.60',
        products: [
          { code: 'AAA-150', name: 'AXA Balanced Portfolio', marketValue: '$38,450.80', status: 'Not Reviewed' },
          { code: 'AAA-250', name: 'AXA Growth Fund', marketValue: '$28,230.50', status: 'Not Reviewed' },
          { code: 'AAA-350', name: 'AXA Conservative Income Fund', marketValue: '$22,890.40', status: 'Not Reviewed' },
          { code: 'AAA-450', name: 'AXA Global Opportunities Fund', marketValue: '$8,768.90', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'aaf', 
        name: 'Alternative Asset Funds', 
        productsReviewed: '0 / 6', 
        value: '$156,789.45',
        products: [
          { code: 'AAF-1001', name: 'Alternative Asset Global Fund', marketValue: '$52,340.20', status: 'Not Reviewed' },
          { code: 'AAF-1002', name: 'Alternative Asset Diversified Portfolio', marketValue: '$38,450.50', status: 'Not Reviewed' },
          { code: 'AAF-1003', name: 'Alternative Asset Income Fund', marketValue: '$28,150.30', status: 'Not Reviewed' },
          { code: 'AAF-1004', name: 'Alternative Asset Balanced Fund', marketValue: '$18,340.00', status: 'Not Reviewed' },
          { code: 'AAF-1005', name: 'Alternative Asset Growth Fund', marketValue: '$12,508.45', status: 'Not Reviewed' },
          { code: 'AAF-1006', name: 'Alternative Asset Real Estate Fund', marketValue: '$7,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'aat', 
        name: 'BMO Deposit Products', 
        productsReviewed: '0 / 5', 
        value: '$187,650.80',
        products: [
          { code: 'AAT-201', name: 'BMO Premium Money Market Fund', marketValue: '$76,991.55', status: 'Not Reviewed' },
          { code: 'AAT-202', name: 'BMO Strategic Income Portfolio', marketValue: '$52,340.20', status: 'Not Reviewed' },
          { code: 'AAT-203', name: 'BMO Balanced Deposit Fund', marketValue: '$35,220.50', status: 'Not Reviewed' },
          { code: 'AAT-204', name: 'BMO Conservative Growth Fund', marketValue: '$18,150.30', status: 'Not Reviewed' },
          { code: 'AAT-205', name: 'BMO High Interest Savings Fund', marketValue: '$4,948.25', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'abc', 
        name: 'ABC Funds', 
        productsReviewed: '0 / 5', 
        value: '$143,890.25',
        products: [
          { code: 'ABC-301', name: 'ABC Canadian Balanced Fund', marketValue: '$48,450.75', status: 'Not Reviewed' },
          { code: 'ABC-302', name: 'ABC Growth & Income Fund', marketValue: '$38,150.50', status: 'Not Reviewed' },
          { code: 'ABC-303', name: 'ABC Dividend Fund', marketValue: '$28,890.20', status: 'Not Reviewed' },
          { code: 'ABC-304', name: 'ABC Global Equity Fund', marketValue: '$18,399.80', status: 'Not Reviewed' },
          { code: 'ABC-305', name: 'ABC Monthly Income Fund', marketValue: '$10,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'abr', 
        name: 'Abria Alternative Investments Inc.', 
        productsReviewed: '0 / 4', 
        value: '$92,450.60',
        products: [
          { code: 'ABR-401', name: 'Abria Alternative Strategies Fund', marketValue: '$38,450.80', status: 'Not Reviewed' },
          { code: 'ABR-402', name: 'Abria Diversified Alternatives Fund', marketValue: '$28,230.50', status: 'Not Reviewed' },
          { code: 'ABR-403', name: 'Abria Hedge Fund Portfolio', marketValue: '$18,890.40', status: 'Not Reviewed' },
          { code: 'ABR-404', name: 'Abria Market Neutral Fund', marketValue: '$6,878.90', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'acc', 
        name: 'Accumulus Investment -Now JOV Funds', 
        productsReviewed: '0 / 5', 
        value: '$128,675.90',
        products: [
          { code: 'ACC-501', name: 'JOV Balanced Growth Fund', marketValue: '$45,340.20', status: 'Not Reviewed' },
          { code: 'ACC-502', name: 'JOV Canadian Equity Fund', marketValue: '$32,450.50', status: 'Not Reviewed' },
          { code: 'ACC-503', name: 'JOV Income Portfolio', marketValue: '$28,150.30', status: 'Not Reviewed' },
          { code: 'ACC-504', name: 'JOV Global Opportunities Fund', marketValue: '$15,735.00', status: 'Not Reviewed' },
          { code: 'ACC-505', name: 'JOV Conservative Fund', marketValue: '$7,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'acf', 
        name: 'All Canadian Management Inc', 
        productsReviewed: '0 / 6', 
        value: '$165,890.50',
        products: [
          { code: 'ACF-601', name: 'All Canadian Equity Fund', marketValue: '$58,991.55', status: 'Not Reviewed' },
          { code: 'ACF-602', name: 'All Canadian Balanced Fund', marketValue: '$42,340.20', status: 'Not Reviewed' },
          { code: 'ACF-603', name: 'All Canadian Dividend Income Fund', marketValue: '$28,220.50', status: 'Not Reviewed' },
          { code: 'ACF-604', name: 'All Canadian Growth Fund', marketValue: '$18,150.30', status: 'Not Reviewed' },
          { code: 'ACF-605', name: 'All Canadian Small Cap Fund', marketValue: '$12,187.95', status: 'Not Reviewed' },
          { code: 'ACF-606', name: 'All Canadian Bond Fund', marketValue: '$6,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'afm', 
        name: 'Foresters Financial Investment Management Company', 
        productsReviewed: '0 / 4', 
        value: '$118,560.70',
        products: [
          { code: 'AFM-701', name: 'Foresters Balanced Portfolio', marketValue: '$48,450.80', status: 'Not Reviewed' },
          { code: 'AFM-702', name: 'Foresters Income Fund', marketValue: '$38,230.50', status: 'Not Reviewed' },
          { code: 'AFM-703', name: 'Foresters Growth & Income Fund', marketValue: '$22,890.40', status: 'Not Reviewed' },
          { code: 'AFM-704', name: 'Foresters Conservative Fund', marketValue: '$8,989.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'agf', 
        name: 'AGF Investments Inc.', 
        productsReviewed: '1 / 9', 
        value: '$104,402.81',
        products: [
          { code: 'AGF304', name: 'AGF Global Equity Fund', marketValue: '$55,425.07', status: 'Reviewed' },
          { code: 'AGF684', name: 'AGF Global Growth Balanced Fund', marketValue: '$16,913.37', status: 'Not Reviewed' },
          { code: 'AGF477', name: 'AGF Elements Growth Portfolio', marketValue: '$16,884.50', status: 'Not Reviewed' },
          { code: 'AGF9623', name: 'AGF Global Sustainable Growth Equity Fund', marketValue: '$9,305.30', status: 'Not Reviewed' },
          { code: 'AGF280', name: 'AGF Global Strategic Income Fund', marketValue: '$1,417.88', status: 'Not Reviewed' },
          { code: 'AGF799', name: 'AGF Canadian Dividend Income Fund', marketValue: '$864.98', status: 'Not Reviewed' },
          { code: 'AGF4211', name: 'AGF Emerging Markets Fund', marketValue: '$821.66', status: 'Not Reviewed' },
          { code: 'AGF201', name: 'AGF American Growth Fund', marketValue: '$1,385.59', status: 'Not Reviewed' },
          { code: 'AGF9401', name: 'AGF Canadian Growth Equity Fund', marketValue: '$1,384.46', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'ahf', 
        name: 'Aston Hill Asset Management Inc.', 
        productsReviewed: '0 / 5', 
        value: '$134,780.40',
        products: [
          { code: 'AHF-801', name: 'Aston Hill Balanced Fund', marketValue: '$52,340.20', status: 'Not Reviewed' },
          { code: 'AHF-802', name: 'Aston Hill Canadian Equity Fund', marketValue: '$38,450.50', status: 'Not Reviewed' },
          { code: 'AHF-803', name: 'Aston Hill Income Fund', marketValue: '$24,150.30', status: 'Not Reviewed' },
          { code: 'AHF-804', name: 'Aston Hill Growth Fund', marketValue: '$14,839.40', status: 'Not Reviewed' },
          { code: 'AHF-805', name: 'Aston Hill Global Opportunities Fund', marketValue: '$5,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'ahp', 
        name: 'Arrow Hedge Partners Inc', 
        productsReviewed: '0 / 4', 
        value: '$108,650.30',
        products: [
          { code: 'AHP-901', name: 'Arrow Alternative Strategies Fund', marketValue: '$45,450.80', status: 'Not Reviewed' },
          { code: 'AHP-902', name: 'Arrow Hedge Fund Portfolio', marketValue: '$32,230.50', status: 'Not Reviewed' },
          { code: 'AHP-903', name: 'Arrow Market Neutral Fund', marketValue: '$22,890.00', status: 'Not Reviewed' },
          { code: 'AHP-904', name: 'Arrow Long/Short Equity Fund', marketValue: '$8,079.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'aim', 
        name: 'Invesco Canada Limited', 
        productsReviewed: '0 / 11', 
        value: '$216,567.55',
        products: [
          { code: 'AIM101', name: 'Invesco Canadian Equity Fund', marketValue: '$45,230.50', status: 'Not Reviewed' },
          { code: 'AIM205', name: 'Invesco Dividend Income Fund', marketValue: '$38,150.75', status: 'Not Reviewed' },
          { code: 'AIM312', name: 'Invesco Balanced Growth Fund', marketValue: '$32,890.20', status: 'Not Reviewed' },
          { code: 'AIM418', name: 'Invesco Global Equity Fund', marketValue: '$28,675.40', status: 'Not Reviewed' },
          { code: 'AIM522', name: 'Invesco Bond Fund', marketValue: '$22,145.80', status: 'Not Reviewed' },
          { code: 'AIM634', name: 'Invesco International Equity Fund', marketValue: '$18,920.35', status: 'Not Reviewed' },
          { code: 'AIM741', name: 'Invesco Income Fund', marketValue: '$12,450.90', status: 'Not Reviewed' },
          { code: 'AIM855', name: 'Invesco Real Estate Fund', marketValue: '$8,675.25', status: 'Not Reviewed' },
          { code: 'AIM962', name: 'Invesco Money Market Fund', marketValue: '$5,120.40', status: 'Not Reviewed' },
          { code: 'AIM1073', name: 'Invesco Emerging Markets Fund', marketValue: '$2,890.50', status: 'Not Reviewed' },
          { code: 'AIM1184', name: 'Invesco Small Cap Equity Fund', marketValue: '$1,417.50', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'atl', 
        name: 'CIBC Asset Management Inc.', 
        productsReviewed: '0 / 8', 
        value: '$276,991.55',
        products: [
          { code: 'ATL550', name: 'CIBC Balanced Fund', marketValue: '$76,991.55', status: 'Not Reviewed' },
          { code: 'ATL123', name: 'CIBC Canadian Equity Fund', marketValue: '$52,340.20', status: 'Not Reviewed' },
          { code: 'ATL456', name: 'CIBC Global Equity Fund', marketValue: '$45,220.50', status: 'Not Reviewed' },
          { code: 'ATL789', name: 'CIBC Dividend Income Fund', marketValue: '$38,150.30', status: 'Not Reviewed' },
          { code: 'ATL234', name: 'CIBC Canadian Bond Fund', marketValue: '$28,340.00', status: 'Not Reviewed' },
          { code: 'ATL567', name: 'CIBC Monthly Income Fund', marketValue: '$18,450.00', status: 'Not Reviewed' },
          { code: 'ATL890', name: 'CIBC U.S. Equity Fund', marketValue: '$12,250.00', status: 'Not Reviewed' },
          { code: 'ATL345', name: 'CIBC International Equity Fund', marketValue: '$5,250.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'bip', 
        name: 'Brandes Investment Partners & Co.', 
        productsReviewed: '0 / 3', 
        value: '$56,776.98',
        products: [
          { code: 'BIP220', name: 'Brandes Global Equity Fund', marketValue: '$32,450.75', status: 'Not Reviewed' },
          { code: 'BIP331', name: 'Brandes International Equity Fund', marketValue: '$15,890.23', status: 'Not Reviewed' },
          { code: 'BIP442', name: 'Brandes Global Value Fund', marketValue: '$8,436.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'bmg', 
        name: 'Bullion Management Services Inc', 
        productsReviewed: '0 / 1', 
        value: '$8,472.64',
        products: [
          { code: 'BMG100', name: 'BMG Gold Bullion Fund', marketValue: '$8,472.64', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'bmo', 
        name: 'BMO Investments Inc.', 
        productsReviewed: '0 / 15', 
        value: '$651,198.98',
        products: [
          { code: 'BMO1001', name: 'BMO Equity Fund', marketValue: '$125,450.80', status: 'Not Reviewed' },
          { code: 'BMO1102', name: 'BMO Monthly Income Fund', marketValue: '$98,230.50', status: 'Not Reviewed' },
          { code: 'BMO1203', name: 'BMO Dividend Fund', marketValue: '$72,890.40', status: 'Not Reviewed' },
          { code: 'BMO1304', name: 'BMO Balanced Fund', marketValue: '$58,675.30', status: 'Not Reviewed' },
          { code: 'BMO1405', name: 'BMO International Equity Fund', marketValue: '$45,120.90', status: 'Not Reviewed' },
          { code: 'BMO1506', name: 'BMO Bond Fund', marketValue: '$38,450.60', status: 'Not Reviewed' },
          { code: 'BMO1607', name: 'BMO Real Estate Fund', marketValue: '$32,890.75', status: 'Not Reviewed' },
          { code: 'BMO1708', name: 'BMO Money Market Fund', marketValue: '$28,145.23', status: 'Not Reviewed' },
          { code: 'BMO1809', name: 'BMO Global Equity Fund', marketValue: '$22,675.50', status: 'Not Reviewed' },
          { code: 'BMO1910', name: 'BMO Growth Fund', marketValue: '$15,890.00', status: 'Not Reviewed' },
          { code: 'BMO2011', name: 'BMO Small Cap Fund', marketValue: '$8,450.00', status: 'Not Reviewed' },
          { code: 'BMO2112', name: 'BMO Emerging Markets Fund', marketValue: '$3,330.00', status: 'Not Reviewed' },
          { code: 'BMO2213', name: 'BMO Income Fund', marketValue: '$1,000.00', status: 'Not Reviewed' },
          { code: 'BMO5500', name: 'BMO Canadian Equity Fund', marketValue: '$42,500.00', status: 'Not Reviewed' },
          { code: 'BMO6600', name: 'BMO U.S. Equity Fund', marketValue: '$57,500.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'btg', 
        name: 'Beutel Goodman Managed Funds Inc.', 
        productsReviewed: '0 / 3', 
        value: '$65,733.74',
        products: [
          { code: 'BTG400', name: 'Beutel Goodman Balanced Fund', marketValue: '$20,733.74', status: 'Not Reviewed' },
          { code: 'BTG500', name: 'Beutel Goodman Canadian Equity Fund', marketValue: '$25,000.00', status: 'Not Reviewed' },
          { code: 'BTG600', name: 'Beutel Goodman Income Fund', marketValue: '$20,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'ccm', 
        name: 'IA Clarington Investments Inc.', 
        productsReviewed: '0 / 8', 
        value: '$281,765.30',
        products: [
          { code: 'CCM500', name: 'IA Clarington Strategic Equity Income Fund', marketValue: '$95,450.80', status: 'Not Reviewed' },
          { code: 'CCM601', name: 'IA Clarington Tactical Balanced Fund', marketValue: '$58,230.50', status: 'Not Reviewed' },
          { code: 'CCM702', name: 'IA Clarington Strategic Income Fund', marketValue: '$38,890.40', status: 'Not Reviewed' },
          { code: 'CCM803', name: 'IA Clarington Global Equity Fund', marketValue: '$22,675.30', status: 'Not Reviewed' },
          { code: 'CCM904', name: 'IA Clarington Canadian Bond Fund', marketValue: '$6,518.30', status: 'Not Reviewed' },
          { code: 'CCM1005', name: 'IA Clarington Inhance Monthly Income Fund', marketValue: '$28,500.00', status: 'Not Reviewed' },
          { code: 'CCM1106', name: 'IA Clarington Canadian Small Cap Fund', marketValue: '$18,250.00', status: 'Not Reviewed' },
          { code: 'CCM1207', name: 'IA Clarington Global Dividend Growth Fund', marketValue: '$13,250.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'cig', 
        name: 'CI Global Asset Management', 
        productsReviewed: '0 / 20', 
        value: '$2,467,715.96',
        products: [
          { code: 'CIG1000', name: 'CI Global Value Fund', marketValue: '$285,450.80', status: 'Not Reviewed' },
          { code: 'CIG1001', name: 'CI Canadian Investment Fund', marketValue: '$198,230.50', status: 'Not Reviewed' },
          { code: 'CIG1002', name: 'CI Signature High Income Fund', marketValue: '$185,890.40', status: 'Not Reviewed' },
          { code: 'CIG1003', name: 'CI Global Equity Fund', marketValue: '$168,675.30', status: 'Not Reviewed' },
          { code: 'CIG1004', name: 'CI Canadian Dividend Fund', marketValue: '$155,120.90', status: 'Not Reviewed' },
          { code: 'CIG1005', name: 'CI Balanced Fund', marketValue: '$142,450.60', status: 'Not Reviewed' },
          { code: 'CIG1006', name: 'CI Global Bond Fund', marketValue: '$128,890.75', status: 'Not Reviewed' },
          { code: 'CIG1007', name: 'CI International Value Fund', marketValue: '$115,145.23', status: 'Not Reviewed' },
          { code: 'CIG1008', name: 'CI American Value Fund', marketValue: '$98,675.50', status: 'Not Reviewed' },
          { code: 'CIG1009', name: 'CI Growth Fund', marketValue: '$85,890.00', status: 'Not Reviewed' },
          { code: 'CIG1010', name: 'CI Income Fund', marketValue: '$72,340.50', status: 'Not Reviewed' },
          { code: 'CIG1011', name: 'CI Money Market Fund', marketValue: '$65,250.00', status: 'Not Reviewed' },
          { code: 'CIG1012', name: 'CI Canadian Equity Fund', marketValue: '$58,150.80', status: 'Not Reviewed' },
          { code: 'CIG1013', name: 'CI U.S. Equity Fund', marketValue: '$52,890.45', status: 'Not Reviewed' },
          { code: 'CIG1014', name: 'CI International Equity Fund', marketValue: '$48,675.30', status: 'Not Reviewed' },
          { code: 'CIG1015', name: 'CI Emerging Markets Fund', marketValue: '$42,120.90', status: 'Not Reviewed' },
          { code: 'CIG1016', name: 'CI Real Estate Fund', marketValue: '$38,450.60', status: 'Not Reviewed' },
          { code: 'CIG1017', name: 'CI Small Cap Fund', marketValue: '$32,890.75', status: 'Not Reviewed' },
          { code: 'CIG1018', name: 'CI Global Dividend Fund', marketValue: '$28,145.23', status: 'Not Reviewed' },
          { code: 'CIG1019', name: 'CI Conservative Portfolio', marketValue: '$245,340.65', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'dyn', 
        name: 'Dynamic Funds', 
        productsReviewed: '1 / 15', 
        value: '$692,367.41',
        products: [
          { code: 'DYN2000', name: 'Dynamic Power Balanced Fund', marketValue: '$125,450.80', status: 'Reviewed' },
          { code: 'DYN2001', name: 'Dynamic Dividend Fund', marketValue: '$98,230.50', status: 'Not Reviewed' },
          { code: 'DYN2002', name: 'Dynamic Equity Income Fund', marketValue: '$82,890.40', status: 'Not Reviewed' },
          { code: 'DYN2003', name: 'Dynamic Global Bond Fund', marketValue: '$68,675.30', status: 'Not Reviewed' },
          { code: 'DYN2004', name: 'Dynamic Global Value Fund', marketValue: '$55,120.90', status: 'Not Reviewed' },
          { code: 'DYN2005', name: 'Dynamic Strategic Yield Fund', marketValue: '$48,450.60', status: 'Not Reviewed' },
          { code: 'DYN2006', name: 'Dynamic Canadian Dividend Fund', marketValue: '$42,890.75', status: 'Not Reviewed' },
          { code: 'DYN2007', name: 'Dynamic Real Estate Fund', marketValue: '$38,145.23', status: 'Not Reviewed' },
          { code: 'DYN2008', name: 'Dynamic Emerging Markets Fund', marketValue: '$32,675.50', status: 'Not Reviewed' },
          { code: 'DYN2009', name: 'Dynamic Growth Fund', marketValue: '$28,890.00', status: 'Not Reviewed' },
          { code: 'DYN2010', name: 'Dynamic Premium Yield PLUS Fund', marketValue: '$22,450.50', status: 'Not Reviewed' },
          { code: 'DYN2011', name: 'Dynamic Global Discovery Fund', marketValue: '$18,340.20', status: 'Not Reviewed' },
          { code: 'DYN2012', name: 'Dynamic Canadian Growth Fund', marketValue: '$15,250.30', status: 'Not Reviewed' },
          { code: 'DYN2013', name: 'Dynamic U.S. Growth Fund', marketValue: '$10,890.43', status: 'Not Reviewed' },
          { code: 'DYN2014', name: 'Dynamic Focus+ Canadian Equity Fund', marketValue: '$4,017.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'edg', 
        name: 'EdgePoint Wealth Management', 
        productsReviewed: '0 / 3', 
        value: '$87,365.03',
        products: [
          { code: 'EDG3000', name: 'EdgePoint Global Portfolio', marketValue: '$45,230.78', status: 'Not Reviewed' },
          { code: 'EDG3001', name: 'EdgePoint Canadian Portfolio', marketValue: '$22,134.25', status: 'Not Reviewed' },
          { code: 'EDG3002', name: 'EdgePoint Global Growth & Income Portfolio', marketValue: '$20,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'fid', 
        name: 'Fidelity Investments Canada ULC', 
        productsReviewed: '0 / 18', 
        value: '$929,705.80',
        products: [
          { code: 'FID5000', name: 'Fidelity Canadian Equity Fund', marketValue: '$145,450.80', status: 'Not Reviewed' },
          { code: 'FID5001', name: 'Fidelity Global Equity Fund', marketValue: '$118,230.50', status: 'Not Reviewed' },
          { code: 'FID5002', name: 'Fidelity Canadian Dividend Fund', marketValue: '$95,890.40', status: 'Not Reviewed' },
          { code: 'FID5003', name: 'Fidelity Canadian Balanced Fund', marketValue: '$78,675.30', status: 'Not Reviewed' },
          { code: 'FID5004', name: 'Fidelity Canadian Bond Fund', marketValue: '$65,120.90', status: 'Not Reviewed' },
          { code: 'FID5005', name: 'Fidelity Monthly Income Fund', marketValue: '$52,450.60', status: 'Not Reviewed' },
          { code: 'FID5006', name: 'Fidelity Canadian Growth Company Fund', marketValue: '$45,890.75', status: 'Not Reviewed' },
          { code: 'FID5007', name: 'Fidelity International Equity Fund', marketValue: '$38,145.23', status: 'Not Reviewed' },
          { code: 'FID5008', name: 'Fidelity True North Fund', marketValue: '$32,675.50', status: 'Not Reviewed' },
          { code: 'FID5009', name: 'Fidelity Global Real Estate Fund', marketValue: '$25,890.00', status: 'Not Reviewed' },
          { code: 'FID5010', name: 'Fidelity American Equity Fund', marketValue: '$42,340.50', status: 'Not Reviewed' },
          { code: 'FID5011', name: 'Fidelity Global Technology Fund', marketValue: '$35,250.00', status: 'Not Reviewed' },
          { code: 'FID5012', name: 'Fidelity Emerging Markets Fund', marketValue: '$28,150.80', status: 'Not Reviewed' },
          { code: 'FID5013', name: 'Fidelity Small Cap America Fund', marketValue: '$22,890.45', status: 'Not Reviewed' },
          { code: 'FID5014', name: 'Fidelity Canadian Large Cap Fund', marketValue: '$18,675.30', status: 'Not Reviewed' },
          { code: 'FID5015', name: 'Fidelity Global Consumer Industries Fund', marketValue: '$15,120.90', status: 'Not Reviewed' },
          { code: 'FID5016', name: 'Fidelity Canadian Short Term Bond Fund', marketValue: '$38,450.60', status: 'Not Reviewed' },
          { code: 'FID5017', name: 'Fidelity ClearPath Income Portfolio', marketValue: '$32,507.37', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'goc', 
        name: 'Canoe Financial', 
        productsReviewed: '0 / 4', 
        value: '$198,071.85',
        products: [
          { code: 'GOC6000', name: 'Canoe Income Fund', marketValue: '$128,071.85', status: 'Not Reviewed' },
          { code: 'GOC6001', name: 'Canoe Global Equity Fund', marketValue: '$35,000.00', status: 'Not Reviewed' },
          { code: 'GOC6002', name: 'Canoe Premium Yield Fund', marketValue: '$20,000.00', status: 'Not Reviewed' },
          { code: 'GOC6003', name: 'Canoe EIT Income Fund', marketValue: '$15,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'maw', 
        name: 'Mawer Investment Management Ltd.', 
        productsReviewed: '0 / 6', 
        value: '$128,646.01',
        products: [
          { code: 'MAW7000', name: 'Mawer Balanced Fund', marketValue: '$38,450.50', status: 'Not Reviewed' },
          { code: 'MAW7001', name: 'Mawer Canadian Equity Fund', marketValue: '$32,890.26', status: 'Not Reviewed' },
          { code: 'MAW7002', name: 'Mawer Global Equity Fund', marketValue: '$27,305.25', status: 'Not Reviewed' },
          { code: 'MAW7003', name: 'Mawer New Canada Fund', marketValue: '$15,000.00', status: 'Not Reviewed' },
          { code: 'MAW7004', name: 'Mawer International Equity Fund', marketValue: '$10,000.00', status: 'Not Reviewed' },
          { code: 'MAW7005', name: 'Mawer Canadian Bond Fund', marketValue: '$5,000.00', status: 'Not Reviewed' },
        ]
      },
      { 
        id: 'mfc', 
        name: 'Mackenzie Financial Corporation', 
        productsReviewed: '0 / 22',
        value: '$1,498,921.03',
        products: [
          { code: 'MFC8000', name: 'Mackenzie Ivy Canadian Balanced Fund', marketValue: '$225,450.80', status: 'Not Reviewed' },
          { code: 'MFC8001', name: 'Mackenzie Canadian Equity Fund', marketValue: '$185,230.50', status: 'Not Reviewed' },
          { code: 'MFC8002', name: 'Mackenzie Global Equity Fund', marketValue: '$145,890.40', status: 'Not Reviewed' },
          { code: 'MFC8003', name: 'Mackenzie Canadian Dividend Fund', marketValue: '$118,675.30', status: 'Not Reviewed' },
          { code: 'MFC8004', name: 'Mackenzie Ivy Income Fund', marketValue: '$95,120.90', status: 'Not Reviewed' },
          { code: 'MFC8005', name: 'Mackenzie Canadian Bond Fund', marketValue: '$78,450.60', status: 'Not Reviewed' },
          { code: 'MFC8006', name: 'Mackenzie Balanced Growth Fund', marketValue: '$65,890.75', status: 'Not Reviewed' },
          { code: 'MFC8007', name: 'Mackenzie Ivy International Fund', marketValue: '$52,145.23', status: 'Not Reviewed' },
          { code: 'MFC8008', name: 'Mackenzie U.S. Equity Fund', marketValue: '$42,675.50', status: 'Not Reviewed' },
          { code: 'MFC8009', name: 'Mackenzie Growth Fund', marketValue: '$35,890.00', status: 'Not Reviewed' },
          { code: 'MFC8010', name: 'Mackenzie Ivy Foreign Equity Fund', marketValue: '$28,340.50', status: 'Not Reviewed' },
          { code: 'MFC8011', name: 'Mackenzie Global Income Fund', marketValue: '$22,250.00', status: 'Not Reviewed' },
          { code: 'MFC8012', name: 'Mackenzie Canadian Growth Fund', marketValue: '$48,150.80', status: 'Not Reviewed' },
          { code: 'MFC8013', name: 'Mackenzie Cundill Value Fund', marketValue: '$38,890.45', status: 'Not Reviewed' },
          { code: 'MFC8014', name: 'Mackenzie Ivy European Fund', marketValue: '$32,675.30', status: 'Not Reviewed' },
          { code: 'MFC8015', name: 'Mackenzie Emerging Markets Fund', marketValue: '$28,120.90', status: 'Not Reviewed' },
          { code: 'MFC8016', name: 'Mackenzie Global Dividend Fund', marketValue: '$25,450.60', status: 'Not Reviewed' },
          { code: 'MFC8017', name: 'Mackenzie Canadian All Cap Dividend Fund', marketValue: '$22,890.75', status: 'Not Reviewed' },
          { code: 'MFC8018', name: 'Mackenzie Global Resource Fund', marketValue: '$18,145.23', status: 'Not Reviewed' },
          { code: 'MFC8019', name: 'Mackenzie Canadian Small Cap Fund', marketValue: '$58,675.50', status: 'Not Reviewed' },
          { code: 'MFC8020', name: 'Mackenzie Strategic Income Fund', marketValue: '$42,890.00', status: 'Not Reviewed' },
          { code: 'MFC8021', name: 'Mackenzie Ivy Cash Management Fund', marketValue: '$32,932.37', status: 'Not Reviewed' },
        ]
      },
    ]
  }
];
