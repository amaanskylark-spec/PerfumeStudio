import { useEffect, useRef, useState, useContext } from 'react';
import { gsap } from 'gsap';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '@/context/AuthContext';
import allProducts from '@/data/products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Package, 
  ShoppingCart, 
  Users, 
  Eye, 
  PlusCircle, 
  Trash2, 
  Download, 
  Home,
  Edit,
  Search,
  Filter,
  ArrowUpDown,
  Camera,
  LogOut
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const cardsRef = useRef(null);
  const chartRef = useRef(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortColumn, setSortColumn] = useState('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    scentNotes: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  // Brand content state
  const [brandContent, setBrandContent] = useState({
    heroTitle: 'Discover Your Signature Scent',
    heroTagline: 'Handcrafted perfumes that tell your unique story',
    aboutTitle: 'Our Fragrance Journey',
    aboutStory: 'ScentScape was founded with a passion for creating unique, memorable fragrances that capture emotions and experiences.',
    founderName: 'Alexandra Chen',
    founderBio: 'With over 15 years of experience in perfumery, Alexandra has trained with master perfumers across France and Italy before establishing ScentScape.',
  });

  // Mock data
  const [stats, setStats] = useState([
    { title: 'Total Products', value: '0', icon: <Package className="h-8 w-8" />, color: 'bg-blue-500' },
    { title: 'Orders', value: '0', icon: <ShoppingCart className="h-8 w-8" />, color: 'bg-green-500' },
    { title: 'Subscribers', value: '0', icon: <Users className="h-8 w-8" />, color: 'bg-purple-500' },
    { title: 'Page Views', value: '0', icon: <Eye className="h-8 w-8" />, color: 'bg-amber-500' },
  ]);

  const chartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
  ];
  
  const pieData = [
    { name: 'Floral', value: 35 },
    { name: 'Oriental', value: 25 },
    { name: 'Woody', value: 20 },
    { name: 'Fresh', value: 15 },
    { name: 'Citrus', value: 5 },
  ];
  
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];
  
  // Products data
  const [products, setProducts] = useState([
    {
      id: '1',
      name: 'Midnight Orchid',
      price: 8900,
      category: 'Floral',
      image: 'https://images.unsplash.com/photo-1594736797933-d0b4b7d0b177?w=400&h=400&fit=crop',
      rating: 4.5,
      isNew: true
    },
    {
      id: '2',
      name: 'Amber Oud',
      price: 12500,
      category: 'Oriental',
      image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=400&h=400&fit=crop',
      rating: 4.8
    },
    {
      id: '3',
      name: 'Citrus Breeze',
      price: 7500,
      originalPrice: 9000,
      category: 'Citrus',
      image: 'https://images.unsplash.com/photo-1616604847462-ad9c15c4e8a3?w=400&h=400&fit=crop',
      rating: 4.2
    },
  ]);
  
  // Orders data
  const [orders, setOrders] = useState([
    {
      id: 'ORD-001',
      customer: 'John Smith',
      date: '2023-09-15T10:30:00Z',
      total: 89.00,
      status: 'delivered',
      items: 2
    },
    {
      id: 'ORD-002',
      customer: 'Emily Johnson',
      date: '2023-09-14T14:45:00Z',
      total: 125.00,
      status: 'shipped',
      items: 1
    },
    {
      id: 'ORD-003',
      customer: 'Michael Brown',
      date: '2023-09-13T09:15:00Z',
      total: 164.50,
      status: 'processing',
      items: 3
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      date: '2023-09-12T16:20:00Z',
      total: 75.00,
      status: 'pending',
      items: 1
    },
  ]);
  
  // Subscribers data
  const [subscribers, setSubscribers] = useState([
    {
      id: '1',
      email: 'john@example.com',
      name: 'John Smith',
      date: '2023-08-10T14:30:00Z',
    },
    {
      id: '2',
      email: 'sarah@example.com',
      name: 'Sarah Johnson',
      date: '2023-08-15T09:45:00Z',
    },
    {
      id: '3',
      email: 'michael@example.com',
      name: 'Michael Brown',
      date: '2023-08-20T16:15:00Z',
    },
  ]);

  // Function to update stats with real data
  const updateStats = () => {
    // Get real product count
    let productCount = 0;
    try {
      // Get deleted product IDs
      const deletedProductIds = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      
      // Filter out deleted default products
      const filteredDefaultProducts = allProducts.filter(product => 
        !deletedProductIds.includes(product.id)
      );
      
      // Get custom products from localStorage
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        productCount = filteredDefaultProducts.length + JSON.parse(storedProducts).length;
      } else {
        productCount = filteredDefaultProducts.length;
      }
    } catch (error) {
      console.error('Error loading products:', error);
      productCount = allProducts.length;
    }

    // Get subscriber count
    const subscriberCount = subscribers.length;

    // Get order count
    const orderCount = orders.length;

    // Update stats
    setStats([
      { title: 'Total Products', value: productCount.toString(), icon: <Package className="h-8 w-8" />, color: 'bg-blue-500' },
      { title: 'Orders', value: orderCount.toString(), icon: <ShoppingCart className="h-8 w-8" />, color: 'bg-green-500' },
      { title: 'Subscribers', value: subscriberCount.toString(), icon: <Users className="h-8 w-8" />, color: 'bg-purple-500' },
    ]);
  };

  useEffect(() => {
    // Load data from localStorage if available
    try {
      // Get deleted product IDs
      const deletedProductIds = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      
      // Filter out deleted default products
      const filteredDefaultProducts = allProducts.filter(product => 
        !deletedProductIds.includes(product.id)
      );
      
      // Get custom products from localStorage
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts([...filteredDefaultProducts, ...JSON.parse(storedProducts)]);
      } else {
setProducts(filteredDefaultProducts.map(product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
  image: product.image,
  rating: product.rating,
  isNew: product.isNew || false
})));
      }

      // Call updateStats to update the dashboard statistics
      updateStats();
      
    } catch (error) {
      console.error('Error loading products:', error);
setProducts(allProducts.map(product => ({
  id: product.id,
  name: product.name,
  price: product.price,
  category: product.category,
  image: product.image,
  rating: product.rating,
  isNew: product.isNew || false
})));
    }
    
    const savedBrandContent = localStorage.getItem('brandContent');
    if (savedBrandContent) {
      setBrandContent(JSON.parse(savedBrandContent));
    }
    
    // GSAP animations
    gsap.from(cardsRef.current.children, {
      y: 50,
      opacity: 0,
      duration: 0.6,
      stagger: 0.1,
      ease: "power3.out"
    });

    gsap.from(chartRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      delay: 0.4,
      ease: "power3.out"
    });
  }, []);
  
  // Handle tab change with animation
  const handleTabChange = (value: string) => {
    gsap.to("#tab-content", {
      opacity: 0,
      y: 20,
      duration: 0.3,
      onComplete: () => {
        setActiveTab(value);
        gsap.to("#tab-content", {
          opacity: 1,
          y: 0,
          duration: 0.3
        });
      }
    });
  };
  
  // Product form handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create a new product object
      const newProduct = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price) * 100, // Convert to cents
        category: formData.category,
        image: imagePreview || 'https://images.unsplash.com/photo-1594736797933-d0b4b7d0b177?w=400&h=400&fit=crop',
        rating: 0,
        isNew: true
      };
      
      // Update products state
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      
      // Save to localStorage
      localStorage.setItem('products', JSON.stringify(updatedProducts));
      
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        scentNotes: '',
      });
      setImage(null);
      setImagePreview(null);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };
  
  // Brand settings handlers
  const handleBrandInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBrandContent(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save to localStorage
    localStorage.setItem('brandContent', JSON.stringify(brandContent));
    
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };
  
  // Order status handlers
  const updateOrderStatus = (id: string, newStatus: string) => {
    const updatedOrders = orders.map(order => {
      if (order.id === id) {
        return { ...order, status: newStatus };
      }
      return order;
    });
    
    setOrders(updatedOrders);
  };
  
  // Subscriber handlers
  const handleDeleteSubscriber = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteSubscriber = () => {
    if (!deleteId) return;
    
    setSubscribers(subscribers.filter(sub => sub.id !== deleteId));
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const exportToCSV = () => {
    // Create CSV content
    const headers = ['Name', 'Email', 'Subscription Date'];
    const csvRows = [
      headers.join(','),
      ...subscribers.map(sub => {
        return [
          sub.name,
          sub.email,
          new Date(sub.date).toISOString().split('T')[0]
        ].join(',');
      })
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to take screenshots of sections
  const takeScreenshot = (sectionId: string, pageName: string) => {
    // In a real implementation, this would use html2canvas or a similar library
    // For now, we'll just navigate to the page
    navigate(`/admin/${pageName}`);
  };

  const [showLockout, setShowLockout] = useState(false);
  const handleLockout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">Complete management of your store</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={() => navigate('/admin/dashboard')} className="flex-1 sm:flex-initial">
            <Package className="mr-2 h-4 w-4" /> Admin Home
          </Button>
          <Button variant="outline" onClick={() => navigate('/')} className="flex-1 sm:flex-initial">
            <Home className="mr-2 h-4 w-4" /> User Home
          </Button>
          <Button variant="destructive" onClick={() => setShowLockout(true)} className="flex-1 sm:flex-initial">
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </div>
      {/* Logout Modal */}
      {showLockout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Logout</h3>
            <p className="text-muted-foreground mb-6">Are you sure you want to logout and end the admin session?</p>
            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => setShowLockout(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleLockout}>Logout</Button>
            </div>
          </div>
        </div>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={handleTabChange}>
        
        <div id="tab-content">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div ref={cardsRef} className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 px-[5px]">
              {stats.map((stat, index) => (
                <Card key={index} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <div className={`${stat.color} p-2 rounded-full text-white`}>
                      {stat.icon}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stat.value}</div>
                  </CardContent>
                  <div className="h-2 w-full bg-muted overflow-hidden">
                    <div className={`h-full ${stat.color}`} style={{ width: `${Math.random() * 50 + 50}%` }}></div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" ref={chartRef}>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Overview</CardTitle>
                  <CardDescription>Monthly sales performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="sales" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => takeScreenshot('sales-chart', 'dashboard')}>
                    <Camera className="h-4 w-4 mr-2" /> Screenshot
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/dashboard')}>View Details</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Product Categories</CardTitle>
                  <CardDescription>Distribution by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm" onClick={() => takeScreenshot('category-chart', 'dashboard')}>
                    <Camera className="h-4 w-4 mr-2" /> Screenshot
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/products')}>View Products</Button>
                </CardFooter>
              </Card>
            </div>
            
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates from your store</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <p className="font-medium">{order.customer}</p>
                        <p className="text-sm text-muted-foreground">Order #{order.id} - {new Date(order.date).toLocaleDateString()}</p>
                      </div>
                      <div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => handleTabChange('orders')}>
                  View All Orders
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Products Tab */}
          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Manage Products</CardTitle>
                    <CardDescription>View and edit your product catalog</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="search"
                        placeholder="Search products..."
                        className="pl-8 w-[200px] md:w-[300px]"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="icon" onClick={() => takeScreenshot('products-table', 'products')}>
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[80px]">Image</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                            setSortDirection(sortColumn === 'name' && sortDirection === 'asc' ? 'desc' : 'asc');
                            setSortColumn('name');
                          }}>
                            Name
                            {sortColumn === 'name' && (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="hidden md:table-cell">Category</TableHead>
                        <TableHead>
                          <div className="flex items-center gap-1 cursor-pointer" onClick={() => {
                            setSortDirection(sortColumn === 'price' && sortDirection === 'asc' ? 'desc' : 'asc');
                            setSortColumn('price');
                          }}>
                            Price
                            {sortColumn === 'price' && (
                              <ArrowUpDown className="h-4 w-4" />
                            )}
                          </div>
                        </TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.length > 0 ? (
                        products
                          .filter(product => 
                            product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            product.category.toLowerCase().includes(searchTerm.toLowerCase())
                          )
                          .sort((a, b) => {
                            if (sortColumn === 'name') {
                              return sortDirection === 'asc' 
                                ? a.name.localeCompare(b.name)
                                : b.name.localeCompare(a.name);
                            } else if (sortColumn === 'price') {
                              return sortDirection === 'asc' 
                                ? a.price - b.price
                                : b.price - a.price;
                            }
                            return 0;
                          })
                          .map((product) => (
                          <TableRow key={product.id}>
                            <TableCell>
                              <div className="h-12 w-12 rounded-md overflow-hidden">
                                <img 
                                  src={product.image} 
                                  alt={product.name} 
                                  className="h-full w-full object-cover" 
                                />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">
                              {product.name}
                              {product.isNew && (
                                <span className="ml-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded">
                                  New
                                </span>
                              )}
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="icon" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                            No products found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => handleTabChange('add-product')}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Product
                </Button>
                <Button variant="ghost" onClick={() => navigate('/admin/products')}>View All</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Order Management</CardTitle>
                    <CardDescription>Track and manage customer orders</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Orders</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" onClick={() => takeScreenshot('orders-table', 'orders')}>
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders
                        .filter(order => statusFilter === 'all' || order.status === statusFilter)
                        .map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                          <TableCell>${order.total.toFixed(2)}</TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                              order.status === 'shipped' ? 'bg-blue-100 text-blue-800' :
                              order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <Select 
                              defaultValue={order.status}
                              onValueChange={(value) => updateOrderStatus(order.id, value)}
                            >
                              <SelectTrigger className="w-[130px]">
                                <SelectValue placeholder="Update status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="processing">Processing</SelectItem>
                                <SelectItem value="shipped">Shipped</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/admin/orders')}>
                  View All Orders
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Subscribers Tab */}
          <TabsContent value="subscribers" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <CardTitle>Subscribers</CardTitle>
                    <CardDescription>Manage newsletter subscribers</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={exportToCSV}>
                      <Download className="mr-2 h-4 w-4" /> Export to CSV
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => takeScreenshot('subscribers-table', 'subscribers')}>
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Subscription Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subscribers.length > 0 ? (
                        subscribers.map((subscriber) => (
                          <TableRow key={subscriber.id} id={`subscriber-row-${subscriber.id}`}>
                            <TableCell className="font-medium">{subscriber.name}</TableCell>
                            <TableCell>{subscriber.email}</TableCell>
                            <TableCell>{new Date(subscriber.date).toLocaleDateString()}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteSubscriber(subscriber.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                            No subscribers found
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full" onClick={() => navigate('/admin/subscribers')}>
                  View All Subscribers
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Add Product Tab */}
          <TabsContent value="add-product" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Add New Product</CardTitle>
                <CardDescription>Create a new product for your store</CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    Product added successfully!
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Form */}
                  <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleProductSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name</Label>
                        <Input 
                          id="name" 
                          name="name" 
                          value={formData.name} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="price">Price ($)</Label>
                          <Input 
                            id="price" 
                            name="price" 
                            type="number" 
                            min="0.01" 
                            step="0.01" 
                            value={formData.price} 
                            onChange={handleInputChange} 
                            required 
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select 
                            value={formData.category} 
                            onValueChange={handleSelectChange}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Floral">Floral</SelectItem>
                              <SelectItem value="Oriental">Oriental</SelectItem>
                              <SelectItem value="Woody">Woody</SelectItem>
                              <SelectItem value="Fresh">Fresh</SelectItem>
                              <SelectItem value="Citrus">Citrus</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea 
                          id="description" 
                          name="description" 
                          rows={3} 
                          value={formData.description} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="scentNotes">Scent Notes</Label>
                        <Textarea 
                          id="scentNotes" 
                          name="scentNotes" 
                          rows={2} 
                          value={formData.scentNotes} 
                          onChange={handleInputChange} 
                          required 
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="image">Product Image</Label>
                        <Input 
                          id="image" 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageChange} 
                        />
                      </div>
                      
                      <Button 
                        type="submit" 
                        className="w-full" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? 'Adding Product...' : 'Add Product'}
                      </Button>
                    </form>
                  </div>
                  
                  {/* Preview */}
                  <div className="p-6 flex flex-col items-center justify-center border rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Preview</h3>
                    
                    {imagePreview ? (
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    ) : (
                      <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
                        <p className="text-muted-foreground">No image selected</p>
                      </div>
                    )}
                    
                    <div className="w-full">
                      <h4 className="font-medium">{formData.name || 'Product Name'}</h4>
                      <p className="text-primary font-bold">
                        {formData.price ? `$${formData.price}` : '$0.00'}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.category || 'Category'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => takeScreenshot('add-product-form', 'add-product')}>
                  <Camera className="h-4 w-4 mr-2" /> Screenshot
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/add-product')}>Full Page View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Brand Settings</CardTitle>
                <CardDescription>Customize your brand content and messaging</CardDescription>
              </CardHeader>
              <CardContent>
                {success && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                    Content updated successfully!
                  </div>
                )}
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Form */}
                  <div className="space-y-6">
                    <form onSubmit={handleBrandSubmit} className="space-y-6">
                      <Tabs defaultValue="home">
                        <TabsList className="mb-4">
                          <TabsTrigger value="home">Home Page</TabsTrigger>
                          <TabsTrigger value="about">About Page</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="home" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="heroTitle">Hero Title</Label>
                            <Input
                              id="heroTitle"
                              name="heroTitle"
                              value={brandContent.heroTitle}
                              onChange={handleBrandInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="heroTagline">Hero Tagline</Label>
                            <Input
                              id="heroTagline"
                              name="heroTagline"
                              value={brandContent.heroTagline}
                              onChange={handleBrandInputChange}
                            />
                          </div>
                        </TabsContent>
                        
                        <TabsContent value="about" className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="aboutTitle">About Page Title</Label>
                            <Input
                              id="aboutTitle"
                              name="aboutTitle"
                              value={brandContent.aboutTitle}
                              onChange={handleBrandInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="aboutStory">Brand Story</Label>
                            <Textarea
                              id="aboutStory"
                              name="aboutStory"
                              rows={4}
                              value={brandContent.aboutStory}
                              onChange={handleBrandInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="founderName">Founder Name</Label>
                            <Input
                              id="founderName"
                              name="founderName"
                              value={brandContent.founderName}
                              onChange={handleBrandInputChange}
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="founderBio">Founder Bio</Label>
                            <Textarea
                              id="founderBio"
                              name="founderBio"
                              rows={4}
                              value={brandContent.founderBio}
                              onChange={handleBrandInputChange}
                            />
                          </div>
                        </TabsContent>
                      </Tabs>
                      
                      <Button type="submit">
                        Save Changes
                      </Button>
                    </form>
                  </div>
                  
                  {/* Preview */}
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <h3 className="text-lg font-medium mb-4">Live Preview</h3>
                    
                    <Tabs defaultValue="home">
                      <TabsList className="mb-4">
                        <TabsTrigger value="home">Home Page</TabsTrigger>
                        <TabsTrigger value="about">About Page</TabsTrigger>
                      </TabsList>
                      
                      <TabsContent value="home" className="space-y-4">
                        <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-white">
                          <h2 className="text-2xl font-bold mb-2">{brandContent.heroTitle}</h2>
                          <p>{brandContent.heroTagline}</p>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="about" className="space-y-4">
                        <div className="p-6 bg-white rounded-lg">
                          <h2 className="text-2xl font-bold mb-4">{brandContent.aboutTitle}</h2>
                          <p className="mb-6">{brandContent.aboutStory}</p>
                          
                          <div className="border-t pt-4">
                            <h3 className="text-lg font-semibold mb-2">About {brandContent.founderName}</h3>
                            <p>{brandContent.founderBio}</p>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm" onClick={() => takeScreenshot('settings-form', 'settings')}>
                  <Camera className="h-4 w-4 mr-2" /> Screenshot
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate('/admin/settings')}>Full Page View</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to remove this item? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDeleteSubscriber}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;