import { useEffect, useRef, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import heroImage from '@/assets/hero-perfume.jpg';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { TextEffectOne } from 'react-text-animate';

gsap.registerPlugin(ScrollTrigger);

function PerfumeModel({ modelRef }: { modelRef: React.MutableRefObject<THREE.Group | null> }) {
  const group = modelRef;
  const { scene } = useGLTF('/src/assets/tripo 3d/ps.glb');

  // Floating animation
  useFrame((state) => {
    if (group.current) {
      (group.current as THREE.Group).rotation.y += 0.003;
      (group.current as THREE.Group).position.y = Math.sin(state.clock.getElapsedTime()) * 0.1;
    }
  });

  useEffect(() => {
    if (group.current) {
      gsap.fromTo(
        group.current.position,
        { y: 1, z: 2 },
        { y: 0, z: 0, duration: 1.2, ease: 'power3.out' }
      );
      gsap.fromTo(
        group.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, ease: 'power2.out' }
      );
    }
  }, []);

  return <primitive ref={group} object={scene} scale={2.2} />;
}

const HeroSection = () => {
  const heroRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const particlesRef = useRef(null);
  const modelRef = useRef<THREE.Group | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero entrance animation
      const tl = gsap.timeline();
      
      tl.fromTo(titleRef.current,
        { opacity: 0, y: 50, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power3.out' }
      )
      .fromTo(subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' },
        '-=0.6'
      )
      .fromTo(ctaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
        '-=0.4'
      );

      // Parallax scroll effect
      gsap.to(heroRef.current, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1
        }
      });

      // Particle animation
      gsap.to('.particle', {
        y: -100,
        opacity: 0,
        duration: 4,
        repeat: -1,
        stagger: 0.5,
        ease: 'power2.out'
      });

      // 3D Model scroll animation
      if (modelRef.current) {
        gsap.fromTo((modelRef.current as THREE.Group).scale,
          { x: 2.2, y: 2.2, z: 2.2 },
          {
            x: 1.2, y: 1.2, z: 1.2,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            },
            ease: 'power2.out',
          }
        );
        gsap.fromTo((modelRef.current as THREE.Group).rotation,
          { y: 0 },
          {
            y: Math.PI * 2,
            scrollTrigger: {
              trigger: heroRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 1
            },
            ease: 'power2.out',
          }
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero"
    >
      {/* Animated Background Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="particle absolute w-2 h-2 bg-secondary rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <h1 
                ref={titleRef}
                className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold"
              >
                <TextEffectOne
                  text="Discover Your Essence"
                  className="block bg-gradient-elegant bg-clip-text text-transparent"
                  staggerDuration={0.08}
                  initialDelay={0}
                  animateOnce={false}
                />
              </h1>
              
              <p 
                ref={subtitleRef}
                className="text-lg sm:text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed"
              >
                Experience the art of fine fragrance with our curated collection of 
                premium perfumes. Each scent tells a story, each bottle holds a dream.
              </p>
            </div>

            <div ref={ctaRef} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button 
                size="lg" 
                className="btn-elegant text-white font-semibold px-8 py-4 rounded-full group"
              >
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Explore Collection
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="glass border-primary/30 text-primary hover:bg-primary/10 font-semibold px-8 py-4 rounded-full"
              >
                Learn Our Story
              </Button>
            </div>
          </div>

          {/* 3D Perfume Model */}
          <div className="relative mx-auto w-full max-w-lg h-[400px] sm:h-[500px] lg:h-[600px]">
            <Suspense fallback={<div className="flex items-center justify-center h-full">Loading 3D...</div>}>
              <Canvas camera={{ position: [0, 0, 4], fov: 35 }} style={{ background: 'transparent' }}>
                <ambientLight intensity={0.8} />
                <directionalLight position={[5, 5, 5]} intensity={1.2} />
                <PerfumeModel modelRef={modelRef} />
                <OrbitControls enablePan={false} enableZoom={false} />
              </Canvas>
            </Suspense>
              {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-primary opacity-20 blur-3xl rounded-full scale-75 pointer-events-none" />
            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-secondary/20 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl animate-pulse delay-1000" />
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center">
          <div className="flex flex-col items-center space-y-2 animate-bounce">
            <span className="text-sm text-muted-foreground font-medium">Scroll to discover</span>
            <ArrowDown className="h-5 w-5 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

// Required for GLTF loading
// @ts-ignore
useGLTF.preload('/src/assets/tripo 3d/ps.glb');