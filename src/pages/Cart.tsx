import { useContext, useState, useEffect } from 'react';
import { CartContext } from '@/context/CartContext';
import { AuthContext } from '@/context/AuthContext';
import { OrderContext } from '@/context/OrderContext'; // Add this import
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import allProducts from '@/data/products';

const Cart = () => {
  const { cartItems, removeFromCart, clearCart, addToCart, increaseQuantity, decreaseQuantity } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const { addOrder } = useContext(OrderContext); // Add this line
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Wait for auth to be checked before redirecting
    const timer = setTimeout(() => {
      setIsLoading(false);
      if (!user) {
        navigate('/login');
      }
    }, 300); // Short delay to allow auth context to load
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (isLoading) {
    return <div className="min-h-screen pt-24 flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }
  
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = Math.round(total * 0.18);
  const grandTotal = total + gst;
  
  // Get random products for suggestions
  const getRandomProducts = () => {
    // Shuffle all products and filter out those already in cart
    const cartIds = cartItems.map(i => i.id);
    const availableProducts = allProducts.filter(p => !cartIds.includes(p.id));
    
    // If all products are in cart or no products available, return random products from all products
    if (availableProducts.length === 0) {
      return [...allProducts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    }
    
    // Otherwise return random products from available products
    return [...availableProducts]
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
  };

  const suggestions = getRandomProducts();

  // Handle checkout
  const handleCheckout = () => {
    // Add order to admin orders
    addOrder(cartItems, user, 'customer@example.com');
    
    // Show confirmation modal
    setShowModal(true);
    
    // Clear the cart
    clearCart();
  };

  return (
    <div className="min-h-screen pt-24 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-display font-bold mb-8 text-foreground">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 flex flex-col gap-6 w-full">
          {cartItems.length === 0 ? (
            <div className="text-muted-foreground text-lg">Your cart is empty.</div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex flex-row items-center bg-card rounded-2xl p-5 shadow-card w-full max-w-2xl">
                <div className="flex flex-col items-center mr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Button size="icon" variant="outline" onClick={() => decreaseQuantity(item.id)} disabled={item.quantity === 1}>-</Button>
                    <span className="font-semibold text-lg text-foreground">{item.quantity}</span>
                    <Button size="icon" variant="outline" onClick={() => increaseQuantity(item.id)}>+</Button>
                  </div>
                  <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-lg text-foreground truncate">{item.name}</div>
                  <div className="text-muted-foreground text-base">₹{item.price} × {item.quantity} = <span className="text-foreground font-bold">₹{item.price * item.quantity}</span></div>
                </div>
                <Button size="lg" variant="destructive" className="ml-6" onClick={() => removeFromCart(item.id)}>Remove</Button>
              </div>
            ))
          )}
        </div>
        {/* Summary Card */}
        <div className="bg-card rounded-2xl shadow-xl p-8 flex flex-col gap-6 h-fit sticky top-32">
          <h2 className="text-xl font-bold text-foreground mb-2">Order Summary</h2>
          <div className="flex justify-between text-base">
            <span>Subtotal</span>
            <span>₹{total}</span>
          </div>
          <div className="flex justify-between text-base">
            <span>GST (18%)</span>
            <span>₹{gst}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-border pt-4">
            <span>Total</span>
            <span>₹{grandTotal}</span>
          </div>
          <Button 
            size="lg" 
            className="w-full btn-elegant text-white font-semibold py-3 rounded-full mt-4" 
            onClick={handleCheckout} // Changed to handleCheckout
            disabled={cartItems.length === 0}
          >
            Checkout
          </Button>
          <Button variant="outline" className="w-full mt-2" onClick={clearCart} disabled={cartItems.length === 0}>Clear Cart</Button>
        </div>
      </div>
      {/* Checkout Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-card rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
            <h3 className="text-2xl font-bold mb-4 text-foreground">Order Placed!</h3>
            <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order has been placed successfully.</p>
            <Button className="btn-elegant w-full" onClick={() => setShowModal(false)}>Close</Button>
          </div>
        </div>
      )}
      {/* Always show product suggestions */}
      <div className="mt-12 p-8 bg-background rounded-2xl shadow-xl text-center flex flex-col items-center">
        <div className="font-semibold text-2xl mb-8 text-foreground">You may also like</div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 w-full">
          {suggestions.map(suggested => (
            <div key={suggested.id} className="flex flex-col items-center bg-card rounded-xl shadow-card p-6 transition-transform duration-300 hover:-translate-y-2 hover:shadow-glow">
              <img src={suggested.image} alt={suggested.name} className="w-24 h-24 object-cover rounded-lg mb-4 shadow-md" />
              <div className="font-bold text-lg text-foreground text-center mb-1">{suggested.name}</div>
              <div className="text-muted-foreground mb-3 text-base">₹{suggested.price}</div>
              <Button size="lg" className="w-full btn-elegant text-white font-semibold py-2 rounded-full transition-transform duration-200 hover:scale-105" onClick={() => addToCart({ id: suggested.id, name: suggested.name, price: suggested.price, image: suggested.image })}>
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Cart;