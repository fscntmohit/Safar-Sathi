import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Calendar, Users, MapPin, Clock } from 'lucide-react';

interface BookingFormProps {
  destination: {
    name: string;
    location: string;
    description: string;
    image: string;
    price: number;
    duration: string;
    includes: string[];
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ destination, onSuccess, onCancel }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date: '',
    travelers: 1,
    specialRequests: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;

    try {
      setLoading(true);
      setError(null);

      await api.createBooking({
        userId: user.id,
        destination: destination.name,
        location: destination.location,
        date: formData.date,
        duration: destination.duration,
        price: destination.price * formData.travelers,
        travelers: formData.travelers,
        description: destination.description,
        image: destination.image,
        includes: destination.includes,
        pickupTime: '08:00 AM',
        pickupLocation: 'Hotel/Railway Station',
        specialRequests: formData.specialRequests
      });

      onSuccess?.();
    } catch (err) {
      console.error('Failed to create booking:', err);
      setError('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Book {destination.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Travel Date</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
                min={new Date().toISOString().split('T')[0]}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="travelers">Number of Travelers</Label>
              <Select
                value={formData.travelers.toString()}
                onValueChange={(value) => setFormData({ ...formData, travelers: parseInt(value) })}
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
            <Label htmlFor="specialRequests">Special Requests (Optional)</Label>
            <Textarea
              id="specialRequests"
              value={formData.specialRequests}
              onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
              placeholder="Any special requirements or requests..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Booking Summary</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Destination:</span>
                <span className="font-medium">{destination.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">{destination.location}</span>
              </div>
              <div className="flex justify-between">
                <span>Duration:</span>
                <span className="font-medium">{destination.duration}</span>
              </div>
              <div className="flex justify-between">
                <span>Travelers:</span>
                <span className="font-medium">{formData.travelers}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per person:</span>
                <span className="font-medium">₹{destination.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t pt-2 font-semibold">
                <span>Total Price:</span>
                <span className="text-forest-primary">₹{(destination.price * formData.travelers).toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={loading || !formData.date}
              className="flex-1 bg-forest-primary hover:bg-forest-dark"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating Booking...
                </>
              ) : (
                'Confirm Booking'
              )}
            </Button>
            {onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={loading}
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;



