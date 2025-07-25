import { useContext } from 'react';
import { WishlistContext } from '@/context/WishlistContext';
import { AuthContext } from '@/context/AuthContext';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useContext(WishlistContext);
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  if (!user) {
    navigate('/login');
    return null;
  }
  return (
    <div className="min-h-screen pt-24 max-w-3xl mx-auto px-4">
      <h1 className="text-3xl font-display font-bold mb-8 text-foreground">Your Wishlist</h1>
      {wishlistItems.length === 0 ? (
        <div className="text-muted-foreground text-lg">Your wishlist is empty.</div>
      ) : (
        <ul className="space-y-6">
          {wishlistItems.map(item => (
            <li key={item.id} className="flex items-center gap-4 bg-card rounded-xl p-4 shadow-card">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
              <div className="flex-1">
                <div className="font-semibold text-lg text-foreground">{item.name}</div>
                <div className="text-muted-foreground">₹{item.price}</div>
              </div>
              <Button variant="outline" onClick={() => { addToCart({ id: item.id, name: item.name, price: item.price, image: item.image }); removeFromWishlist(item.id); }}>
                Add to Cart
              </Button>
              <Button variant="destructive" onClick={() => removeFromWishlist(item.id)}>Remove</Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Wishlist; 