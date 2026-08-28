import { Mail, MapPin, Phone, Send } from 'lucide-react';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';

// Define a type for the form state to satisfy TypeScript
interface FormDataState {
  fullName: string;
  email: string;
  phone: string;
  company: string;
  projectType: string;
  budget: string;
  location: string;
  description: string;
}

export default function ProjectInquiryPage() {
  const [formData, setFormData] = useState<FormDataState>({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    projectType: '',
    budget: '',
    location: '',
    description: ''
  });

  // Use a ref to target the video element directly
  const videoRef = useRef<HTMLVideoElement>(null);

  // Force-play the video on component mount to bypass strict browser policies
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = true; // Crucial: Browsers block autoplay if unmuted
      videoRef.current.play().catch((error) => {
        console.log("Autoplay was prevented by the browser. Interaction might be needed:", error);
      });
    }
  }, []);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (!e || !e.target) return;
    const { name, value } = e.target;
    
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Inquiry Submitted:", formData);
  };

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden font-sans text-white flex flex-col justify-between">
      
      {/* 1. BACKGROUND VIDEO LAYER */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover scale-105 filter brightness-50 contrast-125"
        >
          {/* Points directly to your /public/images/logvid.mp4 asset */}
          <source src="/images/logvid.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {/* Semi-transparent gradient overlay to ensure form contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/75 to-slate-950/90 z-10" />
      </div>

      {/* 2. HEADER / NAVIGATION (Z-index lifted to sit over the video) */}
      <header className="w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="border border-[#c5a880] p-1.5 rounded">
            <span className="font-serif text-xl font-bold tracking-widest text-[#c5a880]">SA</span>
          </div>
          <div>
            <h1 className="font-serif text-sm font-bold tracking-widest text-[#c5a880]">SWAPNAPURTI</h1>
            <p className="text-[9px] tracking-[0.25em] text-gray-400">ASSOCIATES</p>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-8 text-xs tracking-widest text-gray-300 font-medium">
          <span className="hover:text-[#c5a880] cursor-pointer transition-colors">PROJECTS</span>
          <span className="hover:text-[#c5a880] cursor-pointer transition-colors">SERVICES</span>
          <span className="hover:text-[#c5a880] cursor-pointer transition-colors">CAREERS</span>
          <span className="hover:text-[#c5a880] cursor-pointer transition-colors">ABOUT</span>
        </nav>

        <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold tracking-wider px-6 py-2.5 rounded-full shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300">
          GET A QUOTE
        </button>
      </header>

      {/* 3. MAIN HERO & FORM CONTAINER (Z-index lifted to sit over the video) */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 py-8 z-20 w-full max-w-4xl mx-auto">
        
        {/* Intro Header */}
        <div className="text-center mb-8">
          <span className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase block mb-2">— Start a Project —</span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">Let's Build.</h2>
          <p className="text-sm md:text-base text-gray-300 max-w-xl mx-auto font-light leading-relaxed">
            Share your vision with us and our engineering team will help you define the path from blueprint to reality.
          </p>
        </div>

        {/* Contact Quick Badges */}
        <div className="flex flex-wrap justify-center gap-3 mb-8 w-full max-w-3xl">
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs text-gray-300">
            <MapPin size={14} className="text-[#c5a880]" />
            <span>Manchar, Pune</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs text-gray-300">
            <Phone size={14} className="text-[#c5a880]" />
            <span>+91 8379007279</span>
          </div>
          <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs text-gray-300">
            <Mail size={14} className="text-[#c5a880]" />
            <span>infoswapnapurtiasociates@gmail.com</span>
          </div>
        </div>

        {/* PREMIUM GLASSMORPHIC FORM CARD */}
        <div className="w-full bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl shadow-black/50">
          <h3 className="font-serif text-2xl text-center text-white mb-6 tracking-wide">Project Inquiry</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Your full name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.fullName}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="you@email.com"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Company (Optional)</label>
                <input
                  type="text"
                  name="company"
                  placeholder="Your company name"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.company}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Project Type *</label>
                <select
                  name="projectType"
                  required
                  className="w-full bg-neutral-900/90 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.projectType}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select type</option>
                  <option value="commercial">Commercial</option>
                  <option value="residential">Residential</option>
                  <option value="industrial">Industrial</option>
                  <option value="interior">Interior Design</option>
                  <option value="landscape">Landscape</option>
                  <option value="renovation">Renovation</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Budget (Optional)</label>
                <select
                  name="budget"
                  className="w-full bg-neutral-900/90 border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                  value={formData.budget}
                  onChange={handleChange}
                >
                  <option value="" disabled>Select range</option>
                  <option value="under-50l">Under ₹10 Lakhs</option>
                  <option value="under-50l">Under ₹20 Lakhs</option>
                  <option value="under-50l">Under ₹30 Lakhs</option>
                  <option value="under-50l">Under ₹40 Lakhs</option>
                  <option value="50l-2cr">₹50 Lakhs - ₹1 Crores</option>
                  <option value="above-2cr">₹1 Crores - ₹2 Crores</option>
                </select>
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Project Location *</label>
              <input
                type="text"
                name="location"
                required
                placeholder="City, State"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                value={formData.location}
                onChange={handleChange}
              />
            </div>

            {/* Row 5 */}
            <div>
              <label className="block text-[11px] font-bold tracking-wider text-gray-400 uppercase mb-1.5">Project Description *</label>
              <textarea
                name="description"
                required
                rows={4}
                placeholder="Please provide details about scale, timeline, and specific requirements..."
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
                value={formData.description}
                onChange={handleChange}
              />
              <span className="block text-[10px] text-right text-gray-500 mt-1">0/2000</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold tracking-wider py-3.5 rounded-lg flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300"
            >
              <Send size={16} />
              <span>SEND INQUIRY</span>
            </button>
          </form>

          {/* SOCIAL BOX */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="bg-white/5 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">Connect with our team</span>
              
              <div className="flex items-center gap-3">
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/swapnapurtiassociates/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-[#E1306C] hover:bg-white/10 hover:border-[#E1306C]/50 transition-all duration-300 shadow-sm"
                  title="Instagram"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-[#25D366] hover:bg-white/10 hover:border-[#25D366]/50 transition-all duration-300 shadow-sm"
                  title="WhatsApp"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                  </svg>
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="p-2.5 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-[#0077B5] hover:bg-white/10 hover:border-[#0077B5]/50 transition-all duration-300 shadow-sm"
                  title="LinkedIn"
                >
                  <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Footer copyright space (Z-index lifted) */}
      <footer className="w-full text-center py-6 text-[11px] text-gray-500 tracking-wider z-20">
        © 2026 Swapnapurti Associates. All Rights Reserved.
      </footer>
    </div>
  );
}