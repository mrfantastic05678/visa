/**
 * Sample data for the admin dashboard — UI-first phase, no database required.
 * Mirrors the design screenshots. Replaced by live Neon queries once connected.
 */

export type AdminAppStatus =
  | "submitted"
  | "reviewing"
  | "processing"
  | "approved"
  | "rejected";

export type InquiryStatus = "new" | "replied" | "closed";
export type DocStatus = "verified" | "pending" | "rejected";

export interface Consultant {
  name: string;
  initials: string;
  color: string; // tailwind bg utility
  photo?: string;
}

export const CURRENT_USER = {
  name: "Aisha Bahar",
  role: "Senior Consultant",
  initials: "AB",
  email: "aisha@visati.ae",
};

export const CONSULTANTS: Record<string, Consultant> = {
  layla: { name: "Layla", initials: "L", color: "bg-blue", photo: "https://i.pravatar.cc/150?img=47" },
  omar: { name: "Omar", initials: "O", color: "bg-purple-500", photo: "https://i.pravatar.cc/150?img=53" },
  aisha: { name: "Aisha", initials: "A", color: "bg-emerald-500", photo: "https://i.pravatar.cc/150?img=44" },
  hana: { name: "Hana", initials: "H", color: "bg-amber-500", photo: "https://i.pravatar.cc/150?img=45" },
};

export interface AdminDocument {
  id: string;
  filename: string;
  type: "passport" | "photo" | "supporting";
  label: string;
  applicant: string;
  status: DocStatus;
  size: string;
}

export interface AdminApplication {
  id: string;
  applicant: string;
  country: string; // ISO 3166-1 alpha-2 for flag
  nationality: string;
  visaType: string;
  visaShort: string;
  submitted: string;
  submittedTime: string;
  date: string; // relative label for dashboard
  status: AdminAppStatus;
  assigned: keyof typeof CONSULTANTS;
  email: string;
  phone: string;
  passportNo: string;
  dob: string;
  passportExpiry: string;
  travelDate: string;
  entry: "Single" | "Multiple";
  documents: AdminDocument[];
  notes: { author: string; initials: string; time: string; text: string }[];
}

export const STATUS_LABEL: Record<AdminAppStatus, string> = {
  submitted: "Submitted",
  reviewing: "Reviewing",
  processing: "Processing",
  approved: "Approved",
  rejected: "Rejected",
};

