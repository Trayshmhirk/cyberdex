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
  phone?: string;
  certifications?: string[];
}

export const STAFF_DIRECTORY: StaffProfile[] = [
  {
    id: "CDX-26-001-CEO",
    fullName: "Folajimi Akinwande Igbekoyi",
    position: "Founder & Chief Executive Officer (CEO)",
    status: "Active — Verified Cyberdex Staff",
    avatarUrl: "/ceo-image.jpeg",
    canonicalUrl: "https://verify.cyberdex.com.ng/verify/CDX-26-001-CEO",
    email: "Folajimiigbekoyi_ceo@cyberdex.com.ng",
    phone: "+234 803 216 4197",
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
    id: "CDX-26-002-SEC",
    fullName: "Mr. Nojeem Abiodun Daramola",
    position: "Company Secretary & Technical Operations Associate",
    status: "Active — Verified Cyberdex Staff",
    avatarUrl: "/nojeem-image.jpeg",
    canonicalUrl: "https://verify.cyberdex.com.ng/verify/CDX-26-002-SEC",
    email: "Nojeem_secretary@cyberdex.com.ng",
    phone: "+234 816 690 0154",
    bio: "Nojeem Abiodun Daramola is a multidisciplinary professional with a background in automobile engineering and a developing career in technology, corporate administration, and technical operations. His engineering foundation has equipped him with a structured approach to problem-solving, analytical thinking, attention to detail, and an appreciation for systems, processes, and operational efficiency.\n\nAt Cyberdex, Nojeem serves as Company Secretary & Technical Operations Associate, supporting corporate administration, organisational documentation, internal coordination, record management, and the effective implementation of operational processes across the company.\n\nHis role also positions him at the intersection of corporate governance and technology operations, where he contributes to maintaining structured internal processes while continuing to expand his knowledge and capabilities within the technology sector.\n\nNojeem brings a professional mindset centred on integrity, confidentiality, accountability, organisation, collaboration, and continuous improvement. His transition from engineering into technology reflects his adaptability and commitment to developing multidisciplinary expertise relevant to the evolving digital business environment.\n\nAs a member of the Cyberdex pioneer team, he is committed to contributing to the development of a structured, innovative, secure, and forward-looking technology organisation while continuously advancing his professional and technical capabilities.",
    coreAreas: [
      "Corporate Administration",
      "Technical Operations",
      "Systems & Processes",
      "Corporate Governance",
      "Record Management",
      "Internal Coordination",
    ],
  },
  {
    id: "CDX-26-003-DA",
    fullName: "Abiola Enitan Akindolie",
    position: "Data Analyst & Business Intelligence Associate",
    status: "Active — Verified Cyberdex Staff",
    avatarUrl: "/abiola-image.jpeg",
    canonicalUrl: "https://verify.cyberdex.com.ng/verify/CDX-26-003-DA",
    email: "ABIOLA_DAIA@gmail.com",
    phone: "+234 816 696 3848",
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
  {
    id: "CDX-26-006-TO",
    fullName: "Dukuye Yoyovwi IfeOluwa",
    position: "Technology Operations & Team Development Associate",
    status: "Active — Verified Cyberdex Staff",
    avatarUrl: "/yoyovwi-image.jpeg",
    canonicalUrl: "https://verify.cyberdex.com.ng/verify/CDX-26-006-TO",
    email: "yoyovwi@cyberdex.com.ng",
    phone: "+234 701 972 2877",
    bio: "Dukuye Yoyovwi IfeOluwa is an emerging technology professional with a background in competitive sports and a growing focus on technology operations, digital innovation, and professional development. His experience as a basketball player has helped cultivate strong qualities in discipline, teamwork, strategic thinking, resilience, adaptability, leadership, and performance under pressure.\n\nAs he transitions into the technology industry, Dukuye is committed to continuous learning and the development of practical technical and operational skills. He brings a collaborative mindset and a strong work ethic, with particular interest in supporting effective team operations, technology-driven processes, and innovative solutions.\n\nAt Cyberdex, he serves as a Technology Operations & Team Development Associate where his role provides an opportunity to combine the performance-oriented mindset developed through sports with his growing knowledge of technology and organisational operations.\n\nHe is focused on building a sustainable professional career in the technology sector while contributing positively to Cyberdex’s culture of innovation, collaboration, continuous development, and excellence.",
    coreAreas: [
      "Technology Operations",
      "Team Development",
      "Digital Innovation",
      "Process Optimization",
      "Operational Strategy",
      "Leadership",
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
