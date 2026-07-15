import "dotenv/config";
import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import { Project } from "../models/Project.js";
import { Enquiry } from "../models/Enquiry.js";
import mongoose from "mongoose";

async function seed() {
  await connectDB();

  console.log("[seed] clearing existing users, projects and enquiries...");
  await User.deleteMany({});
  await Project.deleteMany({});
  await Enquiry.deleteMany({});

  // Meets new rules: 8+ chars + symbol
  const password = await bcrypt.hash("Password#123", 10);

  console.log("[seed] creating users...");

  const ceo = await User.create({
    firstName: "Rajesh", lastName: "Deshmukh",
    email: "ceo@swapnapurti.com", phone: "9000000001",
    countryCode: "+91", passwordHash: password,
    role: "ceo", city: "Pune", state: "Maharashtra", department: "Executive",
  });

  const admin = await User.create({
    firstName: "Anita", lastName: "Kulkarni",
    email: "admin@swapnapurti.com", phone: "9000000002",
    countryCode: "+91", passwordHash: password,
    role: "admin", city: "Pune", state: "Maharashtra", department: "Operations",
  });

  const engineer1 = await User.create({
    firstName: "Vikram", lastName: "Patil",
    email: "engineer@swapnapurti.com", phone: "9000000003",
    countryCode: "+91", passwordHash: password,
    role: "engineer", city: "Mumbai", state: "Maharashtra",
    specialization: "Structural Engineering",
    skills: ["AutoCAD", "Site Supervision", "RCC Design"],
    experience: 8, available: true,
  });

  const engineer2 = await User.create({
    firstName: "Sneha", lastName: "Joshi",
    email: "sneha.engineer@swapnapurti.com", phone: "9000000004",
    countryCode: "+91", passwordHash: password,
    role: "engineer", city: "Bengaluru", state: "Karnataka",
    specialization: "MEP Engineering",
    skills: ["HVAC", "Plumbing Design", "Electrical Layout"],
    experience: 5, available: true,
  });

  const customer = await User.create({
    firstName: "Rohan", lastName: "Sharma",
    email: "customer@example.com", phone: "9000000005",
    countryCode: "+91", passwordHash: password,
    role: "customer", city: "Mumbai", state: "Maharashtra",
  });

  console.log("[seed] creating 10 construction projects...");

  // Royalty-free Unsplash placeholders (already used elsewhere in this app)
  // mixed with the project's local /images assets, so every project has a
  // working image without relying on any unverified external URL.
  const unsplash = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`;

  const projectsData = [
    {
      title: "Skyline Heights",
      category: "Residential Tower",
      description: "A 42-storey landmark residential tower with sky-lounges, smart-home automation, and panoramic city views in the heart of Wakad.",
      city: "Pune", state: "Maharashtra", location: "Wakad",
      status: "Ongoing", clientName: "Mahesh Realty Group",
      customer: customer._id,
      projectValue: "₹245 Cr", areaCovered: "8.2 Lakh sq.ft",
      keyFeatures: ["42-storey twin towers", "Rooftop infinity pool", "Smart home automation", "3-tier security", "EV charging bays"],
      startDate: new Date("2023-01-15"), completionDate: new Date("2026-12-31"), completionYear: 2026,
      progress: 58, tags: ["Residential", "High-Rise", "Smart Home"],
      imageUrl: "/images/1.jpeg", featured: true,
      assignedEngineers: [engineer1._id], createdBy: admin._id,
    },
    {
      title: "Aurelia Luxury Residences",
      category: "Luxury Apartments",
      description: "Sea-facing ultra-luxury apartments in Bandra West, finished with imported Italian marble, private elevators, and a dedicated concierge team.",
      city: "Mumbai", state: "Maharashtra", location: "Bandra West",
      status: "Ongoing", clientName: "Aurelia Developers Pvt Ltd",
      customer: null,
      projectValue: "₹680 Cr", areaCovered: "5.4 Lakh sq.ft",
      keyFeatures: ["Sea-facing private decks", "Italian marble interiors", "Private elevators", "24x7 concierge", "Infinity-edge pool deck"],
      startDate: new Date("2022-06-01"), completionDate: new Date("2027-03-31"), completionYear: 2027,
      progress: 41, tags: ["Luxury", "Sea-View", "Residential"],
      imageUrl: "/images/2.jpeg", featured: true,
      assignedEngineers: [engineer1._id, engineer2._id], createdBy: admin._id,
    },
    {
      title: "Greenfield Hillside Villas",
      category: "Villas",
      description: "A gated community of 60 private villas set against the hills of Lonavala, designed for weekend luxury and sustainable living.",
      city: "Lonavala", state: "Maharashtra", location: "Tungarli",
      status: "Completed", clientName: "Greenfield Estates",
      customer: null,
      projectValue: "₹95 Cr", areaCovered: "3.1 Lakh sq.ft (60 villas)",
      keyFeatures: ["Private gardens", "Rooftop solar power", "Clubhouse & spa", "Hill-view terraces", "Rainwater harvesting"],
      startDate: new Date("2021-02-01"), completionDate: new Date("2023-11-30"), completionYear: 2023,
      progress: 100, tags: ["Villas", "Hillside", "Sustainable"],
      imageUrl: "/images/interior.jpg", featured: false,
      assignedEngineers: [engineer2._id], createdBy: admin._id,
    },
    {
      title: "Orion Commercial Complex",
      category: "Commercial Complex",
      description: "A Grade-A commercial complex in Hinjewadi's IT corridor, built for large enterprise tenants with LEED Gold sustainability standards.",
      city: "Pune", state: "Maharashtra", location: "Hinjewadi Phase 3",
      status: "Ongoing", clientName: "Orion Business Park LLP",
      customer: null,
      projectValue: "₹310 Cr", areaCovered: "6.8 Lakh sq.ft",
      keyFeatures: ["Grade-A office floors", "Rooftop food court", "Helipad", "LEED Gold certified", "2,500-vehicle parking"],
      startDate: new Date("2023-04-01"), completionDate: new Date("2026-06-30"), completionYear: 2026,
      progress: 67, tags: ["Commercial", "IT Park", "LEED Gold"],
      imageUrl: "/images/exterior.jpg", featured: true,
      assignedEngineers: [engineer1._id], createdBy: admin._id,
    },
    {
      title: "Meridian Shopping Mall",
      category: "Shopping Mall",
      description: "A 9.5 lakh sq.ft retail and entertainment destination in Nagpur, anchored by a multiplex and 150+ premium retail stores.",
      city: "Nagpur", state: "Maharashtra", location: "Wardha Road",
      status: "Completed", clientName: "Meridian Retail Holdings",
      customer: null,
      projectValue: "₹420 Cr", areaCovered: "9.5 Lakh sq.ft",
      keyFeatures: ["8-screen multiplex", "150+ retail stores", "Food court & rooftop dining", "2,000+ car parking", "Central atrium"],
      startDate: new Date("2020-05-01"), completionDate: new Date("2023-09-15"), completionYear: 2023,
      progress: 100, tags: ["Retail", "Entertainment", "Mixed-Use"],
      imageUrl: unsplash("1522708323590-d24dbb6b0267"), featured: false,
      assignedEngineers: [engineer2._id], createdBy: admin._id,
    },
    {
      title: "Bharat Industrial Plant",
      category: "Industrial Plant",
      description: "A heavy manufacturing facility near Aurangabad with a captive power plant, effluent treatment system, and dedicated rail siding.",
      city: "Aurangabad", state: "Maharashtra", location: "Shendra MIDC",
      status: "Ongoing", clientName: "Bharat Heavy Manufacturing Ltd",
      customer: null,
      projectValue: "₹275 Cr", areaCovered: "12 Lakh sq.ft",
      keyFeatures: ["Heavy machinery bays", "Captive power plant", "Effluent treatment plant", "Dedicated rail siding", "Automated material handling"],
      startDate: new Date("2023-01-10"), completionDate: new Date("2025-12-20"), completionYear: 2025,
      progress: 73, tags: ["Industrial", "Manufacturing"],
      imageUrl: "/images/infrastructure.jpg", featured: false,
      assignedEngineers: [engineer1._id, engineer2._id], createdBy: admin._id,
    },
    {
      title: "Konkan Logistics Warehouse",
      category: "Warehouse",
      description: "A fully automated 4.2 lakh sq.ft logistics and cold-storage warehouse strategically located near JNPT for fast last-mile distribution.",
      city: "Panvel", state: "Maharashtra", location: "JNPT Road",
      status: "Completed", clientName: "Konkan Logistics Pvt Ltd",
      customer: null,
      projectValue: "₹85 Cr", areaCovered: "4.2 Lakh sq.ft",
      keyFeatures: ["Automated racking system", "40 loading docks", "Dedicated cold-storage zone", "24x7 surveillance", "Fire-suppression systems"],
      startDate: new Date("2022-03-01"), completionDate: new Date("2023-08-01"), completionYear: 2023,
      progress: 100, tags: ["Warehouse", "Logistics"],
      imageUrl: unsplash("1494526585095-c41746248156"), featured: false,
      assignedEngineers: [engineer1._id], createdBy: admin._id,
    },
    {
      title: "Lifeline Multispecialty Hospital",
      category: "Hospital",
      description: "A 500-bed NABH-ready multispecialty hospital in Nashik with a dedicated trauma center and rooftop helipad for emergency transfers.",
      city: "Nashik", state: "Maharashtra", location: "Gangapur Road",
      status: "Ongoing", clientName: "Lifeline Healthcare Trust",
      customer: customer._id,
      projectValue: "₹350 Cr", areaCovered: "5.8 Lakh sq.ft",
      keyFeatures: ["500-bed facility", "Level-1 trauma center", "Rooftop helipad", "NABH-ready design", "Negative-pressure isolation wards"],
      startDate: new Date("2023-07-01"), completionDate: new Date("2026-10-31"), completionYear: 2026,
      progress: 35, tags: ["Healthcare", "Hospital"],
      imageUrl: "/images/rr.jpg", featured: true,
      assignedEngineers: [engineer2._id], createdBy: admin._id,
    },
    {
      title: "Zenith Corporate Office",
      category: "Corporate Office",
      description: "A LEED Platinum corporate headquarters in Bengaluru with biophilic design, a rooftop amphitheater, and full EV fleet charging.",
      city: "Bengaluru", state: "Karnataka", location: "Outer Ring Road",
      status: "Completed", clientName: "Zenith Technologies",
      customer: null,
      projectValue: "₹190 Cr", areaCovered: "3.6 Lakh sq.ft",
      keyFeatures: ["LEED Platinum certified", "Biophilic interior design", "Rooftop amphitheater", "EV fleet charging", "Smart access control"],
      startDate: new Date("2021-09-01"), completionDate: new Date("2023-12-15"), completionYear: 2023,
      progress: 100, tags: ["Corporate", "Sustainable"],
      imageUrl: unsplash("1533106418989-88406a6695c2"), featured: false,
      assignedEngineers: [engineer1._id], createdBy: admin._id,
    },
    {
      title: "Western Corridor Infrastructure Project",
      category: "Infrastructure Project",
      description: "A 14 km elevated expressway corridor easing freight and commuter traffic between Chennai's port and the outer industrial belt.",
      city: "Chennai", state: "Tamil Nadu", location: "Port-to-Outer Ring Road Corridor",
      status: "Ongoing", clientName: "Chennai Port Authority",
      customer: null,
      projectValue: "₹560 Cr", areaCovered: "14 km elevated corridor",
      keyFeatures: ["14 km elevated expressway", "6 grade-separated interchanges", "Smart traffic monitoring", "Noise-barrier walls", "Dedicated freight lane"],
      startDate: new Date("2022-11-01"), completionDate: new Date("2026-05-31"), completionYear: 2026,
      progress: 49, tags: ["Infrastructure", "Coastal", "Transport"],
      imageUrl: unsplash("1512917774080-9991f1c4c750"), featured: false,
      assignedEngineers: [engineer2._id], createdBy: admin._id,
    },
  ];

  await Project.create(projectsData);

  console.log("[seed] creating demo enquiries...");

  await Enquiry.create([
    {
      name: "Karan Mehta", email: "karan.mehta@example.com", phone: "+91 98200 11223",
      company: "Mehta Builders", projectType: "Residential", budgetRange: "50-100 Cr",
      location: "Thane, Maharashtra",
      message: "We're looking for an EPC partner for a 300-unit residential tower in Thane. Please share your portfolio and a preliminary timeline.",
      status: "New",
    },
    {
      name: "Priya Nair", email: "priya.nair@example.com", phone: "+91 90123 44556",
      company: "Coastal Hospitality Group", projectType: "Commercial", budgetRange: "100-500 Cr",
      location: "Kochi, Kerala",
      message: "Interested in discussing a beachfront hospitality and retail complex. We'd like a call this week to scope requirements.",
      status: "Contacted",
    },
    {
      name: "Suresh Iyer", email: "suresh.iyer@example.com", phone: "+91 99887 76655",
      company: "", projectType: "Industrial", budgetRange: "10-50 Cr",
      location: "Coimbatore, Tamil Nadu",
      message: "We need a warehouse and light-manufacturing facility built in the Coimbatore industrial belt within 18 months.",
      status: "In Progress",
    },
    {
      name: "Anjali Deshpande", email: "anjali.d@example.com", phone: "+91 98765 12340",
      company: "Deshpande Family Trust", projectType: "Residential", budgetRange: "< 10 Cr",
      location: "Nagpur, Maharashtra",
      message: "Looking to build a single villa on a 4,000 sq.ft plot. Already have land and an architect's concept design.",
      status: "Closed",
    },
  ]);

  console.log("\n[seed] Done! Login credentials (all use password: Password#123)\n");
  console.table([
    { role: "CEO (hidden /portal-x9 + access code: SPA-CEO-2026-ACCESS)", email: ceo.email },
    { role: "Admin", email: admin.email },
    { role: "Engineer", email: engineer1.email },
    { role: "Engineer", email: engineer2.email },
    { role: "Customer", email: customer.email },
  ]);
  console.log(`[seed] Created ${projectsData.length} projects (4 featured) and 4 demo enquiries.`);

  await mongoose.connection.close();
}

seed().catch((err) => { console.error("[seed] error:", err); process.exit(1); });
