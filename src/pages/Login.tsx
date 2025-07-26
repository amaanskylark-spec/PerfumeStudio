import { useState, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const formRef = useRef(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Check for admin credentials first
    if (username === 'admin' && password === 'admin123') {
      login(username); // This will set isAdmin to true in AuthContext
      navigate('/admin/dashboard');
      return;
    }
    
    // Check localStorage for regular user
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if ((users[username] && users[username] === password) || (username === 'demo' && password === 'demo123')) {
      login(username);
      navigate('/');
    } else {
      setError('Invalid credentials');
      gsap.fromTo(formRef.current, { x: 0 }, { x: -10, yoyo: true, repeat: 3, duration: 0.1 });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <form ref={formRef} onSubmit={handleLogin} className="glass p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full px-4 py-3 rounded-full border border-border bg-background/80 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full px-4 py-3 rounded-full border border-border bg-background/80 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary mb-2"
        />
        {error && <div className="text-red-500 text-center">{error}</div>}
        <Button type="submit" className="w-full btn-elegant text-white font-semibold py-3 rounded-full">Login</Button>
        <div className="text-xs text-muted-foreground text-center mt-2 space-y-1">
          <div>User Demo: demo / demo123</div>
          <div>Admin Demo: admin / admin123</div>
        </div>
      </form>
    </div>
  );
};

export default Login;