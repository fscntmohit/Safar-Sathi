import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import DestinationCard from "@/components/DestinationCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  TreePine, 
  Mountain, 
  Waves, 
  Users, 
  Camera, 
  MapPin,
  Phone,
  Mail,
  Globe,
  Filter,
  X
} from "lucide-react";
import { useState } from "react";

// Jharkhand Outline Logo Component
const JharkhandOutline = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 200 200"
    className={className}
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
  >
    <defs>
      <linearGradient id="jh-stroke" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="hsl(147 65% 18%)" />
        <stop offset="100%" stopColor="hsl(147 55% 24%)" />
      </linearGradient>
      <filter id="jh-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="hsl(147 60% 15%)" floodOpacity="0.35" />
      </filter>
    </defs>
    <path
      d="M27 110l10-12 14 2 9-11 12 3 8-8 15 2 10-10 12 6 13-8 14 8 10 15-3 12 8 11-6 14-15 6-10 12-18 4-14-6-12 8-16-3-10-12-13-5-8-12 6-10z"
      stroke="url(#jh-stroke)"
      strokeWidth="3.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      filter="url(#jh-shadow)"
    />
  </svg>
);

// Import generated images
import hundruFalls from "@/assets/hundru-falls.jpg";
import tribalCulture from "@/assets/tribal-culture.jpg";
import betlaNationalPark from "@/assets/betla-national-park.jpg";

