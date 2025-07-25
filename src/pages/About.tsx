import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Heart, Award, Users, Sparkles } from 'lucide-react';
import { TextEffectOne } from 'react-text-animate';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const statsRef = useRef(null);
  const valuesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animation
      gsap.fromTo('.about-hero',
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1,
          ease: 'power2.out'
        }
      );

      // Story section animation
      gsap.fromTo('.story-content',
        { opacity: 0, x: -50 },
        {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: storyRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Stats animation
      gsap.fromTo('.stat-item',
        { opacity: 0, scale: 0.8 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'back.out(1.7)',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

      // Values animation
      gsap.fromTo('.value-item',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: valuesRef.current,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse'
          }
        }
      );

    });

    return () => ctx.revert();
  }, []);

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Unique Fragrances' },
    { number: '5', label: 'Years of Excellence' },
    { number: '98%', label: 'Customer Satisfaction' }
  ];

  const values = [
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about creating fragrances that evoke emotions and memories.'
    },
    {
      icon: Award,
      title: 'Quality',
      description: 'Only the finest ingredients make it into our bottles, ensuring premium quality.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a community of fragrance lovers who appreciate the art of perfumery.'
    },
    {
      icon: Sparkles,
      title: 'Innovation',
      description: 'Constantly pushing boundaries to create unique and memorable scent experiences.'
    }
  ];

  return (
    <div className="min-h-screen pt-20 bg-background">
      
      {/* Hero Section */}
      <section ref={heroRef} className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="about-hero space-y-8">
            <h1 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-8">
              <TextEffectOne text="About PerfumeStudio" className="inline bg-gradient-elegant bg-clip-text text-transparent" staggerDuration={0.08} initialDelay={0} animateOnce={false} />
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Born from a passion for exquisite fragrances, PerfumeStudio has been crafting 
              memorable scent experiences that celebrate individuality and elegance.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section ref={storyRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Story Content */}
            <div className="space-y-8">
              <div className="story-content space-y-6">
                <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground">
                  The Art of <span className="bg-gradient-elegant bg-clip-text text-transparent">Fragrance</span>
                </h2>
                
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  <p>
                    PerfumeStudio was founded in 2019 with a simple yet profound vision: to make 
                    luxury fragrances accessible to everyone who appreciates the finer things in life. 
                    Our journey began in a small workshop in Mumbai, where our master perfumer spent 
                    countless hours perfecting each blend.
                  </p>
                  
                  <p>
                    What started as a passion project has grown into a beloved brand that serves 
                    fragrance enthusiasts across India. Each of our perfumes tells a story, 
                    capturing moments, emotions, and memories in beautifully crafted bottles.
                  </p>
                  
                  <p>
                    Today, we continue to honor our commitment to quality, creativity, and customer 
                    satisfaction, while constantly innovating to bring you the most exquisite 
                    fragrances that reflect your unique personality.
                  </p>
                </div>
              </div>

              <div className="story-content">
                <blockquote className="glass rounded-2xl p-6 border-l-4 border-primary">
                  <p className="text-lg font-medium text-foreground italic">
                    "A fragrance is more than just a scent—it's a signature, a memory, 
                    a way to express who you are without saying a word."
                  </p>
                  <cite className="block mt-4 text-sm text-muted-foreground">
                    — Arjun Mehta, Founder & Master Perfumer
                  </cite>
                </blockquote>
              </div>
            </div>

            {/* Founder Image */}
            <div className="story-content">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&h=700&fit=crop"
                  alt="Founder - Master Perfumer"
                  className="w-full h-[600px] object-cover rounded-2xl shadow-elegant"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl" />
                <div className="absolute bottom-6 left-6 text-white">
                  <h3 className="text-2xl font-display font-semibold">Arjun Mehta</h3>
                  <p className="text-white/90">Founder & Master Perfumer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-20 bg-gradient-to-br from-accent to-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Our <span className="bg-gradient-elegant bg-clip-text text-transparent">Journey</span> in Numbers
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              These numbers tell the story of our growth and the trust our customers place in us
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="stat-item text-center">
                <div className="glass rounded-2xl p-8 h-full space-y-4 hover:shadow-elegant transition-all duration-500">
                  <div className="text-4xl lg:text-5xl font-display font-bold bg-gradient-elegant bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-foreground mb-4">
              Our <span className="bg-gradient-elegant bg-clip-text text-transparent">Values</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do at PerfumeStudio
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="value-item text-center group">
                <div className="glass rounded-2xl p-8 h-full space-y-6 hover:shadow-elegant transition-all duration-500">
                  <div className="mx-auto w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-display font-semibold text-foreground">
                    {value.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white">
              Join Our Fragrance Journey
            </h2>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover your signature scent and become part of the PerfumeStudio family
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-elegant text-white font-semibold px-8 py-4 rounded-full">
                Explore Our Collection
              </button>
              <button className="glass border-white/30 text-white hover:bg-white/10 font-semibold px-8 py-4 rounded-full transition-all duration-300">
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;