import { useState, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const formRef = useRef(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[username]) {
      setError('Username already exists');
      gsap.fromTo(formRef.current, { x: 0 }, { x: -10, yoyo: true, repeat: 3, duration: 0.1 });
      return;
    }
    users[username] = password;
    localStorage.setItem('users', JSON.stringify(users));
    login(username);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <form ref={formRef} onSubmit={handleRegister} className="glass p-8 rounded-2xl shadow-xl w-full max-w-md space-y-6">
        <h2 className="text-3xl font-display font-bold text-center text-foreground mb-4">Register</h2>
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
        <Button type="submit" className="w-full btn-elegant text-white font-semibold py-3 rounded-full">Register</Button>
        <div className="text-center text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Login</Link>
        </div>
      </form>
    </div>
  );
};

export default Register; 