export const APPLICATIONS: AdminApplication[] = [
  {
    id: "VIS-2026-4F8A2K",
    applicant: "James Whitfield",
    country: "GB",
    nationality: "British",
    visaType: "Tourist · 60 days",
    visaShort: "Tourist · 60d",
    submitted: "21 Feb · 2026",
    submittedTime: "21 Feb · 14:22",
    date: "Today · 14:22",
    status: "processing",
    assigned: "layla",
    email: "james.w@gmail.com",
    phone: "+44 7700 900123",
    passportNo: "GB123456789",
    dob: "14 June 1989",
    passportExpiry: "02 Nov 2031",
    travelDate: "12 March 2026",
    entry: "Single",
    documents: [
      { id: "d1", filename: "passport_jwhitfield.pdf", type: "passport", label: "Passport Scan", applicant: "James Whitfield", status: "verified", size: "2.4 MB" },
      { id: "d2", filename: "photo_jwhitfield.jpg", type: "photo", label: "Passport Photo", applicant: "James Whitfield", status: "verified", size: "850 KB" },
      { id: "d3", filename: "flight_booking.pdf", type: "supporting", label: "Flight Booking", applicant: "James Whitfield", status: "pending", size: "1.1 MB" },
    ],
    notes: [
      { author: "Aisha", initials: "A", time: "23 Feb · 10:14", text: "Photo background slightly grey — within tolerance. Approving for submission." },
      { author: "Omar", initials: "O", time: "22 Feb · 16:30", text: "Cross-checked with GDRFA portal. No prior flags." },
    ],
  },
  {
    id: "VIS-2026-9C3R7P",
    applicant: "Priya Sharma",
    country: "IN",
    nationality: "Indian",
    visaType: "Multi-Entry · 90 days",
    visaShort: "Multi · 90d",
    submitted: "21 Feb · 2026",
    submittedTime: "21 Feb · 11:08",
    date: "Today · 11:08",
    status: "reviewing",
    assigned: "omar",
    email: "priya.s@gmail.com",
    phone: "+91 98200 11223",
    passportNo: "IN874512369",
    dob: "02 Jan 1992",
    passportExpiry: "18 Aug 2030",
    travelDate: "05 April 2026",
    entry: "Multiple",
    documents: [
      { id: "d4", filename: "passport_psharma.pdf", type: "passport", label: "Passport Scan", applicant: "Priya Sharma", status: "verified", size: "2.1 MB" },
      { id: "d5", filename: "photo_psharma.jpg", type: "photo", label: "Passport Photo", applicant: "Priya Sharma", status: "verified", size: "650 KB" },
    ],
    notes: [
      { author: "Omar", initials: "O", time: "21 Feb · 12:00", text: "Awaiting hotel booking confirmation." },
    ],
  },
  {
    id: "VIS-2026-7B2T5L",
    applicant: "Sophie Laurent",
    country: "FR",
    nationality: "French",
    visaType: "Tourist · 30 days",
    visaShort: "Tourist · 30d",
    submitted: "20 Feb · 2026",
    submittedTime: "20 Feb · 09:40",
    date: "Yesterday",
    status: "approved",
    assigned: "aisha",
    email: "sophie.l@gmail.com",
    phone: "+33 6 12 34 56 78",
    passportNo: "FR55120093",
    dob: "27 May 1995",
    passportExpiry: "11 Mar 2032",
    travelDate: "20 March 2026",
    entry: "Single",
    documents: [
      { id: "d6", filename: "passport_slaurent.pdf", type: "passport", label: "Passport Scan", applicant: "Sophie Laurent", status: "verified", size: "2.1 MB" },
    ],
    notes: [],
  },
  {
    id: "VIS-2026-2N8K1J",
    applicant: "Marcus Hahn",
    country: "DE",
    nationality: "German",
    visaType: "Business · 14 days",
    visaShort: "Business · 14d",
    submitted: "20 Feb · 2026",
    submittedTime: "20 Feb · 16:05",
    date: "Yesterday",
    status: "processing",
    assigned: "omar",
    email: "m.hahn@gmail.com",
    phone: "+49 151 23456789",
    passportNo: "DE9981234C",
    dob: "08 Oct 1984",
    passportExpiry: "30 Jun 2029",
    travelDate: "28 February 2026",
    entry: "Single",
    documents: [
      { id: "d7", filename: "flightbook_mhahn.pdf", type: "supporting", label: "Flight Booking", applicant: "Marcus Hahn", status: "pending", size: "1.1 MB" },
    ],
    notes: [],
  },
  {
    id: "VIS-2026-6D4Q9V",
    applicant: "Hiroshi Tanaka",
    country: "JP",
    nationality: "Japanese",
    visaType: "Transit · 96 hours",
    visaShort: "Transit · 96h",
    submitted: "19 Feb · 2026",
    submittedTime: "19 Feb · 08:12",
    date: "2 days ago",
    status: "approved",
    assigned: "aisha",
    email: "h.tanaka@gmail.com",
    phone: "+81 90 1234 5678",
    passportNo: "JPTR889201",
    dob: "15 Dec 1990",
    passportExpiry: "21 Jan 2031",
    travelDate: "03 March 2026",
    entry: "Single",
    documents: [],
    notes: [],
  },
  {
    id: "VIS-2026-1A5W3X",
    applicant: "Chen Wei",
    country: "CN",
    nationality: "Chinese",
    visaType: "Tourist · 60 days",
    visaShort: "Tourist · 60d",
    submitted: "19 Feb · 2026",
    submittedTime: "19 Feb · 13:50",
    date: "2 days ago",
    status: "rejected",
    assigned: "layla",
    email: "chen.wei@gmail.com",
    phone: "+86 138 0000 1111",
    passportNo: "CN66120934",
    dob: "19 Jul 1988",
    passportExpiry: "09 May 2027",
    travelDate: "15 March 2026",
    entry: "Single",
    documents: [
      { id: "d8", filename: "supporting_cwei.pdf", type: "supporting", label: "Bank Statement", applicant: "Chen Wei", status: "rejected", size: "900 KB" },
    ],
    notes: [],
  },
  {
    id: "VIS-2026-8K2P4M",
    applicant: "Sarah Mitchell",
    country: "GB",
    nationality: "British",
    visaType: "Tourist · 30 days",
    visaShort: "Tourist · 30d",
    submitted: "18 Feb · 2026",
    submittedTime: "18 Feb · 10:30",
    date: "3 days ago",
    status: "approved",
    assigned: "omar",
    email: "sarah.m@gmail.com",
    phone: "+44 7700 900456",
    passportNo: "GB445566778",
    dob: "03 Apr 1993",
    passportExpiry: "14 Sep 2030",
    travelDate: "01 April 2026",
    entry: "Single",
    documents: [],
    notes: [],
  },
  {
    id: "VIS-2026-3R7T9Q",
    applicant: "David Chen",
    country: "CN",
    nationality: "Chinese",
    visaType: "Multi-Entry · 90 days",
    visaShort: "Multi · 90d",
    submitted: "18 Feb · 2026",
    submittedTime: "18 Feb · 15:20",
    date: "3 days ago",
    status: "processing",
    assigned: "aisha",
    email: "david.c@gmail.com",
    phone: "+86 139 2222 3333",
    passportNo: "CN77451230",
    dob: "22 Nov 1986",
    passportExpiry: "05 Feb 2032",
    travelDate: "10 April 2026",
    entry: "Multiple",
    documents: [],
    notes: [],
  },
];

