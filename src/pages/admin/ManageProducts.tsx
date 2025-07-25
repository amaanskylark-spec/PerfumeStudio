import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2, Search, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import allProducts from '@/data/products';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  category: string;
  isNew?: boolean;
  description?: string;
  scentNotes?: string;
}

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  
  const tableRef = useRef(null);

  useEffect(() => {
    // Get deleted product IDs
    const deletedProductIds = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
    
    // Filter out deleted default products
    const filteredDefaultProducts = allProducts.filter(product => 
      !deletedProductIds.includes(product.id)
    );
    
    // Load custom products from localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
      setProducts([...filteredDefaultProducts, ...JSON.parse(storedProducts)]);
    } else {
      setProducts(filteredDefaultProducts);
    }
    
    // GSAP animations
    gsap.from(tableRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteId) return;
    
    // Filter out the product with the matching ID
    const updatedProducts = products.filter(product => product.id !== deleteId);
    setProducts(updatedProducts);
    
    // Update localStorage - store only custom products
    const defaultIds = allProducts.map(p => p.id);
    const customProducts = updatedProducts.filter(p => !defaultIds.includes(p.id));
    localStorage.setItem('products', JSON.stringify(customProducts));
    
    // If the deleted product is a default product, add it to a deleted products list in localStorage
    if (defaultIds.includes(deleteId)) {
      const deletedProducts = JSON.parse(localStorage.getItem('deletedProducts') || '[]');
      deletedProducts.push(deleteId);
      localStorage.setItem('deletedProducts', JSON.stringify(deletedProducts));
    }
    
    setIsDeleteDialogOpen(false);
    setDeleteId(null);
  };

  const handleEdit = (product: Product) => {
    setEditProduct({...product}); // Create a new object to ensure state update
    setIsEditDialogOpen(true);
  };

  const handleEditChange = (field: string, value: string | number) => {
    if (!editProduct) return;
    setEditProduct({
      ...editProduct,
      [field]: field === 'price' ? parseFloat(value as string) * 100 : value
    });
  };

  const saveEdit = () => {
    if (!editProduct) return;
    
    // Update the product in the products array
    const updatedProducts = products.map(product => 
      product.id === editProduct.id ? editProduct : product
    );
    setProducts(updatedProducts);
    
    // Update localStorage - store only custom products
    const defaultIds = allProducts.map(p => p.id);
    const customProducts = updatedProducts.filter(p => !defaultIds.includes(p.id));
    localStorage.setItem('products', JSON.stringify(customProducts));
    
    // If the edited product is a default product, add it to the custom products
    if (defaultIds.includes(editProduct.id)) {
      const customProducts = JSON.parse(localStorage.getItem('products') || '[]');
      const existingIndex = customProducts.findIndex(p => p.id === editProduct.id);
      if (existingIndex >= 0) {
        customProducts[existingIndex] = editProduct;
      } else {
        customProducts.push(editProduct);
      }
      localStorage.setItem('products', JSON.stringify(customProducts));
    }
    
    setIsEditDialogOpen(false);
    setEditProduct(null);
  };

  const categories = ['all', ...new Set(products.map(product => product.category))];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Manage Products</h1>
        <Link to="/admin/products/add">
          <Button>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-3 py-2 rounded-md border border-input bg-background h-10"
        >
          {categories.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      {/* Products Table */}
      <div className="rounded-md border" ref={tableRef}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="h-12 w-12 rounded overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>${(product.price / 100).toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(product)}
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => handleDelete(product.id)}
                      >
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
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <p className="py-4">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={editProduct.name}
                  onChange={(e) => handleEditChange('name', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="price" className="text-right">
                  Price
                </Label>
                <Input
                  id="price"
                  type="number"
                  value={editProduct.price / 100}
                  onChange={(e) => handleEditChange('price', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select
                  value={editProduct.category}
                  onValueChange={(value) => handleEditChange('category', value)}
                >
                  <SelectTrigger className="col-span-3">
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
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="image" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="image"
                  value={editProduct.image}
                  onChange={(e) => handleEditChange('image', e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
                <Button onClick={saveEdit}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageProducts;