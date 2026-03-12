import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { api, type Booking, type Reward } from '@/lib/api';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Star, 
  Gift, 
  Calendar,
  MapPin,
  Phone,
  Edit,
  Save,
  X,
  Loader2
} from 'lucide-react';

const Profile = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    bio: user?.bio || '',
    preferences: user?.preferences || {
      nature: false,
      culture: false,
      adventure: false,
      photography: false
    }
  });

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/signin');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        const [profile, userBookings, userRewards] = await Promise.all([
          api.getProfile(user.id),
          api.getBookings(user.id),
          api.getRewards(user.id)
        ]);

        setProfileData({
          name: profile.name || '',
          email: profile.email || '',
          phone: profile.phone || '',
          location: profile.location || '',
          bio: profile.bio || '',
          preferences: profile.preferences || {
            nature: false,
            culture: false,
            adventure: false,
            photography: false
          }
        });

        setBookings(userBookings);
        setRewards(userRewards);
      } catch (err) {
        console.error('Failed to fetch profile data:', err);
        setError('Failed to load profile data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [user?.id]);

  const handleSave = async () => {
    if (!user?.id) return;
    
    try {
      setSaving(true);
      setError(null);
      
      const updatedProfile = await api.updateProfile(user.id, {
        name: profileData.name,
        phone: profileData.phone,
        location: profileData.location,
        bio: profileData.bio,
        preferences: profileData.preferences
      });

      // Update the user context with new data
      updateUser(updatedProfile);
      
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile:', err);
      setError('Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      location: user?.location || '',
      bio: user?.bio || '',
      preferences: user?.preferences || {
        nature: false,
        culture: false,
        adventure: false,
        photography: false
      }
    });
    setIsEditing(false);
    setError(null);
  };

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

  if (!isAuthenticated || !user) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Loading your profile...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
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
          <h1 className="text-3xl font-bold text-forest-primary">My Profile</h1>
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="text-2xl bg-forest-primary/10 text-forest-primary">
                      {user.name?.[0]?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">{user.name}</CardTitle>
                <p className="text-gray-600">{user.email}</p>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant="secondary" className="bg-forest-primary/10 text-forest-primary">
                    {user.points} Points
                  </Badge>
                  <Badge variant="secondary" className="bg-cultural-gold/10 text-cultural-gold">
                    {user.discountPercent}% Discount
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-forest-primary">{user.points}</div>
                    <div className="text-sm text-gray-600">Total Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-cultural-gold">{user.discountPercent}%</div>
                    <div className="text-sm text-gray-600">Discount Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Personal Information
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                        className="flex items-center gap-2"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 bg-forest-primary hover:bg-forest-dark"
                      >
                        {saving ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {saving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="mt-1 bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                      disabled={!isEditing}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    disabled={!isEditing}
                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-forest-primary focus:border-transparent"
                    rows={3}
                    placeholder="Tell us about yourself..."
                  />
                </div>
                <div>
                  <Label>Travel Preferences</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {Object.entries(profileData.preferences).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setProfileData({
                            ...profileData,
                            preferences: {
                              ...profileData.preferences,
                              [key]: e.target.checked
                            }
                          })}
                          disabled={!isEditing}
                          className="rounded border-forest-primary/30 text-forest-primary focus:ring-forest-primary/20"
                        />
                        <span className="text-sm capitalize">{key}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* My Bookings */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  My Bookings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No bookings yet</p>
                      <Button 
                        onClick={() => navigate('/')}
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                      >
                        Explore Destinations
                      </Button>
                    </div>
                  ) : (
                    bookings.map((booking) => (
                      <div key={booking._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-forest-primary">{booking.destination}</h3>
                          <p className="text-sm text-gray-600">{formatDate(booking.date)} • {booking.duration}</p>
                          <Badge 
                            variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {booking.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">{formatPrice(booking.price)}</div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => navigate('/bookings')}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Rewards */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  Rewards & Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {rewards.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Gift className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <p>No rewards yet</p>
                      <p className="text-sm">Complete bookings to earn rewards!</p>
                    </div>
                  ) : (
                    rewards.map((reward) => (
                      <div key={reward._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold text-forest-primary">{reward.title}</h3>
                          <p className="text-sm text-gray-600">{reward.description}</p>
                          <Badge 
                            variant={reward.status === 'Available' ? 'default' : 'secondary'}
                            className="mt-1"
                          >
                            {reward.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-forest-primary">+{reward.points}</div>
                          <div className="text-sm text-gray-600">Points</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
