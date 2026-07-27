"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  CheckCircle2,
  Clock,
  FileSpreadsheet,
  Users,
  Building,
  Smartphone,
  ShieldCheck,
  ChevronRight,
  Menu,
  X,
  PlayCircle,
  BarChart,
  Calendar,
  Building2,
  Lock,
  Zap,
  Globe2,
  Tablet,
  DoorOpen,
  Printer,
  CreditCard as IdCard,
  Camera,
  Package,
  Phone,
  Mail,
  Tag,
  Send,
  Star,
  BadgeCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 100 } },
};

const STAGGER_CONTAINER = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

type Vendor = {
  id: number;
  category: string;
  icon: React.ElementType;
  product: string;
  vendorName: string;
  tagline: string;
  price: string;
  rating: number;
  reviews: number;
  badge: string;
  features: string[];
  phone: string;
  email: string;
  whatsapp: string;
};

const VENDORS: Vendor[] = [
  {
    id: 1,
    category: 'Tablets',
    icon: Tablet,
    product: 'Android Attendance Tablets',
    vendorName: 'TabMart India',
    tagline: 'Wall-mountable kiosk tablets pre-configured for Unite Attendance',
    price: '₹6,999 – ₹14,999',
    rating: 4.8,
    reviews: 312,
    badge: 'Best Seller',
    features: ['10" IPS Display', 'NFC + QR Reader', '4G / Wi-Fi', 'Wall Mount Included', 'Long Battery Life'],
    phone: '+91-98765-43210',
    email: 'sales@tabmartindia.in',
    whatsapp: '919876543210',
  },
  {
    id: 2,
    category: 'Gate Machines',
    icon: DoorOpen,
    product: 'Flap Barrier Gate Machine',
    vendorName: 'GateGuard Systems',
    tagline: 'Smart turnstile & flap barriers with direct attendance system integration',
    price: '₹24,999 onwards',
    rating: 4.7,
    reviews: 186,
    badge: 'Verified Vendor',
    features: ['RFID & QR Compatible', 'Attendance API Ready', 'Stainless Steel Build', 'Bidirectional', 'Anti-tailgating'],
    phone: '+91-98000-11222',
    email: 'info@gateguard.co.in',
    whatsapp: '919800011222',
  },
  {
    id: 3,
    category: 'ID Printers',
    icon: Printer,
    product: 'Employee ID Card Printer',
    vendorName: 'CardPrint Pro',
    tagline: 'Single & dual-sided ID card printers with photo-quality output',
    price: '₹11,999 – ₹29,999',
    rating: 4.6,
    reviews: 224,
    badge: 'Verified Vendor',
    features: ['300 DPI Print Quality', 'Single & Dual Side', 'USB + Network Port', '200+ Cards/hr', 'Includes Starter Kit'],
    phone: '+91-90000-55443',
    email: 'orders@cardprintpro.in',
    whatsapp: '919000055443',
  },
  {
    id: 4,
    category: 'Access Cards',
    icon: IdCard,
    product: 'RFID Employee ID Cards',
    vendorName: 'RFIDStore India',
    tagline: 'Bulk RFID cards compatible with all gate machines and attendance terminals',
    price: '₹12 – ₹25 per card',
    rating: 4.9,
    reviews: 540,
    badge: 'Best Seller',
    features: ['ISO 14443A Standard', 'Universal Compatibility', 'Custom Printing Available', 'Min. Order 50 cards', 'Fast Dispatch'],
    phone: '+91-87654-32109',
    email: 'bulk@rfidstore.in',
    whatsapp: '918765432109',
  },
  {
    id: 5,
    category: 'Printers',
    icon: Package,
    product: 'Thermal Attendance Slip Printer',
    vendorName: 'PrintTech Solutions',
    tagline: 'Print attendance receipts and reports directly at the gate',
    price: '₹3,499 – ₹7,999',
    rating: 4.5,
    reviews: 98,
    badge: 'Verified Vendor',
    features: ['80mm Paper Roll', 'USB + Bluetooth', 'Auto-Cut Mechanism', 'ESC/POS Compatible', 'Fast Thermal Print'],
    phone: '+91-80000-77665',
    email: 'sales@printtech.in',
    whatsapp: '918000077665',
  },
  {
    id: 6,
    category: 'Cameras',
    icon: Camera,
    product: 'IP Security Camera',
    vendorName: 'SafeView Technologies',
    tagline: 'HD surveillance cameras for gate entry monitoring and workforce safety',
    price: '₹2,499 onwards',
    rating: 4.6,
    reviews: 415,
    badge: 'Verified Vendor',
    features: ['4MP Full HD', 'Night Vision IR', 'IP66 Weatherproof', 'Motion Alerts', 'Remote Viewing App'],
    phone: '+91-73456-78901',
    email: 'support@safeview.in',
    whatsapp: '917345678901',
  },
];

