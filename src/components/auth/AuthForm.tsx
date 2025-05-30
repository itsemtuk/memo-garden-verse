
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Chrome } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{email?: string; password?: string; username?: string}>({});
  
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validateUsername = (username: string) => {
    return username.length >= 3;
  };

  const handleInputChange = (field: string, value: string) => {
    setError('');
    setFieldErrors(prev => ({ ...prev, [field]: undefined }));
    
    if (field === 'email') {
      setEmail(value);
      if (value && !validateEmail(value)) {
        setFieldErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      }
    } else if (field === 'password') {
      setPassword(value);
      if (value && !validatePassword(value)) {
        setFieldErrors(prev => ({ ...prev, password: 'Password must be at least 6 characters' }));
      }
    } else if (field === 'username') {
      setUsername(value);
      if (value && !validateUsername(value)) {
        setFieldErrors(prev => ({ ...prev, username: 'Username must be at least 3 characters' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Validate all fields
    const errors: {email?: string; password?: string; username?: string} = {};
    
    if (!validateEmail(email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!validatePassword(password)) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!isLogin && !validateUsername(username)) {
      errors.username = 'Username must be at least 3 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      if (isLogin) {
        await signIn(email, password);
        toast.success('Welcome back to MemoGarden! 🌱');
      } else {
        await signUp(email, password, username);
        toast.success('Welcome to MemoGarden! Check your email to verify your account. 🌱');
      }
      navigate('/app');
    } catch (error: any) {
      if (error.message?.includes('Invalid login credentials')) {
        setError('Invalid email or password. Please try again.');
      } else if (error.message?.includes('User already registered')) {
        setError('An account with this email already exists. Try signing in instead.');
      } else if (error.message?.includes('Email not confirmed')) {
        setError('Please check your email and click the confirmation link before signing in.');
      } else {
        setError(error.message || 'An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setSocialLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/app`
        }
      });
      
      if (error) throw error;
    } catch (error: any) {
      toast.error('Failed to sign in with Google. Please try again.');
      console.error('Google sign in error:', error);
    } finally {
      setSocialLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-garden-note via-garden-corkLight to-garden-image px-4 py-8">
      <div className="w-full max-w-md space-y-6 animate-fade-in">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-garden-text">
            🌱 <span className="text-garden-primary">Memo</span>Garden
          </h1>
          <p className="text-garden-textSecondary">
            {isLogin ? 'Welcome back to your digital garden' : 'Start cultivating your ideas today'}
          </p>
        </div>

        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl text-center text-garden-text">
              {isLogin ? 'Sign In' : 'Create Account'}
            </CardTitle>
            <CardDescription className="text-center text-garden-textSecondary">
              {isLogin 
                ? 'Enter your credentials to access your boards' 
                : 'Join thousands of creators organizing beautifully'
              }
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Social Login */}
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 text-garden-text border-garden-primary/20 hover:bg-garden-primary/5 hover:border-garden-primary/40 transition-all duration-200"
              onClick={handleGoogleSignIn}
              disabled={socialLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              {socialLoading ? 'Connecting...' : `Continue with Google`}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-garden-textSecondary">Or continue with email</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200 animate-fade-in">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field (Sign Up Only) */}
              {!isLogin && (
                <div className="space-y-1">
                  <label htmlFor="username" className="text-sm font-medium text-garden-text">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-garden-textSecondary" />
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="Choose a username"
                      className={`pl-10 h-11 border-garden-primary/20 focus:border-garden-primary transition-colors ${
                        fieldErrors.username ? 'border-red-300 focus:border-red-500' : ''
                      }`}
                      required={!isLogin}
                      autoFocus={!isLogin}
                    />
                  </div>
                  {fieldErrors.username && (
                    <p className="text-xs text-red-600">{fieldErrors.username}</p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-sm font-medium text-garden-text">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-garden-textSecondary" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    className={`pl-10 h-11 border-garden-primary/20 focus:border-garden-primary transition-colors ${
                      fieldErrors.email ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                    required
                    autoFocus={isLogin}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-xs text-red-600">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label htmlFor="password" className="text-sm font-medium text-garden-text">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-garden-textSecondary" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder={isLogin ? 'Enter your password' : 'Create a password (min. 6 characters)'}
                    className={`pl-10 pr-10 h-11 border-garden-primary/20 focus:border-garden-primary transition-colors ${
                      fieldErrors.password ? 'border-red-300 focus:border-red-500' : ''
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-garden-textSecondary hover:text-garden-text transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {fieldErrors.password && (
                  <p className="text-xs text-red-600">{fieldErrors.password}</p>
                )}
              </div>

              <Button 
                type="submit" 
                className="w-full h-11 bg-garden-primary hover:bg-garden-primary-dark text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {isLogin ? 'Signing In...' : 'Creating Account...'}
                  </div>
                ) : (
                  isLogin ? 'Sign In' : 'Create Account'
                )}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <div className="text-center">
              <Button
                variant="link"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFieldErrors({});
                  setEmail('');
                  setPassword('');
                  setUsername('');
                }}
                className="text-garden-primary hover:text-garden-primary-dark transition-colors"
              >
                {isLogin 
                  ? "Don't have an account? Create one here" 
                  : "Already have an account? Sign in instead"
                }
              </Button>
            </div>
            
            {isLogin && (
              <div className="text-center">
                <Button
                  variant="link"
                  className="text-sm text-garden-textSecondary hover:text-garden-text transition-colors"
                  onClick={() => toast.info('Password reset feature coming soon!')}
                >
                  Forgot your password?
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>

        <p className="text-center text-xs text-garden-textSecondary">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
