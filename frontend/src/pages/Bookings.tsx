import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api, type Booking } from '@/lib/api';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Clock, 
  Users,
  Phone,
  Mail,
  Download,
  Star,
  Filter,
  Search,
  Loader2
} from 'lucide-react';

const Bookings = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const userBookings = await api.getBookings(user.id);
        setBookings(userBookings);
      } catch (err) {
        console.error('Failed to fetch bookings:', err);
        setError('Failed to load bookings. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user?.id]);

  const filteredBookings = bookings.filter(booking => {
    const matchesFilter = filter === 'all' || booking.status.toLowerCase() === filter;
    const matchesSearch = booking.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-blue-100 text-blue-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || !user) {
    navigate('/signin');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading your bookings...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
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
          <h1 className="text-3xl font-bold text-forest-primary">My Bookings</h1>
        </div>

        {error && (
          <Card className="mb-6 shadow-lg border-red-200">
            <CardContent className="p-4">
              <div className="text-red-600">{error}</div>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm" 
                className="mt-2"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Filters and Search */}
        <Card className="mb-6 shadow-lg">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-primary focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                {['all', 'confirmed', 'pending', 'completed', 'cancelled'].map((status) => (
                  <Button
                    key={status}
                    variant={filter === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilter(status)}
                    className={filter === status ? 'bg-forest-primary hover:bg-forest-dark' : ''}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-6">
          {filteredBookings.map((booking) => (
            <Card key={booking._id} className="shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-xl text-forest-primary">{booking.destination}</CardTitle>
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {booking.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(booking.date)}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {booking.duration}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {booking.travelers} travelers
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-forest-primary">{formatPrice(booking.price)}</div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Star className="h-4 w-4 fill-current text-cultural-gold" />
                      {booking.guide.rating}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
                    <p className="text-gray-600 text-sm mb-4">{booking.description}</p>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">Includes</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {booking.includes.map((item, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-forest-primary rounded-full"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Guide Information</h4>
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="font-medium text-forest-primary">{booking.guide.name}</div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${booking.guide.phone}`} className="hover:text-forest-primary">
                          {booking.guide.phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${booking.guide.email}`} className="hover:text-forest-primary">
                          {booking.guide.email}
                        </a>
                      </div>
                    </div>
                    
                    <h4 className="font-semibold text-gray-900 mb-2">Pickup Details</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div><strong>Time:</strong> {booking.pickupTime}</div>
                      <div><strong>Location:</strong> {booking.pickupLocation}</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open(`tel:${booking.guide.phone}`)}
                  >
                    <Phone className="h-4 w-4" />
                    Call Guide
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => window.open(`mailto:${booking.guide.email}`)}
                  >
                    <Mail className="h-4 w-4" />
                    Email Guide
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredBookings.length === 0 && (
          <Card className="shadow-lg">
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm ? 'Try adjusting your search terms' : 'You haven\'t made any bookings yet'}
              </p>
              <Button 
                onClick={() => navigate('/')}
                className="bg-forest-primary hover:bg-forest-dark"
              >
                Explore Destinations
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Bookings;
