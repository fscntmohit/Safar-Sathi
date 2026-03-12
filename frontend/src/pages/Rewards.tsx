import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Gift, 
  Star, 
  Trophy,
  Target,
  Award,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Crown,
  Sparkles
} from 'lucide-react';

const Rewards = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('earned');

  const [rewards, setRewards] = useState([
    {
      id: 1,
      title: 'Early Bird Bonus',
      description: 'Book any destination 30 days in advance',
      points: 100,
      status: 'Available',
      category: 'Booking',
      icon: <Clock className="h-6 w-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      id: 2,
      title: 'Loyalty Reward',
      description: 'Complete 5 trips with us',
      points: 250,
      status: 'Earned',
      category: 'Loyalty',
      icon: <Trophy className="h-6 w-6" />,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    },
    {
      id: 3,
      title: 'Nature Lover',
      description: 'Visit 3 nature destinations',
      points: 150,
      status: 'In Progress',
      category: 'Achievement',
      icon: <Star className="h-6 w-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      progress: 2,
      target: 3
    },
    {
      id: 4,
      title: 'Cultural Explorer',
      description: 'Experience 2 cultural tours',
      points: 200,
      status: 'Available',
      category: 'Cultural',
      icon: <Award className="h-6 w-6" />,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      id: 5,
      title: 'Photography Enthusiast',
      description: 'Share 5 photos from your trips',
      points: 75,
      status: 'Earned',
      category: 'Social',
      icon: <Sparkles className="h-6 w-6" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100'
    },
    {
      id: 6,
      title: 'Adventure Seeker',
      description: 'Complete 1 adventure activity',
      points: 120,
      status: 'Available',
      category: 'Adventure',
      icon: <Zap className="h-6 w-6" />,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ]);

  const [redeemableRewards] = useState([
    {
      id: 1,
      title: '10% Discount Voucher',
      description: 'Get 10% off on your next booking',
      points: 500,
      available: true
    },
    {
      id: 2,
      title: 'Free Guide Service',
      description: 'Complimentary guide for one day',
      points: 300,
      available: true
    },
    {
      id: 3,
      title: 'Upgrade to Premium',
      description: 'Upgrade your booking to premium package',
      points: 800,
      available: false
    },
    {
      id: 4,
      title: 'Free Photography Session',
      description: 'Professional photography during your trip',
      points: 400,
      available: true
    }
  ]);

  const earnedRewards = rewards.filter(r => r.status === 'Earned');
  const availableRewards = rewards.filter(r => r.status === 'Available');
  const inProgressRewards = rewards.filter(r => r.status === 'In Progress');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Earned':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'Available':
        return <Gift className="h-5 w-5 text-blue-600" />;
      case 'In Progress':
        return <Target className="h-5 w-5 text-orange-600" />;
      default:
        return <XCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Earned':
        return 'bg-green-100 text-green-800';
      case 'Available':
        return 'bg-blue-100 text-blue-800';
      case 'In Progress':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!isAuthenticated || !user) {
    navigate('/signin');
    return null;
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
          <h1 className="text-3xl font-bold text-forest-primary">Rewards & Points</h1>
        </div>

        {/* Points Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-forest-primary/10 rounded-full">
                  <Crown className="h-8 w-8 text-forest-primary" />
                </div>
              </div>
              <div className="text-3xl font-bold text-forest-primary mb-2">{user.points}</div>
              <div className="text-gray-600">Total Points</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-cultural-gold/10 rounded-full">
                  <Gift className="h-8 w-8 text-cultural-gold" />
                </div>
              </div>
              <div className="text-3xl font-bold text-cultural-gold mb-2">{earnedRewards.length}</div>
              <div className="text-gray-600">Rewards Earned</div>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-green-100 rounded-full">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <div className="text-3xl font-bold text-green-600 mb-2">{user.discountPercent}%</div>
              <div className="text-gray-600">Current Discount</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { id: 'earned', label: 'Earned Rewards', count: earnedRewards.length },
            { id: 'available', label: 'Available Rewards', count: availableRewards.length },
            { id: 'progress', label: 'In Progress', count: inProgressRewards.length },
            { id: 'redeem', label: 'Redeem Points', count: redeemableRewards.length }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-white text-forest-primary shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Rewards Content */}
        <div className="space-y-6">
          {activeTab === 'earned' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {earnedRewards.map((reward) => (
                <Card key={reward.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${reward.bgColor}`}>
                        <div className={reward.color}>{reward.icon}</div>
                      </div>
                      {getStatusIcon(reward.status)}
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(reward.status)}>
                        {reward.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-forest-primary">+{reward.points}</div>
                        <div className="text-xs text-gray-600">Points</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'available' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRewards.map((reward) => (
                <Card key={reward.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${reward.bgColor}`}>
                        <div className={reward.color}>{reward.icon}</div>
                      </div>
                      {getStatusIcon(reward.status)}
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge className={getStatusColor(reward.status)}>
                        {reward.status}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-forest-primary">+{reward.points}</div>
                        <div className="text-xs text-gray-600">Points</div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-forest-primary hover:bg-forest-dark">
                      Start Challenge
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressRewards.map((reward) => (
                <Card key={reward.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${reward.bgColor}`}>
                        <div className={reward.color}>{reward.icon}</div>
                      </div>
                      {getStatusIcon(reward.status)}
                    </div>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress</span>
                        <span>{reward.progress}/{reward.target}</span>
                      </div>
                      <Progress 
                        value={(reward.progress! / reward.target!) * 100} 
                        className="h-2"
                      />
                      <div className="flex items-center justify-between">
                        <Badge className={getStatusColor(reward.status)}>
                          {reward.status}
                        </Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-forest-primary">+{reward.points}</div>
                          <div className="text-xs text-gray-600">Points</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {activeTab === 'redeem' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {redeemableRewards.map((reward) => (
                <Card key={reward.id} className="shadow-lg hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{reward.title}</CardTitle>
                    <p className="text-sm text-gray-600">{reward.description}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-2xl font-bold text-forest-primary">{reward.points} pts</div>
                      <Badge className={reward.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {reward.available ? 'Available' : 'Not Available'}
                      </Badge>
                    </div>
                    <Button 
                      className="w-full" 
                      disabled={!reward.available || user.points < reward.points}
                      variant={reward.available && user.points >= reward.points ? 'default' : 'outline'}
                    >
                      {!reward.available ? 'Not Available' : 
                       user.points < reward.points ? 'Insufficient Points' : 'Redeem Now'}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {activeTab !== 'redeem' && (
          <Card className="mt-8 shadow-lg">
            <CardContent className="p-6 text-center">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Earn More Points</h3>
              <p className="text-gray-600 mb-4">
                Complete more activities and bookings to unlock additional rewards
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

export default Rewards;
