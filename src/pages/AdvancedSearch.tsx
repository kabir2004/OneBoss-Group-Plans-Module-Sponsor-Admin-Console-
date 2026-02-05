import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Filter,
  Search,
  X,
  Calendar,
  User,
} from "lucide-react";

const AdvancedSearch = () => {
  const navigate = useNavigate();
  const [activeFilters, setActiveFilters] = useState<string[]>(["Client Status: Active"]);

  // Text input fields state
  const [alias, setAlias] = useState("");
  const [assetValue, setAssetValue] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [employer, setEmployer] = useState("");
  const [fileId, setFileId] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [occupation, setOccupation] = useState("");

  // Dropdown states
  const [clientType, setClientType] = useState("All");
  const [clientStatus, setClientStatus] = useState("Active");
  const [poa, setPoa] = useState("All");
  const [crsEligibility, setCrsEligibility] = useState("All");
  const [maritalStatus, setMaritalStatus] = useState("All");
  const [caslPermission, setCaslPermission] = useState("All");
  const [country, setCountry] = useState("All Countries");
  const [gender, setGender] = useState("All");
  const [title, setTitle] = useState("All");
  const [deliveryStatus, setDeliveryStatus] = useState("All");
  const [returnedMail, setReturnedMail] = useState("All");
  const [lta, setLta] = useState("All");
  const [fatcaEligibility, setFatcaEligibility] = useState("All");
  const [citizenship, setCitizenship] = useState("All");
  const [language, setLanguage] = useState("All");
  const [accreditedInvestor, setAccreditedInvestor] = useState("All");
  const [w8benW9, setW8benW9] = useState("All");
  const [proAccount, setProAccount] = useState("All");
  const [province, setProvince] = useState("All Provinces");
  const [clientDobMonth, setClientDobMonth] = useState("All");
  const [transferFeeAgreement, setTransferFeeAgreement] = useState("All");
  const [rebatePrimary, setRebatePrimary] = useState("All");
  const [rebateSecondary, setRebateSecondary] = useState("All");

  // Date and range inputs
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [age, setAge] = useState("");
  const [dobFrom, setDobFrom] = useState("");
  const [dobTo, setDobTo] = useState("");
  const [createdFrom, setCreatedFrom] = useState("");
  const [createdTo, setCreatedTo] = useState("");

  // Custom fields
  const [customField1, setCustomField1] = useState("");
  const [customField2, setCustomField2] = useState("");
  const [customField3, setCustomField3] = useState("");
  const [pinnedDocuments, setPinnedDocuments] = useState(false);

  const handleRemoveFilter = (filter: string) => {
    setActiveFilters(activeFilters.filter((f) => f !== filter));
    if (filter === "Client Status: Active") {
      setClientStatus("All");
    }
  };

  const handleResetAll = () => {
    setAlias("");
    setAssetValue("");
    setPostalCode("");
    setEmployer("");
    setFileId("");
    setBusinessNumber("");
    setAddress("");
    setCity("");
    setPhone("");
    setEmail("");
    setOccupation("");
    setClientType("All");
    setClientStatus("All");
    setPoa("All");
    setCrsEligibility("All");
    setMaritalStatus("All");
    setCaslPermission("All");
    setCountry("All Countries");
    setGender("All");
    setTitle("All");
    setDeliveryStatus("All");
    setReturnedMail("All");
    setLta("All");
    setFatcaEligibility("All");
    setCitizenship("All");
    setLanguage("All");
    setAccreditedInvestor("All");
    setW8benW9("All");
    setProAccount("All");
    setProvince("All Provinces");
    setClientDobMonth("All");
    setTransferFeeAgreement("All");
    setRebatePrimary("All");
    setRebateSecondary("All");
    setDateOfBirth("");
    setAge("");
    setDobFrom("");
    setDobTo("");
    setCreatedFrom("");
    setCreatedTo("");
    setCustomField1("");
    setCustomField2("");
    setCustomField3("");
    setPinnedDocuments(false);
    setActiveFilters([]);
  };

  return (
    <PageLayout title="">
      <div className="space-y-6">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Text Input Fields Section */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Text Input Fields</h2>
                  </div>
                  <span className="text-xs text-gray-500">Free-form typing</span>
                </div>
                
                {/* Client Identification Group */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Client Identification</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Alias</label>
                      <Input
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="Enter alias"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">File ID #</label>
                      <Input
                        value={fileId}
                        onChange={(e) => setFileId(e.target.value)}
                        placeholder="Enter file ID"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Business Number</label>
                      <Input
                        value={businessNumber}
                        onChange={(e) => setBusinessNumber(e.target.value)}
                        placeholder="Enter business number"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Asset Value</label>
                      <Input
                        value={assetValue}
                        onChange={(e) => setAssetValue(e.target.value)}
                        placeholder="Enter asset value"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information Group */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Contact Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Address</label>
                      <Input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Enter address"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">City</label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Enter city"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Postal Code</label>
                      <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Enter postal code"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Phone</label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter phone number"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Email</label>
                      <Input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email address"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                  </div>
                </div>

                {/* Employment Information Group */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Employment Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Employer</label>
                      <Input
                        value={employer}
                        onChange={(e) => setEmployer(e.target.value)}
                        placeholder="Enter employer"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Occupation</label>
                      <Input
                        value={occupation}
                        onChange={(e) => setOccupation(e.target.value)}
                        placeholder="Enter occupation"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dropdowns / Select Menus Section */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Filter className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Dropdowns / Select Menus</h2>
                  </div>
                  <span className="text-xs text-gray-500">Fixed values</span>
                </div>
                
                {/* Client Information Group */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Client Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Client Type</label>
                      <Select value={clientType} onValueChange={setClientType}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Individual">Individual</SelectItem>
                          <SelectItem value="Corporate">Corporate</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Client Status</label>
                      <Select value={clientStatus} onValueChange={setClientStatus}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                          <SelectItem value="Prospect">Prospect</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Gender</label>
                      <Select value={gender} onValueChange={setGender}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Title</label>
                      <Select value={title} onValueChange={setTitle}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Mr">Mr</SelectItem>
                          <SelectItem value="Mrs">Mrs</SelectItem>
                          <SelectItem value="Ms">Ms</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Marital Status</label>
                      <Select value={maritalStatus} onValueChange={setMaritalStatus}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Single">Single</SelectItem>
                          <SelectItem value="Married">Married</SelectItem>
                          <SelectItem value="Divorced">Divorced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Client DOB Month</label>
                      <Select value={clientDobMonth} onValueChange={setClientDobMonth}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="January">January</SelectItem>
                          <SelectItem value="February">February</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Location & Demographics Group */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Location & Demographics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Country</label>
                      <Select value={country} onValueChange={setCountry}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Countries">All Countries</SelectItem>
                          <SelectItem value="Canada">Canada</SelectItem>
                          <SelectItem value="United States">United States</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Province</label>
                      <Select value={province} onValueChange={setProvince}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All Provinces">All Provinces</SelectItem>
                          <SelectItem value="Ontario">Ontario</SelectItem>
                          <SelectItem value="Quebec">Quebec</SelectItem>
                          <SelectItem value="British Columbia">British Columbia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Citizenship</label>
                      <Select value={citizenship} onValueChange={setCitizenship}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Canadian">Canadian</SelectItem>
                          <SelectItem value="US">US</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Language</label>
                      <Select value={language} onValueChange={setLanguage}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="English">English</SelectItem>
                          <SelectItem value="French">French</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Compliance & Eligibility Group */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Compliance & Eligibility</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">CRS Eligibility</label>
                      <Select value={crsEligibility} onValueChange={setCrsEligibility}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Eligible">Eligible</SelectItem>
                          <SelectItem value="Not Eligible">Not Eligible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">FATCA Eligibility</label>
                      <Select value={fatcaEligibility} onValueChange={setFatcaEligibility}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Eligible">Eligible</SelectItem>
                          <SelectItem value="Not Eligible">Not Eligible</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">W-8BEN/W9</label>
                      <Select value={w8benW9} onValueChange={setW8benW9}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="W-8BEN">W-8BEN</SelectItem>
                          <SelectItem value="W9">W9</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Accredited Investor</label>
                      <Select value={accreditedInvestor} onValueChange={setAccreditedInvestor}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Account & Services Group */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Account & Services</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">POA</label>
                      <Select value={poa} onValueChange={setPoa}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Pro Account</label>
                      <Select value={proAccount} onValueChange={setProAccount}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">LTA</label>
                      <Select value={lta} onValueChange={setLta}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Transfer Fee Agreement</label>
                      <Select value={transferFeeAgreement} onValueChange={setTransferFeeAgreement}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Rebate - Primary</label>
                      <Select value={rebatePrimary} onValueChange={setRebatePrimary}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Rebate - Secondary</label>
                      <Select value={rebateSecondary} onValueChange={setRebateSecondary}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Communication & Delivery Group */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Communication & Delivery</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">CASL Permission</label>
                      <Select value={caslPermission} onValueChange={setCaslPermission}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Delivery Status</label>
                      <Select value={deliveryStatus} onValueChange={setDeliveryStatus}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Active">Active</SelectItem>
                          <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Returned Mail</label>
                      <Select value={returnedMail} onValueChange={setReturnedMail}>
                        <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="All">All</SelectItem>
                          <SelectItem value="Yes">Yes</SelectItem>
                          <SelectItem value="No">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Date Pickers / Range Inputs Section */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Date Pickers / Range Inputs</h2>
                  </div>
                  <span className="text-xs text-gray-500">Time-based searches</span>
                </div>
                
                {/* Date of Birth Group */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Date of Birth</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Date of Birth</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={dateOfBirth}
                          onChange={(e) => setDateOfBirth(e.target.value)}
                          placeholder="yyyy-mm-dd"
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg h-9"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Age</label>
                      <Input
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="Enter age"
                        className="bg-gray-50 border-gray-200 rounded-lg h-9"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Date of Birth Range - From</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={dobFrom}
                          onChange={(e) => setDobFrom(e.target.value)}
                          placeholder="yyyy-mm-dd"
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg h-9"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Date of Birth Range - To</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={dobTo}
                          onChange={(e) => setDobTo(e.target.value)}
                          placeholder="yyyy-mm-dd"
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Account Creation Date Group */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-3 pb-2 border-b border-gray-200">Account Creation Date</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Client Created Date Range - From</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={createdFrom}
                          onChange={(e) => setCreatedFrom(e.target.value)}
                          placeholder="yyyy-mm-dd"
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg h-9"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-gray-700 mb-1 block">Client Created Date Range - To</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={createdTo}
                          onChange={(e) => setCreatedTo(e.target.value)}
                          placeholder="yyyy-mm-dd"
                          className="pl-10 bg-gray-50 border-gray-200 rounded-lg h-9"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Custom / Multi-Select Fields Section */}
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Custom / Multi-Select Fields</h2>
                  </div>
                  <span className="text-xs text-gray-500">User-defined criteria</span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-700 mb-1 block">Representative Defined Field 1</label>
                    <Input
                      value={customField1}
                      onChange={(e) => setCustomField1(e.target.value)}
                      placeholder="Enter custom field 1"
                      className="bg-gray-50 border-gray-200 rounded-lg h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-700 mb-1 block">Representative Defined Field 2</label>
                    <Input
                      value={customField2}
                      onChange={(e) => setCustomField2(e.target.value)}
                      placeholder="Enter custom field 2"
                      className="bg-gray-50 border-gray-200 rounded-lg h-9"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-700 mb-1 block">Representative Defined Field 3</label>
                    <Input
                      value={customField3}
                      onChange={(e) => setCustomField3(e.target.value)}
                      placeholder="Enter custom field 3"
                      className="bg-gray-50 border-gray-200 rounded-lg h-9"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Checkbox
                      id="pinned-documents"
                      checked={pinnedDocuments}
                      onCheckedChange={(checked) => setPinnedDocuments(checked === true)}
                    />
                    <label htmlFor="pinned-documents" className="text-xs text-gray-700 cursor-pointer">
                      Search By Pinned Documents
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Search Actions */}
          <div className="lg:col-span-1">
            <Card className="border border-gray-200 shadow-sm sticky top-6">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Search className="h-5 w-5 text-gray-600" />
                  <h2 className="text-lg font-bold text-gray-900">Search Actions</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-700 mb-1 block">Status Filters</label>
                    <Select defaultValue="1">
                      <SelectTrigger className="bg-gray-50 border-gray-200 rounded-lg">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="0">0</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    <Search className="h-4 w-4 mr-2" />
                    Search Clients
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                    onClick={handleResetAll}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset All Filters
                  </Button>

                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-2">Active Filters:</p>
                    <div className="flex flex-wrap gap-2">
                      {activeFilters.map((filter, index) => (
                        <Badge
                          key={index}
                          className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-normal px-2 py-1 text-xs flex items-center gap-1"
                        >
                          {filter}
                          <button
                            onClick={() => handleRemoveFilter(filter)}
                            className="ml-1 hover:bg-blue-200 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default AdvancedSearch;

