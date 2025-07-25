import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    scentNotes: '',
  });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const formRef = useRef(null);
  const previewRef = useRef(null);
  const successRef = useRef(null);

  useEffect(() => {
    // GSAP animations
    gsap.from(formRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
      
      // Animate preview
      if (previewRef.current) {
        gsap.fromTo(previewRef.current, 
          { scale: 0.8, opacity: 0 }, 
          { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // Create a new product object
      const newProduct = {
        id: Date.now().toString(),
        name: formData.name,
        price: parseFloat(formData.price) * 100, // Convert to cents
        category: formData.category,
        description: formData.description,
        scentNotes: formData.scentNotes,
        image: imagePreview || 'https://images.unsplash.com/photo-1594736797933-d0b4b7d0b177?w=400&h=400&fit=crop',
        rating: 0,
        isNew: true
      };
      
      // Get existing products from localStorage or initialize empty array
      const existingProducts = JSON.parse(localStorage.getItem('products') || '[]');
      
      // Add new product
      localStorage.setItem('products', JSON.stringify([...existingProducts, newProduct]));
      
      setIsSubmitting(false);
      setSuccess(true);
      
      // Reset form
      setFormData({
        name: '',
        price: '',
        category: '',
        description: '',
        scentNotes: '',
      });
      setImage(null);
      setImagePreview(null);
      
      // Success animation
      gsap.fromTo(successRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        gsap.to(successRef.current, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => setSuccess(false)
        });
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Add New Product</h1>
      
      {success && (
        <div 
          ref={successRef}
          className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6"
        >
          Product added successfully!
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <Card className="md:col-span-2 p-6" ref={formRef}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  name="price" 
                  type="number" 
                  min="0.01" 
                  step="0.01" 
                  value={formData.price} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
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
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description" 
                rows={3} 
                value={formData.description} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="scentNotes">Scent Notes</Label>
              <Textarea 
                id="scentNotes" 
                name="scentNotes" 
                rows={2} 
                value={formData.scentNotes} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="image">Product Image</Label>
              <Input 
                id="image" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding Product...' : 'Add Product'}
            </Button>
          </form>
        </Card>
        
        {/* Preview */}
        <Card className="p-6 flex flex-col items-center justify-center">
          <h3 className="text-lg font-medium mb-4">Preview</h3>
          
          {imagePreview ? (
            <div ref={previewRef} className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className="w-full aspect-square bg-muted rounded-lg flex items-center justify-center mb-4">
              <p className="text-muted-foreground">No image selected</p>
            </div>
          )}
          
          <div className="w-full">
            <h4 className="font-medium">{formData.name || 'Product Name'}</h4>
            <p className="text-primary font-bold">
              {formData.price ? `₹${formData.price}` : '₹0'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {formData.category || 'Category'}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AddProduct;