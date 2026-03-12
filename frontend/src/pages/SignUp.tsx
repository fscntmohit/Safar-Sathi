import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function SignUp() {
  const { signInWithToken } = useAuth();
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<'details' | 'code' | 'password'>('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      const response = await api.sendOtp(email);
      console.log('OTP Response:', response);
      setSuccess('OTP sent successfully! Check your email.');
      setStep('code');
    } catch (e: any) {
      console.error('OTP Error:', e);
      setError(e.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      console.log('Verifying OTP:', { email, code });
      // Just verify OTP and move to password step
      await api.verifyOtp(email, code);
      setSuccess('OTP verified! Please set your password.');
      setStep('password');
    } catch (e: any) {
      console.error('OTP Verification Error:', e);
      setError(e.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const completeSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError(null); setSuccess(null);
    try {
      const name = `${firstName} ${lastName}`.trim() || firstName || lastName || email.split('@')[0];
      console.log('Setting password:', { name, email, code, password: '***' });
      const { token, user } = await api.setPassword(email, code, password);
      console.log('Signup success:', { token, user });
      signInWithToken({ id: user.id, name: user.name, email: user.email, points: 100, discountPercent: 5 }, token);
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (e: any) {
      console.error('Signup Error:', e);
      setError(e.message || 'Failed to complete sign up');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Or{' '}
            <Link
              to="/signin"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              sign in to your existing account
            </Link>
          </p>
        </div>
        {error && <div className="p-3 rounded bg-red-50 text-red-700 text-sm">{error}</div>}
        {success && <div className="p-3 rounded bg-green-50 text-green-700 text-sm">{success}</div>}
        {step === 'details' ? (
          <form className="mt-8 space-y-6" onSubmit={sendOtp}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="firstName" className="sr-only">First name</label>
                  <input id="firstName" name="firstName" type="text" autoComplete="given-name" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="First name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="lastName" className="sr-only">Last name</label>
                  <input id="lastName" name="lastName" type="text" autoComplete="family-name" className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Last name" value={lastName} onChange={(e)=>setLastName(e.target.value)} />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="sr-only">Email address</label>
                <input id="email" name="email" type="email" autoComplete="email" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Email address" value={email} onChange={(e)=>setEmail(e.target.value)} />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        ) : step === 'code' ? (
          <form className="mt-8 space-y-6" onSubmit={verifyOtp}>
            <div className="rounded-md shadow-sm">
              <label htmlFor="code" className="sr-only">Verification code</label>
              <input id="code" name="code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Enter 6-digit code" value={code} onChange={(e)=>setCode(e.target.value)} />
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Verifying...' : 'Verify OTP'}</button>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={completeSignup}>
            <div className="space-y-4">
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input id="password" name="password" type="password" autoComplete="new-password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Create a password" value={password} onChange={(e)=>setPassword(e.target.value)} />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" required className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm" placeholder="Confirm password" />
              </div>
            </div>
            <button type="submit" disabled={loading} className="w-full py-2 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">{loading ? 'Creating Account...' : 'Create Account'}</button>
          </form>
        )}
        
        <div className="text-center">
          <Link
            to="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
