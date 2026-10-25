/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, Suspense } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform } from 'motion/react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, PerspectiveCamera, Points, PointMaterial, TorusKnot, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import {
  Terminal,
  Database,
  Cloud,
  Download,
  ArrowRight,
  Settings,
  Activity,
  Github,
  Linkedin,
  Twitter,
  Mail,
  ExternalLink,
  Cpu,
  Brain,
  Coffee,
  BarChart3,
  Table,
  Send,
  Instagram,
  Code
} from 'lucide-react';

// --- Three.js Components ---

const ParticleBackground = () => {
  const points = useMemo(() => {
    const p = new Float32Array(3000);
    for (let i = 0; i < 3000; i++) {
      p[i] = (Math.random() - 0.5) * 15;
    }
    return p;
  }, []);

  const pointsRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02;
    }
  });

  return (
    <Points positions={points} ref={pointsRef}>
      <PointMaterial
        transparent
        color="#81ecff"
        size={0.02}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.4}
      />
    </Points>
  );
};

const AbstractModel = () => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={1.5}>
      <TorusKnot ref={meshRef} args={[1.5, 0.4, 256, 32]}>
        <MeshDistortMaterial
          color="#81ecff"
          speed={2}
          distort={0.4}
          radius={1}
          emissive="#81ecff"
          emissiveIntensity={0.5}
          wireframe
        />
      </TorusKnot>
    </Float>
  );
};

const SpaceScene = () => {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#81ecff" />
        <Suspense fallback={null}>
          <ParticleBackground />
          <AbstractModel />
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  );
};

