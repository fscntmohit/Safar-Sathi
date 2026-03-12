import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Camera, ArrowDown } from "lucide-react";
import { useState, useRef } from "react";
 
 const HeroSection = () => {
   const [isVideoLoaded, setIsVideoLoaded] = useState(false);
   const videoRef = useRef<HTMLVideoElement>(null);

   const handleVideoLoad = () => {
     setIsVideoLoaded(true);
   };

   const handleVideoError = () => {
     setIsVideoLoaded(false);
   };

   // Smooth scroll to destinations section
   const scrollToDestinations = () => {
     const destinationsSection = document.getElementById('destinations');
     if (destinationsSection) {
       destinationsSection.scrollIntoView({ 
         behavior: 'smooth',
         block: 'start'
       });
     }
   };

   // Smooth scroll to services section (cultural experiences)
   const scrollToServices = () => {
     const servicesSection = document.getElementById('services');
     if (servicesSection) {
       servicesSection.scrollIntoView({ 
         behavior: 'smooth',
         block: 'start'
       });
     }
   };

   // Scroll to contact section (plan your journey)
   const scrollToContact = () => {
     const contactSection = document.getElementById('contact');
     if (contactSection) {
       contactSection.scrollIntoView({ 
         behavior: 'smooth',
         block: 'start'
       });
     }
   };

   return (
         <section className="relative min-h-screen flex items-end justify-start overflow-hidden bg-transparent">
      {/* Background Video with Overlay */}
      <div className="absolute inset-0">
        {/* Fallback Image (shows while video loads) */}
        <img 
          src="/backgroundhome.jpeg"
          alt="Jharkhand scenic background" 
          className={`w-full h-full object-cover filter contrast-110 saturate-110 transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
        
        {/* Video Background */}
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          onLoadedData={handleVideoLoad}
          onError={handleVideoError}
          className={`absolute inset-0 w-full h-full object-cover filter contrast-110 saturate-110 transition-opacity duration-1000 ${
            isVideoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source src="https://res.cloudinary.com/dvevruzjw/video/upload/v1773342679/Home_video_edited_copy_qhk1f1.mp4"type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
       
       {/* Content */}
       <div className="relative z-10 text-left px-6 pl-8 md:pl-16 pb-12 md:pb-16 max-w-4xl w-full ml-0 mr-auto">
         <h1 className="text-4xl md:text-6xl font-semibold text-white mb-6 leading-tight animate-fade-in-down">
           <span className="font-forum text-5xl md:text-7xl text-cultural-gold uppercase animate-fade-in-left">Safar Sathi</span>
           <span className="font-forum block text-4xl md:text-6xl text-cultural-gold uppercase animate-fade-in-left">Journey into the Heart</span>
           <span className="font-forum block text-4xl md:text-6xl text-cultural-gold uppercase animate-fade-in-left">of Jharkhand</span>
         </h1>
         
         <div className="flex flex-col sm:flex-row gap-4 justify-start items-start mb-8 animate-fade-in-up animation-delay-300">
           <Button 
             variant="hero" 
             size="lg" 
             onClick={scrollToDestinations}
             className="group transform transition-transform hover:scale-105 active:scale-95 font-black text-lg cursor-pointer"
           >
             <MapPin className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
             Explore Destinations
           </Button>
           <Button 
             variant="cultural" 
             size="lg" 
             onClick={scrollToServices}
             className="group transform transition-transform hover:scale-105 active:scale-95 font-black text-lg cursor-pointer"
           >
             <Camera className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
             Cultural Experiences
           </Button>
           <Button 
             variant="nature" 
             size="lg" 
             onClick={scrollToContact}
             className="group transform transition-transform hover:scale-105 active:scale-95 font-black text-lg cursor-pointer"
           >
             <Calendar className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
             Plan Your Journey
           </Button>
         </div>
         
         {/* Stats */}
         <div className="grid grid-cols-3 gap-8 max-w-2xl ml-0 opacity-0 animate-fade-in animation-delay-500">
           <div className="text-center">
             <div className="text-3xl md:text-4xl font-black text-cultural-gold mb-2 drop-shadow-lg">25+</div>
             <div className="text-white font-black text-lg drop-shadow-lg">Tourist Destinations</div>
           </div>
           <div className="text-center">
             <div className="text-3xl md:text-4xl font-black text-cultural-gold mb-2 drop-shadow-lg">10+</div>
             <div className="text-white font-black text-lg drop-shadow-lg">Tribal Communities</div>
           </div>
           <div className="text-center">
             <div className="text-3xl md:text-4xl font-black text-cultural-gold mb-2 drop-shadow-lg">5</div>
             <div className="text-white font-black text-lg drop-shadow-lg">National Parks</div>
           </div>
         </div>
       </div>
       
       {/* Scroll Indicator */}
       <div 
         className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer hover:scale-110 transition-transform duration-300"
         onClick={scrollToDestinations}
         title="Scroll to destinations"
       >
         <div className="w-8 h-8 border-3 border-cultural-gold rounded-full flex items-center justify-center bg-white/20 backdrop-blur-sm hover:bg-white/30 transition-colors">
           <ArrowDown className="w-4 h-4 text-cultural-gold drop-shadow-lg" />
         </div>
       </div>
     </section>
   );
 };
 
 export default HeroSection;