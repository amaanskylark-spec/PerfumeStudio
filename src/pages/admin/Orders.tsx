import { useState, useEffect, useRef, useContext } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { OrderContext } from '@/context/OrderContext';

interface Order {
  id: string;
  customer: string;
  email: string;
  product: string;
  amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  date: string;
}

const Orders = () => {
  const { orders, updateOrderStatus } = useContext(OrderContext); // Use OrderContext
  const [statusFilter, setStatusFilter] = useState('all');
  const tableRef = useRef(null);
  const statusRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  useEffect(() => {
    // GSAP animations
    gsap.from(tableRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  const filteredOrders = orders.filter(order => {
    return statusFilter === 'all' || order.status === statusFilter;
  });

  const handleUpdateStatus = (orderId: string, newStatus: Order['status']) => {
    // Animate status change
    if (statusRefs.current[orderId]) {
      gsap.fromTo(
        statusRefs.current[orderId],
        { scale: 1, opacity: 1 },
        { 
          scale: 1.2, 
          opacity: 0, 
          duration: 0.3, 
          onComplete: () => {
            gsap.fromTo(
              statusRefs.current[orderId],
              { scale: 0.8, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.3 }
            );
          } 
        }
      );
    }
    
    // Update order status in context
    updateOrderStatus(orderId, newStatus);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'processing': return 'bg-blue-500';
      case 'shipped': return 'bg-purple-500';
      case 'delivered': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">Manage customer orders and shipments</p>
      </div>
      
      {/* Filters */}
      <div className="flex gap-2">
        <Button 
          variant={statusFilter === 'all' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('all')}
        >
          All
        </Button>
        <Button 
          variant={statusFilter === 'pending' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('pending')}
        >
          Pending
        </Button>
        <Button 
          variant={statusFilter === 'processing' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('processing')}
        >
          Processing
        </Button>
        <Button 
          variant={statusFilter === 'shipped' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('shipped')}
        >
          Shipped
        </Button>
        <Button 
          variant={statusFilter === 'delivered' ? 'default' : 'outline'}
          onClick={() => setStatusFilter('delivered')}
        >
          Delivered
        </Button>
      </div>
      
      {/* Orders Table */}
      <div className="rounded-md border" ref={tableRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{order.customer}</div>
                      <div className="text-sm text-muted-foreground">{order.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>₹{order.amount}</TableCell>
                  <TableCell>{format(new Date(order.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell>
                    <div 
                      ref={el => statusRefs.current[order.id] = el}
                      className="inline-block"
                    >
                      <Badge className={getStatusColor(order.status)}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'pending' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(order.id, 'processing')}
                        >
                          Process
                        </Button>
                      )}
                      {order.status === 'processing' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(order.id, 'shipped')}
                        >
                          Ship
                        </Button>
                      )}
                      {order.status === 'shipped' && (
                        <Button 
                          size="sm" 
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                        >
                          Mark Delivered
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No orders found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Orders;