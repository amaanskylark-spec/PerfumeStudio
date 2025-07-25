import { useState, useRef, useEffect, useContext } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CartContext } from '@/context/CartContext';
import { WishlistContext } from '@/context/WishlistContext';
import { AuthContext } from '@/context/AuthContext';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  isNew?: boolean;
  onAddToCart?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  rating,
  category,
  isNew = false,
  onAddToCart,
  onToggleFavorite
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const cardRef = useRef(null);
  const imageRef = useRef(null);
  const overlayRef = useRef(null);

  const { addToCart } = useContext(CartContext);
  const { wishlistItems, addToWishlist, removeFromWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const isWishlisted = wishlistItems.some(item => item.id === id);

  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(overlayRef.current, { opacity: 0, y: 20 });
      
      // Scroll-based animation
      gsap.fromTo(cardRef.current, 
        { 
          opacity: 0, 
          y: 50, 
          scale: 0.9 
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: {
            trigger: cardRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    }, cardRef);

    return () => ctx.revert();
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    gsap.to(imageRef.current, {
      scale: 1.1,
      rotateY: 5,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(overlayRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });

    gsap.to(cardRef.current, {
      y: -8,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    
    gsap.to(imageRef.current, {
      scale: 1,
      rotateY: 0,
      duration: 0.4,
      ease: 'power2.out'
    });

    gsap.to(overlayRef.current, {
      opacity: 0,
      y: 20,
      duration: 0.3,
      ease: 'power2.out'
    });

    gsap.to(cardRef.current, {
      y: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
  };

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart({ id, name, price, image });
    gsap.fromTo(cardRef.current,
      { scale: 1 },
      { 
        scale: 0.95, 
        duration: 0.1, 
        yoyo: true, 
        repeat: 1,
        ease: 'power2.inOut'
      }
    );
    onAddToCart?.(id);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    if (isWishlisted) {
      removeFromWishlist(id);
    } else {
      addToWishlist({ id, name, price, image });
    }
    gsap.fromTo(cardRef.current?.querySelector('.heart-icon'),
      { scale: 1 },
      { 
        scale: 1.3, 
        duration: 0.2, 
        yoyo: true, 
        repeat: 1,
        ease: 'back.inOut'
      }
    );
    onToggleFavorite?.(id);
  };

  const handleViewProduct = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/products/${id}`);
  };

  return (
    <div
      ref={cardRef}
      className="group relative bg-card rounded-2xl overflow-hidden shadow-card hover:shadow-elegant transition-all duration-500 cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-accent to-muted">
        <img
          ref={imageRef}
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          style={{ willChange: 'opacity, transform' }}
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <Badge className="bg-secondary text-secondary-foreground font-semibold">
              New
            </Badge>
          )}
          {originalPrice && (
            <Badge variant="destructive" className="font-semibold">
              -{Math.round(((originalPrice - price) / originalPrice) * 100)}%
            </Badge>
          )}
        </div>

        {/* Wishlist Button (hidden, now in overlay) */}
        {/* Hover Overlay with 3 buttons */}
        <div
          ref={overlayRef}
          className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 gap-3"
          style={{ willChange: 'opacity, transform' }}
        >
          <div className="flex flex-col gap-3 w-full px-6">
            <Button
              onClick={user ? handleAddToCart : () => navigate('/login')}
              className="btn-elegant text-white font-semibold py-2 rounded-full w-full"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
            <Button
              onClick={user ? handleToggleWishlist : () => navigate('/login')}
              variant={isWishlisted ? 'default' : 'outline'}
              className="rounded-full flex items-center gap-2 w-full"
            >
              <Heart className={isWishlisted ? 'fill-red-500 text-red-500' : 'text-muted-foreground'} />
              {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
            </Button>
            <Button
              onClick={handleViewProduct}
              variant="secondary"
              className="rounded-full w-full"
            >
              View Product
            </Button>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground font-medium">{category}</p>
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-300">
            {name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating)
                  ? 'fill-secondary text-secondary'
                  : 'text-muted-foreground'
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">({rating})</span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">₹{price}</span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">₹{originalPrice}</span>
          )}
        </div>
      </div>

      {/* Glow Effect on Hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className="absolute inset-0 rounded-2xl shadow-glow" />
      </div>
    </div>
  );
};

export default ProductCard;