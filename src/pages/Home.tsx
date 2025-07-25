import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import HeroSection from '@/components/HeroSection';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, Shield, Truck, RefreshCw } from 'lucide-react';
import { TextEffectOne } from 'react-text-animate';
import { useNavigate } from 'react-router-dom';
import allProducts from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const featuredRef = useRef(null);
  const benefitsRef = useRef(null);
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Featured products animation
      gsap.fromTo('.featured-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: featuredRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Benefits animation
      gsap.fromTo('.benefit-item',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: benefitsRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    });

    return () => ctx.revert();
  }, []);

  // Load products from localStorage and combine with default products
  useEffect(() => {
    try {
      // Get deleted product IDs
      const deletedProductIds = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      
      // Filter out deleted default products
      const filteredDefaultProducts = allProducts.filter(product => 
        !deletedProductIds.includes(product.id)
      );
      
      // Get custom products from localStorage
      const storedProducts = localStorage.getItem('products');
      let availableProducts = [];
      
      if (storedProducts) {
        availableProducts = [...filteredDefaultProducts, ...JSON.parse(storedProducts)];
      } else {
        availableProducts = filteredDefaultProducts;
      }
      
      // Select up to 4 products for featured collection
      // If we have less than 4 products, show all of them
      const maxFeatured = Math.min(4, availableProducts.length);
      const featured = availableProducts.slice(0, maxFeatured);
      
      setFeaturedProducts(featured);
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to first 4 default products if there's an error
      setFeaturedProducts(allProducts.slice(0, 4));
    }
  }, []);

  const benefits = [
    {
      icon: Shield,
      title: 'Authentic Quality',
      description: 'Premium ingredients sourced globally for the finest fragrances'
    },
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Complimentary shipping on orders above ₹1999'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy for your peace of mind'
    },
    {
      icon: Sparkles,
      title: 'Expert Curation',
      description: 'Hand-picked selections by master perfumers'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Products Section */}
      <section ref={featuredRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mb-4">
              <TextEffectOne text="Featured Collection" className="inline text-foreground" staggerDuration={0.08} initialDelay={0} animateOnce={false} />
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover our most beloved fragrances, carefully crafted to elevate your senses
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product) => (
              <div key={product.id} className="featured-card">
                <ProductCard {...product} />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button 
              size="lg" 
              className="btn-elegant text-white font-semibold px-8 py-4 rounded-full group"
              onClick={() => navigate('/products')}
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section ref={benefitsRef} className="py-20 bg-gradient-to-br from-accent to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              <TextEffectOne text="Why Choose PerfumeStudio" className="inline text-foreground" staggerDuration={0.08} initialDelay={0} animateOnce={false} />
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience the difference with our commitment to quality and customer satisfaction
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="benefit-item text-center group">
                <div className="glass rounded-2xl p-8 h-full space-y-4 hover:shadow-elegant transition-all duration-500">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <benefit.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground">
                    {benefit.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
                <TextEffectOne text="Stay Updated with New Arrivals" className="inline text-white" staggerDuration={0.08} initialDelay={0} animateOnce={false} />
              </h2>
              <p className="text-xl text-white/80 max-w-2xl mx-auto">
                Be the first to discover our latest fragrances and exclusive offers
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-secondary"
              />
              <Button className="bg-secondary hover:bg-secondary-light text-secondary-foreground font-semibold px-6 py-3 rounded-full whitespace-nowrap">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;