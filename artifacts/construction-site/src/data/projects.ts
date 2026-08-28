export type ProjectStatus = "Completed" | "Ongoing" | "In Progress" | "Planned";

export interface ProjectData {
  id: string;
  title: string;
  category: string;
  shortDescription: string;
  description: string;
  city: string;
  state: string;
  location: string;
  status: ProjectStatus;
  projectValue: string;
  areaCovered: string;
  completionYear: number | null;
  progress: number;
  featured: boolean;
  imageUrl: string;
  tags: string[];
  keyFeatures: string[];
  clientName: string;
}

export const ALL_PROJECTS: ProjectData[] = [
  {
    id: "skyline-heights",
    title: "Skyline Heights",
    category: "Residential Tower",
    shortDescription:
      "A 42-storey luxury residential tower redefining the Pune skyline with panoramic views and world-class amenities.",
    description:
      "Skyline Heights stands as a testament to modern luxury living in Pune-Wakad. This 42-storey residential tower offers 320 premium apartments across 3 BHK and 4 BHK configurations with floor-to-ceiling glazing, private sky decks, and a resort-style podium. The project integrates smart home automation, a rooftop infinity pool, and a 25,000 sq ft clubhouse — setting a new benchmark for urban living in Pune.",
    city: "Pune",
    state: "Maharashtra",
    location: "Wakad, Pune, Maharashtra",
    status: "Completed",
    projectValue: "₹420 Cr",
    areaCovered: "2.4 Lakh Sq Ft",
    completionYear: 2023,
    progress: 100,
    featured: true,
    imageUrl: "/images/project-1.jpeg",
    tags: ["Luxury", "High-Rise", "Residential", "Smart Home"],
    keyFeatures: [
      "42 floors, 320 apartments",
      "Rooftop infinity pool",
      "Smart home automation",
      "25,000 sq ft clubhouse",
    ],
    clientName: "Skyline Developers Pvt Ltd",
  },
  {
    id: "aurelia-residences",
    title: "Aurelia Luxury Residences",
    category: "Luxury Apartments",
    shortDescription:
      "Ultra-premium sea-facing apartments in the heart of Bandra, Mumbai — where every detail is a statement of art.",
    description:
      "Aurelia Luxury Residences in Bandra West brings together 180 sea-facing apartments across 28 floors, blending Italian marble finishes, private elevators, and panoramic Arabian Sea views. Each residence features imported fixtures, bespoke kitchen cabinetry, and a private concierge service. The development includes a sky lounge, wine cellar, spa, and a curated art gallery on the ground floor — a lifestyle unlike any other in Mumbai.",
    city: "Mumbai",
    state: "Maharashtra",
    location: "Bandra West, Mumbai, Maharashtra",
    status: "Completed",
    projectValue: "₹780 Cr",
    areaCovered: "3.1 Lakh Sq Ft",
    completionYear: 2024,
    progress: 100,
    featured: true,
    imageUrl: "/images/project-6.jpeg",
    tags: ["Sea-Facing", "Ultra-Premium", "Bandra", "Luxury"],
    keyFeatures: [
      "180 sea-facing units",
      "Private elevator per unit",
      "Italian marble throughout",
      "Dedicated concierge service",
    ],
    clientName: "Aurelia Realty LLP",
  },
  {
    id: "orion-commercial",
    title: "Orion Commercial Complex",
    category: "Commercial Complex",
    shortDescription:
      "A 1.2 million sq ft Grade-A commercial hub in Pune's thriving IT corridor, built for the Fortune 500 ecosystem.",
    description:
      "Orion Commercial Complex in Hinjewadi represents the pinnacle of Grade-A office infrastructure in Pune. Spread across 12 towers and 1.2 million sq ft, the development is home to over 40 Fortune 500 tenants. Featuring LEED Platinum certification, sky bridges, 5-level underground parking, and a central retail boulevard, Orion sets a new standard for integrated work environments. The project was completed ahead of schedule and under budget.",
    city: "Pune",
    state: "Maharashtra",
    location: "Hinjewadi, Pune, Maharashtra",
    status: "Completed",
    projectValue: "₹1,200 Cr",
    areaCovered: "12 Lakh Sq Ft",
    completionYear: 2022,
    progress: 100,
    featured: true,
    imageUrl: "/images/project-7.png",
    tags: ["LEED Platinum", "Commercial", "IT Park", "Grade-A"],
    keyFeatures: [
      "12 interconnected towers",
      "LEED Platinum certified",
      "5-level underground parking",
      "Central retail boulevard",
    ],
    clientName: "Orion Tech Parks Ltd",
  },
  {
    id: "lifeline-hospital",
    title: "Lifeline Multispecialty Hospital",
    category: "Hospital",
    shortDescription:
      "A 600-bed state-of-the-art multispecialty hospital in Nashik, transforming healthcare access for 3 million residents.",
    description:
      "Lifeline Multispecialty Hospital is a landmark healthcare infrastructure project in Nashik, designed to serve a catchment population of over 3 million. The 600-bed facility spans 4.5 lakh sq ft across 8 floors, featuring 12 modular OT suites, an advanced NICU, a 64-bed ICU, and a dedicated trauma center. The hospital integrates a NABH-ready hospital management system, pneumatic tube supply networks, and a dedicated helipad — built to international JCI standards.",
    city: "Nashik",
    state: "Maharashtra",
    location: "Nashik, Maharashtra",
    status: "Completed",
    projectValue: "₹580 Cr",
    areaCovered: "4.5 Lakh Sq Ft",
    completionYear: 2023,
    progress: 100,
    featured: true,
    imageUrl: "/images/project-8.jpeg",
    tags: ["Healthcare", "JCI Standards", "600 Beds", "NABH"],
    keyFeatures: [
      "600 beds across 8 floors",
      "12 modular OT suites",
      "JCI and NABH compliant",
      "Dedicated helipad",
    ],
    clientName: "Lifeline Health Foundation",
  },
  {
    id: "greenfield-villas",
    title: "Greenfield Hillside Villas",
    category: "Villas",
    shortDescription:
      "Private hillside villas nestled in the Sahyadri foothills of Lonavala — a sanctuary of nature and craftsmanship.",
    description:
      "Greenfield Hillside Villas is a boutique gated community of 48 independent villas perched across a 22-acre hillside estate in Lonavala. Each 5,000–8,000 sq ft villa features a private pool, home theatre, staff quarters, and landscaped terraces with unobstructed valley views. Built using sustainable local stone and reclaimed timber, the project integrates passive cooling design, rainwater harvesting, and a dedicated solar farm — making it one of India's most eco-conscious luxury villa communities.",
    city: "Lonavala",
    state: "Maharashtra",
    location: "Lonavala, Maharashtra",
    status: "Ongoing",
    projectValue: "₹320 Cr",
    areaCovered: "22 Acres",
    completionYear: null,
    progress: 72,
    featured: false,
    imageUrl: "/images/project-3.jpeg",
    tags: ["Eco-Luxury", "Villas", "Hillside", "Sustainable"],
    keyFeatures: [
      "48 independent villas",
      "Private pool per villa",
      "Passive cooling design",
      "Solar-powered estate",
    ],
    clientName: "Greenfield Estate Developers",
  },
  {
    id: "meridian-mall",
    title: "Meridian Shopping Mall",
    category: "Shopping Mall",
    shortDescription:
      "Central India's largest mixed-use retail destination in Nagpur with 350+ brands across 1.8 million sq ft.",
    description:
      "Meridian Shopping Mall in Nagpur is a landmark retail and entertainment destination in Central India. Spread over 1.8 million sq ft across 4 levels, it houses 350+ international and domestic retail brands, an 18-screen multiplex, a 60,000 sq ft food court, an indoor theme park, and a 5-star business hotel. The structural engineering involved a 200m column-free atrium — one of the largest in India. The mall was built using precast construction technology, reducing build time by 9 months.",
    city: "Nagpur",
    state: "Maharashtra",
    location: "Nagpur, Maharashtra",
    status: "Completed",
    projectValue: "₹950 Cr",
    areaCovered: "18 Lakh Sq Ft",
    completionYear: 2023,
    progress: 100,
    featured: false,
    imageUrl: "/images/project-5.jpeg",
    tags: ["Retail", "Largest Mall", "Entertainment", "Precast"],
    keyFeatures: [
      "350+ brands across 4 levels",
      "18-screen multiplex",
      "200m column-free atrium",
      "Indoor theme park",
    ],
    clientName: "Meridian Retail Ventures",
  },
  {
    id: "zenith-corporate",
    title: "Zenith Corporate Office",
    category: "Corporate Office",
    shortDescription:
      "Bengaluru's most distinctive corporate headquarters — a 28-floor tower with a vertical garden façade and net-zero energy design.",
    description:
      "Zenith Corporate Office in Bengaluru is a trophy asset that redefines sustainable corporate architecture in India. The 28-floor tower features a 3,000-panel photovoltaic glass façade, vertical garden systems spanning 18 floors, and a geothermal cooling network — achieving net-zero energy certification. The building accommodates 6,500 professionals and includes collaboration hubs, a wellness centre, fine dining restaurant, and a rooftop observation deck accessible to clients and guests.",
    city: "Bengaluru",
    state: "Karnataka",
    location: "Whitefield, Bengaluru, Karnataka",
    status: "In Progress",
    projectValue: "₹680 Cr",
    areaCovered: "6.8 Lakh Sq Ft",
    completionYear: null,
    progress: 58,
    featured: false,
    imageUrl: "/images/project-2.jpeg",
    tags: ["Net-Zero", "Vertical Garden", "Sustainable", "Bengaluru"],
    keyFeatures: [
      "Net-zero energy certified",
      "Vertical garden 18 floors",
      "PV glass façade",
      "Geothermal cooling",
    ],
    clientName: "Zenith Technologies Ltd",
  },
  {
    id: "western-corridor",
    title: "Western Corridor Infrastructure",
    category: "Infrastructure Project",
    shortDescription:
      "A 62 km elevated road and metro corridor connecting Chennai's outer ring road with the new international airport.",
    description:
      "The Western Corridor Infrastructure Project is one of South India's most significant transport infrastructure achievements — a 62 km elevated highway and integrated metro corridor connecting Chennai's ORR with the new Greenfield International Airport at Parandur. The project involved 1,840 precast spans, 220 pier foundations, 6 interchange nodes, and 14 metro stations. Delivered through a joint venture structure with a 26-month fast-track schedule, this corridor will reduce travel time by 55 minutes for 4 lakh daily commuters.",
    city: "Chennai",
    state: "Tamil Nadu",
    location: "Chennai, Tamil Nadu",
    status: "Ongoing",
    projectValue: "₹4,800 Cr",
    areaCovered: "62 km Corridor",
    completionYear: null,
    progress: 44,
    featured: false,
    imageUrl: "/images/project-4.jpeg",
    tags: ["Infrastructure", "Metro", "Highway", "Chennai"],
    keyFeatures: [
      "62 km elevated corridor",
      "14 integrated metro stations",
      "1,840 precast spans",
      "55-min commute reduction",
    ],
    clientName: "TNRDC / Govt of Tamil Nadu",
  },
  {
    id: "bharat-industrial",
    title: "Bharat Industrial Plant",
    category: "Industrial Plant",
    shortDescription:
      "A 150-acre EV battery gigafactory in Aurangabad, built to produce 10 GWh annually with zero liquid discharge.",
    description:
      "Bharat Industrial Plant is a landmark EV battery gigafactory spanning 150 acres in Chikalthana MIDC, Aurangabad. The 18-lakh sq ft facility houses climate-controlled dry rooms, precision cleanrooms, and automated assembly lines capable of producing 10 GWh of lithium-ion cells annually. The project implemented zero liquid discharge systems, an onsite 20 MW solar plant, and ISO 50001-certified energy management — making it one of India's most advanced and sustainable industrial facilities.",
    city: "Aurangabad",
    state: "Maharashtra",
    location: "Chikalthana MIDC, Aurangabad, Maharashtra",
    status: "Completed",
    projectValue: "₹2,200 Cr",
    areaCovered: "150 Acres",
    completionYear: 2024,
    progress: 100,
    featured: false,
    imageUrl: "/images/project-5.jpeg",
    tags: ["EV Battery", "Gigafactory", "Zero Discharge", "Industrial"],
    keyFeatures: [
      "10 GWh annual production capacity",
      "Zero liquid discharge",
      "20 MW onsite solar",
      "ISO 50001 certified",
    ],
    clientName: "Bharat EV Technologies Ltd",
  },
  {
    id: "konkan-warehouse",
    title: "Konkan Logistics Warehouse",
    category: "Warehouse",
    shortDescription:
      "A 2.4 million sq ft automated 3PL logistics hub at Panvel, designed as gateway warehouse for the JNPT port corridor.",
    description:
      "Konkan Logistics Warehouse at Panvel is a state-of-the-art 3PL fulfillment and warehousing complex serving as the primary gateway hub for the JNPT-Mumbai port corridor. The 2.4 million sq ft facility features automated storage and retrieval systems (ASRS), dock-level floors for 120 bays, cold chain warehousing, and an integrated railway siding. The structure was engineered to carry 6-ton/m² floor loads with 18m clear height across 4 interconnected blocks — built using fast-track pre-engineered building (PEB) technology.",
    city: "Panvel",
    state: "Maharashtra",
    location: "Panvel, Navi Mumbai, Maharashtra",
    status: "Completed",
    projectValue: "₹480 Cr",
    areaCovered: "2.4 Million Sq Ft",
    completionYear: 2023,
    progress: 100,
    featured: false,
    imageUrl: "/images/project-2.jpeg",
    tags: ["Logistics", "ASRS", "3PL", "PEB"],
    keyFeatures: [
      "ASRS automated systems",
      "120 dock-level bays",
      "Cold chain integrated",
      "Railway siding access",
    ],
    clientName: "Konkan Logistics Parks Ltd",
  },
];

export const FEATURED_PROJECTS = ALL_PROJECTS.filter((p) => p.featured);

export const STATUS_COLOR: Record<ProjectStatus, string> = {
  Completed: "bg-emerald-600 text-white",
  Ongoing: "bg-blue-600 text-white",
  "In Progress": "bg-amber-500 text-white",
  Planned: "bg-slate-500 text-white",
};