const JharkhandTourism = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);

  const destinations = [
    {
      id: "hundru-falls",
      title: "Hundru Falls",
      description: "Experience the thunderous beauty of Jharkhand's highest waterfall cascading 98 meters down rocky cliffs.",
      image: hundruFalls,
      // Serve the MP4 from public/ and play it on hover
      video: "https://res.cloudinary.com/dvevruzjw/video/upload/v1773343838/waterfall_video_cnveqx.mp4",
      location: "Ranchi",
      duration: "Half Day",
      rating: 4.8,
      category: "adventure" as const
    },
    {
      id: "betla-national-park",
      title: "Betla National Park",
      description: "Discover diverse wildlife including elephants, tigers, and deer in their natural habitat.",
      image: betlaNationalPark,
      // Serve the MP4 from public/ and play it on hover
      video: "https://res.cloudinary.com/dvevruzjw/video/upload/v1773343828/From_Klickpin_CF_-_Kaziranga_National_Park_-_At_a_Glance_in_Monsoon_xwsgce.mp4",
      location: "Latehar",
      duration: "Full Day",
      rating: 4.6,
      category: "nature" as const
    },
    {
      id: "tribal-heritage",
      title: "Tribal Heritage",
      description: "Immerse yourself in the rich cultural traditions and vibrant festivals of indigenous communities.",
      image: "/Gond tribe odisha.jpeg",
      location: "Across Jharkhand",
      duration: "2-3 Days",
      rating: 4.9,
      category: "cultural" as const
    },
    {
      id: "netarhat",
      title: "Netarhat",
      description: "Discover the 'Queen of Chotanagpur' with its cool climate, pine forests, and breathtaking sunrise views from Magnolia Point.",
      // Place the JPEG in /public so it is served at this path
      image: "/Need A Quiet Place To Unwind_ Head To Netarhat In Jharkhand.jpeg",
      // Hover video playback (place file in public/)
      video: "https://res.cloudinary.com/dvevruzjw/video/upload/v1773343833/naharut_ka_video_quwvq6.mp4",
      location: "Latehar",
      duration: "2-3 Days",
      rating: 4.7,
      category: "nature" as const
    },
    {
      id: "patratu",
      title: "Patratu",
      description: "Experience the serene beauty of Patratu Dam surrounded by lush green hills and enjoy boating in crystal clear waters.",
      // Use a custom poster image from public/ by default
      image: "/patratu image.jpeg",
      // Place the MP4 in /public so it is served at this path
      video: "https://res.cloudinary.com/dvevruzjw/video/upload/v1773343833/From_Klickpin_CF_-_Pinterest_Video_ccrvvh.mp4",
      location: "Ramgarh",
      duration: "Full Day",
      rating: 4.5,
      category: "nature" as const
    },
    {
      id: "deoghar",
      title: "Deoghar",
      description: "Visit the sacred city of Deoghar, home to the famous Baidyanath Temple and numerous other religious sites.",
      // Use custom public image as default poster
      image: "/Baba Dham ✨ Deoghar, Jharkhand.jpeg",
      // Hover video playback (place file in public/)
      video: "https://res.cloudinary.com/dvevruzjw/video/upload/v1773343830/deogarh_video_k0i8vb.mp4",
      location: "Deoghar",
      duration: "1-2 Days",
      rating: 4.8,
      category: "cultural" as const
    }
  ];

  const services = [
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Guided Tours",
      description: "Expert local guides to enhance your experience"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Photography Tours",
      description: "Capture the natural beauty with professional guidance"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Cultural Immersion",
      description: "Live authentic experiences with tribal communities"
    },
    {
      icon: <TreePine className="h-8 w-8" />,
      title: "Eco Adventures",
      description: "Sustainable tourism practices for nature lovers"
    }
  ];

  // Filter destinations based on selected category
  const filteredDestinations = selectedCategory === 'all' 
    ? destinations 
    : destinations.filter(dest => dest.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All Destinations', icon: <MapPin className="h-4 w-4" /> },
    { id: 'nature', label: 'Nature', icon: <TreePine className="h-4 w-4" /> },
    { id: 'cultural', label: 'Cultural', icon: <Users className="h-4 w-4" /> },
    { id: 'adventure', label: 'Adventure', icon: <Mountain className="h-4 w-4" /> }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <Navigation />
      <HeroSection />
      
      {/* Destinations Section */}
      <section id="destinations" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Featured <span className="text-forest-primary">Destinations</span>
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-semibold">
              Discover the untouched beauty of Jharkhand's most spectacular natural wonders 
              and cultural treasures
            </p>
          </div>

          {/* Filter Controls */}
          <div className="mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-forest-primary" />
                <span className="text-lg font-semibold text-foreground">Filter by Category:</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="sm:hidden"
              >
                {showFilters ? <X className="h-4 w-4 mr-2" /> : <Filter className="h-4 w-4 mr-2" />}
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 transition-all duration-300 ${showFilters ? 'block' : 'hidden sm:grid'}`}>
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-forest-primary text-white shadow-lg transform scale-105'
                      : 'hover:bg-forest-primary/10 hover:border-forest-primary'
                  }`}
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.label}</span>
                  <span className="sm:hidden">{category.label.split(' ')[0]}</span>
                </Button>
              ))}
            </div>

            {/* Results count */}
            <div className="mt-4 text-center">
              <Badge variant="secondary" className="text-sm">
                {filteredDestinations.length} destination{filteredDestinations.length !== 1 ? 's' : ''} found
              </Badge>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination, index) => (
              <DestinationCard key={index} {...destination} />
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No destinations found</h3>
              <p className="text-muted-foreground mb-4">
                Try selecting a different category to explore more destinations.
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory('all')}
                className="hover:bg-forest-primary hover:text-white"
              >
                Show All Destinations
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">
              Cultural <span className="text-forest-primary">Experiences</span> & Services
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto font-semibold">
              Immerse yourself in authentic tribal culture and comprehensive travel services 
              to make your Jharkhand experience truly memorable
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="group p-6 text-center card-enhanced hover:shadow-nature transition-all duration-300 transform hover:-translate-y-2 cursor-pointer"
                onClick={() => {
                  // Add specific functionality for each service
                  if (service.title === "Cultural Immersion") {
                    setSelectedCategory('cultural');
                    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (service.title === "Photography Tours") {
                    // Could open a modal or navigate to a photography gallery
                    alert('Photography tours coming soon! Contact us to book your session.');
                  } else if (service.title === "Guided Tours") {
                    // Could open a booking form or contact section
                    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                  } else if (service.title === "Eco Adventures") {
                    setSelectedCategory('nature');
                    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-primary/10 text-forest-primary rounded-full mb-4 group-hover:bg-forest-primary group-hover:text-white transition-all duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-high-contrast mb-3 group-hover:text-forest-primary transition-colors">
                  {service.title}
                </h3>
                <p className="text-muted-contrast group-hover:text-high-contrast transition-colors">
                  {service.description}
                </p>
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button variant="outline" size="sm" className="w-full">
                    Learn More
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Cultural Highlights */}
          <div className="mt-16 bg-gradient-to-r from-cultural-gold/10 to-forest-primary/10 rounded-2xl p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Experience <span className="text-cultural-gold">Authentic Tribal Culture</span>
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Connect with indigenous communities and participate in traditional festivals, 
                crafts, and cultural ceremonies that have been preserved for generations.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🎭</div>
                <h4 className="font-semibold text-foreground mb-2">Traditional Festivals</h4>
                <p className="text-sm text-muted-foreground">Participate in vibrant tribal celebrations and cultural events</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🎨</div>
                <h4 className="font-semibold text-foreground mb-2">Handicraft Workshops</h4>
                <p className="text-sm text-muted-foreground">Learn traditional crafts from master artisans</p>
              </div>
              <div className="text-center p-4">
                <div className="text-4xl mb-3">🍽️</div>
                <h4 className="font-semibold text-foreground mb-2">Authentic Cuisine</h4>
                <p className="text-sm text-muted-foreground">Taste traditional tribal dishes and cooking methods</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About <span className="text-forest-primary">Jharkhand Tourism</span>
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed mb-8 font-semibold">
            Jharkhand Tourism is dedicated to showcasing the unparalleled beauty, rich cultural heritage,
            and vibrant traditions of Jharkhand. Our mission is to promote sustainable eco-tourism,
            empower local communities, and provide unforgettable experiences for travelers seeking
            authentic adventures in nature's lap.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-medium">
            From the majestic waterfalls and dense forests to ancient temples and lively tribal festivals,
            Jharkhand offers a diverse tapestry of experiences. We are committed to preserving the
            natural and cultural integrity of the region while inviting the world to discover its hidden treasures.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-forest-primary mb-6">
              Plan Your <span className="text-cultural-gold">Perfect Journey</span>
            </h2>
            <p className="text-xl text-gray-700 mb-8 font-semibold max-w-3xl mx-auto">
              Ready to explore the natural wonders and cultural treasures of Jharkhand? 
              Let us help you create the perfect eco-tourism experience tailored to your interests.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            {/* Contact Information */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-forest-primary mb-6">Get in Touch</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-gradient-to-br from-forest-primary/5 to-nature-green/5 rounded-2xl hover:shadow-lg transition-all duration-300 border border-forest-primary/10 hover:border-forest-primary/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-primary/10 rounded-full mb-4">
                    <Phone className="h-8 w-8 text-forest-primary" />
                  </div>
                  <h4 className="text-forest-primary font-bold mb-2 text-lg">Call Us</h4>
                  <p className="text-gray-700 font-semibold text-sm">+91 98765 43210</p>
                  <p className="text-gray-500 text-xs mt-1">Mon-Sat: 9AM-7PM</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-forest-primary/5 to-nature-green/5 rounded-2xl hover:shadow-lg transition-all duration-300 border border-forest-primary/10 hover:border-forest-primary/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-primary/10 rounded-full mb-4">
                    <Mail className="h-8 w-8 text-forest-primary" />
                  </div>
                  <h4 className="text-forest-primary font-bold mb-2 text-lg">Email</h4>
                  <p className="text-gray-700 font-semibold text-sm break-all">info@jharkhandtourism.com</p>
                  <p className="text-gray-500 text-xs mt-1">24/7 Support</p>
                </div>
                <div className="text-center p-6 bg-gradient-to-br from-forest-primary/5 to-nature-green/5 rounded-2xl hover:shadow-lg transition-all duration-300 border border-forest-primary/10 hover:border-forest-primary/20">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-forest-primary/10 rounded-full mb-4">
                    <Globe className="h-8 w-8 text-forest-primary" />
                  </div>
                  <h4 className="text-forest-primary font-bold mb-2 text-lg">Visit</h4>
                  <p className="text-gray-700 font-semibold text-sm">Tourism Office, Ranchi</p>
                  <p className="text-gray-500 text-xs mt-1">Open Daily</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-4">
                <h4 className="text-xl font-bold text-forest-primary mb-4">Quick Actions</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button 
                    variant="outline" 
                    className="border-2 border-forest-primary text-forest-primary hover:bg-forest-primary hover:text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    onClick={() => window.open('tel:+919876543210')}
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    Call Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="border-2 border-forest-primary text-forest-primary hover:bg-forest-primary hover:text-white font-semibold py-3 rounded-xl transition-all duration-300"
                    onClick={() => window.open('mailto:info@jharkhandtourism.com')}
                  >
                    <Mail className="mr-2 h-5 w-5" />
                    Send Email
                  </Button>
                </div>
              </div>
            </div>

            {/* Journey Planning Form */}
            <div className="bg-white border-2 border-forest-primary/20 rounded-3xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-300">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold text-forest-primary mb-2">Plan Your Trip</h3>
                <p className="text-gray-600">Fill out the form below and we'll get back to you within 24 hours</p>
              </div>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-forest-primary text-sm font-bold mb-3">Full Name</label>
                    <input 
                      type="text" 
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-forest-primary/20 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-forest-primary/20 focus:border-forest-primary transition-all duration-300"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-forest-primary text-sm font-bold mb-3">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full px-4 py-4 bg-gray-50 border-2 border-forest-primary/20 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-forest-primary/20 focus:border-forest-primary transition-all duration-300"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-forest-primary text-sm font-bold mb-3">Your Interests</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Nature', 'Culture', 'Adventure', 'Photography'].map((interest) => (
                      <label key={interest} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl hover:bg-forest-primary/5 transition-colors cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 text-forest-primary border-2 border-forest-primary/30 rounded focus:ring-forest-primary/20 focus:ring-2" 
                        />
                        <span className="text-gray-700 font-medium">{interest}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-forest-primary text-sm font-bold mb-3">Trip Duration</label>
                  <select className="w-full px-4 py-4 bg-gray-50 border-2 border-forest-primary/20 rounded-xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-forest-primary/20 focus:border-forest-primary transition-all duration-300">
                    <option value="">Select your preferred duration</option>
                    <option value="1-2 days">1-2 Days</option>
                    <option value="3-5 days">3-5 Days</option>
                    <option value="1 week">1 Week</option>
                    <option value="custom">Custom Duration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-forest-primary text-sm font-bold mb-3">Tell us about your dream experience</label>
                  <textarea 
                    rows={4}
                    className="w-full px-4 py-4 bg-gray-50 border-2 border-forest-primary/20 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-forest-primary/20 focus:border-forest-primary transition-all duration-300 resize-none"
                    placeholder="Describe what you'd like to see and experience in Jharkhand..."
                  ></textarea>
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-forest-primary to-nature-green hover:from-forest-dark hover:to-forest-primary text-white font-bold py-4 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Thank you for your interest! We\'ll contact you within 24 hours to plan your perfect Jharkhand journey.');
                  }}
                >
                  <MapPin className="mr-3 h-6 w-6" />
                  Plan My Perfect Journey
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 via-forest-primary to-gray-800 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <JharkhandOutline className="h-10 w-10 text-cultural-gold mr-3" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                <span className="text-xs font-bold text-forest-primary">★</span>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black text-white leading-tight drop-shadow-lg">
                Incredible Jharkhand
              </span>
            </div>
          </div>
          <p className="text-white mb-6 drop-shadow-md">
            Promoting sustainable eco-tourism and cultural heritage preservation in Jharkhand
          </p>
          <div className="border-t border-white/40 pt-6">
            <p className="text-white/90 drop-shadow-sm">
              © 2024 Jharkhand Tourism Development. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default JharkhandTourism;