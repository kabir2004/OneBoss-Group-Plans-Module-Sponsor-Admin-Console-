import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Search, 
  CheckCircle2, 
  Clock, 
  Minus,
  List,
  Grid3x3,
  CheckCircle,
} from "lucide-react";

type ClientStatus = "Active" | "Inactive" | "Prospect";

type Client = {
  id: string;
  name: string;
  accountNumber: string;
  email: string;
  city: string;
  province: string;
  portfolio: string;
  status: ClientStatus;
  statusIndicator?: "active" | "inactive";
};

// Sample client data matching the image
export const CLIENTS: Client[] = [
  {
    id: "CL001",
    name: "John Smith",
    accountNumber: "CL001",
    email: "john.smith@email.com",
    city: "New York",
    province: "NY",
    portfolio: "$125K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL002",
    name: "Sarah Johnson",
    accountNumber: "CL002",
    email: "sarah.j@company.com",
    city: "Los Angeles",
    province: "CA",
    portfolio: "$89K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL005",
    name: "Robert Wilson",
    accountNumber: "CL005",
    email: "r.wilson@capital.com",
    city: "Boston",
    province: "MA",
    portfolio: "$67K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL006",
    name: "Elton Andrews",
    accountNumber: "CL006",
    email: "elton.andrews@email.com",
    city: "Toronto",
    province: "ON",
    portfolio: "$45K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL007",
    name: "Francoise Andrews",
    accountNumber: "CL007",
    email: "francoise.andrews@email.com",
    city: "Vancouver",
    province: "BC",
    portfolio: "$22K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL008",
    name: "Amy Armstrong",
    accountNumber: "CL008",
    email: "amy.armstrong@email.com",
    city: "Montreal",
    province: "QC",
    portfolio: "$38K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL009",
    name: "David Thompson",
    accountNumber: "CL009",
    email: "david.thompson@finance.com",
    city: "Seattle",
    province: "WA",
    portfolio: "$180K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL011",
    name: "James Brown",
    accountNumber: "CL011",
    email: "james.brown@capital.com",
    city: "Denver",
    province: "CO",
    portfolio: "$320K",
    status: "Inactive",
    statusIndicator: "inactive",
  },
  {
    id: "CL012",
    name: "William Anderson",
    accountNumber: "CL012",
    email: "will.anderson@finance.com",
    city: "Atlanta",
    province: "GA",
    portfolio: "$150K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL013",
    name: "Maria Garcia",
    accountNumber: "CL013",
    email: "maria.garcia@email.com",
    city: "Miami",
    province: "FL",
    portfolio: "$95K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL014",
    name: "Michael Chen",
    accountNumber: "CL014",
    email: "michael.chen@tech.com",
    city: "San Francisco",
    province: "CA",
    portfolio: "$245K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL015",
    name: "Emily Davis",
    accountNumber: "CL015",
    email: "emily.davis@email.com",
    city: "Chicago",
    province: "IL",
    portfolio: "$78K",
    status: "Prospect",
    statusIndicator: "active",
  },
  {
    id: "CL016",
    name: "Christopher Martinez",
    accountNumber: "CL016",
    email: "chris.martinez@finance.com",
    city: "Phoenix",
    province: "AZ",
    portfolio: "$165K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL017",
    name: "Jessica Taylor",
    accountNumber: "CL017",
    email: "jessica.taylor@email.com",
    city: "Calgary",
    province: "AB",
    portfolio: "$52K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL018",
    name: "Daniel Rodriguez",
    accountNumber: "CL018",
    email: "daniel.rodriguez@capital.com",
    city: "Houston",
    province: "TX",
    portfolio: "$210K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL019",
    name: "Olivia White",
    accountNumber: "CL019",
    email: "olivia.white@email.com",
    city: "Portland",
    province: "OR",
    portfolio: "$88K",
    status: "Inactive",
    statusIndicator: "inactive",
  },
  {
    id: "CL020",
    name: "Matthew Harris",
    accountNumber: "CL020",
    email: "matthew.harris@finance.com",
    city: "Ottawa",
    province: "ON",
    portfolio: "$135K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL021",
    name: "Sophia Lee",
    accountNumber: "CL021",
    email: "sophia.lee@email.com",
    city: "San Diego",
    province: "CA",
    portfolio: "$195K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL022",
    name: "Andrew Clark",
    accountNumber: "CL022",
    email: "andrew.clark@capital.com",
    city: "Edmonton",
    province: "AB",
    portfolio: "$42K",
    status: "Prospect",
    statusIndicator: "active",
  },
  {
    id: "CL023",
    name: "Isabella Lewis",
    accountNumber: "CL023",
    email: "isabella.lewis@email.com",
    city: "Austin",
    province: "TX",
    portfolio: "$175K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL024",
    name: "Ryan Walker",
    accountNumber: "CL024",
    email: "ryan.walker@finance.com",
    city: "Minneapolis",
    province: "MN",
    portfolio: "$110K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL025",
    name: "Ava Hall",
    accountNumber: "CL025",
    email: "ava.hall@email.com",
    city: "Winnipeg",
    province: "MB",
    portfolio: "$68K",
    status: "Inactive",
    statusIndicator: "inactive",
  },
  {
    id: "CL026",
    name: "Nathan Young",
    accountNumber: "CL026",
    email: "nathan.young@capital.com",
    city: "Detroit",
    province: "MI",
    portfolio: "$155K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL027",
    name: "Mia King",
    accountNumber: "CL027",
    email: "mia.king@email.com",
    city: "Halifax",
    province: "NS",
    portfolio: "$92K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL028",
    name: "Benjamin Wright",
    accountNumber: "CL028",
    email: "benjamin.wright@finance.com",
    city: "Philadelphia",
    province: "PA",
    portfolio: "$225K",
    status: "Active",
    statusIndicator: "active",
  },
  {
    id: "CL029",
    name: "Charlotte Scott",
    accountNumber: "CL029",
    email: "charlotte.scott@email.com",
    city: "Quebec City",
    province: "QC",
    portfolio: "$58K",
    status: "Prospect",
    statusIndicator: "active",
  },
  {
    id: "CL030",
    name: "Lucas Green",
    accountNumber: "CL030",
    email: "lucas.green@capital.com",
    city: "Las Vegas",
    province: "NV",
    portfolio: "$185K",
    status: "Active",
    statusIndicator: "active",
  },
];

