import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  PlusCircle,
  ArrowLeft,
  Menu,
  X
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const AdminLayout = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);
  const isMobile = useIsMobile();
  
  // Check if user is admin, if not redirect to login
  useEffect(() => {
    if (!user || user !== 'admin') {
      navigate('/admin/login');
    }
  }, [user, navigate]);
  
  // Animation for sidebar
  useEffect(() => {
    if (!isMobile) {
      gsap.fromTo(sidebarRef.current,
        { x: -50, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }
      );
      
      gsap.fromTo(contentRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5, delay: 0.2, ease: 'power2.out' }
      );
    }
  }, [isMobile]);
  
  // Close sidebar on route change for mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [location.pathname, isMobile]);
  
  const toggleSidebar = () => {
    if (!sidebarOpen && isMobile) {
      // First set state to show sidebar
      setSidebarOpen(true);
      // Then animate it in
      gsap.fromTo(sidebarRef.current,
        { x: -300, opacity: 0, visibility: 'visible' },
        { x: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
    } else if (sidebarOpen && isMobile) {
      // First animate out
      gsap.to(sidebarRef.current, {
        x: -300,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          // Then update state after animation completes
          setSidebarOpen(false);
        }
      });
    }
  };



  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/admin/dashboard' },
    { icon: <PlusCircle size={20} />, label: 'Add Product', path: '/admin/products/add' },
    { icon: <Package size={20} />, label: 'Manage Products', path: '/admin/products' },
    { icon: <ShoppingCart size={20} />, label: 'Orders', path: '/admin/orders' },
    { icon: <Users size={20} />, label: 'Subscribers', path: '/admin/subscribers' },
    // Removed Settings item
  ];

  // Check if current page is dashboard
  const isDashboard = location.pathname === '/admin/dashboard';

  // Handle navigation with sidebar state management
  const handleNavigation = (path) => {
    // Only close sidebar if we're not already on the page we're navigating to
    if (location.pathname !== path && isMobile) {
      // Animate sidebar out before navigation
      gsap.to(sidebarRef.current, {
        x: -300,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          setSidebarOpen(false);
          navigate(path);
        }
      });
    } else {
      navigate(path);
    }
  };

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Mobile Header with Hamburger */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg shadow-sm p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PerfumeStudio Admin</h2>
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-accent text-foreground hover:text-primary transition-colors duration-300"
            aria-label="Toggle menu"
          >
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Sidebar - Responsive */}
      <div 
        ref={sidebarRef}
        className={`${isMobile ? 'fixed z-40 top-16 bottom-0 left-0' : 'sticky top-0 h-screen'} 
          ${sidebarOpen || !isMobile ? 'translate-x-0 visible' : '-translate-x-full invisible md:visible md:translate-x-0'} 
          w-64 bg-card shadow-lg p-4 flex flex-col transition-transform duration-300 ease-in-out overflow-hidden`}
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="mb-8 p-4 hidden md:block">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">PerfumeStudio</h2>
          <p className="text-sm text-muted-foreground">Admin Portal</p>
        </div>
        
        <nav className="flex-1 space-y-1 overflow-y-auto pb-4">
          {menuItems.map((item) => (
            <button 
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex w-full items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${location.pathname === item.path 
                ? 'bg-accent text-accent-foreground' 
                : 'text-foreground hover:bg-accent hover:text-accent-foreground'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        

      </div>
      
      {/* Overlay for mobile when sidebar is open */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 backdrop-blur-sm"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Main Content - Adjusted for mobile header */}
      <div 
        ref={contentRef} 
        className="flex-1 p-4 md:p-8 overflow-auto md:pt-8 pt-20 w-full"
      >
        {!isDashboard && (
          <div className="mb-4">
            <Button 
              variant="ghost" 
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => navigate('/admin/dashboard')}
            >
              <ArrowLeft size={16} />
              Back to Dashboard
            </Button>
          </div>
        )}
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;