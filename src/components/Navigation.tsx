import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, User, ShoppingBag, Heart, LogOut, LogIn } from 'lucide-react';
import { gsap } from 'gsap';
import { CartContext } from '@/context/CartContext';
import { WishlistContext } from '@/context/WishlistContext';
import { AuthContext } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useContext(CartContext);
  const { wishlistItems } = useContext(WishlistContext);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Animate navigation on route change
    gsap.fromTo('.nav-item', 
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    
    if (!isOpen) {
      gsap.fromTo('.mobile-menu',
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
      );
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/products', label: 'Products' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      isScrolled ? 'bg-background/95 backdrop-blur-lg shadow-card' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="nav-item">
            <h1 className="text-2xl lg:text-3xl font-display font-bold bg-gradient-elegant bg-clip-text text-transparent">
              PerfumeStudio
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`nav-item relative px-2 py-1 font-medium transition-colors duration-300 ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-foreground hover:text-primary'
                }`}
              >
                {link.label}
                {location.pathname === link.path && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-primary rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="nav-item p-2 text-foreground hover:text-primary transition-colors duration-300">
              <Search size={20} />
            </button>
            
            {/* Profile Icon with Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="nav-item p-2 text-foreground hover:text-primary transition-colors duration-300">
                  <User size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem onClick={handleLogin} className="cursor-pointer">
                    <LogIn className="mr-2 h-4 w-4" />
                    <span>Login</span>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            
            {user && (
              <>
                <button onClick={() => navigate('/wishlist')} className="nav-item p-2 text-foreground hover:text-primary transition-colors duration-300 relative">
                  <Heart size={20} />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                      {wishlistItems.length}
                    </span>
                  )}
                </button>
                <button onClick={() => navigate('/cart')} className="nav-item p-2 text-foreground hover:text-primary transition-colors duration-300 relative">
              <ShoppingBag size={20} />
                  {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                      {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
                  )}
            </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors duration-300"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="mobile-menu md:hidden mt-4 pb-4">
            <div className="glass rounded-lg p-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-md font-medium transition-colors duration-300 ${
                    location.pathname === link.path
                      ? 'text-primary bg-accent'
                      : 'text-foreground hover:text-primary hover:bg-accent'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              
              <div className="flex items-center justify-center space-x-6 pt-4 border-t border-border">
                <button className="p-2 text-foreground hover:text-primary transition-colors duration-300">
                  <Search size={20} />
                </button>
                
                {/* Mobile Profile Button */}
                {user ? (
                  <button onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }} className="p-2 text-foreground hover:text-primary transition-colors duration-300 flex items-center">
                    <LogOut size={20} />
                  </button>
                ) : (
                  <button onClick={() => {
                    handleLogin();
                    setIsOpen(false);
                  }} className="p-2 text-foreground hover:text-primary transition-colors duration-300 flex items-center">
                    <LogIn size={20} />
                  </button>
                )}
                
                {user && (
                  <>
                    <button onClick={() => {
                      navigate('/wishlist');
                      setIsOpen(false);
                    }} className="p-2 text-foreground hover:text-primary transition-colors duration-300 relative">
                      <Heart size={20} />
                      {wishlistItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                          {wishlistItems.length}
                        </span>
                      )}
                    </button>
                    <button onClick={() => {
                      navigate('/cart');
                      setIsOpen(false);
                    }} className="p-2 text-foreground hover:text-primary transition-colors duration-300 relative">
                      <ShoppingBag size={20} />
                      {cartItems.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-secondary text-secondary-foreground text-xs rounded-full flex items-center justify-center">
                          {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
                        </span>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;