const CATEGORIES = ['All', 'Tablets', 'Gate Machines', 'ID Printers', 'Access Cards', 'Printers', 'Cameras'];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [videoOpen, setVideoOpen] = React.useState(false);
  const [selectedVendor, setSelectedVendor] = React.useState<Vendor | null>(null);
  const [activeCategory, setActiveCategory] = React.useState('All');
  const [inquiryForm, setInquiryForm] = React.useState({ name: '', company: '', phone: '', message: '' });
  const [inquirySent, setInquirySent] = React.useState(false);

  const filteredVendors = activeCategory === 'All'
    ? VENDORS
    : VENDORS.filter(v => v.category === activeCategory);

  const handleInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setInquirySent(true);
    setTimeout(() => {
      setSelectedVendor(null);
      setInquirySent(false);
      setInquiryForm({ name: '', company: '', phone: '', message: '' });
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/20">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-primary flex items-center justify-center">
                <Clock className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl tracking-tight text-foreground">Unite Attendance</span>
            </div>
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#marketplace" className="text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />Hardware Store
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">FAQ</a>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Button variant="ghost">Log In</Button>
              <Link href="/checkout">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold">Start Free Trial</Button>
              </Link>
            </div>
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-background pt-20 px-4">
          <div className="flex flex-col space-y-4">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Features</a>
            <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">How it Works</a>
            <a href="#marketplace" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium flex items-center gap-2"><Tag className="w-4 h-4 text-primary" />Hardware Store</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">Pricing</a>
            <a href="#faq" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">FAQ</a>
            <hr className="my-4 border-border" />
            <Button variant="outline" className="w-full">Log In</Button>
            <Link href="/checkout" className="w-full">
              <Button className="w-full bg-primary text-primary-foreground">Start Free Trial</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-4 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial="hidden"
            animate="show"
            variants={STAGGER_CONTAINER}
            className="flex flex-col items-center max-w-4xl mx-auto"
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="mb-6 flex items-center gap-2 px-3 py-1 rounded-full bg-muted border border-border text-sm font-medium text-foreground">
              <Zap className="w-4 h-4 text-primary fill-primary" />
              <span>Powered by PunchLogs™</span>
            </motion.div>
            
            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] mb-8">
              Attendance Made Simple. <br className="hidden md:block" />
              <span className="text-primary">Business Made Smarter.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed">
              Eliminate paper registers and Excel sheets. Unite Attendance is the precise, reliable platform built for real Indian businesses from 10 to 10,000 employees. 
            </motion.p>
            
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <Link href="/checkout">
                <Button size="lg" className="w-full sm:w-auto text-base h-14 px-8 font-semibold shadow-lg shadow-primary/25">
                  Start Free Trial
                </Button>
              </Link>
              <a href="#pricing">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base h-14 px-8 font-semibold">
                  View Pricing
                </Button>
              </a>
            </motion.div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, type: 'spring' }}
            className="mt-16 md:mt-24 relative max-w-5xl mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
            <div className="rounded-2xl border border-border/50 bg-card p-2 shadow-2xl overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src="/assets/generated_images/hero-dashboard.jpg" 
                alt="Unite Attendance Dashboard" 
                className="w-full h-auto rounded-xl border border-border object-cover aspect-[16/9]"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000';
                }}
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-24 bg-muted/50 border-y border-border">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Why Businesses Choose Unite</h2>
            <p className="text-muted-foreground text-lg">Built for the realities of Indian operations, not just Silicon Valley offices.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Zap, title: "10-Minute Setup", desc: "No IT team required. Go live before your next shift starts." },
              { icon: Smartphone, title: "No Hardware Needed", desc: "Any office phone, tablet, or PC works as your attendance terminal." },
              { icon: Globe2, title: "Cloud-Based Access", desc: "Monitor your operations from anywhere in the world, securely." },
              { icon: Building, title: "Built to Scale", desc: "Works effortlessly for 10 employees, robust enough for 10,000." },
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0, transition: { delay: i * 0.1 } }
                }}
                className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-16">
            <h2 className="text-4xl font-bold mb-6">Everything You Need. <br /><span className="text-muted-foreground">Nothing You Don&apos;t.</span></h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Users, title: "Employee Directory", desc: "Centralized database for all employee records and documents." },
              { icon: FileSpreadsheet, title: "Payroll-Ready Reports", desc: "Export perfect attendance data straight to your payroll software." },
              { icon: Building2, title: "Multi-Branch Management", desc: "Manage multiple locations, factories, and offices from one dashboard." },
              { icon: Calendar, title: "Leave Management", desc: "Streamlined requests, approvals, and balance tracking." },
              { icon: Smartphone, title: "Mobile Access", desc: "Dedicated mobile view for managers on the go." },
              { icon: Lock, title: "Secure Cloud Storage", desc: "Bank-grade security ensures your operational data is always safe." },
              { icon: BarChart, title: "Admin & HR Dashboards", desc: "Separate, secure views with role-based access control." },
              { icon: Clock, title: "Employee Attendance", desc: "Accurate logging with shifts, grace periods, and overtime rules." },
              { icon: ShieldCheck, title: "Department Management", desc: "Organize teams perfectly matching your real-world structure." },
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1 }}
                className="group p-6 rounded-2xl border border-border/50 bg-muted/20 hover:bg-card hover:border-primary/30 transition-colors"
              >
                <f.icon className="w-8 h-8 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Split Image Section */}
      <section className="py-24 bg-card border-y border-border overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border border-border">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src="/assets/generated_images/industry-tablet.jpg" 
                  alt="Tablet check-in terminal" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200';
                  }}
                />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-background p-6 rounded-2xl shadow-xl border border-border max-w-xs hidden md:block">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg">99.9% Accuracy</p>
                    <p className="text-sm text-muted-foreground">Zero disputed shifts</p>
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">Designed for real-world operations.</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Whether you run a manufacturing plant with rotating shifts or a retail chain with hundreds of outlets, Unite Attendance adapts to your workflow.
              </p>
              
              <div className="space-y-6">
                {[
                  { title: "Save Time", desc: "Automate calculation of work hours, overtime, and late marks." },
                  { title: "Improve Accuracy", desc: "Eradicate buddy punching and manual entry errors." },
                  { title: "Reduce Costs", desc: "Stop paying for unworked time. Ensure precise payroll." },
                  { title: "Work From Anywhere", desc: "HR can manage exceptions while managers approve leaves remotely." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Up and Running in 10 Minutes</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">No complex implementations. No lengthy training.</p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-border -z-10" />
            
            {[
              { step: "01", title: "Create Organization", desc: "Sign up and set up your company profile." },
              { step: "02", title: "Add Employees", desc: "Bulk import or add team members manually." },
              { step: "03", title: "Configure Rules", desc: "Set up shifts, grace periods, and weekends." },
              { step: "04", title: "Start Attendance", desc: "Mount a tablet or use the web dashboard." }
            ].map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative bg-background pt-8 md:pt-0"
              >
                <div className="w-16 h-16 rounded-2xl bg-card border border-border shadow-sm flex items-center justify-center text-xl font-bold text-primary mx-auto mb-6">
                  {s.step}
                </div>
                <div className="text-center">
                  <h4 className="text-lg font-bold mb-2">{s.title}</h4>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Video Section */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-20"
          >
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-2xl bg-card group cursor-pointer" onClick={() => setVideoOpen(true)}>
              {/* Thumbnail with overlay */}
              <div className="aspect-video w-full bg-gradient-to-br from-primary/20 via-card to-muted flex items-center justify-center relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%), radial-gradient(circle at 75% 75%, hsl(var(--primary)) 0%, transparent 50%)' }} />
                {/* Mock dashboard screenshot strips */}
                <div className="absolute inset-0 flex flex-col gap-4 p-8 opacity-20 pointer-events-none">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-6 rounded bg-primary/40" style={{ width: `${60 + (i % 3) * 15}%` }} />
                  ))}
                </div>
                {/* Play button */}
                <div className="relative z-10 flex flex-col items-center gap-4">
                  <div className="w-24 h-24 rounded-full bg-primary shadow-2xl shadow-primary/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <PlayCircle className="w-12 h-12 text-primary-foreground fill-primary-foreground" />
                  </div>
                  <p className="text-lg font-semibold text-foreground">Watch How It Works</p>
                  <p className="text-sm text-muted-foreground">2-minute product walkthrough</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Video Modal */}
          <AnimatePresence>
            {videoOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={() => setVideoOpen(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="relative w-full max-w-4xl bg-black rounded-2xl overflow-hidden shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => setVideoOpen(false)}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <div className="aspect-video w-full">
                    <iframe
                      className="w-full h-full"
                      src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0"
                      title="Unite Attendance Product Demo"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Who Uses It (Marquee style representation) */}
      <section className="py-20 bg-muted/30 overflow-hidden border-y border-border">
        <div className="max-w-7xl mx-auto px-4 mb-10 text-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Trusted across industries</h2>
        </div>
        <div className="flex overflow-hidden relative">
          <div className="flex gap-4 min-w-max animate-marquee px-4">
            {[
              "Manufacturing", "Retail Chains", "Restaurants", "Hotels", 
              "Hospitals", "Warehouses", "Educational Institutions", "NGOs", 
              "Offices", "Startups", "Service Businesses",
              "Manufacturing", "Retail Chains", "Restaurants", "Hotels"
            ].map((industry, i) => (
              <div key={i} className="whitespace-nowrap px-6 py-3 rounded-full bg-background border border-border text-foreground font-medium shadow-sm">
                {industry}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hardware Marketplace */}
      <section id="marketplace" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-4">
              <Tag className="w-4 h-4" />
              Hardware Store
            </div>
            <h2 className="text-4xl font-bold mb-4">Everything You Need to Get Started</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Verified vendors offering attendance hardware at competitive prices.
              Connect directly — no middlemen, no markups.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  activeCategory === cat
                    ? 'bg-primary text-primary-foreground border-primary shadow-sm shadow-primary/20'
                    : 'bg-background text-muted-foreground border-border hover:border-primary/40 hover:text-foreground'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Vendor Cards Grid */}
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredVendors.map((vendor) => (
                <motion.div
                  key={vendor.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="bg-card border border-border rounded-2xl overflow-hidden hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all group flex flex-col"
                >
                  {/* Card top — icon + badge */}
                  <div className="bg-gradient-to-br from-primary/10 via-muted/30 to-muted/10 p-6 flex items-start justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors">
                      <vendor.icon className="w-7 h-7 text-primary" />
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                      vendor.badge === 'Best Seller'
                        ? 'bg-amber-100 text-amber-700 border border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800'
                        : 'bg-green-100 text-green-700 border border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800'
                    }`}>
                      {vendor.badge === 'Best Seller' ? '★ ' : ''}
                      {vendor.badge}
                    </span>
                  </div>

                  {/* Card body */}
                  <div className="p-5 flex flex-col flex-1">
                    <p className="text-xs font-semibold text-primary uppercase tracking-wide mb-1">{vendor.vendorName}</p>
                    <h3 className="text-lg font-bold mb-1 leading-tight">{vendor.product}</h3>
                    <p className="text-sm text-muted-foreground mb-3 leading-relaxed">{vendor.tagline}</p>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < Math.floor(vendor.rating) ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-semibold">{vendor.rating}</span>
                      <span className="text-xs text-muted-foreground">({vendor.reviews} reviews)</span>
                    </div>

                    {/* Features */}
                    <ul className="space-y-1.5 mb-5">
                      {vendor.features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* Price + CTA */}
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs text-muted-foreground font-medium">Starting at</p>
                        <p className="text-lg font-bold text-foreground">{vendor.price}</p>
                      </div>
                      <Button
                        size="sm"
                        className="shrink-0 font-semibold"
                        onClick={() => { setSelectedVendor(vendor); setInquirySent(false); }}
                      >
                        Contact Vendor
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          <p className="text-center text-sm text-muted-foreground mt-10">
            All vendors are independently operated. Unite Attendance connects you directly — we don&apos;t take a commission.
            <span className="text-primary font-medium"> Want to list your products? </span>
            <a href="mailto:vendors@uniteattendance.in" className="underline underline-offset-2 text-primary">Partner with us</a>
          </p>
        </div>
      </section>

      {/* Vendor Contact Modal */}
      <AnimatePresence>
        {selectedVendor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedVendor(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.93, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.93, y: 20 }}
              transition={{ type: 'spring', damping: 24, stiffness: 200 }}
              className="bg-card border border-border rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal header */}
              <div className="bg-gradient-to-br from-primary/15 via-muted/30 to-muted/10 p-5 flex items-start justify-between border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center">
                    <selectedVendor.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-base leading-tight">{selectedVendor.product}</p>
                    <p className="text-sm text-primary font-semibold">{selectedVendor.vendorName}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedVendor(null)}
                  className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5">
                {inquirySent ? (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-8 text-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <BadgeCheck className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Inquiry Sent!</h3>
                    <p className="text-muted-foreground text-sm">
                      {selectedVendor.vendorName} will reach out to you shortly on your phone number.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    {/* Quick contact links */}
                    <div className="grid grid-cols-3 gap-2 mb-5">
                      <a
                        href={`tel:${selectedVendor.phone}`}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
                      >
                        <Phone className="w-5 h-5 text-primary" />
                        <span className="text-xs font-semibold">Call Now</span>
                        <span className="text-[10px] text-muted-foreground leading-tight">{selectedVendor.phone}</span>
                      </a>
                      <a
                        href={`https://wa.me/${selectedVendor.whatsapp}?text=Hi, I found your listing on Unite Attendance. I'm interested in ${selectedVendor.product}.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-muted/30 hover:border-green-400/60 hover:bg-green-500/10 transition-all text-center"
                      >
                        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-green-500"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span className="text-xs font-semibold">WhatsApp</span>
                        <span className="text-[10px] text-muted-foreground">Chat instantly</span>
                      </a>
                      <a
                        href={`mailto:${selectedVendor.email}?subject=Inquiry: ${selectedVendor.product}&body=Hi, I found your listing on Unite Attendance. I'm interested in ${selectedVendor.product}. Please send me more details.`}
                        className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-muted/30 hover:border-primary/40 hover:bg-primary/5 transition-all text-center"
                      >
                        <Mail className="w-5 h-5 text-primary" />
                        <span className="text-xs font-semibold">Email</span>
                        <span className="text-[10px] text-muted-foreground leading-tight truncate w-full">{selectedVendor.email}</span>
                      </a>
                    </div>

                    <div className="relative mb-5">
                      <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
                      <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">or send a quick inquiry</span></div>
                    </div>

                    {/* Inquiry form */}
                    <form onSubmit={handleInquiry} className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          required
                          placeholder="Your name"
                          value={inquiryForm.name}
                          onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                          className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                        <input
                          placeholder="Company name"
                          value={inquiryForm.company}
                          onChange={e => setInquiryForm(f => ({ ...f, company: e.target.value }))}
                          className="h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                        />
                      </div>
                      <input
                        required
                        type="tel"
                        placeholder="Phone number"
                        value={inquiryForm.phone}
                        onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                      />
                      <textarea
                        placeholder={`I'm interested in ${selectedVendor.product}. Please share pricing and availability.`}
                        value={inquiryForm.message}
                        onChange={e => setInquiryForm(f => ({ ...f, message: e.target.value }))}
                        rows={3}
                        className="w-full px-3 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-none"
                      />
                      <Button type="submit" className="w-full font-semibold h-10">
                        <Send className="w-4 h-4 mr-2" />
                        Send Inquiry to {selectedVendor.vendorName}
                      </Button>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pricing */}
      <section id="pricing" className="py-24 bg-muted/20">
        <div className="max-w-5xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-4">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Pay only for active employees. Upgrade or downgrade anytime.
            </p>
          </div>

          {/* Launch offer banner */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-200 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300 rounded-2xl px-5 py-3 mb-10 max-w-lg mx-auto"
          >
            <Zap className="w-5 h-5 text-amber-500 fill-amber-400 shrink-0" />
            <p className="text-sm font-semibold">
              Launch Offer: <span className="text-amber-600 dark:text-amber-400">25% OFF</span> — Limited time. Lock in your price today.
            </p>
          </motion.div>

          {/* Pricing table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-card border border-border rounded-2xl overflow-hidden shadow-xl shadow-black/5"
          >
            {/* Table header */}
            <div className="grid grid-cols-4 bg-muted/60 border-b border-border text-sm font-bold text-muted-foreground">
              <div className="px-6 py-4">Active Employees</div>
              <div className="px-6 py-4 text-right line-through decoration-muted-foreground/50">Regular Price</div>
              <div className="px-6 py-4 text-right text-primary">Launch Offer</div>
              <div className="px-6 py-4 text-right">Per Employee</div>
            </div>

            {/* Table rows */}
            {[
              { range: 'Up to 10',   regular: '₹499',          offer: '₹375',        per: '₹37.50', highlight: false },
              { range: '11 – 25',    regular: '₹999',          offer: '₹749',        per: '₹30.00', highlight: false },
              { range: '26 – 50',    regular: '₹1,499',        offer: '₹1,125',      per: '₹22.50', highlight: false },
              { range: '51 – 100',   regular: '₹2,499',        offer: '₹1,875',      per: '₹18.75', highlight: true  },
              { range: '101 – 200',  regular: '₹3,999',        offer: '₹2,999',      per: '₹15.00', highlight: false },
              { range: '201 – 500',  regular: '₹6,999',        offer: '₹5,249',      per: '₹10.50', highlight: false },
              { range: '501 – 1,000',regular: '₹11,999',       offer: '₹8,999',      per: '₹9.00',  highlight: false },
              { range: '1,001+',     regular: 'Contact Sales', offer: 'Custom Quote', per: '—',      highlight: false },
            ].map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`grid grid-cols-4 border-b border-border last:border-0 text-sm transition-colors ${
                  row.highlight
                    ? 'bg-primary/5 border-l-2 border-l-primary'
                    : 'hover:bg-muted/30'
                }`}
              >
                <div className="px-6 py-4 font-semibold flex items-center gap-2">
                  {row.highlight && (
                    <span className="text-[10px] font-bold bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                      Popular
                    </span>
                  )}
                  {row.range}
                </div>
                <div className="px-6 py-4 text-right text-muted-foreground line-through">
                  {row.regular}
                  {row.regular !== 'Contact Sales' && <span className="not-italic no-underline text-muted-foreground/60">/mo</span>}
                </div>
                <div className="px-6 py-4 text-right font-bold text-foreground">
                  {row.offer === 'Custom Quote' ? (
                    <span className="text-primary">{row.offer}</span>
                  ) : (
                    <>{row.offer}<span className="font-normal text-muted-foreground">/mo</span></>
                  )}
                </div>
                <div className="px-6 py-4 text-right text-muted-foreground font-medium">{row.per}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Features & CTA */}
          <div className="mt-10 grid md:grid-cols-2 gap-6 items-start">
            <div className="bg-card border border-border rounded-2xl p-6">
              <p className="text-sm font-bold uppercase tracking-wide text-muted-foreground mb-4">All plans include</p>
              <ul className="space-y-2.5">
                {[
                  'All core attendance features',
                  'Multi-branch & department support',
                  'Leave management',
                  'Payroll-ready reports',
                  'Admin & HR dashboards',
                  'Secure cloud storage',
                  'Email & chat support',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4">
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-1">Ready to get started?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  14-day free trial. No credit card charged until day 15. Cancel anytime.
                </p>
                <Link href="/checkout" className="block">
                  <Button size="lg" className="w-full h-12 font-bold text-base">
                    Start Free Trial — ₹0 today
                  </Button>
                </Link>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-bold text-base mb-1">Enterprise / 1,001+ employees?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Get a custom quote tailored to your headcount and branch setup.
                </p>
                <a href="mailto:sales@uniteattendance.in" className="block">
                  <Button size="lg" variant="outline" className="w-full h-11 font-semibold">
                    Contact Sales
                  </Button>
                </a>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground mt-8">
            Prices in INR, billed monthly. Active employee count is calculated on the last day of each billing cycle.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-muted/20 border-y border-border">
        <div className="max-w-3xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
          </div>
          
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1" className="bg-card px-6 rounded-lg border mb-4">
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">Do I need to buy a biometric machine?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                No hardware is required. You can use any existing office tablet, PC, or even a smartphone as your dedicated attendance terminal.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="bg-card px-6 rounded-lg border mb-4">
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">How long does setup take?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                Literally 10 minutes. Create an account, add your shift timings, import your employee list via Excel, and you are ready to log attendance.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3" className="bg-card px-6 rounded-lg border mb-4">
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">Can I manage multiple branches?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                Yes. Unite Attendance is built for scale. You can manage multiple locations, branches, and departments from a single admin dashboard.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4" className="bg-card px-6 rounded-lg border mb-4">
              <AccordionTrigger className="text-left font-semibold text-lg hover:no-underline py-6">Does it require installation on my PC?</AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base pb-6 leading-relaxed">
                No, it is a 100% cloud-based SaaS platform. You access it through your web browser just like email, meaning your data is always safe even if your computer crashes.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 -z-10" />
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8">Ready to Simplify Attendance?</h2>
          <p className="text-xl text-muted-foreground mb-10">
            10-Minute Setup • No Attendance Machine Required • Powered by PunchLogs™
          </p>
          <Link href="/checkout">
            <Button size="lg" className="h-16 px-10 text-lg font-bold shadow-2xl shadow-primary/20">
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 text-center text-muted-foreground">
        <div className="flex items-center justify-center gap-2 mb-6">
          <Clock className="w-6 h-6 text-primary" />
          <span className="font-bold text-xl text-foreground">Unite Attendance</span>
        </div>
        <p className="mb-4" suppressHydrationWarning>© {new Date().getFullYear()} Unite Attendance. All rights reserved.</p>
        <p className="text-sm">Powered by PunchLogs™</p>
      </footer>
    </div>
  );
}
