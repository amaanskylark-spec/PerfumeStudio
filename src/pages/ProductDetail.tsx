import { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowLeft, ShoppingBag, Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartContext } from '@/context/CartContext';
import { WishlistContext } from '@/context/WishlistContext';
import { AuthContext } from '@/context/AuthContext';
import allProducts from '@/data/products';

gsap.registerPlugin(ScrollTrigger);

// Default product data structure for new products
const defaultProduct = {
  rating: 4.0,
  description: 'A beautiful fragrance for any occasion.',
  notes: {
    top: ['Citrus', 'Bergamot'],
    heart: ['Floral', 'Spice'],
    base: ['Musk', 'Amber']
  },
  testimonials: [
    { name: 'Customer', text: 'Lovely scent that lasts all day!' },
    { name: 'Reviewer', text: 'One of my favorite fragrances.' }
  ]
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const imageRef = useRef(null);
  const pyramidRef = useRef(null);
  const testimonialsRef = useRef(null);
  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const isWishlisted = wishlistItems.some(item => item?.id === product?.id);
  const cartBtnRef = useRef(null);
  const wishBtnRef = useRef(null);

  useEffect(() => {
    // Get deleted product IDs
    const deletedProductIds = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
    
    // Filter out deleted default products
    let allAvailableProducts = allProducts.filter(product => 
      !deletedProductIds.includes(product.id)
    );
    
    // Add custom products from localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      allAvailableProducts = [...allAvailableProducts, ...JSON.parse(storedProducts)];
    }
    
    // Find the product by ID
    const foundProduct = allAvailableProducts.find(p => p.id === id);
    
    if (foundProduct) {
      // Merge with default product structure for any missing properties
      setProduct({
        ...defaultProduct,
        ...foundProduct
      });
    } else {
      // If product not found, navigate back to products page
      navigate('/products');
    }
    
    setLoading(false);
  }, [id, navigate]);
  
  useEffect(() => {
    if (!product || loading) return;
    
    // Perfume image entrance and floating
    gsap.fromTo(imageRef.current,
      { opacity: 0, y: 60, scale: 0.9 },
      { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
    );
    gsap.to(imageRef.current, {
      y: -15,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'power2.inOut'
    });

    // Note pyramid scroll animation
    gsap.fromTo(
      pyramidRef.current,
      { opacity: 0, y: 60 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: pyramidRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Testimonials reveal
    gsap.fromTo(
      testimonialsRef.current,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: testimonialsRef.current,
          start: 'top 85%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  }, [product, loading]);

  if (!user) {
    navigate('/login');
    return null;
  }
  
  if (loading || !product) {
    return <div className="min-h-screen pt-20 flex items-center justify-center">Loading...</div>;
  }

  const handleAddToCart = () => {
    if (user) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
      gsap.fromTo(cartBtnRef.current, { scale: 1 }, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: 'power2.inOut' });
    }
  };

  const handleToggleWishlist = () => {
    if (!user) return;
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({ id: product.id, name: product.name, price: product.price, image: product.image });
    }
    gsap.fromTo(wishBtnRef.current, { scale: 1 }, { scale: 1.2, duration: 0.2, yoyo: true, repeat: 1, ease: 'back.inOut' });
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-8" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Perfume Image */}
          <div className="relative">
            <img
              ref={imageRef}
              src={product.image}
              alt={product.name}
              className="w-full max-w-xs mx-auto rounded-3xl shadow-2xl object-contain bg-gradient-to-br from-accent to-muted p-4"
            />
            {/* Glow */}
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full scale-75 pointer-events-none" />
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <h1 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
              {product.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-foreground">
0₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-base text-muted-foreground line-through">
0₹{product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating)
                      ? 'fill-secondary text-secondary'
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
              <span className="text-sm text-muted-foreground ml-1">({product.rating})</span>
            </div>
            <p className="text-lg text-muted-foreground max-w-xl">
              {product.description}
            </p>
            {user && (
              <div className="flex gap-4 mt-4">
                <Button ref={cartBtnRef} size="lg" className="btn-elegant text-white font-semibold px-8 py-4 rounded-full" onClick={handleAddToCart}>
                  <ShoppingBag className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button ref={wishBtnRef} variant={isWishlisted ? 'default' : 'outline'} size="lg" className="rounded-full flex items-center gap-2" onClick={handleToggleWishlist}>
                  <Heart className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} />
                  {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Note Pyramid */}
        <section ref={pyramidRef} className="mt-20 mb-32 flex flex-col items-center">
          <h2 className="text-2xl font-display font-semibold text-foreground mb-10 text-center">
            Scent Note Pyramid
          </h2>
          <div className="flex flex-col items-center w-full max-w-xs gap-2">
            {/* Top Notes */}
            <div className="w-1/2 mx-auto bg-primary/10 rounded-t-lg py-2 px-2 text-center mb-1">
              <div className="font-bold text-primary">Top Notes</div>
              <div className="text-sm text-primary font-medium">{product.notes.top.join(', ')}</div>
            </div>
            {/* Heart Notes */}
            <div className="w-3/4 mx-auto bg-primary/20 rounded-lg py-2 px-2 text-center mb-1">
              <div className="font-bold text-primary">Heart Notes</div>
              <div className="text-sm text-primary font-medium">{product.notes.heart.join(', ')}</div>
            </div>
            {/* Base Notes */}
            <div className="w-full mx-auto bg-primary/30 rounded-b-lg py-2 px-2 text-center">
              <div className="font-bold text-primary">Base Notes</div>
              <div className="text-sm text-primary font-medium">{product.notes.base.join(', ')}</div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section ref={testimonialsRef} className="mt-12">
          <h2 className="text-2xl font-display font-semibold text-foreground mb-6 text-center">
            Customer Testimonials
          </h2>
          <div className="grid sm:grid-cols-2 gap-8">
            {product.testimonials.map((t, i) => (
              <div key={i} className="glass rounded-2xl p-6 shadow-lg">
                <p className="text-lg text-foreground mb-2">“{t.text}”</p>
                <div className="text-sm text-muted-foreground font-semibold">- {t.name}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default ProductDetail;