import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { api } from '@/lib/api';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import { sendTicketEmail, type TicketData } from '@/services/ticketService';
import { 
  ArrowLeft, 
  Calendar, 
  Users, 
  MapPin, 
  Clock, 
  Star, 
  Phone, 
  Mail, 
  CreditCard,
  QrCode,
  Download,
  CheckCircle,
  Gift,
  Percent,
  Loader2,
  Home,
  User,
  Camera,
  ShoppingBag,
  Calendar as CalendarIcon,
  Music
} from 'lucide-react';

// Destination data with realistic Indian pricing
const destinations = [
  {
    id: 1,
    name: "Hundru Falls",
    location: "Ranchi",
    description: "Experience the thunderous beauty of Jharkhand's highest waterfall cascading 98 meters down rocky cliffs.",
    image: "/hundru-falls.jpg",
    basePrice: 800,
    duration: "Half Day",
    includes: ["Transportation", "Guide", "Entry Fees", "Refreshments"],
    rating: 4.8,
    category: "Nature"
  },
  {
    id: 2,
    name: "Betla National Park",
    location: "Latehar",
    description: "Discover diverse wildlife including elephants, tigers, and deer in their natural habitat.",
    image: "/betla-national-park.jpg",
    basePrice: 1200,
    duration: "Full Day",
    includes: ["Jeep Safari", "Guide", "Entry Fees", "Lunch"],
    rating: 4.6,
    category: "Wildlife"
  },
  {
    id: 3,
    name: "Netarhat Hills",
    location: "Latehar",
    description: "Enjoy the cool climate and panoramic views from Jharkhand's hill station.",
    image: "/netarhat-hills.jpg",
    basePrice: 1000,
    duration: "Full Day",
    includes: ["Transportation", "Guide", "Entry Fees", "Meals"],
    rating: 4.7,
    category: "Nature"
  },
  {
    id: 4,
    name: "Tribal Heritage Tour",
    location: "Across Jharkhand",
    description: "Immerse yourself in the rich cultural traditions and vibrant festivals of indigenous communities.",
    image: "/tribal-culture.jpg",
    basePrice: 1800,
    duration: "2-3 Days",
    includes: ["Accommodation", "Meals", "Cultural Programs", "Transportation"],
    rating: 4.9,
    category: "Culture"
  },
  {
    id: 5,
    name: "Patratu Valley",
    location: "Ramgarh",
    description: "Explore the scenic valley with its beautiful lake and surrounding hills.",
    image: "/patratu image.jpeg",
    basePrice: 900,
    duration: "Full Day",
    includes: ["Transportation", "Guide", "Entry Fees", "Lunch"],
    rating: 4.5,
    category: "Nature"
  },
  {
    id: 6,
    name: "Baba Dham Temple",
    location: "Deoghar",
    description: "Visit the sacred temple complex and experience spiritual tranquility.",
    image: "/Baba Dham ✨ Deoghar, Jharkhand.jpeg",
    basePrice: 600,
    duration: "Half Day",
    includes: ["Transportation", "Guide", "Entry Fees"],
    rating: 4.4,
    category: "Spiritual"
  }
];

// Guides data with realistic pricing
const guides = [
  {
    id: 1,
    name: "Rajesh Kumar",
    phone: "+91 98765 43210",
    email: "rajesh@jharkhandtourism.com",
    rating: 4.8,
    experience: "8 years",
    languages: ["Hindi", "English", "Santhali"],
    specialties: ["Nature Tours", "Wildlife", "Photography"],
    price: 200
  },
  {
    id: 2,
    name: "Sunita Devi",
    phone: "+91 98765 43219",
    email: "sunita@jharkhandtourism.com",
    rating: 4.9,
    experience: "12 years",
    languages: ["Hindi", "English", "Odia", "Bengali"],
    specialties: ["Cultural Tours", "Tribal Heritage", "Festivals"],
    price: 250
  },
  {
    id: 3,
    name: "Amit Verma",
    phone: "+91 98765 43216",
    email: "amit@jharkhandtourism.com",
    rating: 4.6,
    experience: "6 years",
    languages: ["Hindi", "English"],
    specialties: ["Adventure", "Trekking", "Wildlife"],
    price: 180
  }
];

