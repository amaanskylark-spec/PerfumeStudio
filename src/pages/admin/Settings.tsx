import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BrandContent {
  heroTitle: string;
  heroTagline: string;
  aboutTitle: string;
  aboutStory: string;
  founderName: string;
  founderBio: string;
}

const Settings = () => {
  const [brandContent, setBrandContent] = useState<BrandContent>({
    heroTitle: 'Discover Your Signature Scent',
    heroTagline: 'Handcrafted perfumes that tell your unique story',
    aboutTitle: 'Our Fragrance Journey',
    aboutStory: 'ScentScape was founded with a passion for creating unique, memorable fragrances that capture emotions and experiences.',
    founderName: 'Alexandra Chen',
    founderBio: 'With over 15 years of experience in perfumery, Alexandra has trained with master perfumers across France and Italy before establishing ScentScape.',
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const formRef = useRef(null);
  const previewRef = useRef(null);

  useEffect(() => {
    // Load saved content from localStorage if available
    const savedContent = localStorage.getItem('brandContent');
    if (savedContent) {
      setBrandContent(JSON.parse(savedContent));
    }
    
    // GSAP animations
    gsap.from(formRef.current, {
      x: -50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
    
    gsap.from(previewRef.current, {
      x: 50,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setBrandContent(prev => {
      const updated = { ...prev, [name]: value };
      
      // Animate preview update
      gsap.to(previewRef.current, {
        opacity: 0.5,
        duration: 0.2,
        onComplete: () => {
          gsap.to(previewRef.current, {
            opacity: 1,
            duration: 0.2
          });
        }
      });
      
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('brandContent', JSON.stringify(brandContent));
      
      setIsSaving(false);
      setSaved(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Brand Settings</h1>
        <p className="text-muted-foreground">Customize your brand content and messaging</p>
      </div>
      
      {saved && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Content updated successfully!
        </div>
      )}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <Card className="p-6" ref={formRef}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <Tabs defaultValue="home">
              <TabsList className="mb-4">
                <TabsTrigger value="home">Home Page</TabsTrigger>
                <TabsTrigger value="about">About Page</TabsTrigger>
              </TabsList>
              
              <TabsContent value="home" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Hero Title</Label>
                  <Input
                    id="heroTitle"
                    name="heroTitle"
                    value={brandContent.heroTitle}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="heroTagline">Hero Tagline</Label>
                  <Input
                    id="heroTagline"
                    name="heroTagline"
                    value={brandContent.heroTagline}
                    onChange={handleInputChange}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="about" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="aboutTitle">About Page Title</Label>
                  <Input
                    id="aboutTitle"
                    name="aboutTitle"
                    value={brandContent.aboutTitle}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="aboutStory">Brand Story</Label>
                  <Textarea
                    id="aboutStory"
                    name="aboutStory"
                    rows={4}
                    value={brandContent.aboutStory}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="founderName">Founder Name</Label>
                  <Input
                    id="founderName"
                    name="founderName"
                    value={brandContent.founderName}
                    onChange={handleInputChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="founderBio">Founder Bio</Label>
                  <Textarea
                    id="founderBio"
                    name="founderBio"
                    rows={4}
                    value={brandContent.founderBio}
                    onChange={handleInputChange}
                  />
                </div>
              </TabsContent>
            </Tabs>
            
            <Button type="submit" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </Card>
        
        {/* Preview */}
        <Card className="p-6 bg-muted/50" ref={previewRef}>
          <h3 className="text-lg font-medium mb-4">Live Preview</h3>
          
          <Tabs defaultValue="home">
            <TabsList className="mb-4">
              <TabsTrigger value="home">Home Page</TabsTrigger>
              <TabsTrigger value="about">About Page</TabsTrigger>
            </TabsList>
            
            <TabsContent value="home" className="space-y-4">
              <div className="p-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg text-white">
                <h2 className="text-2xl font-bold mb-2">{brandContent.heroTitle}</h2>
                <p>{brandContent.heroTagline}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="about" className="space-y-4">
              <div className="p-6 bg-white rounded-lg">
                <h2 className="text-2xl font-bold mb-4">{brandContent.aboutTitle}</h2>
                <p className="mb-6">{brandContent.aboutStory}</p>
                
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold mb-2">About {brandContent.founderName}</h3>
                  <p>{brandContent.founderBio}</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Settings;