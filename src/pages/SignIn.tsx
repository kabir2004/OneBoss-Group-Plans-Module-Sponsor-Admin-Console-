import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface SignInProps {
  onSignIn: (userId: string, password: string) => void;
}

export default function SignIn({ onSignIn }: SignInProps) {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [view, setView] = useState<'signin' | 'forgotId' | 'forgotPassword'>('signin');

  useEffect(() => {
    setEmail('');
  }, [view]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userId && password) {
      onSignIn(userId, password);
    }
  };

  const handleForgotIdSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: integrate with backend flow
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // TODO: integrate with backend flow
    }
  };

  const renderContent = () => {
    switch (view) {
      case 'forgotId':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">Recover User ID</CardTitle>
              <CardDescription>We'll send your User ID to your registered email address</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotIdSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="recover-email">Email Address</Label>
                  <Input
                    id="recover-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send User ID
                </Button>
              </form>
              <div className="mt-6 space-y-3 text-sm text-center text-muted-foreground">
                <Button variant="link" className="p-0 text-primary" onClick={() => setView('signin')}>
                  Back to Sign In
                </Button>
                <div className="space-y-1">
                  <div>
                    Remember your User ID?{' '}
                    <Button variant="link" className="p-0 text-primary" onClick={() => setView('signin')}>
                      Sign in here
                    </Button>
                  </div>
                  <div>
                    Need to reset your password?{' '}
                    <Button variant="link" className="p-0 text-primary" onClick={() => setView('forgotPassword')}>
                      Reset your password
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </>
        );
      case 'forgotPassword':
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">Forgot Password</CardTitle>
              <CardDescription>We'll send you a secure link to reset your password</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email Address</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Send Reset Link
                </Button>
              </form>
              <div className="mt-6 space-y-3 text-sm text-center text-muted-foreground">
                <Button variant="link" className="p-0 text-primary" onClick={() => setView('signin')}>
                  Back to Sign In
                </Button>
                <div>
                  Remember your password?{' '}
                  <Button variant="link" className="p-0 text-primary" onClick={() => setView('signin')}>
                    Sign in here
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        );
      default:
        return (
          <>
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl font-semibold">Sign In</CardTitle>
              <CardDescription>Enter your user ID and password to continue</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="userId">User ID</Label>
                  <Input
                    id="userId"
                    type="text"
                    placeholder="Enter your user ID"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
              <div className="mt-6 space-y-2 text-sm text-center">
                <div>
                  <Button
                    variant="link"
                    className="p-0 text-primary"
                    onClick={() => setView('forgotPassword')}
                  >
                    Forgot your password?
                  </Button>
                </div>
                <div>
                  <Button variant="link" className="p-0 text-primary" onClick={() => setView('forgotId')}>
                    Forgot your ID?
                  </Button>
                </div>
                <div className="pt-2 text-muted-foreground">
                  Need help? Contact your system administrator
                </div>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md space-y-4">
        <CardHeader className="text-center pb-0">
          <CardTitle className="text-3xl font-bold tracking-tight">OneBoss</CardTitle>
        </CardHeader>
        {renderContent()}
      </Card>
    </div>
  );
}