// Accommodations data with realistic pricing
const accommodations = [
  {
    id: 1,
    name: "Jharkhand Tourism Hotel",
    location: "Ranchi",
    type: "Hotel",
    rating: 4.2,
    price: 800,
    amenities: ["WiFi", "AC", "Restaurant", "Parking"],
    description: "Comfortable stay in the heart of Ranchi"
  },
  {
    id: 2,
    name: "Nature's Retreat",
    location: "Netarhat",
    type: "Resort",
    rating: 4.5,
    price: 1200,
    amenities: ["WiFi", "AC", "Restaurant", "Parking", "Garden"],
    description: "Peaceful resort surrounded by nature"
  },
  {
    id: 3,
    name: "Tribal Heritage Lodge",
    location: "Latehar",
    type: "Lodge",
    rating: 4.3,
    price: 600,
    amenities: ["WiFi", "Restaurant", "Parking"],
    description: "Authentic tribal experience"
  }
];

// Marketplaces data
const marketplaces = [
  {
    id: 1,
    name: "Tribal Handicrafts Market",
    location: "Ranchi",
    description: "Traditional tribal crafts, jewelry, and artifacts",
    specialties: ["Wooden Crafts", "Bamboo Products", "Tribal Jewelry"],
    timing: "9:00 AM - 8:00 PM",
    rating: 4.4
  },
  {
    id: 2,
    name: "Local Food Market",
    location: "Deoghar",
    description: "Fresh local produce and traditional foods",
    specialties: ["Local Vegetables", "Traditional Snacks", "Spices"],
    timing: "6:00 AM - 10:00 PM",
    rating: 4.2
  },
  {
    id: 3,
    name: "Artisan Village",
    location: "Hazaribagh",
    description: "Handmade textiles and pottery",
    specialties: ["Textiles", "Pottery", "Paintings"],
    timing: "10:00 AM - 6:00 PM",
    rating: 4.6
  }
];

// Events data with realistic pricing
const events = [
  {
    id: 1,
    name: "Sarhul Festival",
    date: "2024-04-15",
    time: "6:00 AM - 10:00 PM",
    location: "Ranchi",
    description: "Traditional tribal spring festival",
    price: 0,
    type: "Cultural"
  },
  {
    id: 2,
    name: "Jharkhand Food Festival",
    date: "2024-04-20",
    time: "11:00 AM - 9:00 PM",
    location: "Jamshedpur",
    description: "Traditional Jharkhand cuisine showcase",
    price: 50,
    type: "Food"
  },
  {
    id: 3,
    name: "Nature Photography Workshop",
    date: "2024-04-25",
    time: "7:00 AM - 5:00 PM",
    location: "Betla National Park",
    description: "Learn wildlife photography techniques",
    price: 300,
    type: "Workshop"
  }
];

