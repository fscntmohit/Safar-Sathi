import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from "lucide-react";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

interface DestinationCardProps {
  id: string;
  title: string;
  description: string;
  image: string;
  location: string;
  duration: string;
  rating: number;
  category: 'nature' | 'cultural' | 'adventure';
  video?: string;
}

const DestinationCard = ({ 
  id,
  title, 
  description, 
  image, 
  location, 
  duration, 
  rating, 
  category,
  video
}: DestinationCardProps) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    if (videoRef.current) {
      try {
        videoRef.current.currentTime = 0;
        void videoRef.current.play();
      } catch {}
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch {}
    }
  };
  const getCategoryStyles = () => {
    switch (category) {
      case 'nature':
        return 'bg-nature-green text-white';
      case 'cultural':
        return 'bg-cultural-gold text-foreground';
      case 'adventure':
        return 'bg-water-blue text-white';
      default:
        return 'bg-primary text-primary-foreground';
    }
  };

  return (
    <Card className="group overflow-hidden card-enhanced hover:shadow-nature transition-all duration-300 transform hover:-translate-y-2 bg-gradient-card border-0">
      <div className="relative overflow-hidden" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <img 
          src={image} 
          alt={`${title} - ${location}`}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {video ? (
          <video
            ref={videoRef}
            src={video}
            muted
            playsInline
            loop
            className="absolute inset-0 w-full h-48 object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          />
        ) : null}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryStyles()}`}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </span>
        </div>
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center">
          <Star className="h-4 w-4 text-cultural-gold fill-current mr-1" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-high-contrast mb-2 group-hover:text-forest-primary transition-colors">
          {title}
        </h3>
        
        <div className="flex items-center text-muted-contrast mb-3">
          <MapPin className="h-4 w-4 mr-2" />
          <span className="text-sm font-medium">{location}</span>
          <Clock className="h-4 w-4 ml-4 mr-2" />
          <span className="text-sm font-medium">{duration}</span>
        </div>
        
        <p className="text-muted-contrast mb-4 leading-relaxed">
          {description}
        </p>
        
        <Button 
          variant="nature" 
          className="w-full group"
          onClick={() => {
            // Navigate to destination detail page
            navigate(`/destination/${id}`);
          }}
        >
          <span className="group-hover:mr-2 transition-all">Explore Now</span>
          <MapPin className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
        </Button>
      </div>
    </Card>
  );
};

export default DestinationCard;