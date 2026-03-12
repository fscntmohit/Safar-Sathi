import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  Navigation, 
  Users, 
  Calendar,
  ShoppingBag,
  Home,
  TreePine,
  Camera,
  ArrowLeft,
  ExternalLink,
  Compass
} from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DestinationData {
  id: string;
  title: string;
  description: string;
  image: string;
  video?: string;
  location: string;
  duration: string;
  rating: number;
  category: 'nature' | 'cultural' | 'adventure';
  coordinates: [number, number];
  detailedDescription: string;
  bestTimeToVisit: string;
  entryFee: string;
  facilities: string[];
  guides: Guide[];
  handicrafts: Handicraft[];
  events: Event[];
  homestays: Homestay[];
  nearbyAttractions: NearbyAttraction[];
}

interface Guide {
  id: string;
  name: string;
  experience: string;
  languages: string[];
  rating: number;
  phone: string;
  email: string;
  specialties: string[];
  price: string;
}

interface Handicraft {
  id: string;
  name: string;
  artisan: string;
  price: string;
  description: string;
  image: string;
  category: string;
  contact: string;
}

interface Event {
  id: string;
  name: string;
  date: string;
  description: string;
  location: string;
  type: string;
  contact: string;
}

interface Homestay {
  id: string;
  name: string;
  location: string;
  price: string;
  amenities: string[];
  rating: number;
  contact: string;
  description: string;
}

interface NearbyAttraction {
  id: string;
  name: string;
  distance: string;
  type: string;
  coordinates: [number, number];
}