const BookingPage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState(destinations[0]);
  const [selectedGuide, setSelectedGuide] = useState(guides[0]);
  const [selectedAccommodation, setSelectedAccommodation] = useState(accommodations[0]);
  const [selectedMarketplace, setSelectedMarketplace] = useState(marketplaces[0]);
  const [selectedEvent, setSelectedEvent] = useState(events[0]);
  const [bookingData, setBookingData] = useState({
    date: '',
    travelers: 1,
    specialRequests: '',
    includeGuide: true,
    includeAccommodation: false,
    includeMarketplace: false,
    includeEvent: false
  });
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  const calculateTotal = () => {
    let total = selectedDestination.basePrice * bookingData.travelers;
    
    if (bookingData.includeGuide) {
      total += selectedGuide.price * bookingData.travelers;
    }
    
    if (bookingData.includeAccommodation) {
      total += selectedAccommodation.price * bookingData.travelers;
    }
    
    if (bookingData.includeEvent && selectedEvent.price > 0) {
      total += selectedEvent.price * bookingData.travelers;
    }

    // Apply user's existing discount from reward points
    const userDiscount = user?.discountPercent || 0;
    const userDiscountAmount = total * (userDiscount / 100);
    
    // Apply volume discounts
    let volumeDiscount = 0;
    let rewardPoints = 0;
    
    if (total > 2000) {
      volumeDiscount = total * 0.10; // 10% discount
      rewardPoints = 100;
    } else if (total > 1000) {
      volumeDiscount = total * 0.05; // 5% discount
      rewardPoints = 50;
    }

    const totalDiscount = userDiscountAmount + volumeDiscount;
    const finalTotal = total - totalDiscount;

    return {
      subtotal: total,
      userDiscount: userDiscountAmount,
      volumeDiscount,
      totalDiscount,
      rewardPoints,
      total: finalTotal
    };
  };

  const handleBooking = async () => {
    if (!user?.id) return;
    
    if (!bookingData.date) {
      alert('Please select a travel date first.');
      return;
    }
    
    setLoading(true);
    try {
      const pricing = calculateTotal();
      
      const bookingPayload = {
        userId: user.id,
        destination: selectedDestination.name,
        location: selectedDestination.location,
        date: bookingData.date,
        duration: selectedDestination.duration,
        price: pricing.total,
        travelers: bookingData.travelers,
        guide: bookingData.includeGuide ? {
          name: selectedGuide.name,
          phone: selectedGuide.phone,
          email: selectedGuide.email,
          rating: selectedGuide.rating
        } : null,
        description: selectedDestination.description,
        image: selectedDestination.image,
        includes: selectedDestination.includes,
        pickupTime: '08:00 AM',
        pickupLocation: 'Hotel/Railway Station',
        specialRequests: bookingData.specialRequests,
        additionalServices: {
          accommodation: bookingData.includeAccommodation ? selectedAccommodation : null,
          marketplace: bookingData.includeMarketplace ? selectedMarketplace : null,
          event: bookingData.includeEvent ? selectedEvent : null
        },
        pricing: pricing
      };

      const booking = await api.createBooking(bookingPayload);
      setBookingReference(booking.bookingReference);
      setPaymentStep(true);
      
    } catch (error) {
      console.error('Booking failed:', error);
      alert('Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      // Simulate WhatsApp Pay integration
      const whatsappPayUrl = `https://wa.me/919876543210?text=Payment for booking ${bookingReference} - Amount: ₹${calculateTotal().total}`;
      window.open(whatsappPayUrl, '_blank');
      
      // Simulate payment completion
      setTimeout(() => {
        setBookingComplete(true);
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
      setLoading(false);
    }
  };

  const generateQRData = () => {
    return JSON.stringify({
      bookingReference,
      destination: selectedDestination.name,
      date: bookingData.date,
      travelers: bookingData.travelers,
      total: calculateTotal().total,
      user: user?.email
    });
  };

  const handleRedeemPoints = async () => {
    if (!user?.id) return;
    
    try {
      const result = await api.redeemPoints(100);
      alert(`Successfully redeemed 100 points for 1% additional discount! Your total discount is now ${result.newDiscountPercent}%.`);
      
      // Refresh user data to show updated points and discount
      window.location.reload();
    } catch (error) {
      console.error('Points redemption failed:', error);
      alert('Failed to redeem points. Please try again.');
    }
  };

  const handleSendTicketEmail = async () => {
    try {
      const ticketData: TicketData = {
        bookingReference,
        destination: selectedDestination.name,
        date: bookingData.date,
        travelers: bookingData.travelers,
        total: calculateTotal().total,
        userEmail: user?.email || '',
        userName: user?.name || '',
        guide: bookingData.includeGuide ? {
          name: selectedGuide.name,
          phone: selectedGuide.phone,
          email: selectedGuide.email
        } : undefined,
        accommodation: bookingData.includeAccommodation ? {
          name: selectedAccommodation.name,
          location: selectedAccommodation.location,
          type: selectedAccommodation.type
        } : undefined,
        event: bookingData.includeEvent ? {
          name: selectedEvent.name,
          date: selectedEvent.date,
          time: selectedEvent.time,
          location: selectedEvent.location
        } : undefined,
        marketplace: bookingData.includeMarketplace ? {
          name: selectedMarketplace.name,
          location: selectedMarketplace.location,
          specialties: selectedMarketplace.specialties
        } : undefined
      };

      const success = await sendTicketEmail(ticketData);
      if (success) {
        alert('Ticket sent to your email successfully!');
      } else {
        alert('Failed to send email. Please try again.');
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      alert('Failed to send email. Please try again.');
    }
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  if (bookingComplete) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
              <p className="text-gray-600">Your booking has been successfully completed</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Booking Reference</h3>
                <p className="text-2xl font-bold text-green-600">{bookingReference}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Destination:</strong> {selectedDestination.name}</div>
                    <div><strong>Date:</strong> {bookingData.date}</div>
                    <div><strong>Travelers:</strong> {bookingData.travelers}</div>
                    <div><strong>Total Amount:</strong> ₹{calculateTotal().total}</div>
                  </div>
                </div>
                
                <div className="text-center">
                  <h3 className="font-semibold mb-2">QR Code</h3>
                  <QRCodeGenerator 
                    data={generateQRData()} 
                    size={150}
                    className="mx-auto"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleSendTicketEmail} className="flex-1">
                  <Mail className="h-4 w-4 mr-2" />
                  Send Ticket to Email
                </Button>
                <Button variant="outline" onClick={() => navigate('/bookings')}>
                  View All Bookings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const pricing = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold text-forest-primary">Book Your Jharkhand Experience</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="destinations" className="space-y-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="destinations" className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Destinations
                </TabsTrigger>
                <TabsTrigger value="guides" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Guides
                </TabsTrigger>
                <TabsTrigger value="accommodations" className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Stay
                </TabsTrigger>
                <TabsTrigger value="marketplaces" className="flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Markets
                </TabsTrigger>
                <TabsTrigger value="events" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Events
                </TabsTrigger>
                <TabsTrigger value="booking" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Book
                </TabsTrigger>
              </TabsList>

              {/* Destinations Tab */}
              <TabsContent value="destinations" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {destinations.map((destination) => (
                    <Card 
                      key={destination.id} 
                      className={`cursor-pointer transition-all ${
                        selectedDestination.id === destination.id 
                          ? 'ring-2 ring-forest-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedDestination(destination)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{destination.name}</CardTitle>
                            <p className="text-sm text-gray-600">{destination.location}</p>
                          </div>
                          <Badge variant="secondary">{destination.category}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{destination.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm">{destination.rating}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-forest-primary">₹{destination.basePrice}</div>
                            <div className="text-xs text-gray-500">{destination.duration}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Guides Tab */}
              <TabsContent value="guides" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {guides.map((guide) => (
                    <Card 
                      key={guide.id} 
                      className={`cursor-pointer transition-all ${
                        selectedGuide.id === guide.id 
                          ? 'ring-2 ring-forest-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedGuide(guide)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{guide.name}</CardTitle>
                            <p className="text-sm text-gray-600">{guide.experience} experience</p>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-forest-primary">₹{guide.price}</div>
                            <div className="text-xs text-gray-500">per person</div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm">{guide.rating}</span>
                          </div>
                          <div className="text-sm">
                            <strong>Languages:</strong> {guide.languages.join(', ')}
                          </div>
                          <div className="text-sm">
                            <strong>Specialties:</strong> {guide.specialties.join(', ')}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <Button size="sm" variant="outline" onClick={() => window.open(`tel:${guide.phone}`)}>
                              <Phone className="h-3 w-3 mr-1" />
                              Call
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => window.open(`mailto:${guide.email}`)}>
                              <Mail className="h-3 w-3 mr-1" />
                              Email
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Accommodations Tab */}
              <TabsContent value="accommodations" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {accommodations.map((accommodation) => (
                    <Card 
                      key={accommodation.id} 
                      className={`cursor-pointer transition-all ${
                        selectedAccommodation.id === accommodation.id 
                          ? 'ring-2 ring-forest-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedAccommodation(accommodation)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{accommodation.name}</CardTitle>
                            <p className="text-sm text-gray-600">{accommodation.location}</p>
                          </div>
                          <Badge variant="secondary">{accommodation.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{accommodation.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm">{accommodation.rating}</span>
                          </div>
                          <div className="text-sm">
                            <strong>Amenities:</strong> {accommodation.amenities.join(', ')}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-forest-primary">₹{accommodation.price}</div>
                            <div className="text-xs text-gray-500">per night</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Marketplaces Tab */}
              <TabsContent value="marketplaces" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {marketplaces.map((marketplace) => (
                    <Card 
                      key={marketplace.id} 
                      className={`cursor-pointer transition-all ${
                        selectedMarketplace.id === marketplace.id 
                          ? 'ring-2 ring-forest-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedMarketplace(marketplace)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg">{marketplace.name}</CardTitle>
                        <p className="text-sm text-gray-600">{marketplace.location}</p>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{marketplace.description}</p>
                        <div className="space-y-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            <span className="text-sm">{marketplace.rating}</span>
                          </div>
                          <div className="text-sm">
                            <strong>Specialties:</strong> {marketplace.specialties.join(', ')}
                          </div>
                          <div className="text-sm">
                            <strong>Timing:</strong> {marketplace.timing}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Events Tab */}
              <TabsContent value="events" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {events.map((event) => (
                    <Card 
                      key={event.id} 
                      className={`cursor-pointer transition-all ${
                        selectedEvent.id === event.id 
                          ? 'ring-2 ring-forest-primary shadow-lg' 
                          : 'hover:shadow-md'
                      }`}
                      onClick={() => setSelectedEvent(event)}
                    >
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg">{event.name}</CardTitle>
                            <p className="text-sm text-gray-600">{event.location}</p>
                          </div>
                          <Badge variant="secondary">{event.type}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                        <div className="space-y-2">
                          <div className="text-sm">
                            <strong>Date:</strong> {event.date}
                          </div>
                          <div className="text-sm">
                            <strong>Time:</strong> {event.time}
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-forest-primary">
                              {event.price === 0 ? 'Free' : `₹${event.price}`}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Booking Tab */}
              <TabsContent value="booking" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="date">Travel Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={bookingData.date}
                          onChange={(e) => setBookingData({...bookingData, date: e.target.value})}
                          min={new Date().toISOString().split('T')[0]}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="travelers">Number of Travelers</Label>
                        <Select
                          value={bookingData.travelers.toString()}
                          onValueChange={(value) => setBookingData({...bookingData, travelers: parseInt(value)})}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                              <SelectItem key={num} value={num.toString()}>
                                {num} {num === 1 ? 'Person' : 'People'}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="specialRequests">Special Requests</Label>
                      <Textarea
                        id="specialRequests"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                        placeholder="Any special requirements or requests..."
                        className="mt-1"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold">Additional Services</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={bookingData.includeGuide}
                            onChange={(e) => setBookingData({...bookingData, includeGuide: e.target.checked})}
                            className="rounded border-forest-primary/30 text-forest-primary focus:ring-forest-primary/20"
                          />
                          <span>Include Guide (₹{selectedGuide.price} per person)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={bookingData.includeAccommodation}
                            onChange={(e) => setBookingData({...bookingData, includeAccommodation: e.target.checked})}
                            className="rounded border-forest-primary/30 text-forest-primary focus:ring-forest-primary/20"
                          />
                          <span>Include Accommodation (₹{selectedAccommodation.price} per night)</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={bookingData.includeMarketplace}
                            onChange={(e) => setBookingData({...bookingData, includeMarketplace: e.target.checked})}
                            className="rounded border-forest-primary/30 text-forest-primary focus:ring-forest-primary/20"
                          />
                          <span>Visit Marketplace</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={bookingData.includeEvent}
                            onChange={(e) => setBookingData({...bookingData, includeEvent: e.target.checked})}
                            className="rounded border-forest-primary/30 text-forest-primary focus:ring-forest-primary/20"
                          />
                          <span>Attend Event ({selectedEvent.price === 0 ? 'Free' : `₹${selectedEvent.price}`})</span>
                        </label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Selected Services Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Selected Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-forest-primary">{selectedDestination.name}</h4>
                    <p className="text-sm text-gray-600">{selectedDestination.location}</p>
                    <p className="text-sm">₹{selectedDestination.basePrice} × {bookingData.travelers}</p>
                  </div>
                  
                  {bookingData.includeGuide && (
                    <div>
                      <h4 className="font-semibold text-forest-primary">Guide: {selectedGuide.name}</h4>
                      <p className="text-sm">₹{selectedGuide.price} × {bookingData.travelers}</p>
                    </div>
                  )}
                  
                  {bookingData.includeAccommodation && (
                    <div>
                      <h4 className="font-semibold text-forest-primary">Stay: {selectedAccommodation.name}</h4>
                      <p className="text-sm">₹{selectedAccommodation.price} × {bookingData.travelers}</p>
                    </div>
                  )}
                  
                  {bookingData.includeEvent && selectedEvent.price > 0 && (
                    <div>
                      <h4 className="font-semibold text-forest-primary">Event: {selectedEvent.name}</h4>
                      <p className="text-sm">₹{selectedEvent.price} × {bookingData.travelers}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Pricing Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pricing Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{pricing.subtotal}</span>
                  </div>
                  
                  {pricing.userDiscount > 0 && (
                    <div className="flex justify-between text-blue-600">
                      <span>Your Discount ({user?.discountPercent || 0}%):</span>
                      <span>-₹{Math.round(pricing.userDiscount)}</span>
                    </div>
                  )}
                  
                  {pricing.volumeDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Volume Discount ({pricing.volumeDiscount === pricing.subtotal * 0.10 ? '10%' : '5%'}):</span>
                      <span>-₹{Math.round(pricing.volumeDiscount)}</span>
                    </div>
                  )}
                  
                  {pricing.rewardPoints > 0 && (
                    <div className="flex justify-between text-purple-600">
                      <span>Reward Points Earned:</span>
                      <span>+{pricing.rewardPoints}</span>
                    </div>
                  )}
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span>₹{Math.round(pricing.total)}</span>
                  </div>
                  
                  {user?.points && user.points > 0 && (
                    <div className="text-sm text-gray-600 text-center space-y-2">
                      <div>You have {user.points} reward points</div>
                      {user.points >= 100 && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={handleRedeemPoints}
                          className="w-full"
                        >
                          Redeem 100 Points for 1% Discount
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                {!paymentStep ? (
                  <Button 
                    onClick={handleBooking}
                    disabled={loading}
                    className="w-full bg-forest-primary hover:bg-forest-dark"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing...
                      </>
                    ) : !bookingData.date ? (
                      'Please Select Travel Date'
                    ) : (
                      'Proceed to Payment'
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handlePayment}
                    disabled={loading}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4 mr-2" />
                        Pay with WhatsApp Pay
                      </>
                    )}
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/bookings')}
                  className="w-full"
                >
                  View My Bookings
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
