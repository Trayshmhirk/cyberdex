export interface StaffProfile {
  id: string;
  fullName: string;
  position: string;
  status: string;
  bio: string;
  coreAreas: string[];
  avatarUrl: string;
  canonicalUrl: string;
  email?: string;
  certifications?: string[];
}

export const STAFF_DIRECTORY: StaffProfile[] = [
  {
    id: "CDX-26-001-CEO",
    fullName: "Folajimi Igbekoyi",
    position: "Founder & Chief Executive Officer (CEO)",
    status: "Active — Verified Cyberdex Staff",
    avatarUrl: "/ceo-image.jpeg",
    canonicalUrl: "https://verify.cyberdex.com.ng/verify/CDX-26-001-CEO",
    bio: "Folajimi Igbekoyi is the Founder and Chief Executive Officer of Cyberdex and a cybersecurity professional with experience across security operations, governance, risk and compliance, vulnerability management, incident response, network security, and data protection. His professional background combines cybersecurity, compliance, administration, entrepreneurship, and technology leadership.\n\nHe holds industry certifications including Certified Ethical Hacker (CEH), CompTIA Security+, and CompTIA Network+, with practical interests in ethical hacking, threat detection, security engineering, regulatory compliance, and the development of secure digital solutions.\n\nAt Cyberdex, he provides strategic and technical leadership with a focus on building secure, innovative technology solutions and strengthening organizational cybersecurity and data protection.",
    certifications: [
      "Certified Ethical Hacker (CEH)",
      "CompTIA Security+",
      "CompTIA Network+",
    ],
    coreAreas: [
      "Cybersecurity",
      "Ethical Hacking",
      "Security Operations",
      "GRC",
      "Vulnerability Management",
      "Incident Response",
      "Network Security",
      "Data Protection",
      "Security Engineering",
      "Technology Leadership",
    ],
  },
  {
    id: "CDX-26-003-DA",
    fullName: "Abiola Akindolie",
    position: "Data Analyst & Business Intelligence Associate",
    status: "Active — Verified Cyberdex Staff",
    avatarUrl: "/abiola-image.jpeg",
    canonicalUrl: "https://verify.cyberdex.com.ng/verify/CDX-26-003-DA",
    email: "abiola@cyberdex.com.ng",
    bio: "Abiola Akindolie is a Data Analyst and Business Intelligence Associate at Cyberdex with a strong interest in data-driven problem solving, analytical thinking, and technology-enabled business decision-making. He contributes to Cyberdex by transforming information into meaningful insights, supporting research and analysis, and applying innovative thinking to organizational and technology-focused projects.",
    coreAreas: [
      "Data Analysis",
      "Business Intelligence",
      "Research",
      "Data Interpretation",
      "Analytical Problem-Solving",
      "Digital Innovation",
    ],
  },
];

export function getStaffById(id: string): StaffProfile | undefined {
  if (!id) return undefined;
  const cleanId = id.trim().toUpperCase();
  return STAFF_DIRECTORY.find((s) => s.id.toUpperCase() === cleanId);
}

export function getAllStaff(): StaffProfile[] {
  return STAFF_DIRECTORY;
}
