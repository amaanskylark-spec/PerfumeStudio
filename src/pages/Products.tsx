import { useState, useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Search, Filter, Grid, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { TextEffectOne } from 'react-text-animate';
import allProducts from '@/data/products';
import { AuthContext } from '@/context/AuthContext';

gsap.registerPlugin(ScrollTrigger);

const Products = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const productsRef = useRef(null);
  const filtersRef = useRef(null);

  // Load products from localStorage and combine with default products
  useEffect(() => {
    try {
      // Get custom products from localStorage
      const storedProducts = localStorage.getItem('products');
      if (storedProducts) {
        setProducts([...allProducts, ...JSON.parse(storedProducts)]);
      } else {
        setProducts(allProducts);
      }
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to default products if there's an error
      setProducts(allProducts);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Filters animation
      gsap.fromTo(filtersRef.current,
        { opacity: 0, y: -30 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.8, 
          ease: 'power2.out',
          delay: 0.2 
        }
      );

      // Products animation
      gsap.fromTo('.product-item',
        { opacity: 0, y: 50, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );
    });

    return () => ctx.revert();
  }, []);

  const categories = ['All', 'Floral', 'Oriental', 'Fresh', 'Woody', 'Citrus'];

  useEffect(() => {
    let filtered = products; // Use the combined products array instead of allProducts

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort products
    filtered.sort((a, b) => {
      if (sortBy === 'id') {
        return Number(a.id) - Number(b.id);
      }
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, sortBy, products]); // Add products as a dependency

  const animateProductChange = () => {
    gsap.fromTo('.product-item',
      { opacity: 0, scale: 0.9 },
      { 
        opacity: 1, 
        scale: 1, 
        duration: 0.4, 
        stagger: 0.05,
        ease: 'power2.out' 
      }
    );
  };

  useEffect(() => {
    animateProductChange();
  }, [filteredProducts, viewMode]);

  // Render loading state or authentication check
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-2xl font-bold">Loading products...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="bg-card rounded-2xl shadow-xl p-8 text-center space-y-6">
          <h2 className="text-2xl font-bold text-foreground mb-2">Please login first to view products.</h2>
          <Button onClick={() => navigate('/login')} className="btn-elegant text-white font-semibold px-8 py-3 rounded-full">Login</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-4">
            <TextEffectOne text="Our Collection" className="inline bg-gradient-elegant bg-clip-text text-transparent" staggerDuration={0.08} initialDelay={0} animateOnce={false} />
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our complete range of premium fragrances crafted for every occasion
          </p>
        </div>

        {/* Filters */}
        <div ref={filtersRef} className="space-y-6 mb-12">
          {/* Search and View Toggle */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search fragrances..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-border focus:border-primary"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 rounded-full border border-border bg-background text-foreground focus:outline-none focus:border-primary"
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
                <option value="id">Sort by ID</option>
              </select>

              {/* View Mode */}
              <div className="flex items-center bg-accent rounded-full p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-full transition-colors duration-300 ${
                    viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'hover:bg-primary hover:text-primary-foreground'
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div ref={productsRef}>
          {filteredProducts.length > 0 ? (
            <div className={`grid gap-8 ${
              viewMode === 'grid' 
                ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                : 'grid-cols-1'
            }`}>
              {filteredProducts.map((product) => (
                <div key={product.id} className="product-item" onClick={() => navigate(`/products/${product.id}`)} style={{ cursor: 'pointer' }}>
                  <ProductCard {...product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="space-y-4">
                <Filter className="h-16 w-16 text-muted-foreground mx-auto" />
                <h3 className="text-2xl font-display font-semibold text-foreground">
                  No products found
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Try adjusting your search or filter criteria to find what you're looking for.
                </p>
                <Button
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('All');
                  }}
                  className="mt-4"
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Load More (if needed) */}
        {filteredProducts.length > 0 && (
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 py-4 rounded-full">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;