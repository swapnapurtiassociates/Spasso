import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetEngineerCities, useListEngineers } from "@workspace/api-client-react";
import { motion } from "framer-motion";
import { ArrowRight, Award, Filter, MapPin } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Engineers() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  
  const { data: engineers, isLoading } = useListEngineers();
  
  const { data: cities } = useGetEngineerCities();

  const filteredEngineers = engineers?.filter(e => {
    const matchesCity = selectedCity === "All" || e.city === selectedCity;
    const q = search.toLowerCase();
    const matchesSearch =
      e.fullName.toLowerCase().includes(q) ||
      e.role.toLowerCase().includes(q);
    return matchesCity && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight mb-6">Our Experts</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-8">
              The minds behind the monuments. Our team of world-class engineers and architects bring decades of experience to every project.
            </p>
            
            <div className="max-w-md mb-6">
              <Input 
                placeholder="Search by name or role..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 rounded-none border-border bg-card"
              />
            </div>
            
            {cities && cities.length > 0 && (
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 mr-4 text-muted-foreground uppercase tracking-widest text-xs font-bold">
                  <Filter size={16} /> Location
                </div>
                <Button
                  variant={selectedCity === "All" ? "default" : "outline"}
                  onClick={() => setSelectedCity("All")}
                  className="rounded-none uppercase tracking-widest text-xs h-10"
                >
                  All
                </Button>
                {cities.map((cityName) => (
                  <Button
                    key={cityName}
                    variant={selectedCity === cityName ? "default" : "outline"}
                    onClick={() => setSelectedCity(cityName)}
                    className="rounded-none uppercase tracking-widest text-xs h-10"
                  >
                    {cityName}
                  </Button>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-square bg-muted animate-pulse rounded-sm"></div>
            ))
          ) : filteredEngineers?.length === 0 ? (
            <div className="col-span-full py-20 text-center text-muted-foreground">
              No engineers found matching your criteria.
            </div>
          ) : (
            filteredEngineers?.map((engineer, i) => (
              <motion.div
                key={engineer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                className="group flex flex-col bg-card border border-border"
              >
                <div className="relative aspect-square overflow-hidden bg-muted">
                  <img
                    src={engineer.imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(engineer.fullName)}&background=random&size=512`}
                    alt={engineer.fullName}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 grayscale group-hover:grayscale-0"
                  />
                  {!engineer.available && (
                    <div className="absolute top-4 right-4 bg-black/80 text-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-sm">
                      On Project
                    </div>
                  )}
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-serif font-bold mb-1">{engineer.fullName}</h3>
                  <p className="text-primary text-sm font-bold uppercase tracking-widest mb-4">{engineer.role}</p>
                  
                  <div className="space-y-2 text-sm text-muted-foreground mb-6">
                    <div className="flex items-center gap-2">
                      <MapPin size={16} className="text-foreground/50" />
                      {engineer.city}, {engineer.state}
                    </div>
                    <div className="flex items-center gap-2">
                      <Award size={16} className="text-foreground/50" />
                      {engineer.experience} Years Exp.
                    </div>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-border">
                    <Link href={`/engineers/${engineer.id}`} className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-foreground hover:text-primary transition-colors">
                      View Profile <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}