const Clients = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Active");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [selectedClients, setSelectedClients] = useState<Set<string>>(new Set());

  // Filter clients based on status
  const filteredClients = useMemo(() => {
    let filtered = CLIENTS;

    // Apply status filter
    if (activeFilter === "Active") {
      filtered = filtered.filter(c => c.status === "Active");
    } else if (activeFilter === "Inactive") {
      filtered = filtered.filter(c => c.status === "Inactive");
    } else if (activeFilter === "Prospects") {
      filtered = filtered.filter(c => c.status === "Prospect");
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        client =>
          client.name.toLowerCase().includes(term) ||
          client.email.toLowerCase().includes(term) ||
          client.id.toLowerCase().includes(term) ||
          `${client.city}, ${client.province}`.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [searchTerm, activeFilter]);

  // Count clients by status
  const activeCount = CLIENTS.filter(c => c.status === "Active").length;
  const inactiveCount = CLIENTS.filter(c => c.status === "Inactive").length;
  const prospectsCount = CLIENTS.filter(c => c.status === "Prospect").length;

  const toggleClientSelection = (clientId: string) => {
    const newSelected = new Set(selectedClients);
    if (newSelected.has(clientId)) {
      newSelected.delete(clientId);
      } else {
      newSelected.add(clientId);
    }
    setSelectedClients(newSelected);
  };

  return (
      <PageLayout title="">
        <div className="space-y-6">
        {/* Message */}
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Please select a client from the clients list on the sidebar</p>
        </div>
        </div>
    </PageLayout>
  );
};

export default Clients;