const CustomCursor = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .glow-hover')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseover', handleMouseHover);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseover', handleMouseHover);
    };
  }, []);

  const cursorSpring = {
    type: "spring" as const,
    damping: 50,
    stiffness: 1000,
    mass: 0.1
  };

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 rounded-full border border-primary/30 pointer-events-none z-[999]"
        animate={{
          x: mousePos.x - 16,
          y: mousePos.y - 16,
          scale: isHovering ? 2 : 1,
          borderColor: isHovering ? "rgba(129, 236, 255, 0.8)" : "rgba(129, 236, 255, 0.3)",
        }}
        transition={{ duration: 0 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[1000] shadow-[0_0_10px_#81ecff]"
        animate={{
          x: mousePos.x - 3,
          y: mousePos.y - 3,
          scale: isHovering ? 3 : 1,
        }}
        transition={{ duration: 0 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none z-[-1]"
        animate={{
          x: mousePos.x - 128,
          y: mousePos.y - 128,
        }}
        transition={{ type: "tween", ease: "linear", duration: 0.1 }}
      />
    </>
  );
};

// --- Types ---
interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
  icon: React.ReactNode;
  color: 'primary' | 'secondary' | 'tertiary';
  category?: string;
  stats?: { label: string; value: string }[];
}

interface Experience {
  epoch: string;
  year: string | number;
  title: string;
  description: string;
  skills: string[];
  icon: React.ReactNode;
}

// --- Data ---
const PROJECTS: Project[] = [
  {
    id: 'ai-chatbot',
    title: 'AI Chatbot',
    description: 'Advanced LLM-powered assistant with real-time semantic search and personality tuning modules.',
    tags: ['PYTHON', 'PYTORCH', 'NEXTJS'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0OOEh3oe4BnJcvbVjV6HwNZUmUAMY7B8emMK3vHAM--hfqZyYhGMfp9UYIeDPSKlWtO64nCDGoD6kz4QX7c1TXMm53YPTSYsEtIFJpw9NB5f-FjjmqpJFUWsszFotWfA4mhJrRq6MF08gOND77XcqSJcZ_r4LC8Z1rhqcdgYG6-TnFex5i8oZqY89qp54wvrw4le72WsIAWsouRefKx-tWgL4uCAmbqP3Cja16qPzu0mQnvjckI8YgIVApMs0zs55GZGbfoP6mESy',
    icon: <Brain className="w-6 h-6" />,
    color: 'primary',
  },
  {
    id: 'data-dashboard',
    title: 'Data Dashboard',
    description: 'Dark interface design with complex data visualizations representing real-time system metrics.',
    tags: ['D3.JS', 'REDUX'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcywMPJtbJJThHs80-zJT3lA0OGm6APS8xWN-QCtW8PN0axqcQDqY-U7V22mzcyist5tE_POgQA6nhGFtu1z3kdBKBwgklcTfOrduF68pnRkyzuxOOl4Nfa0Ak_oyPsPTa8bFNzGtPEYO2upXhqrCcznP1mwRgWBSO4mXz5myYI2Oexofxp2DUSY4byRDwQe4IenkQNugzf8R5BCcCsuLwYbC6d5yR8cUKUY5swy6V0ajG8y-Isnz8b9rAwu3eTpR5nN4h0VjRVhVU',
    icon: <BarChart3 className="w-6 h-6" />,
    color: 'secondary',
  },
  {
    id: 'portfolio-website',
    title: 'Portfolio Website',
    description: 'Minimalist typography driven website design with dramatic shadows and high-end animations.',
    tags: ['GSAP', 'TAILWIND'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXLcU8GFa65DITV5zZjXP6whIONAZ6pvLMVL1etAhUpx8QCzks0O-Jt-apCAWDPDWk-7gZtiQaJAC4_quXXvY2J3_qhIT4l8g6HnP5XCpzA-W8hL7jf9ijTuEaOBSrzu9NFp5eJ19VLrZCRCG5R4Mlj7AgbXBImchvsUJnpwdWs3j-HXC0hJ8F25bKx5GhVAk38V6mSL-y2VHjvCGB4b3HGQ7i4jRO5WhAEMFCjBYVUij2hRcTKfwOzKEMXly93niCJMn2Cz3CIZsX',
    icon: <Settings className="w-6 h-6" />,
    color: 'primary',
  },
  {
    id: 'ml-prediction',
    title: 'ML Prediction System',
    category: 'PREDICTIVE_ENGINE',
    description: 'Real-time market analysis engine utilizing recurrent neural networks for sequence forecasting.',
    tags: ['SCIKIT-LEARN', 'DOCKER'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWpVJLyS5GXxfd1M6qEYAsvmuWtXEsi6GGmgBFWmylugfNk6Vr4TC16P5mfHDrjAfHrce_rn_4gSPjXn0YBcxZzV8DWSBRob74bryQlNfBQPjOnBNUSxvldgDUXfnodv3UvLh_a0sD66N6vl08WfEHdHdxi4bGg7oymitBtNzSNCMoremE_obPgLwC5APq1okBeaPDeJ5bHvfJ2pO0ztaGnrFJLZS_f6IvKj7t2xN19jBU8eUZZWFbMQPql0PoHWvZNliogK-83Syc',
    icon: <Activity className="w-6 h-6" />,
    color: 'tertiary',
  },
  {
    id: 'sql-analytics',
    title: 'SQL Analytics Project',
    description: 'Deep dive into enterprise data warehouses. Optimized query performance by 40% using advanced indexing.',
    tags: ['POSTGRESQL', 'TABLEAU'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCt3UgZqr5CZzhkS8E9YCsSBokhLqV-Hho8GLI8D1DJfIqxT2HpaISfmHWmZSofb9Ay11dcvffmS7gHpHSeF33kRrwE2Mwdy0GkxQCGWrNknk9Th4_Ih4wGfHnoFsv_XV9j4JH7I7tsusdmmFb_wH20XmShI9v4TjboAVDfMzqr-oaHpP4inx1IQb6xj0-gYURjw4vfmSwAyvAbBfbLN-fNvQVxG6-qnxCjq3BYbZtAQSwtUxjK5QHWPoXbbjMfYSW5sxzXTCrdlXv0',
    icon: <Database className="w-6 h-6" />,
    color: 'primary',
    stats: [
      { label: 'DATABASE', value: 'PostgreSQL 15' },
      { label: 'VISUALIZATION', value: 'Tableau Cloud' },
    ]
  },
];

const EXPERIENCE: Experience[] = [
  {
    epoch: 'Epoch_01',
    year: 2021,
    title: 'Learning Programming',
    description: 'Initiated the synthesis process. Mastering syntactic logic through Python and C++. Deep-diving into algorithm complexity and memory management.',
    skills: ['PYTHON', 'LOGIC'],
    icon: <Terminal className="w-6 h-6" />,
  },
  {
    epoch: 'Epoch_02',
    year: 2022,
    title: 'Started Data Analytics',
    description: 'Deciphering large-scale noise. Utilizing SQL, Pandas, and visualization tools to transform raw data streams into actionable intelligence protocols.',
    skills: ['PANDAS', 'POSTGRESQL'],
    icon: <Activity className="w-6 h-6" />,
  },
  {
    epoch: 'Epoch_03',
    year: 2023,
    title: 'Building AI Projects',
    description: 'Architecting neural landscapes. Developing LLM integrations and custom transformer models. Focused on the intersection of RAG and autonomous agents.',
    skills: ['PYTORCH', 'LLM_OPS'],
    icon: <Brain className="w-6 h-6" />,
  },
  {
    epoch: 'Epoch_04',
    year: 'CURRENT',
    title: 'Freelance / Hackathon Ready',
    description: 'Operational deployment. Shipping production-ready code for global clients and leading engineering teams in high-stakes competitive environments.',
    skills: ['PRODUCTION_SHIP', 'STRATEGY'],
    icon: <Settings className="w-6 h-6" />,
  },
];

const SKILLS = [
  { name: 'Python', icon: <Terminal />, description: 'System tools & ML' },
  { name: 'SQL', icon: <Database />, description: 'Data Intelligence' },
  { name: 'Java', icon: <Coffee />, description: 'Core Application' },
  { name: 'Power BI', icon: <BarChart3 />, description: 'Performance metrics' },
  { name: 'Machine Learning', icon: <Brain />, description: 'Neural systems' },
  { name: 'Data Analytics', icon: <Activity />, description: 'Pattern synthesis' },
  { name: 'Excel', icon: <Table />, description: 'Operational Data' },
  { name: 'GitHub', icon: <Github />, description: 'Source Control' },
];

// --- Components ---

const Navbar = () => {
  const [active, setActive] = useState('home');

  return (
    <nav className="fixed top-0 w-full z-50 bg-black/60 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        <div className="font-headline text-2xl font-black tracking-tighter text-primary">
          SHIVAM_LABS
        </div>
        <div className="hidden md:flex items-center gap-10 font-headline text-xs font-bold tracking-widest uppercase">
          {['home', 'projects', 'skills', 'experience'].map((item) => (
            <a
              key={item}
              href={`#${item}`}
              onClick={() => setActive(item)}
              className={`transition-all duration-300 relative py-1 ${active === item ? 'text-primary' : 'text-zinc-500 hover:text-primary/70'
                }`}
            >
              {item}
              {active === item && (
                <motion.div
                  layoutId="nav-underline"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary"
                />
              )}
            </a>
          ))}
        </div>
        <button className="bg-primary text-black font-headline text-[10px] font-black tracking-[0.2em] px-6 py-2.5 rounded-lg hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(129,236,255,0.3)]">
          GET_IN_TOUCH
        </button>
      </div>
    </nav>
  );
};

const GalaxyBackground = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-40 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <radialGradient id="grad1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#81ecff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#81ecff" stopOpacity="0" />
          </radialGradient>
        </defs>
        {[...Array(5)].map((_, i) => (
          <motion.circle
            key={i}
            cx="50%"
            cy="50%"
            r="1"
            fill="url(#grad1)"
            animate={{
              r: [1, 1000],
              opacity: [1, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
          />
        ))}
        {/* Stars */}
        {[...Array(50)].map((_, i) => (
          <circle
            key={`star-${i}`}
            cx={Math.random() * 1000}
            cy={Math.random() * 1000}
            r={Math.random() * 1.5}
            fill="white"
            opacity={Math.random() * 0.5}
          />
        ))}
      </svg>
    </div>
  );
};

const DiagnosticsCard = () => {
  return (
    <motion.div
      initial={{ rotate: 3, opacity: 0, y: 20 }}
      whileInView={{ rotate: 1, opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass-panel rounded-xl border border-white/10 p-8 flex flex-col justify-between h-[500px]"
    >
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <div className="w-12 h-1 bg-primary" />
          <span className="font-headline text-[10px] text-primary/60 tracking-widest uppercase">SYSTEM_DIAGNOSTICS</span>
        </div>
        <Cpu className="text-primary w-10 h-10" />
      </div>

      <div className="space-y-4">
        <div className="h-40 bg-white/5 rounded-lg flex items-end px-4 gap-2 py-4">
          {[60, 80, 40, 90, 55, 70].map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              transition={{ delay: i * 0.1, duration: 1 }}
              className="bg-primary/40 w-full hover:bg-primary transition-colors"
            />
          ))}
        </div>
        <div className="flex justify-between font-mono text-[10px] text-zinc-500 uppercase">
          <span>DATA_FEED_01</span>
          <span className="text-primary">98.2% EFFICIENCY</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded border border-white/5 hover:border-primary/20 transition-all">
          <span className="font-headline text-[9px] text-zinc-500 block mb-1 uppercase tracking-tighter">LATENCY</span>
          <span className="font-headline text-2xl text-on-surface">14ms</span>
        </div>
        <div className="bg-white/5 p-4 rounded border border-white/5 hover:border-primary/20 transition-all">
          <span className="font-headline text-[9px] text-zinc-500 block mb-1 uppercase tracking-tighter">UPTIME</span>
          <span className="font-headline text-2xl text-on-surface">99.9%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default function App() {
  const [activeWordIndex, setActiveWordIndex] = useState(0);
  const words = ["AI • Data Analytics", "Machine Learning • Developer", "Problem Solver • Tech Lead"];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveWordIndex((prev) => (prev + 1) % words.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="selection-primary scroll-smooth min-h-screen bg-black cursor-none">
      <CustomCursor />
      <Navbar />

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-surface-container-lowest">
        <SpaceScene />

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full grid md:grid-cols-2 gap-16 items-center z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-10"
          >
            <div className="space-y-3">
              <span className="font-headline text-secondary tracking-[0.4em] text-[10px] font-black uppercase animate-pulse">INITIATING_SEQUENCE...</span>
              <h1 className="font-headline text-6xl lg:text-8xl font-black text-on-surface leading-[0.9] tracking-tighter">
                Hi, I'm <span className="text-primary glow-text">Shivam</span>
              </h1>
            </div>

            <div className="h-10 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWordIndex}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="font-headline text-2xl md:text-3xl text-on-surface-variant/80 font-light tracking-tight flex items-center"
                >
                  {words[activeWordIndex]}
                </motion.div>
              </AnimatePresence>
            </div>

            <p className="text-on-surface-variant text-lg md:text-xl font-light leading-relaxed max-w-lg border-l-2 border-primary/20 pl-8">
              Building smart solutions with code, data, and creativity. Architecting the future through high-performance engineering.
            </p>

            <div className="flex flex-wrap gap-5 pt-4">
              <a href="#projects" className="group relative px-10 py-4 bg-primary text-black font-headline font-black rounded-xl overflow-hidden transition-all duration-300 shadow-[0_0_30px_rgba(129,236,255,0.4)] hover:shadow-[0_0_50px_rgba(129,236,255,0.6)]">
                <span className="relative z-10 flex items-center gap-3">
                  VIEW PROJECTS
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </a>

              <a
                href="/resume.pdf"
                download="Shivam_Kumar_Resume.pdf"
                className="px-10 py-4 border border-white/10 text-on-surface font-headline font-bold rounded-xl inline-flex items-center gap-3 hover:bg-white/5 transition-colors"
              >
                DOWNLOAD RESUME
                <Download className="w-4 h-4" />
              </a>

            </div>

            <div className="pt-16 flex gap-16 items-center opacity-40 hover:opacity-100 transition-all duration-700">
              <div className="flex flex-col gap-2">
                <span className="font-headline text-[10px] tracking-widest text-zinc-500 uppercase">TECH_STACK</span>
                <div className="flex gap-5 text-primary">
                  <Terminal className="w-5 h-5" />
                  <Database className="w-5 h-5" />
                  <Cloud className="w-5 h-5" />
                </div>
              </div>
              <div className="w-[1px] h-10 bg-white/10" />
              <div className="flex flex-col gap-2">
                <span className="font-headline text-[10px] tracking-widest text-zinc-500 uppercase">LOCATION</span>
                <span className="text-xs font-black font-headline tracking-widest text-on-surface">EARTH // SECTOR_7G</span>
              </div>
            </div>
          </motion.div>

          <div className="hidden md:block relative">
            <DiagnosticsCard />
            {/* Background Decorative Element */}
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary-container/5 rounded-full blur-[100px] -z-10 animate-subtle-pulse" />
          </div>
        </div>
      </section>

      {/* About & Skills Section */}
      <section id="skills" className="py-32 bg-surface-container-low px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-32">
          {/* About Me */}
          <div className="grid lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <span className="font-headline text-[10px] tracking-[0.2em] uppercase text-zinc-400">BIO_MANIFEST</span>
              </div>
              <h2 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-none text-white">
                ENGINEERING <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">SOLUTIONS.</span>
              </h2>
            </div>
            <div className="lg:col-span-7">
              <div className="glass-panel p-10 md:p-14 rounded-2xl border border-white/5 shadow-2xl relative group">
                <div className="absolute top-0 right-0 p-6 opacity-5 font-headline text-[120px] font-black select-none text-primary pointer-events-none">01</div>
                <div className="relative z-10 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="h-[1.5px] w-14 bg-primary" />
                    <span className="font-headline text-xs tracking-widest text-primary uppercase font-black">About Me</span>
                  </div>
                  <p className="font-sans text-xl md:text-2xl text-on-surface-variant/90 leading-relaxed font-light">
                    B.Tech Student passionate about <span className="text-white font-bold">AI, ML, SQL, Java.</span>
                    I focus on translating complex data patterns into elegant, high-impact intelligent systems.
                  </p>
                  <div className="pt-8 grid grid-cols-2 md:grid-cols-3 gap-8">
                    {[
                      { l: 'STATUS', v: 'B.Tech Student' },
                      { l: 'FOCUS', v: 'Data Intelligence' },
                      { l: 'LOCATION', v: 'Digital Horizon' }
                    ].map((item, i) => (
                      <div key={i} className="space-y-2">
                        <div className="font-headline text-[10px] tracking-[0.2em] text-zinc-500 uppercase">{item.l}</div>
                        <div className="text-on-surface font-bold font-headline tracking-wide">{item.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Arsenal */}
          <div className="space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-8">
              <div className="space-y-4">
                <div className="font-headline text-[12px] tracking-[0.3em] uppercase text-secondary font-black">Tech_Stack_v2.0</div>
                <h2 className="font-headline text-5xl md:text-6xl font-black tracking-tighter">TECHNICAL ARSENAL</h2>
              </div>
              <div className="text-zinc-500 font-mono text-[10px] tracking-widest max-w-xs text-right hidden md:block uppercase opacity-70">
                System tools and frameworks utilized in the deployment of high-performance analytical environments.
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {SKILLS.map((skill, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="group bg-white/[0.03] border border-white/5 p-10 rounded-2xl flex flex-col items-center justify-center gap-5 transition-all duration-500 hover:bg-white/[0.07] hover:border-primary/30 glow-hover"
                >
                  <div className="text-primary group-hover:scale-110 transition-transform duration-500 w-10 h-10 flex items-center justify-center">
                    {React.cloneElement(skill.icon as React.ReactElement<any>, { className: 'w-full h-full' })}
                  </div>
                  <div className="text-center space-y-1">
                    <span className="font-headline text-sm tracking-widest uppercase font-black text-white block">{skill.name}</span>
                    <span className="font-headline text-[9px] tracking-widest uppercase text-zinc-500">{skill.description}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Selected Works */}
      <section id="projects" className="py-32 px-6 md:px-12 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="space-y-6">
              <span className="font-headline text-primary tracking-[0.3em] text-[10px] font-black uppercase block">LAB_PORTFOLIO_V4.0</span>
              <h2 className="font-headline text-6xl md:text-8xl font-black tracking-tighter leading-none">
                Selected Works
              </h2>
            </div>
            <div className="text-on-surface-variant font-headline text-[10px] tracking-[0.3em] flex items-center gap-4 font-black">
              <span className="w-16 h-px bg-white/10" />
              ACTIVE_PROJECTS / 05
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-6 gap-8">
            {PROJECTS.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`group relative overflow-hidden rounded-2xl border border-white/5 bg-white/[0.02] transition-all duration-700 
                  ${i === 0 ? 'md:col-span-4' : i === 3 ? 'md:col-span-4' : i === 4 ? 'md:col-span-6' : 'md:col-span-2'}
                  hover:border-primary/40 hover:shadow-[0_0_50px_rgba(129,236,255,0.1)]
                `}
              >
                <div className={`relative overflow-hidden ${i === 4 ? 'flex flex-col md:flex-row' : 'block'}`}>
                  {/* Image area */}
                  <div className={`relative overflow-hidden ${i === 4 ? 'md:w-1/3 aspect-square' : 'aspect-video'}`}>
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover opacity-40 group-hover:opacity-70 transition-all duration-1000 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  </div>

                  {/* Content area */}
                  <div className={`p-10 flex flex-col justify-between ${i === 4 ? 'flex-1' : 'absolute bottom-0 left-0 w-full glass-panel border-t border-white/5'}`}>
                    <div className="space-y-4">
                      {project.category && (
                        <span className="font-headline text-[9px] tracking-[0.3em] text-primary font-black uppercase mb-2 block">{project.category}</span>
                      )}
                      <div className="flex justify-between items-start">
                        <h3 className={`font-headline font-black tracking-tight group-hover:text-primary transition-colors ${i === 4 ? 'text-4xl' : 'text-3xl'}`}>
                          {project.title}
                        </h3>
                        <ExternalLink className="w-6 h-6 text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-45" />
                      </div>
                      <p className="text-on-surface-variant font-light text-sm max-w-xl leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    <div className="mt-8 flex flex-wrap gap-3">
                      {project.tags.map(tag => (
                        <span key={tag} className="px-3 py-1 bg-white/5 text-zinc-400 font-headline text-[9px] tracking-[0.2em] uppercase rounded-md border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {project.stats && (
                      <div className="mt-10 flex gap-10 items-center">
                        {project.stats.map((stat, idx) => (
                          <React.Fragment key={idx}>
                            <div className="space-y-2">
                              <div className="font-headline text-[9px] tracking-[0.2em] text-primary uppercase font-black">{stat.label}</div>
                              <div className="text-on-surface font-mono text-xs">{stat.value}</div>
                            </div>
                            {idx < project.stats!.length - 1 && <div className="w-px h-10 bg-white/10" />}
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Large Visual Anchor */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="mt-32 relative h-[500px] w-full rounded-2xl overflow-hidden border border-white/5 group"
          >
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBKDWpliGZXZWBhtwPHqqmS6EsuyKC0JuaiFWEal1yYld4WOOP9IJqn5VlgAkUuNKhKJNR6up_80OpcZd_FrdENb5eyGdRdUcMm2EG3vg9zVGJsJhFBS4He0uidJhszM63E056Es4d7CMPCjCx0XTdWxyOZNMxfZ9FGii_kg117fP_OcC5g-3zmHvJ16Ne4_ze-prP9TzrTcmSC0rttEs9p2vGr6I44hK0KH9ga94wxScHDItHZd_O6XuAWmm5ZvCWW2GQAfO6xdxuh"
              alt="Quantum visualization"
              className="w-full h-full object-cover transition-transform duration-[4000ms] group-hover:scale-110 opacity-70"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            <div className="absolute bottom-16 left-16 right-16 flex flex-col md:flex-row justify-between items-end gap-10">
              <div className="space-y-4">
                <h3 className="font-headline text-5xl md:text-6xl font-black tracking-tighter text-white">RESEARCHING THE FUTURE</h3>
                <p className="text-on-surface-variant font-light text-xl max-w-lg leading-relaxed">
                  Developing neural architectures that bridge the gap between abstract mathematics and tangible impact.
                </p>
              </div>
              <div className="hidden md:block">
                <div className="px-8 py-4 border border-primary/30 rounded-xl font-headline text-primary tracking-[0.3em] text-[10px] font-black uppercase bg-black/60 backdrop-blur-xl animate-pulse">
                  ACTIVE_NODE_STABLE
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section id="experience" className="py-32 px-6 md:px-12 bg-surface">
        <div className="max-w-7xl mx-auto">
          <div className="mb-32">
            <span className="font-headline text-primary tracking-[0.4em] uppercase text-[10px] font-black mb-6 block">Chronology_Data</span>
            <h2 className="font-headline text-6xl md:text-8xl font-black tracking-tighter text-white mb-10">
              EVOLUTION <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-container to-secondary">OF INTELLECT.</span>
            </h2>
            <p className="text-on-surface-variant text-xl max-w-2xl font-light leading-relaxed">
              A technical trajectory through language acquisition, data systems, and autonomous intelligence engineering.
            </p>
          </div>

          <div className="relative">
            {/* Center line */}
            <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-[1.5px] bg-gradient-to-b from-primary/50 via-secondary/50 to-transparent md:-translate-x-1/2 opacity-20" />

            <div className="space-y-32">
              {EXPERIENCE.map((exp, i) => (
                <div key={i} className={`relative flex flex-col md:flex-row items-center gap-12 group ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  {/* Dot */}
                  <div className="absolute left-0 md:left-1/2 top-0 md:top-8 w-4 h-4 rounded-full bg-surface border-2 border-primary -translate-x-1.5 md:-translate-x-2 z-10 shadow-[0_0_10px_#81ecff]" />

                  {/* Content */}
                  <div className={`w-full md:w-1/2 pl-10 md:pl-0 ${i % 2 === 0 ? 'md:pl-20' : 'md:pr-20 md:text-right'}`}>
                    <motion.div
                      initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="space-y-6"
                    >
                      <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/[0.03] border border-white/5 text-primary group-hover:shadow-[0_0_20px_rgba(129,236,255,0.2)] transition-all duration-500 ${i % 2 !== 0 ? 'md:ml-auto' : ''}`}>
                        {React.cloneElement(exp.icon as React.ReactElement<any>, { className: 'w-7 h-7' })}
                      </div>
                      <div className="space-y-2">
                        <div className="font-headline text-zinc-500 text-[10px] tracking-[0.3em] font-black uppercase">{exp.epoch} // {exp.year}</div>
                        <h3 className="font-headline text-4xl font-bold text-white tracking-tight">{exp.title}</h3>
                      </div>
                      <p className={`text-on-surface-variant font-light leading-relaxed max-w-lg ${i % 2 !== 0 ? 'md:ml-auto' : ''}`}>
                        {exp.description}
                      </p>
                      <div className={`flex flex-wrap gap-2 ${i % 2 !== 0 ? 'md:justify-end' : ''}`}>
                        {exp.skills.map(skill => (
                          <span key={skill} className="px-3 py-1 text-[9px] font-headline font-black tracking-[0.2em] bg-white/5 text-zinc-400 rounded-md border border-white/5">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="relative bg-white/[0.02] rounded-[40px] overflow-hidden p-12 md:p-24 border border-white/5 shadow-[0_0_100px_rgba(0,229,255,0.05)]">
            <div className="relative z-10 grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-10">
                <div className="space-y-6">
                  <h2 className="font-headline text-6xl font-black text-white tracking-tighter">Let's Connect</h2>
                  <p className="text-on-surface-variant text-xl font-light leading-relaxed max-w-sm">
                    System ready for collaboration. Available for architecture consulting and high-impact AI ventures.
                  </p>
                </div>

                <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    <div className="relative group">
                      <label className="block text-[10px] font-headline font-black tracking-[0.3em] text-zinc-500 uppercase mb-3">Identifier_Name</label>
                      <input
                        type="text"
                        placeholder="GUEST_USER"
                        className="w-full bg-transparent border-b border-white/10 focus:border-primary focus:ring-0 text-white placeholder-zinc-800 transition-all py-4 font-headline text-lg"
                      />
                    </div>
                    <div className="relative group">
                      <label className="block text-[10px] font-headline font-black tracking-[0.3em] text-zinc-500 uppercase mb-3">Electronic_Mail</label>
                      <input
                        type="email"
                        placeholder="USER@DOMAIN.COM"
                        className="w-full bg-transparent border-b border-white/10 focus:border-primary focus:ring-0 text-white placeholder-zinc-800 transition-all py-4 font-headline text-lg"
                      />
                    </div>
                  </div>
                  <button className="w-full bg-primary text-black py-5 font-headline font-black tracking-[0.3em] text-xs hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-4 rounded-xl shadow-[0_0_30px_rgba(129,236,255,0.3)]">
                    INITIALIZE_COMMS
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>

              <div className="grid grid-cols-2 gap-5">

                <div className="grid grid-cols-2 gap-5">
                  {[
                    {
                      label: 'GMAIL',
                      icon: <Mail />,
                      color: 'primary',
                      href: 'https://mail.google.com/mail/?view=cm&fs=1&to=shiviam02@gmail.com',
                    },
                    {
                      label: 'LINKEDIN',
                      icon: <Linkedin />,
                      color: 'secondary',
                      href: 'https://www.linkedin.com/in/shivam-kumar-b086842a9/',
                    },
                    {
                      label: 'GITHUB',
                      icon: <Github />,
                      color: 'primary',
                      href: 'https://github.com/Pantherrbx',
                    },
                    {
                      label: 'INSTAGRAM',
                      icon: <Instagram />,
                      color: 'secondary',
                      href: 'https://www.instagram.com/pantherrbx/',
                    },
                  ].map((social, i) => (
                    <a
                      key={i}
                      href={social.href}
                      target={social.label === 'GMAIL' ? undefined : '_blank'}
                      rel="noopener noreferrer"
                      className={`group flex flex-col p-10 bg-white/[0.03] rounded-[30px] border border-white/5 transition-all duration-300 ${social.color === 'primary'
                          ? 'hover:border-primary/40'
                          : 'hover:border-secondary/40'
                        }`}
                    >
                      <div
                        className={`${social.color === 'primary' ? 'text-primary' : 'text-secondary'
                          } mb-6`}
                      >
                        {React.cloneElement(
                          social.icon as React.ReactElement<any>,
                          { className: 'w-8 h-8' }
                        )}
                      </div>

                      <span className="font-headline text-[10px] tracking-[0.3em] font-black text-zinc-500 group-hover:text-white transition-colors">
                        {social.label}
                      </span>
                    </a>
                  ))}
                </div>


                {/* Decorative Grid Background */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#81ecff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-white/5 bg-surface-container-lowest">
        <div className="max-w-7xl mx-auto px-12 py-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-8">
            <div className="text-primary font-headline text-xl font-black tracking-tighter">SHIVAM</div>
            <div className="h-5 w-px bg-white/10 hidden md:block" />
            <span className="font-mono text-[9px] tracking-widest uppercase text-zinc-600">© 2024 SHIVAM // EVENT_HORIZON_OS</span>
          </div>
          <div className="flex gap-10 font-mono text-[10px] tracking-[0.2em] uppercase text-zinc-500 font-bold">
            <a href="#" className="hover:text-white transition-colors">GITHUB</a>
            <a href="#" className="hover:text-white transition-colors">LINKEDIN</a>
            <a href="#" className="hover:text-white transition-colors">TWITTER</a>
          </div>
          <div className="text-zinc-800 font-mono text-[9px] tracking-tighter uppercase font-bold">
            BUILD_VER: 0.9.4-STABLE
          </div>
        </div>
      </footer>
    </div>
  );
}
