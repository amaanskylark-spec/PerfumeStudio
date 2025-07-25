import { createContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

interface OrderContextType {
  orders: Order[];
  addOrder: (items: CartItem[], customerName: string, email: string) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
}

export const OrderContext = createContext<OrderContextType>({
  orders: [],
  addOrder: () => {},
  updateOrderStatus: () => {},
});

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Load orders from localStorage
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      // Mock orders data for initial state
      const mockOrders: Order[] = [
        {
          id: 'ORD-001',
          customer: 'John Smith',
          email: 'john@example.com',
          product: 'Midnight Rose',
          amount: 2499,
          status: 'delivered',
          date: '2023-09-15T10:30:00Z',
        },
        {
          id: 'ORD-002',
          customer: 'Sarah Johnson',
          email: 'sarah@example.com',
          product: 'Golden Oud',
          amount: 3499,
          status: 'shipped',
          date: '2023-09-18T14:45:00Z',
        },
        {
          id: 'ORD-003',
          customer: 'Michael Brown',
          email: 'michael@example.com',
          product: 'Ocean Breeze',
          amount: 1999,
          status: 'processing',
          date: '2023-09-20T09:15:00Z',
        },
        {
          id: 'ORD-004',
          customer: 'Emily Davis',
          email: 'emily@example.com',
          product: 'Velvet Musk',
          amount: 2999,
          status: 'pending',
          date: '2023-09-21T16:20:00Z',
        },
      ];
      setOrders(mockOrders);
      localStorage.setItem('orders', JSON.stringify(mockOrders));
    }
  }, []);

  useEffect(() => {
    // Save orders to localStorage whenever they change
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addOrder = (items: CartItem[], customerName: string, email: string) => {
    // Create a new order for each item in the cart
    const newOrders = items.map((item) => ({
      id: `ORD-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      customer: customerName,
      email: email,
      product: item.name,
      amount: item.price * item.quantity,
      status: 'pending' as const,
      date: new Date().toISOString(),
    }));

    setOrders((prevOrders) => [...prevOrders, ...newOrders]);
  };

  const updateOrderStatus = (id: string, status: Order['status']) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === id ? { ...order, status } : order
      )
    );
  };

  return (
    <OrderContext.Provider value={{ orders, addOrder, updateOrderStatus }}>
      {children}
    </OrderContext.Provider>
  );
};