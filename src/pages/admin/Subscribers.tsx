import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Subscriber {
  id: string;
  email: string;
  name: string;
  date: string;
}

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const tableRef = useRef(null);

  useEffect(() => {
    // Mock subscribers data
    const mockSubscribers: Subscriber[] = [
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
      {
        id: '4',
        email: 'emily@example.com',
        name: 'Emily Davis',
        date: '2023-08-25T11:30:00Z',
      },
      {
        id: '5',
        email: 'david@example.com',
        name: 'David Wilson',
        date: '2023-09-01T13:20:00Z',
      },
    ];
    
    setSubscribers(mockSubscribers);
    
    // GSAP animations
    gsap.from(tableRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    
    // Find the row element to animate
    const rowElement = document.getElementById(`subscriber-row-${deleteId}`);
    
    if (rowElement) {
      // Animate row removal
      gsap.to(rowElement, {
        height: 0,
        opacity: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.5,
        onComplete: () => {
          // Remove subscriber from state after animation
          setSubscribers(subscribers.filter(sub => sub.id !== deleteId));
        }
      });
    } else {
      // Fallback if element not found
      setSubscribers(subscribers.filter(sub => sub.id !== deleteId));
    }
    
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
          format(new Date(sub.date), 'yyyy-MM-dd')
        ].join(',');
      })
    ];
    
    const csvContent = csvRows.join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `subscribers_${format(new Date(), 'yyyy-MM-dd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subscribers</h1>
          <p className="text-muted-foreground">Manage newsletter subscribers</p>
        </div>
        
        <Button onClick={exportToCSV}>
          <Download className="mr-2 h-4 w-4" /> Export to CSV
        </Button>
      </div>
      
      {/* Subscribers Table */}
      <div className="rounded-md border" ref={tableRef}>
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
                  <TableCell>{format(new Date(subscriber.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(subscriber.id)}
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to remove this subscriber? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Subscribers;