export const DASHBOARD_STATS = [
  { label: "Total Applications", value: "4,283", delta: "+12.4%", deltaType: "up" as const },
  { label: "Pending Review", value: "142", delta: "+8", deltaType: "neutral" as const },
  { label: "Approved (30d)", value: "892", delta: "98.6% rate", deltaType: "up" as const },
  { label: "Rejected (30d)", value: "13", delta: "1.4% rate", deltaType: "neutral" as const },
];

export const QUICK_ACTIONS = [
  "Bulk approve queue",
  "Export weekly report",
  "Send batch updates",
  "Invite team member",
];

export const RECENT_ACTIVITY = [
  { dot: "bg-emerald-500", text: "Aisha approved Sophie Laurent", time: "4m ago" },
  { dot: "bg-blue", text: "In Progress · Marcus Hahn", time: "10m ago" },
  { dot: "bg-amber-500", text: "Omar requested docs · Priya Sharma", time: "24m ago" },
  { dot: "bg-emerald-500", text: "Aisha approved Hiroshi Tanaka", time: "1h ago" },
];

export interface AdminInquiry {
  id: string;
  initials: string;
  country: string;
  name: string;
  email: string;
  subject: string;
  time: string;
  status: InquiryStatus;
  messages: { from: "client" | "agent"; time: string; text: string }[];
  suggestedVisa?: { name: string; price: string };
}

export const INQUIRY_STATUS_LABEL: Record<InquiryStatus, string> = {
  new: "New",
  replied: "Replied",
  closed: "Closed",
};

export const INQUIRIES: AdminInquiry[] = [
  {
    id: "1094",
    initials: "MS",
    country: "DE",
    name: "Maria Santos",
    email: "maria.s@email.com",
    subject: "Visa for journalism work",
    time: "Today · 11:34",
    status: "new",
    messages: [
      { from: "client", time: "11:34 AM", text: "Hi, I'm a journalist planning to visit Dubai for a media conference in March. I need a business visa for a 10-day stay. Can you advise on requirements?" },
    ],
    suggestedVisa: { name: "Business Visa · 14 days", price: "AED 749 · 24h express processing" },
  },
  {
    id: "1093",
    initials: "AA",
    country: "AE",
    name: "Ahmed Al-Mansoori",
    email: "ahmed.m@email.com",
    subject: "Multi-entry for business",
    time: "Today · 09:18",
    status: "replied",
    messages: [
      { from: "client", time: "09:18 AM", text: "I travel to Dubai monthly. What's the best multi-entry option?" },
      { from: "agent", time: "09:40 AM", text: "A 90-day multi-entry visa would suit you best. I'll send a quote." },
    ],
  },
  {
    id: "1092",
    initials: "JP",
    country: "GB",
    name: "Jennifer Park",
    email: "jen.p@email.com",
    subject: "Family visa for parents",
    time: "Yesterday",
    status: "replied",
    messages: [
      { from: "client", time: "Yesterday", text: "Looking to bring my parents over for a 2-month visit." },
      { from: "agent", time: "Yesterday", text: "We can arrange 60-day tourist visas for both. Documents needed: passports + photos." },
    ],
  },
  {
    id: "1091",
    initials: "LB",
    country: "IT",
    name: "Lucas Bernardi",
    email: "lucas.b@email.com",
    subject: "Refund question",
    time: "Yesterday",
    status: "new",
    messages: [
      { from: "client", time: "Yesterday", text: "My travel plans changed. Am I eligible for a refund?" },
    ],
  },
  {
    id: "1090",
    initials: "RG",
    country: "FR",
    name: "Rachel Goldman",
    email: "rachel.g@email.com",
    subject: "Visa extension help",
    time: "2 days ago",
    status: "closed",
    messages: [
      { from: "client", time: "2 days ago", text: "Can I extend my current tourist visa?" },
      { from: "agent", time: "2 days ago", text: "Yes — we processed your extension. All set!" },
    ],
  },
  {
    id: "1089",
    initials: "HT",
    country: "JP",
    name: "Hiroshi Tanaka",
    email: "h.tanaka@email.com",
    subject: "Transit visa question",
    time: "2 days ago",
    status: "replied",
    messages: [
      { from: "client", time: "2 days ago", text: "Do I need a visa for a 12-hour layover?" },
    ],
  },
];

export const ALL_DOCUMENTS: AdminDocument[] = [
  ...APPLICATIONS.flatMap((a) => a.documents),
  { id: "x1", filename: "sponsor_akhan.pdf", type: "supporting", label: "Sponsor Letter", applicant: "Aaliyah Khan", status: "pending", size: "1.2 MB" },
];

export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  verified: "Verified",
  pending: "Pending",
  rejected: "Rejected",
};
