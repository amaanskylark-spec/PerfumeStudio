import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    gsap.fromTo(formRef.current, { scale: 1 }, { scale: 1.05, yoyo: true, repeat: 1, duration: 0.2 });
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen pt-24 bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-card rounded-2xl shadow-xl p-8 space-y-8">
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground text-center mb-4">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-8">We'd love to hear from you! Fill out the form below or reach us directly.</p>
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Your Name"
              required
              className="px-4 py-3 rounded-full border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="px-4 py-3 rounded-full border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              placeholder="Your Message"
              required
              rows={4}
              className="px-4 py-3 rounded-2xl border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
          </div>
          <Button type="submit" className="w-full btn-elegant text-white font-semibold py-3 rounded-full flex items-center justify-center gap-2">
            <Send className="h-5 w-5" /> Send Message
          </Button>
          {submitted && <div className="text-green-500 text-center font-semibold mt-2">Thank you! Your message has been sent.</div>}
        </form>
        <div className="mt-8 flex flex-col gap-4 text-center text-muted-foreground">
          <div className="flex items-center justify-center gap-2"><Mail className="h-5 w-5" /> hello@perfumestudio.com</div>
          <div className="flex items-center justify-center gap-2"><Phone className="h-5 w-5" /> +91 98765 43210</div>
          <div className="flex items-center justify-center gap-2"><MapPin className="h-5 w-5" /> Mumbai, India</div>
        </div>
      </div>
    </div>
  );
};

export default Contact; 