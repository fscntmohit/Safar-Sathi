export type ApiUser = { 
  id: string; 
  name: string; 
  email: string; 
  phone?: string; 
  location?: string; 
  bio?: string; 
  preferences?: any; 
  points?: number; 
  discountPercent?: number; 
};

export type Booking = {
  _id: string;
  destination: string;
  location: string;
  date: string;
  duration: string;
  status: string;
  price: number;
  travelers: number;
  guide: {
    name: string;
    phone: string;
    email: string;
    rating: number;
  };
  description: string;
  image: string;
  includes: string[];
  pickupTime: string;
  pickupLocation: string;
  specialRequests?: string;
  paymentStatus: string;
  bookingReference: string;
  createdAt: string;
  updatedAt: string;
};

export type Reward = {
  _id: string;
  title: string;
  description: string;
  points: number;
  status: string;
  category: string;
  earnedAt?: string;
  expiresAt?: string;
  bookingReference?: string;
  createdAt: string;
};

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  // Get token from localStorage
  const token = localStorage.getItem('auth:token');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options?.headers || {})
  };
  
  // Add authorization header if token exists
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_BASE}${path}`, {
    headers,
    ...options,
  });
  if (!res.ok) {
    let message = 'Request failed';
    try {
      const data = await res.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }
  return res.json();
}

export const api = {
  sendOtp(email: string) {
    return request<{ ok: boolean; message?: string }>(`/auth/send-otp`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  verifyOtp(email: string, code: string) {
    return request<{ token: string; user: ApiUser }>(`/auth/verify-otp`, {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
  },
  signup(name: string, email: string, code: string) {
    return request<{ token: string; user: ApiUser }>(`/auth/signup`, {
      method: 'POST',
      body: JSON.stringify({ name, email, code }),
    });
  },
  signIn(email: string, password: string) {
    return request<{ token: string; user: ApiUser }>(`/auth/signin`, {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  setPassword(email: string, code: string, password: string) {
    return request<{ token: string; user: ApiUser }>(`/auth/set-password`, {
      method: 'POST',
      body: JSON.stringify({ email, code, password }),
    });
  },
  checkUser(email: string) {
    return request<{ exists: boolean; user: ApiUser | null }>(`/auth/check-user/${email}`);
  },
  directSignIn(email: string) {
    return request<{ token: string; user: ApiUser }>(`/auth/direct-signin`, {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  // Profile endpoints
  getProfile(userId: string) {
    return request<ApiUser>(`/auth/profile/${userId}`);
  },
  updateProfile(userId: string, data: any) {
    return request<ApiUser>(`/auth/profile/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  // Booking endpoints
  getBookings(userId: string) {
    return request<Booking[]>(`/auth/bookings/${userId}`);
  },
  createBooking(bookingData: any) {
    return request<Booking>(`/auth/bookings`, {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  },
  updateBooking(bookingId: string, data: any) {
    return request<Booking>(`/auth/bookings/${bookingId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  cancelBooking(bookingId: string) {
    return request<{ message: string }>(`/auth/bookings/${bookingId}`, {
      method: 'DELETE',
    });
  },
  // Reward endpoints
  getRewards(userId: string) {
    return request<Reward[]>(`/auth/rewards/${userId}`);
  },
  createReward(rewardData: any) {
    return request<Reward>(`/auth/rewards`, {
      method: 'POST',
      body: JSON.stringify(rewardData),
    });
  },
  redeemPoints(pointsToRedeem: number) {
    return request<{
      message: string;
      pointsUsed: number;
      discountIncrease: number;
      newDiscountPercent: number;
      remainingPoints: number;
      reward: Reward;
    }>(`/auth/rewards/redeem`, {
      method: 'POST',
      body: JSON.stringify({ pointsToRedeem }),
    });
  },
};



