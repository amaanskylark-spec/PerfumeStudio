import { useState, useRef, useContext, useEffect } from 'react';
import { gsap } from 'gsap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, user } = useContext(AuthContext);
  const formRef = useRef(null);
  const titleRef = useRef(null);
  
  useEffect(() => {
    // Redirect if already logged in
    if (user === 'admin') {
      navigate('/admin/dashboard');
    }
    
    // GSAP animation for title
    gsap.from(titleRef.current, {
      y: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
    
    // GSAP animation for form
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out'
    });
  }, [user, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple admin authentication
    if (email === 'admin@scentscape.com' && password === 'admin123') {
      // Animation on successful login
      gsap.to(formRef.current, {
        y: -20,
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
          login('admin');
          navigate('/admin/dashboard');
        }
      });
    } else {
      setError('Invalid admin credentials');
      // Shake animation on error
      gsap.fromTo(formRef.current, 
        { x: 0 }, 
        { x: 10, yoyo: true, repeat: 5, duration: 0.1 }
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
      <div className="w-full max-w-md px-8 py-10">
        <h1 ref={titleRef} className="text-3xl font-bold text-center mb-8">Admin Portal</h1>
        <form ref={formRef} onSubmit={handleLogin} className="glass p-8 rounded-xl shadow-xl space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin@scentscape.com"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-border bg-background/80 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          
          {error && <div className="text-red-500 text-center">{error}</div>}
          
          <Button type="submit" className="w-full btn-elegant py-3 rounded-lg">
            Login to Admin Panel
          </Button>
          
          <div className="text-xs text-muted-foreground text-center mt-2">
            Demo: admin@scentscape.com / admin123
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;