// Sample data for destinations
const destinationsData: DestinationData[] = [
  {
    id: 'hundru-falls',
    title: 'Hundru Falls',
    description: 'Experience the thunderous beauty of Jharkhand\'s highest waterfall cascading 98 meters down rocky cliffs.',
    image: '/hundru-falls.jpg',
    video: '/waterfall video.mp4',
    location: 'Ranchi',
    duration: 'Half Day',
    rating: 4.8,
    category: 'adventure',
    coordinates: [23.3441, 85.3096],
    detailedDescription: 'Hundru Falls is one of the most spectacular waterfalls in Jharkhand, cascading from a height of 98 meters. The falls are formed by the Subarnarekha River and offer a breathtaking view, especially during the monsoon season. The surrounding area is rich in biodiversity and offers excellent opportunities for photography and nature walks.',
    bestTimeToVisit: 'July to September (Monsoon)',
    entryFee: '₹50 per person',
    facilities: ['Parking', 'Restrooms', 'Food Stalls', 'Viewing Platform', 'Safety Railings'],
    guides: [
      {
        id: '1',
        name: 'Rajesh Kumar',
        experience: '8 years',
        languages: ['Hindi', 'English', 'Santhali'],
        rating: 4.9,
        phone: '+91 98765 43210',
        email: 'rajesh@jharkhandtourism.com',
        specialties: ['Waterfall Photography', 'Nature Walks', 'Local History'],
        price: '₹500 per day'
      },
      {
        id: '2',
        name: 'Priya Singh',
        experience: '5 years',
        languages: ['Hindi', 'English', 'Bengali'],
        rating: 4.7,
        phone: '+91 98765 43211',
        email: 'priya@jharkhandtourism.com',
        specialties: ['Adventure Tours', 'Safety Expert', 'Group Tours'],
        price: '₹400 per day'
      }
    ],
    handicrafts: [
      {
        id: '1',
        name: 'Bamboo Baskets',
        artisan: 'Tribal Artisan Group',
        price: '₹200-500',
        description: 'Handwoven bamboo baskets with traditional tribal patterns',
        image: '/bamboo-basket.jpg',
        category: 'Bamboo Work',
        contact: '+91 98765 43212'
      },
      {
        id: '2',
        name: 'Stone Carvings',
        artisan: 'Local Sculptors',
        price: '₹1000-3000',
        description: 'Intricate stone carvings depicting local folklore',
        image: '/stone-carving.jpg',
        category: 'Stone Work',
        contact: '+91 98765 43213'
      }
    ],
    events: [
      {
        id: '1',
        name: 'Waterfall Festival',
        date: 'August 15-17, 2024',
        description: 'Annual celebration of nature and local culture',
        location: 'Hundru Falls Viewpoint',
        type: 'Cultural Festival',
        contact: '+91 98765 43214'
      }
    ],
    homestays: [
      {
        id: '1',
        name: 'Nature\'s Retreat',
        location: 'Near Hundru Falls',
        price: '₹1500 per night',
        amenities: ['WiFi', 'Meals', 'Parking', 'Guided Tours'],
        rating: 4.6,
        contact: '+91 98765 43215',
        description: 'Eco-friendly homestay with traditional tribal architecture'
      }
    ],
    nearbyAttractions: [
      {
        id: '1',
        name: 'Jonha Falls',
        distance: '15 km',
        type: 'Waterfall',
        coordinates: [23.3441, 85.3096]
      },
      {
        id: '2',
        name: 'Rock Garden',
        distance: '8 km',
        type: 'Garden',
        coordinates: [23.3441, 85.3096]
      }
    ]
  },
  {
    id: 'betla-national-park',
    title: 'Betla National Park',
    description: 'Discover diverse wildlife including elephants, tigers, and deer in their natural habitat.',
    image: '/betla-national-park.jpg',
    video: '/From Klickpin CF - Kaziranga National Park - At a Glance in Monsoon.mp4',
    location: 'Latehar',
    duration: 'Full Day',
    rating: 4.6,
    category: 'nature',
    coordinates: [23.8000, 84.2000],
    detailedDescription: 'Betla National Park is a wildlife sanctuary and national park located in the Palamu district of Jharkhand. It is home to a variety of wildlife including tigers, elephants, leopards, and numerous bird species. The park offers jeep safaris, elephant rides, and nature walks for visitors.',
    bestTimeToVisit: 'October to March',
    entryFee: '₹100 per person',
    facilities: ['Jeep Safari', 'Elephant Rides', 'Nature Walks', 'Restrooms', 'Cafeteria'],
    guides: [
      {
        id: '3',
        name: 'Amit Verma',
        experience: '12 years',
        languages: ['Hindi', 'English'],
        rating: 4.8,
        phone: '+91 98765 43216',
        email: 'amit@jharkhandtourism.com',
        specialties: ['Wildlife Photography', 'Bird Watching', 'Safari Tours'],
        price: '₹800 per day'
      }
    ],
    handicrafts: [
      {
        id: '3',
        name: 'Tribal Jewelry',
        artisan: 'Local Artisans',
        price: '₹300-800',
        description: 'Traditional tribal jewelry made from natural materials',
        image: '/tribal-jewelry.jpg',
        category: 'Jewelry',
        contact: '+91 98765 43217'
      }
    ],
    events: [],
    homestays: [
      {
        id: '2',
        name: 'Forest Lodge',
        location: 'Inside Betla National Park',
        price: '₹2000 per night',
        amenities: ['WiFi', 'Meals', 'Safari Booking', 'Nature Walks'],
        rating: 4.7,
        contact: '+91 98765 43218',
        description: 'Luxury forest lodge with modern amenities'
      }
    ],
    nearbyAttractions: [
      {
        id: '3',
        name: 'Palamau Fort',
        distance: '25 km',
        type: 'Historical Site',
        coordinates: [23.8000, 84.2000]
      }
    ]
  },
  {
    id: 'tribal-heritage',
    title: 'Tribal Heritage',
    description: 'Immerse yourself in the rich cultural traditions and vibrant festivals of indigenous communities.',
    image: '/Gond tribe odisha.jpeg',
    location: 'Across Jharkhand',
    duration: '2-3 Days',
    rating: 4.9,
    category: 'cultural',
    coordinates: [23.3441, 85.3096],
    detailedDescription: 'Experience the rich cultural heritage of Jharkhand\'s tribal communities through authentic cultural immersion programs. Learn about traditional crafts, participate in festivals, and stay with local families.',
    bestTimeToVisit: 'Year-round',
    entryFee: 'Varies by program',
    facilities: ['Cultural Programs', 'Craft Workshops', 'Traditional Meals', 'Homestays'],
    guides: [
      {
        id: '4',
        name: 'Sunita Devi',
        experience: '10 years',
        languages: ['Hindi', 'Santhali', 'Munda'],
        rating: 4.9,
        phone: '+91 98765 43219',
        email: 'sunita@jharkhandtourism.com',
        specialties: ['Cultural Immersion', 'Tribal Crafts', 'Festival Tours'],
        price: '₹600 per day'
      }
    ],
    handicrafts: [
      {
        id: '4',
        name: 'Paitkar Paintings',
        artisan: 'Traditional Artists',
        price: '₹500-1500',
        description: 'Traditional tribal paintings depicting local folklore',
        image: '/paitkar-painting.jpg',
        category: 'Paintings',
        contact: '+91 98765 43220'
      }
    ],
    events: [
      {
        id: '2',
        name: 'Sarhul Festival',
        date: 'March 15-17, 2024',
        description: 'Traditional tribal spring festival',
        location: 'Various Tribal Villages',
        type: 'Cultural Festival',
        contact: '+91 98765 43221'
      }
    ],
    homestays: [
      {
        id: '3',
        name: 'Tribal Village Homestay',
        location: 'Santhal Village',
        price: '₹800 per night',
        amenities: ['Traditional Meals', 'Cultural Programs', 'Craft Workshops'],
        rating: 4.8,
        contact: '+91 98765 43222',
        description: 'Authentic tribal village experience'
      }
    ],
    nearbyAttractions: []
  },
  {
    id: 'netarhat',
    title: 'Netarhat',
    description: 'Discover the \'Queen of Chotanagpur\' with its cool climate, pine forests, and breathtaking sunrise views from Magnolia Point.',
    image: '/Need A Quiet Place To Unwind_ Head To Netarhat In Jharkhand.jpeg',
    video: '/naharut ka video.mp4',
    location: 'Latehar',
    duration: '2-3 Days',
    rating: 4.7,
    category: 'nature',
    coordinates: [23.5000, 84.0000],
    detailedDescription: 'Netarhat, known as the "Queen of Chotanagpur," is a hill station in Jharkhand famous for its cool climate, pine forests, and spectacular sunrise views. The Magnolia Point offers breathtaking views of the surrounding landscape.',
    bestTimeToVisit: 'October to March',
    entryFee: 'Free',
    facilities: ['Viewing Points', 'Nature Walks', 'Photography Spots', 'Restaurants'],
    guides: [
      {
        id: '5',
        name: 'Vikram Singh',
        experience: '7 years',
        languages: ['Hindi', 'English'],
        rating: 4.6,
        phone: '+91 98765 43223',
        email: 'vikram@jharkhandtourism.com',
        specialties: ['Sunrise Photography', 'Nature Walks', 'Hill Station Tours'],
        price: '₹500 per day'
      }
    ],
    handicrafts: [],
    events: [],
    homestays: [
      {
        id: '4',
        name: 'Hill Station Resort',
        location: 'Netarhat',
        price: '₹2500 per night',
        amenities: ['WiFi', 'Meals', 'Mountain Views', 'Trekking'],
        rating: 4.5,
        contact: '+91 98765 43224',
        description: 'Luxury resort with panoramic mountain views'
      }
    ],
    nearbyAttractions: [
      {
        id: '4',
        name: 'Magnolia Point',
        distance: '2 km',
        type: 'Viewpoint',
        coordinates: [23.5000, 84.0000]
      }
    ]
  },
  {
    id: 'patratu',
    title: 'Patratu',
    description: 'Experience the serene beauty of Patratu Dam surrounded by lush green hills and enjoy boating in crystal clear waters.',
    image: '/patratu image.jpeg',
    video: '/From Klickpin CF - Pinterest Video.mp4',
    location: 'Ramgarh',
    duration: 'Full Day',
    rating: 4.5,
    category: 'nature',
    coordinates: [23.6000, 85.5000],
    detailedDescription: 'Patratu Dam is a beautiful reservoir surrounded by lush green hills, offering boating, fishing, and picnicking opportunities. The serene environment makes it perfect for relaxation and nature photography.',
    bestTimeToVisit: 'October to March',
    entryFee: '₹100 per person',
    facilities: ['Boating', 'Fishing', 'Picnic Areas', 'Restaurants', 'Parking'],
    guides: [
      {
        id: '6',
        name: 'Ravi Kumar',
        experience: '6 years',
        languages: ['Hindi', 'English'],
        rating: 4.4,
        phone: '+91 98765 43225',
        email: 'ravi@jharkhandtourism.com',
        specialties: ['Boating Tours', 'Fishing', 'Nature Photography'],
        price: '₹400 per day'
      }
    ],
    handicrafts: [],
    events: [],
    homestays: [],
    nearbyAttractions: []
  },
  {
    id: 'deoghar',
    title: 'Deoghar',
    description: 'Visit the sacred city of Deoghar, home to the famous Baidyanath Temple and numerous other religious sites.',
    image: '/Baba Dham ✨ Deoghar, Jharkhand.jpeg',
    video: '/deogarh video.mp4',
    location: 'Deoghar',
    duration: '1-2 Days',
    rating: 4.8,
    category: 'cultural',
    coordinates: [24.4833, 86.7000],
    detailedDescription: 'Deoghar is a sacred city known for the Baidyanath Temple, one of the twelve Jyotirlingas. The city attracts thousands of pilgrims and offers a rich cultural and spiritual experience.',
    bestTimeToVisit: 'Year-round',
    entryFee: 'Free (Temple)',
    facilities: ['Temple Complex', 'Accommodation', 'Food Stalls', 'Parking'],
    guides: [
      {
        id: '7',
        name: 'Pandit Ram Prasad',
        experience: '15 years',
        languages: ['Hindi', 'Sanskrit', 'English'],
        rating: 4.9,
        phone: '+91 98765 43226',
        email: 'ramprasad@jharkhandtourism.com',
        specialties: ['Temple Tours', 'Spiritual Guidance', 'Religious History'],
        price: '₹300 per day'
      }
    ],
    handicrafts: [
      {
        id: '5',
        name: 'Religious Artifacts',
        artisan: 'Temple Artisans',
        price: '₹200-1000',
        description: 'Traditional religious artifacts and souvenirs',
        image: '/religious-artifacts.jpg',
        category: 'Religious Items',
        contact: '+91 98765 43227'
      }
    ],
    events: [
      {
        id: '3',
        name: 'Shravan Mela',
        date: 'July-August, 2024',
        description: 'Annual religious festival and fair',
        location: 'Baidyanath Temple',
        type: 'Religious Festival',
        contact: '+91 98765 43228'
      }
    ],
    homestays: [
      {
        id: '5',
        name: 'Temple Dharamshala',
        location: 'Near Baidyanath Temple',
        price: '₹500 per night',
        amenities: ['Basic Amenities', 'Temple Access', 'Meals'],
        rating: 4.3,
        contact: '+91 98765 43229',
        description: 'Simple accommodation for pilgrims'
      }
    ],
    nearbyAttractions: [
      {
        id: '5',
        name: 'Trikut Hills',
        distance: '10 km',
        type: 'Religious Site',
        coordinates: [24.4833, 86.7000]
      }
    ]
  }
];

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationPermission, setLocationPermission] = useState<'granted' | 'denied' | 'pending'>('pending');
  const [activeTab, setActiveTab] = useState<'overview' | 'map' | 'guides' | 'marketplace' | 'events' | 'homestays'>('overview');

  const destination = destinationsData.find(dest => dest.id === id);

  useEffect(() => {
    if (!destination) {
      navigate('/');
      return;
    }

    // Request location permission
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationPermission('granted');
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationPermission('denied');
        }
      );
    } else {
      setLocationPermission('denied');
    }
  }, [destination, navigate]);

  if (!destination) {
    return null;
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const distance = userLocation ? 
    calculateDistance(userLocation[0], userLocation[1], destination.coordinates[0], destination.coordinates[1]) : null;

  const MapComponent = () => {
    const map = useMap();
    
    useEffect(() => {
      if (userLocation) {
        map.setView(userLocation, 10);
      }
    }, [userLocation, map]);

    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
                            <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                  className="flex items-center gap-2 btn-outline-nature"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to Destinations
                </Button>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-forest-primary" />
              <span className="font-semibold">{destination.location}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-96 bg-gradient-to-r from-forest-primary to-nature-green">
        <img
          src={destination.image}
          alt={destination.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-8 w-full">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {destination.title}
            </h1>
            <div className="flex items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-current text-cultural-gold" />
                <span className="font-semibold">{destination.rating}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-5 w-5" />
                <span>{destination.duration}</span>
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white">
                {destination.category.charAt(0).toUpperCase() + destination.category.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8 overflow-x-auto">
            {[
              { id: 'overview', label: 'Overview', icon: <Compass className="h-4 w-4" /> },
              { id: 'map', label: 'Map & Directions', icon: <MapPin className="h-4 w-4" /> },
              { id: 'guides', label: 'Guides', icon: <Users className="h-4 w-4" /> },
              { id: 'marketplace', label: 'Marketplace', icon: <ShoppingBag className="h-4 w-4" /> },
              { id: 'events', label: 'Events', icon: <Calendar className="h-4 w-4" /> },
              { id: 'homestays', label: 'Homestays', icon: <Home className="h-4 w-4" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-2 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-forest-primary text-forest-primary'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.icon}
                <span className="whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-4">About {destination.title}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {destination.detailedDescription}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Best Time to Visit</h3>
                    <p className="text-gray-600">{destination.bestTimeToVisit}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Entry Fee</h3>
                    <p className="text-gray-600">{destination.entryFee}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Facilities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {destination.facilities.map((facility, index) => (
                    <Badge key={index} variant="outline" className="justify-center">
                      {facility}
                    </Badge>
                  ))}
                </div>
              </Card>

              {destination.nearbyAttractions.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-xl font-bold mb-4">Nearby Attractions</h3>
                  <div className="space-y-3">
                    {destination.nearbyAttractions.map((attraction) => (
                      <div key={attraction.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{attraction.name}</h4>
                          <p className="text-sm text-gray-600">{attraction.type}</p>
                        </div>
                        <Badge variant="secondary">{attraction.distance}</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-bold mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance from you:</span>
                    <span className="font-semibold">
                      {distance ? `${distance.toFixed(1)} km` : 'Location required'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration:</span>
                    <span className="font-semibold">{destination.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-current text-cultural-gold" />
                      <span className="font-semibold">{destination.rating}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {locationPermission === 'denied' && (
                <Card className="p-6 bg-yellow-50 border-yellow-200">
                  <h3 className="text-lg font-semibold text-yellow-800 mb-2">Location Access</h3>
                  <p className="text-yellow-700 text-sm mb-3">
                    Enable location access to see distance and get directions to this destination.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.reload()}
                    className="border-yellow-300 text-yellow-800 hover:bg-yellow-100"
                  >
                    Try Again
                  </Button>
                </Card>
              )}
            </div>
          </div>
        )}

        {activeTab === 'map' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Map & Directions</h2>
              <div className="h-96 rounded-lg overflow-hidden">
                <MapContainer
                  center={destination.coordinates}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={destination.coordinates}>
                    <Popup>
                      <div className="text-center">
                        <h3 className="font-bold">{destination.title}</h3>
                        <p className="text-sm text-gray-600">{destination.location}</p>
                        {distance && (
                          <p className="text-sm text-forest-primary font-semibold">
                            {distance.toFixed(1)} km from your location
                          </p>
                        )}
                      </div>
                    </Popup>
                  </Marker>
                  {userLocation && (
                    <Marker position={userLocation}>
                      <Popup>
                        <div className="text-center">
                          <h3 className="font-bold">Your Location</h3>
                          <p className="text-sm text-gray-600">Current position</p>
                        </div>
                      </Popup>
                    </Marker>
                  )}
                  <MapComponent />
                </MapContainer>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination.coordinates[0]},${destination.coordinates[1]}`;
                    window.open(url, '_blank');
                  }}
                  className="flex items-center gap-2 btn-outline-nature"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    const url = `https://www.google.com/maps/search/?api=1&query=${destination.coordinates[0]},${destination.coordinates[1]}`;
                    window.open(url, '_blank');
                  }}
                  className="flex items-center gap-2 btn-outline-nature"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open in Maps
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Local Guides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.guides.map((guide) => (
                  <Card key={guide.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="text-center mb-4">
                      <div className="w-16 h-16 bg-forest-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Users className="h-8 w-8 text-forest-primary" />
                      </div>
                      <h3 className="font-bold text-lg">{guide.name}</h3>
                      <p className="text-gray-600 text-sm">{guide.experience} experience</p>
                      <div className="flex items-center justify-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-current text-cultural-gold" />
                        <span className="font-semibold">{guide.rating}</span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-semibold">Languages:</span>
                        <p className="text-gray-600">{guide.languages.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Specialties:</span>
                        <p className="text-gray-600">{guide.specialties.join(', ')}</p>
                      </div>
                      <div>
                        <span className="font-semibold">Price:</span>
                        <p className="text-forest-primary font-semibold">{guide.price}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(`tel:${guide.phone}`)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        onClick={() => window.open(`mailto:${guide.email}`)}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Local Handicrafts & Marketplace</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {destination.handicrafts.map((item) => (
                  <Card key={item.id} className="p-4 hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                      <ShoppingBag className="h-12 w-12 text-gray-400" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">by {item.artisan}</p>
                    <p className="text-gray-700 text-sm mb-3">{item.description}</p>
                    <div className="flex justify-between items-center mb-3">
                      <Badge variant="outline">{item.category}</Badge>
                      <span className="font-bold text-forest-primary">{item.price}</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() => window.open(`tel:${item.contact}`)}
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Contact Artisan
                    </Button>
                  </Card>
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Upcoming Events</h2>
              {destination.events.length > 0 ? (
                <div className="space-y-4">
                  {destination.events.map((event) => (
                    <Card key={event.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{event.name}</h3>
                          <p className="text-gray-600 mb-2">{event.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{event.location}</span>
                            </div>
                            <Badge variant="outline">{event.type}</Badge>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${event.contact}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No upcoming events for this destination.</p>
                </div>
              )}
            </Card>
          </div>
        )}

        {activeTab === 'homestays' && (
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-2xl font-bold mb-4">Homestays & Accommodation</h2>
              {destination.homestays.length > 0 ? (
                <div className="space-y-4">
                  {destination.homestays.map((homestay) => (
                    <Card key={homestay.id} className="p-4 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-lg mb-2">{homestay.name}</h3>
                          <p className="text-gray-600 mb-2">{homestay.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              <span>{homestay.location}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-current text-cultural-gold" />
                              <span>{homestay.rating}</span>
                            </div>
                            <span className="font-bold text-forest-primary">{homestay.price}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {homestay.amenities.map((amenity, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {amenity}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(`tel:${homestay.contact}`)}
                        >
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No homestays available for this destination.</p>
                </div>
              )}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetail;
