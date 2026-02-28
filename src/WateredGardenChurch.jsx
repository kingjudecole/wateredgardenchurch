import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Menu, X, ChevronDown, Phone, Mail, MapPin, Clock, Play, Pause,
  Youtube, Instagram, Facebook, Twitter, MessageCircle, ArrowUp,
  BookOpen, Users, Globe, Heart, Star, Mic, ChevronRight,
  Sun, Moon, Send, Loader, Cross, Sparkles, Calendar, Music,
  ShoppingBag, Map, Headphones, FileText, Shield, HelpCircle,
  Volume2, VolumeX, Check, ArrowRight, Flame, Zap, Award
} from "lucide-react";

// ===== GLOBAL STYLES =====
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=Raleway:wght@300;400;500;600;700&family=EB+Garamond:ital,wght@0,400;0,600;1,400&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  :root {
    --gold: #D4AF37;
    --gold-light: #E8CC6A;
    --gold-dim: rgba(212,175,55,0.15);
    --dark-bg: #080808;
    --dark-surface: #111111;
    --dark-card: #161616;
    --dark-border: rgba(212,175,55,0.2);
    --navy: #0D1B2A;
    --text-primary: #F5F0E8;
    --text-muted: #9A9080;
    --text-dim: #5A5450;
    --light-bg: #FAFAF8;
    --light-surface: #F0EDE8;
    --light-card: #FFFFFF;
    --light-border: rgba(0,0,0,0.1);
    --light-text: #1A1208;
    --light-muted: #6B6458;
  }

  html { scroll-behavior: smooth; }
  
  body {
    font-family: 'Raleway', sans-serif;
    background: var(--dark-bg);
    color: var(--text-primary);
    overflow-x: hidden;
    transition: background 0.4s ease, color 0.4s ease;
  }

  body.light-mode {
    background: var(--light-bg);
    color: var(--light-text);
  }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--dark-bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

  .light-mode ::-webkit-scrollbar-track { background: var(--light-bg); }

  @keyframes floatOrb {
    0%, 100% { transform: translate(0, 0) scale(1); }
    33% { transform: translate(30px, -50px) scale(1.05); }
    66% { transform: translate(-20px, 20px) scale(0.95); }
  }
  @keyframes goldPulse {
    0%, 100% { opacity: 0.4; }
    50% { opacity: 0.8; }
  }
  @keyframes shimmer {
    0% { background-position: -200% center; }
    100% { background-position: 200% center; }
  }
  @keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes ripple {
    0% { transform: scale(0); opacity: 1; }
    100% { transform: scale(4); opacity: 0; }
  }

  .gold-gradient { background: linear-gradient(135deg, #D4AF37, #E8CC6A, #B8960C); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; }
  .gold-shimmer-text {
    background: linear-gradient(90deg, #D4AF37 0%, #F0D060 25%, #D4AF37 50%, #B8960C 75%, #D4AF37 100%);
    background-size: 200% auto;
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    animation: shimmer 4s linear infinite;
  }
  .glass {
    background: rgba(8,8,8,0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid var(--dark-border);
  }
  .light-mode .glass {
    background: rgba(250,250,248,0.8);
    border-bottom: 1px solid var(--light-border);
  }
  .section-divider {
    width: 60px; height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
    margin: 0 auto 48px;
  }
  .card-glow:hover {
    box-shadow: 0 0 30px rgba(212,175,55,0.15), 0 20px 60px rgba(0,0,0,0.5);
  }
  .btn-primary {
    background: linear-gradient(135deg, #D4AF37, #B8960C);
    color: #080808;
    font-family: 'Raleway', sans-serif;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 13px;
    padding: 14px 32px;
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .btn-primary:hover { filter: brightness(1.1); }
  .btn-secondary {
    background: transparent;
    color: var(--gold);
    font-family: 'Raleway', sans-serif;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    font-size: 13px;
    padding: 13px 32px;
    border: 1px solid var(--gold);
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  .btn-secondary:hover { background: var(--gold-dim); }
  .light-mode .btn-secondary { color: #B8960C; border-color: #B8960C; }
  .light-mode .btn-secondary:hover { background: rgba(180,150,12,0.1); }
  .page-content { padding-top: 80px; min-height: 100vh; }
`;

// ===== DATA =====
const CHURCH_DATA = {
  name: "Watered Garden Church",
  shortName: "Watered Garden",
  tagline: "Where His Glory Flows",
  founded: 1989,
  overseer: "Prophet Prince Manasseh Atsu",
  overseerTitle: "General Overseer & Founder",
  overseerBio: "A prophetic voice spanning over three decades, Prophet Prince Manasseh Atsu has carried the fire of the Holy Spirit across Africa, Asia, Europe, and the United States. Founder of Operation Church Everywhere, he is called to establish the Kingdom wherever darkness lingers.",
  mission: "To manifest the glory of God in every sphere of human existence — bringing healing, purpose, and divine order through the uncompromising teaching of God's Word.",
  vision: "A world saturated with the knowledge of God's glory, where every soul walks in the fullness of their divine destiny.",
  address: "A 982/17, Dansoman Roundabout, Accra, Ghana",
  phone: "+233 24 308 7949",
  whatsapp: "233243087949",
  email: "wateredgardengh@gmail.com",
  mapsLink: "https://maps.app.goo.gl/wn6HL4ShAA4NEhXX7",
  social: {
    facebook: "https://web.facebook.com/wateredgardenchurch/",
    instagram: "https://www.instagram.com/prophetprincemanassehatsu/",
    youtube: "https://www.youtube.com/@prophetprincemanassehatsu4550/",
    twitter: "https://x.com/WateredGardenGH",
    tiktok: "https://www.tiktok.com/@prophetatsumanasseh",
    instagramYouth: "https://www.instagram.com/wateredgardenyouth/"
  }
};

const SERVICES = [
  { day: "Sunday", events: [
    { time: "8:00 AM – 8:45 AM", name: "Discipleship Class", desc: "In-depth study of the Word — shaping disciples, not just converts.", icon: BookOpen },
    { time: "8:45 AM – 10:45 AM", name: "First Service", desc: "The flagship gathering of the Watered Garden family. Come expectant.", icon: Star },
    { time: "11:00 AM – 1:00 PM", name: "Second Service", desc: "The glory flows again. Same fire, same power. New souls welcomed.", icon: Flame },
  ]},
  { day: "Monday", events: [
    { time: "10:00 AM – 1:00 PM", name: "Monday Prophetic Service", desc: "The most anticipated gathering of the week. Prophetic ministry, supernatural encounters, divine direction.", icon: Zap },
  ]},
  { day: "Tuesday – Friday", events: [
    { time: "9:00 AM – 2:00 PM", name: "Spiritual Development Meetings", desc: "Daily formation through prayer, the Word, and the Spirit. For those who hunger for more.", icon: Music },
  ]},
];

const TESTIMONIES = [
  { name: "Abena Mensah-Owusu", role: "Attorney, Accra", years: "12 years at Watered Garden", text: "I walked in carrying a divorce, two failed businesses, and a heart that had stopped believing. Through the Monday Prophetic Service, Prophet Manasseh spoke things no human could have known. My marriage was restored, my business recovered, and I found myself again." },
  { name: "Dr. Emmanuel Tetteh", role: "Medical Director, Korle Bu", years: "8 years at Watered Garden", text: "I was diagnosed with a condition my own colleagues said was terminal. I attended one 5 Days of Glory crusade and left healed. Every medical test since then confirms what heaven declared: there is no sickness where God's glory flows." },
  { name: "Ambassador Grace Asante", role: "Diplomat, UN Accra Office", years: "15 years at Watered Garden", text: "Working at the highest levels of international diplomacy, I still needed something no position could give me — peace. This ministry gave me a prophetic compass. Every major appointment in my career was preceded by a word from this pulpit." },
  { name: "Kwame Darko-Boateng", role: "Entrepreneur, London & Accra", years: "6 years at Watered Garden", text: "I found Watered Garden online while living in the UK and feeling spiritually dry. I flew to Accra for one service. I never left. The teaching restructured my entire understanding of purpose, and I launched the most successful chapter of my business life within that same year." },
  { name: "Sister Patience Antwi", role: "Nurse & Mother of Four", years: "20 years at Watered Garden", text: "My last child was told by doctors she would never walk normally. We brought her to a healing service. Today she dances before the Lord every Sunday. I don't have another explanation except that God's glory is real and it lives in this house." },
  { name: "Prof. Richard Kojo Asumang", role: "Academic & Author", years: "10 years at Watered Garden", text: "As a scholar, I came to interrogate. I stayed because the depth of the Word preached here challenged everything I thought I knew. This ministry produced my most significant published research on prophetic literature. Faith and intellect are not enemies here." },
  { name: "Nana Ama Osei-Bonsu", role: "CEO, Pan-African Media Group", years: "9 years at Watered Garden", text: "I launched my media company with nothing but a prophetic word received at this church. Every time I faced a crossroads, I came back to this altar and left with divine clarity. The anointing here is not a performance — it is the real, tangible, life-altering presence of God." },
];

const BOOKS = [
  { title: "Discerning The Lord's Body", author: "Prophet Prince Manasseh Atsu", desc: "A revelatory teaching on communion, spiritual discernment, and the body of Christ. Life-transforming.", price: "$15", tag: "Bestseller" },
  { title: "The Prophetic Office", author: "Prophet Prince Manasseh Atsu", desc: "Understanding the prophetic anointing — its function, responsibility, and divine purpose in the modern church.", price: "$18", tag: "Essential" },
  { title: "Operation Church Everywhere", author: "Prophet Prince Manasseh Atsu", desc: "The mandate, the mission, and the methods of planting God's Kingdom in every community worldwide.", price: "$14", tag: "New" },
  { title: "Walking In Glory", author: "Prophet Prince Manasseh Atsu", desc: "A practical guide to manifesting God's glory in everyday life — your career, family, finances, and destiny.", price: "$16", tag: null },
  { title: "Divine Order", author: "Prophet Prince Manasseh Atsu", desc: "God's blueprint for your life — aligning your steps with prophetic timing and divine purpose.", price: "$15", tag: null },
  { title: "The Anointing & Your Destiny", author: "Prophet Prince Manasseh Atsu", desc: "Discovering how the prophetic anointing unlocks the hidden potential sealed within every believer.", price: "$17", tag: null },
];

const BRANCHES = [
  { name: "Watered Garden HQ", location: "Dansoman Roundabout, Accra, Ghana", type: "Headquarters", established: 1989, overseer: "Prophet Prince Manasseh Atsu" },
  { name: "Watered Garden — Tema", location: "Tema Community 1, Greater Accra, Ghana", type: "Branch", established: 2005, overseer: "Pastor Andrews Nkrumah" },
  { name: "Watered Garden — Kumasi", location: "Adum, Ashanti Region, Ghana", type: "Branch", established: 2009, overseer: "Pastor Grace Osei" },
  { name: "Watered Garden — Takoradi", location: "Effia, Western Region, Ghana", type: "Branch", established: 2012, overseer: "Pastor Samuel Fiagbenu" },
  { name: "Watered Garden — London", location: "Peckham, London, United Kingdom", type: "International", established: 2015, overseer: "Pastor James Darko" },
  { name: "Watered Garden — Houston", location: "Houston, Texas, USA", type: "International", established: 2018, overseer: "Pastor Victoria Mensah" },
];

const NEWS = [
  { title: "5 Days of Glory Crusade Returns to Accra", date: "February 2026", category: "Events", desc: "The flagship evangelism crusade returns with unprecedented expectation. Thousands expected across five nights of signs, wonders, and prophetic ministry.", tag: "Upcoming" },
  { title: "Prophet Manasseh Speaks at UN Interfaith Summit", date: "January 2026", category: "News", desc: "Our General Overseer was invited to address world leaders on the role of prophetic ministry in global reconciliation and peace." },
  { title: "Higher Calling Conference 2026 Announced", date: "December 2025", category: "Events", desc: "The annual conference that repositions ministers and believers for excellence. Registration now open. Speakers announced soon." },
  { title: "Operation Church Everywhere: 50 Communities Reached", date: "November 2025", category: "Missions", desc: "The OCE team completed its most ambitious crusade season — 50 new communities across Ghana reached with the Gospel of the Kingdom." },
  { title: "New Book: The Anointing & Your Destiny Released", date: "October 2025", category: "Books", desc: "Prophet Manasseh's latest release is already transforming readers' understanding of purpose and prophetic timing. Available in our bookstore." },
  { title: "Youth Ministry Launches Global Prayer Chain", date: "September 2025", category: "Youth", desc: "Watered Garden Youth activates a 24/7 international prayer chain spanning 12 countries. Young people choosing intercession over everything." },
];

const FAQS = [
  { q: "What should I wear to a service?", a: "Come as you are. While we appreciate smart and modest dressing as a sign of reverence, we welcome everyone — regardless of how they arrive. God sees the heart first." },
  { q: "Do I need to register before attending?", a: "No registration is required for regular Sunday or Monday services. Simply show up. You are expected and you are welcome." },
  { q: "What denomination is Watered Garden Church?", a: "We are a Charismatic, Pentecostal, prophetic church. We believe in the full operation of all the gifts of the Holy Spirit as described in Scripture." },
  { q: "Is there parking available?", a: "Yes. Parking is available at and around the Dansoman Roundabout premises. Ushers are available to assist you." },
  { q: "Do you offer online services?", a: "Yes. All major services are streamed live on our YouTube channel and social media platforms. Follow @prophetprincemanassehatsu for links before each service." },
  { q: "How can I join the church officially?", a: "Attend any Sunday Discipleship Class (8:00–8:45 AM) as a starting point. You may also contact our office via WhatsApp or phone to begin your membership journey." },
  { q: "Can I request a personal prophetic session or counseling?", a: "Yes. Use the Counseling or Prayer Request pages on this website, or contact us directly via WhatsApp at +233 24 308 7949. We will schedule a session with a minister." },
  { q: "Are your books available internationally?", a: "Yes. Several titles are available on Amazon. You may also order directly through this website or call +233 24 308 7949 / +233 55 308 8951 for local orders." },
];

// ===== ANIMATION VARIANTS =====
const fadeUp = { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] } } };
const fadeIn = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.6 } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };
const scaleIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } } };

// ===== UTILITY COMPONENTS =====
function SectionHeader({ eyebrow, title, subtitle, light }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? "visible" : "hidden"} variants={staggerContainer} className="text-center mb-16">
      {eyebrow && (
        <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "var(--gold)" }}>{eyebrow}</motion.p>
      )}
      <motion.h2 variants={fadeUp} className={`font-cormorant text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight ${light ? "text-white" : ""}`}
        style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {title}
      </motion.h2>
      <div className="section-divider" />
      {subtitle && (
        <motion.p variants={fadeUp} className="max-w-2xl mx-auto text-base md:text-lg leading-relaxed" style={{ color: "var(--text-muted)", fontFamily: "'Raleway', sans-serif" }}>
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  );
}

function GoldDivider() {
  return <div style={{ width: "60px", height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", margin: "24px auto" }} />;
}

function StatCounter({ value, label, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  useEffect(() => {
    if (!inView) return;
    const target = parseInt(value.toString().replace(/\D/g, ""));
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, value]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-bold mb-2 gold-shimmer-text" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-sm tracking-widest uppercase" style={{ color: "var(--text-muted)" }}>{label}</div>
    </div>
  );
}

// ===== NAVBAR =====
function Navbar({ currentPage, setPage, isDark, toggleDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "About", page: "about" },
    { label: "Services", page: "services" },
    { label: "Store", page: "store" },
    { label: "Media", page: "news" },
    { label: "Connect", page: "contact" },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNav = (page) => { setPage(page); setMobileOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };

  return (
    <>
      <motion.nav initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass shadow-lg" : "bg-transparent"}`}
        style={{ fontFamily: "'Raleway', sans-serif" }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <button onClick={() => handleNav("home")} className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)" }}>
              <span className="text-black font-bold text-sm" style={{ fontFamily: "'Cormorant Garamond', serif" }}>WG</span>
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-sm font-bold tracking-wide" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)" }}>Watered Garden</div>
              <div className="text-xs tracking-[0.2em] uppercase" style={{ color: "var(--text-muted)", fontSize: "9px" }}>Church</div>
            </div>
          </button>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)}
                className="text-sm font-medium tracking-wider uppercase transition-all duration-300 relative group"
                style={{ color: currentPage === page ? "var(--gold)" : isDark ? "var(--text-primary)" : "var(--light-text)", letterSpacing: "0.08em" }}>
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-px group-hover:w-full transition-all duration-300" style={{ background: "var(--gold)" }} />
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <button onClick={toggleDark} className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300"
              style={{ background: "var(--gold-dim)", border: "1px solid var(--dark-border)" }}>
              <AnimatePresence mode="wait">
                <motion.div key={isDark ? "moon" : "sun"} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {isDark ? <Moon size={16} color="var(--gold)" /> : <Sun size={16} color="var(--gold)" />}
                </motion.div>
              </AnimatePresence>
            </button>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => handleNav("prayer")}
              className="hidden md:block btn-primary text-xs py-2.5 px-5">
              Prayer Request
            </motion.button>
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full"
              style={{ background: "var(--gold-dim)" }}>
              {mobileOpen ? <X size={18} color="var(--gold)" /> : <Menu size={18} color="var(--gold)" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 left-0 right-0 z-40 glass border-t py-6 px-6"
            style={{ borderColor: "var(--dark-border)" }}>
            {[...navLinks,
              { label: "Branches", page: "branches" },
              { label: "Testimonies", page: "testimonies" },
              { label: "Visit Us", page: "visit" },
              { label: "Counseling", page: "counseling" },
            ].map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)}
                className="w-full text-left py-3 text-sm font-medium tracking-wider uppercase border-b transition-colors"
                style={{ color: currentPage === page ? "var(--gold)" : isDark ? "var(--text-primary)" : "var(--light-text)", borderColor: "var(--dark-border)" }}>
                {label}
              </button>
            ))}
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => handleNav("prayer")} className="btn-primary w-full mt-4">
              Send Prayer Request
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// ===== HOME PAGE =====
function HomePage({ setPage, isDark }) {
  const heroWords = ["Where", "His", "Glory", "Flows"];

  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ background: "var(--dark-bg)" }}>
        {/* Animated orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div style={{ position: "absolute", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.06) 0%, transparent 70%)", top: "-100px", left: "-100px", animation: "floatOrb 15s ease-in-out infinite" }} />
          <div style={{ position: "absolute", width: "500px", height: "500px", borderRadius: "50%", background: "radial-gradient(circle, rgba(13,27,42,0.8) 0%, transparent 70%)", bottom: "-50px", right: "-50px", animation: "floatOrb 18s ease-in-out infinite reverse" }} />
          <div style={{ position: "absolute", width: "300px", height: "300px", borderRadius: "50%", background: "radial-gradient(circle, rgba(212,175,55,0.04) 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%, -50%)", animation: "floatOrb 12s ease-in-out infinite 3s" }} />
          {/* Subtle grid */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(212,175,55,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.03) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="text-xs font-semibold tracking-[0.4em] uppercase mb-8" style={{ color: "var(--gold)" }}>
            Founded 1989 · Dansoman, Accra, Ghana · Global
          </motion.p>

          <div className="overflow-hidden mb-6">
            <motion.h1 initial={{ y: 80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold leading-none"
              style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              Watered<br />
              <span className="gold-shimmer-text">Garden</span>
            </motion.h1>
          </div>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}
            className="text-lg md:text-xl font-light tracking-[0.3em] uppercase mb-4" style={{ color: "var(--text-muted)", fontFamily: "'Raleway', sans-serif" }}>
            Church · Accra, Ghana
          </motion.p>

          <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 1.1, duration: 0.8 }} style={{ width: "120px", height: "1px", background: "linear-gradient(90deg, transparent, var(--gold), transparent)", margin: "32px auto" }} />

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="text-xl md:text-2xl font-light mb-12 max-w-2xl mx-auto leading-relaxed italic"
            style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-muted)" }}>
            "Where His Glory Flows"
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.6 }}
            className="flex flex-wrap gap-4 justify-center mb-12">
            <motion.button whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              onClick={() => { setPage("visit"); window.scrollTo(0,0); }} className="btn-primary text-sm">
              Plan Your Visit
            </motion.button>
            <motion.button whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              onClick={() => window.open(CHURCH_DATA.social.youtube, "_blank")} className="btn-secondary text-sm flex items-center gap-2">
              <Play size={14} /> Watch Live
            </motion.button>
          </motion.div>

          {/* Service pills */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.6 }}
            className="flex flex-wrap gap-3 justify-center">
            {[
              { label: "Sunday First Service", time: "8:45 AM" },
              { label: "Monday Prophetic", time: "10:00 AM" },
              { label: "Daily Meetings", time: "9:00 AM" },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.25)", color: "var(--gold)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--gold)" }} />
                {s.label} — {s.time}
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 0.6 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ animation: "bounce 2s ease-in-out infinite" }}>
          <span className="text-xs tracking-widest uppercase" style={{ color: "var(--text-dim)" }}>Scroll</span>
          <ChevronDown size={16} style={{ color: "var(--gold)" }} />
        </motion.div>
      </section>

      {/* MISSION STRIP */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: "var(--dark-surface)" }}>
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(212,175,55,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
              <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.3em] uppercase mb-4" style={{ color: "var(--gold)" }}>Our Mission</motion.p>
              <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Manifesting God's Glory<br />
                <span className="gold-gradient">In Every Soul</span>
              </motion.h2>
              <motion.p variants={fadeUp} className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                {CHURCH_DATA.mission}
              </motion.p>
              <motion.button variants={fadeUp} whileTap={{ scale: 0.94 }} onClick={() => { setPage("about"); window.scrollTo(0,0); }} className="btn-secondary flex items-center gap-2 text-sm">
                Our Full Story <ArrowRight size={14} />
              </motion.button>
            </motion.div>

            <div className="space-y-6">
              {[
                { icon: Zap, title: "Prophetic Ministry", desc: "Operating in the gift of prophecy with precision and integrity — directing lives, restoring families, and unlocking destinies." },
                { icon: Globe, title: "Operation Church Everywhere", desc: "A global mandate: planting the Kingdom in every community, every region, every nation — until the whole earth is filled with His glory." },
                { icon: Heart, title: "Healing & Restoration", desc: "Supernatural healing for the body, mind, and spirit. Thousands have testified. The signs still follow those who believe." },
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
                  style={{ transitionDelay: `${i * 0.1}s` }}
                  whileHover={{ x: 8, transition: { duration: 0.2 } }}
                  className="flex gap-5 p-5 rounded-sm transition-all duration-300 card-glow"
                  style={{ background: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
                  <div className="w-12 h-12 rounded-sm flex-shrink-0 flex items-center justify-center" style={{ background: "var(--gold-dim)" }}>
                    <item.icon size={20} style={{ color: "var(--gold)" }} />
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 text-sm tracking-wide">{item.title}</h4>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-24 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-surface)" }}>
        <div className="max-w-5xl mx-auto">
          <GoldDivider />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <StatCounter value={35} suffix="+" label="Years of Ministry" />
            <StatCounter value={50000} suffix="+" label="Souls Won for Christ" />
            <StatCounter value={50} suffix="+" label="Communities Reached" />
            <StatCounter value={6} suffix="" label="Nations With Branches" />
          </div>
          <GoldDivider />
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-32 px-6" style={{ background: "var(--dark-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Join Us" title="Service Schedule" subtitle="Every gathering is a divine appointment. Choose yours — and come expectant." />
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              { day: "Sunday", name: "First Service", time: "8:45 – 10:45 AM", icon: Star, featured: true },
              { day: "Monday", name: "Prophetic Service", time: "10:00 AM – 1:00 PM", icon: Zap, featured: false },
              { day: "Tue – Fri", name: "Spiritual Development", time: "9:00 AM – 2:00 PM", icon: BookOpen, featured: false },
            ].map((s, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={scaleIn}
                transition={{ delay: i * 0.1 }} whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="p-8 rounded-sm card-glow"
                style={{ background: s.featured ? "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))" : "var(--dark-card)", border: s.featured ? "1px solid rgba(212,175,55,0.5)" : "1px solid var(--dark-border)" }}>
                {s.featured && <div className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: "var(--gold)" }}>✦ Featured</div>}
                <s.icon size={28} style={{ color: "var(--gold)" }} className="mb-4" />
                <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--text-muted)" }}>{s.day}</div>
                <h3 className="text-xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.name}</h3>
                <div className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{s.time}</div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => { setPage("services"); window.scrollTo(0,0); }} className="btn-secondary flex items-center gap-2 mx-auto">
              Full Schedule <ArrowRight size={14} />
            </motion.button>
          </div>
        </div>
      </section>

      {/* TESTIMONIES MARQUEE */}
      <section className="py-24 overflow-hidden" style={{ background: "var(--dark-bg)" }}>
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <SectionHeader eyebrow="Testimonies" title="Lives Transformed" subtitle="What God does here cannot be contained. These are just a few reports." />
        </div>
        <div className="relative" style={{ mask: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)", WebkitMask: "linear-gradient(90deg, transparent, black 10%, black 90%, transparent)" }}>
          <div className="flex gap-6" style={{ animation: "marquee 35s linear infinite", width: "max-content" }}>
            {[...TESTIMONIES, ...TESTIMONIES].map((t, i) => (
              <div key={i} className="flex-shrink-0 w-80 p-6 rounded-sm" style={{ background: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
                <div className="flex gap-1 mb-4">{[1,2,3,4,5].map(s => <Star key={s} size={12} style={{ color: "var(--gold)", fill: "var(--gold)" }} />)}</div>
                <p className="text-sm leading-relaxed mb-4 italic" style={{ color: "var(--text-muted)", fontFamily: "'EB Garamond', serif" }}>"{t.text.substring(0, 120)}..."</p>
                <div className="text-sm font-semibold" style={{ color: "var(--gold)" }}>{t.name}</div>
                <div className="text-xs mt-1" style={{ color: "var(--text-dim)" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOKS PREVIEW */}
      <section className="py-32 px-6" style={{ background: "var(--dark-surface)" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Bookstore" title="Transform Through the Word" subtitle="Books authored by Prophet Prince Manasseh Atsu — available worldwide." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {BOOKS.slice(0, 3).map((b, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.3 } }} className="p-6 rounded-sm card-glow"
                style={{ background: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
                <div className="w-full h-48 rounded-sm mb-5 flex items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1a1208, #2a2010)" }}>
                  <BookOpen size={40} style={{ color: "var(--gold)", opacity: 0.4 }} />
                  <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.1), transparent)" }} />
                  {b.tag && <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-sm font-bold" style={{ background: "var(--gold)", color: "#080808" }}>{b.tag}</div>}
                </div>
                <h4 className="font-bold mb-2 text-base" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{b.title}</h4>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>{b.desc.substring(0, 80)}...</p>
                <div className="flex items-center justify-between">
                  <span className="font-bold" style={{ color: "var(--gold)" }}>{b.price}</span>
                  <span className="text-xs tracking-widest uppercase" style={{ color: "var(--text-dim)" }}>Order Now</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center">
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => { setPage("store"); window.scrollTo(0,0); }} className="btn-primary">
              Visit the Bookstore
            </motion.button>
          </div>
        </div>
      </section>

      {/* OVERSEER FEATURE */}
      <section className="py-32 px-6 relative overflow-hidden" style={{ background: "var(--dark-bg)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(212,175,55,0.04) 0%, transparent 70%)" }} />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
            <motion.p variants={fadeUp} className="text-xs font-semibold tracking-[0.4em] uppercase mb-6" style={{ color: "var(--gold)" }}>The Voice at the Helm</motion.p>
            <motion.div variants={scaleIn} className="w-32 h-32 rounded-full mx-auto mb-8 flex items-center justify-center relative"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.2), rgba(212,175,55,0.05))", border: "2px solid rgba(212,175,55,0.4)" }}>
              <span className="text-4xl" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)" }}>P</span>
              <div className="absolute inset-0 rounded-full" style={{ animation: "goldPulse 3s ease-in-out infinite", boxShadow: "0 0 40px rgba(212,175,55,0.2)" }} />
            </motion.div>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Prophet Prince Manasseh Atsu
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm tracking-[0.2em] uppercase mb-8" style={{ color: "var(--gold)" }}>
              General Overseer & Founder
            </motion.p>
            <GoldDivider />
            <motion.blockquote variants={fadeUp} className="text-xl md:text-2xl font-light italic leading-relaxed mt-8" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--text-muted)" }}>
              "There is no excuse for failure. Once you have excuses, you will do the same thing again."
            </motion.blockquote>
            <motion.p variants={fadeUp} className="mt-4 text-sm tracking-widest uppercase" style={{ color: "var(--text-dim)" }}>— Prophet Prince Manasseh Atsu</motion.p>
          </motion.div>
        </div>
      </section>

      {/* CTA STRIP */}
      <section className="py-20 px-6" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(13,27,42,0.8))", borderTop: "1px solid rgba(212,175,55,0.2)", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-3xl md:text-4xl font-bold mb-6" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
            Your Encounter Awaits
          </motion.h2>
          <motion.p initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="text-base mb-8 leading-relaxed max-w-xl mx-auto" style={{ color: "var(--text-muted)" }}>
            You did not find this site by accident. There is something God wants to do in your life. Take the next step.
          </motion.p>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-wrap gap-4 justify-center">
            <motion.button variants={fadeUp} whileTap={{ scale: 0.94 }} onClick={() => { setPage("visit"); window.scrollTo(0,0); }} className="btn-primary">Plan My Visit</motion.button>
            <motion.button variants={fadeUp} whileTap={{ scale: 0.94 }} onClick={() => window.open(`https://wa.me/${CHURCH_DATA.whatsapp}`, "_blank")} className="btn-secondary flex items-center gap-2">
              <MessageCircle size={14} /> WhatsApp Us
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ===== ABOUT PAGE =====
function AboutPage({ setPage, isDark }) {
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Our Story" title="The Watered Garden" subtitle="From a small gathering in Dansoman to a prophetic voice reaching the nations — this is our story." />
          <div className="grid lg:grid-cols-2 gap-20 items-start mb-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.p variants={fadeUp} className="text-base leading-loose mb-6" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)", fontFamily: "'EB Garamond', serif", fontSize: "17px" }}>
                In 1989, a young prophet with nothing but faith and fire gathered a small congregation in the heart of Dansoman, Accra. Prophet Prince Manasseh Atsu had received a mandate from God that would take him — and those who dared to follow — to the uttermost parts of the earth.
              </motion.p>
              <motion.p variants={fadeUp} className="text-base leading-loose mb-6" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)", fontFamily: "'EB Garamond', serif", fontSize: "17px" }}>
                Today, Watered Garden Church is more than a congregation — it is a movement. A prophetic house with branches spanning Ghana, the United Kingdom, and the United States. A ministry whose radio broadcasts are heard by millions, whose crusades transform entire communities, and whose teaching has repositioned diplomats, physicians, entrepreneurs, and academics in the purposes of God.
              </motion.p>
              <motion.p variants={fadeUp} className="text-base leading-loose" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)", fontFamily: "'EB Garamond', serif", fontSize: "17px" }}>
                Through Operation Church Everywhere, Prophet Manasseh has spearheaded indoor crusades in regional capitals, districts, and remote communities — planting the Kingdom with precision and power. The vision has not changed: that every community in the world would have a vibrant, Spirit-filled congregation of believers walking in the fullness of God's glory.
              </motion.p>
            </motion.div>
            <div className="space-y-6">
              {[
                { title: "Founded", value: "1989", detail: "In Dansoman, Accra — with faith as the only currency" },
                { title: "General Overseer", value: "Prophet Prince Manasseh Atsu", detail: "Founder, General Overseer, Global Prophet" },
                { title: "Mission", value: "Operation Church Everywhere", detail: "Planting the Kingdom in every community worldwide" },
                { title: "Reach", value: "6+ Nations", detail: "Ghana, UK, USA and growing — the mission is global" },
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-sm" style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                  <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold)" }}>{item.title}</div>
                  <div className="text-lg font-bold mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.value}</div>
                  <div className="text-sm" style={{ color: isDark ? "var(--text-dim)" : "var(--light-muted)" }}>{item.detail}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Overseer Profile */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="p-12 rounded-sm text-center" style={{ background: isDark ? "var(--dark-surface)" : "var(--light-surface)", border: "1px solid var(--dark-border)" }}>
            <div className="w-28 h-28 rounded-full mx-auto mb-6 flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.3), rgba(212,175,55,0.05))", border: "2px solid rgba(212,175,55,0.5)" }}>
              <span className="text-5xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif", color: "var(--gold)" }}>P</span>
            </div>
            <h3 className="text-3xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Prophet Prince Manasseh Atsu</h3>
            <p className="text-sm tracking-[0.2em] uppercase mb-6" style={{ color: "var(--gold)" }}>General Overseer & Founder</p>
            <GoldDivider />
            <p className="text-base leading-loose max-w-3xl mx-auto mt-6" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)", fontFamily: "'EB Garamond', serif", fontSize: "17px" }}>
              {CHURCH_DATA.overseerBio}
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ===== SERVICES PAGE =====
function ServicesPage({ setPage, isDark }) {
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader eyebrow="Join Us" title="Service Schedule" subtitle="Every service is an encounter. Find the gathering that speaks to your season." />
          {SERVICES.map((group, gi) => (
            <motion.div key={gi} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="mb-16">
              <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
                <div className="h-px flex-1" style={{ background: "var(--dark-border)" }} />
                <span className="text-sm font-bold tracking-[0.2em] uppercase px-4" style={{ color: "var(--gold)" }}>{group.day}</span>
                <div className="h-px flex-1" style={{ background: "var(--dark-border)" }} />
              </motion.div>
              {group.events.map((ev, i) => (
                <motion.div key={i} variants={fadeUp} whileHover={{ x: 6 }}
                  className="flex gap-6 p-7 rounded-sm mb-4 transition-all card-glow"
                  style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                  <div className="w-14 h-14 flex-shrink-0 flex items-center justify-center rounded-sm" style={{ background: "var(--gold-dim)" }}>
                    <ev.icon size={24} style={{ color: "var(--gold)" }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
                      <h3 className="text-xl font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{ev.name}</h3>
                      <div className="text-sm font-semibold px-3 py-1 rounded-sm" style={{ background: "var(--gold-dim)", color: "var(--gold)", whiteSpace: "nowrap" }}>{ev.time}</div>
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>{ev.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ))}

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="p-8 rounded-sm text-center mt-12" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(13,27,42,0.5))", border: "1px solid rgba(212,175,55,0.3)" }}>
            <MapPin size={24} style={{ color: "var(--gold)" }} className="mx-auto mb-4" />
            <h4 className="text-xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>All Services at Headquarters</h4>
            <p className="mb-4" style={{ color: "var(--text-muted)" }}>{CHURCH_DATA.address}</p>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => window.open(CHURCH_DATA.mapsLink, "_blank")} className="btn-primary">
              Get Directions
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ===== STORE PAGE =====
function StorePage({ isDark }) {
  const [cart, setCart] = useState([]);
  const [added, setAdded] = useState(null);
  const addToCart = (title) => {
    setCart(c => [...c, title]);
    setAdded(title);
    setTimeout(() => setAdded(null), 2000);
  };
  const PRODUCTS = [
    ...BOOKS,
    { title: "Anointing Oil — Prophetic Blend", author: "Watered Garden Church", desc: "Consecrated anointing oil, prayed over at the altar of Watered Garden. For healing, deliverance, and prophetic activation.", price: "$10", tag: "Popular", category: "oil" },
    { title: "Watered Garden Worship Album", author: "WG Worship Team", desc: "A curated collection of worship songs birthed in the presence of God during Watered Garden services.", price: "$8", tag: null, category: "music" },
    { title: "Prophetic Activation Kit", author: "Prophet Prince Manasseh Atsu", desc: "A study kit including workbooks, a prayer journal, and guided activation exercises for the prophetic life.", price: "$35", tag: "Bundle", category: "kit" },
  ];
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-7xl mx-auto">
          {cart.length > 0 && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between p-4 rounded-sm"
              style={{ background: "var(--gold-dim)", border: "1px solid rgba(212,175,55,0.3)" }}>
              <span className="text-sm font-semibold">{cart.length} item{cart.length > 1 ? "s" : ""} in enquiry list</span>
              <motion.button whileTap={{ scale: 0.94 }} onClick={() => window.open(`https://wa.me/${CHURCH_DATA.whatsapp}?text=I'd like to order: ${cart.join(", ")}`, "_blank")}
                className="btn-primary text-xs py-2 px-4">
                Order via WhatsApp
              </motion.button>
            </motion.div>
          )}
          <SectionHeader eyebrow="Bookstore & Shop" title="Transform Through the Word" subtitle="Order books, anointing oil, and ministry resources — delivered to you." />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PRODUCTS.map((p, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }} className="rounded-sm overflow-hidden card-glow"
                style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                <div className="h-44 flex items-center justify-center relative overflow-hidden"
                  style={{ background: "linear-gradient(135deg, #1a1208, #2d2010)" }}>
                  <BookOpen size={44} style={{ color: "var(--gold)", opacity: 0.3 }} />
                  {p.tag && <div className="absolute top-3 right-3 text-xs px-2 py-1 font-bold rounded-sm" style={{ background: "var(--gold)", color: "#080808" }}>{p.tag}</div>}
                </div>
                <div className="p-6">
                  <h4 className="font-bold text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{p.title}</h4>
                  <p className="text-xs mb-3" style={{ color: "var(--gold)" }}>{p.author}</p>
                  <p className="text-sm leading-relaxed mb-5" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>{p.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold" style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}>{p.price}</span>
                    <motion.button whileTap={{ scale: 0.9, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                      onClick={() => addToCart(p.title)} className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5">
                      {added === p.title ? <><Check size={12} /> Added</> : <><ShoppingBag size={12} /> Add to Order</>}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="mt-12 p-8 rounded-sm text-center" style={{ background: isDark ? "var(--dark-surface)" : "var(--light-surface)", border: "1px solid var(--dark-border)" }}>
            <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>All orders processed via WhatsApp or direct call. Physical delivery available in Accra.</p>
            <motion.button whileTap={{ scale: 0.94 }} onClick={() => window.open(`https://wa.me/${CHURCH_DATA.whatsapp}?text=I'd like to enquire about your books and products`, "_blank")}
              className="btn-primary flex items-center gap-2 mx-auto">
              <MessageCircle size={14} /> Order via WhatsApp
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ===== BRANCHES PAGE =====
function BranchesPage({ isDark }) {
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="Our Branches" title="The Kingdom Is Spreading" subtitle="Watered Garden has planted the flag of God's glory across Ghana and internationally." />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BRANCHES.map((b, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={scaleIn} transition={{ delay: i * 0.08 }}
                whileHover={{ y: -8 }} className="p-7 rounded-sm card-glow"
                style={{ background: b.type === "Headquarters" ? "linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.03))" : isDark ? "var(--dark-card)" : "var(--light-card)",
                  border: b.type === "Headquarters" ? "1px solid rgba(212,175,55,0.5)" : `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                <div className="flex justify-between items-start mb-5">
                  <div className="text-xs font-bold px-2 py-1 rounded-sm" style={{ background: b.type === "International" ? "rgba(13,27,42,0.8)" : "var(--gold-dim)", color: b.type === "International" ? "#7EB8FF" : "var(--gold)" }}>
                    {b.type}
                  </div>
                  <div className="text-xs" style={{ color: "var(--text-dim)" }}>Est. {b.established}</div>
                </div>
                <Globe size={24} style={{ color: "var(--gold)", opacity: 0.5 }} className="mb-4" />
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{b.name}</h3>
                <p className="text-sm mb-4" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>{b.location}</p>
                <div className="text-xs" style={{ color: "var(--text-dim)" }}>Overseer: <span style={{ color: isDark ? "var(--text-primary)" : "var(--light-text)" }}>{b.overseer}</span></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== TESTIMONIES PAGE =====
function TestimoniesPage({ isDark }) {
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader eyebrow="Testimonies" title="What God Has Done" subtitle="The supernatural is not abstract here. It is documented. It is verified. It is ongoing." />
          <div className="space-y-8">
            {TESTIMONIES.map((t, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={fadeUp} transition={{ delay: i * 0.05 }}
                className="p-8 rounded-sm card-glow" style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                <div className="flex gap-1 mb-6">{[1,2,3,4,5].map(s => <Star key={s} size={14} style={{ color: "var(--gold)", fill: "var(--gold)" }} />)}</div>
                <blockquote className="text-lg leading-loose mb-6 italic" style={{ fontFamily: "'EB Garamond', serif", color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>
                  "{t.text}"
                </blockquote>
                <GoldDivider />
                <div className="mt-4">
                  <div className="font-bold text-base" style={{ color: "var(--gold)" }}>{t.name}</div>
                  <div className="text-sm mt-1" style={{ color: isDark ? "var(--text-dim)" : "var(--light-muted)" }}>{t.role} · {t.years}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== NEWS PAGE =====
function NewsPage({ isDark }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Events", "News", "Missions", "Books", "Youth"];
  const filtered = filter === "All" ? NEWS : NEWS.filter(n => n.category === filter);
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-7xl mx-auto">
          <SectionHeader eyebrow="News & Events" title="What's Happening" subtitle="Stay current with the latest from Watered Garden Church and the global ministry." />
          <div className="flex flex-wrap gap-3 justify-center mb-12">
            {categories.map(c => (
              <motion.button key={c} whileTap={{ scale: 0.95 }} onClick={() => setFilter(c)}
                className="text-xs font-bold px-4 py-2 rounded-sm tracking-widest uppercase transition-all duration-300"
                style={{ background: filter === c ? "var(--gold)" : "var(--gold-dim)", color: filter === c ? "#080808" : "var(--gold)", border: `1px solid ${filter === c ? "var(--gold)" : "rgba(212,175,55,0.3)"}` }}>
                {c}
              </motion.button>
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {filtered.map((n, i) => (
                <motion.div key={n.title} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.06 }} whileHover={{ y: -6 }}
                  className="p-6 rounded-sm card-glow" style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold px-2 py-1 rounded-sm" style={{ background: "var(--gold-dim)", color: "var(--gold)" }}>{n.category}</span>
                    {n.tag && <span className="text-xs px-2 py-1 rounded-sm font-bold" style={{ background: "var(--gold)", color: "#080808" }}>{n.tag}</span>}
                  </div>
                  <h3 className="text-xl font-bold mb-3 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{n.title}</h3>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>{n.desc}</p>
                  <div className="text-xs flex items-center gap-2" style={{ color: "var(--text-dim)" }}><Calendar size={12} style={{ color: "var(--gold)" }} /> {n.date}</div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== VISIT PAGE =====
function VisitPage({ setPage, isDark }) {
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader eyebrow="Plan Your Visit" title="We're Expecting You" subtitle="You are not visiting a building. You are walking into an encounter. Here's how to prepare." />
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {[
              { icon: MapPin, title: "Find Us", detail: CHURCH_DATA.address, action: "Get Directions", link: CHURCH_DATA.mapsLink },
              { icon: Clock, title: "Service Times", detail: "Sunday: 8:45 AM & 11:00 AM\nMonday Prophetic: 10:00 AM\nDaily: 9:00 AM", action: null },
              { icon: Phone, title: "Call Ahead", detail: CHURCH_DATA.phone, action: "Call Now", link: `tel:${CHURCH_DATA.phone}` },
              { icon: MessageCircle, title: "WhatsApp Us", detail: "Message before you arrive — we'll have someone welcome you personally.", action: "WhatsApp", link: `https://wa.me/${CHURCH_DATA.whatsapp}?text=I'm planning to visit Watered Garden Church` },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="p-7 rounded-sm card-glow" style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                <div className="w-12 h-12 rounded-sm flex items-center justify-center mb-4" style={{ background: "var(--gold-dim)" }}>
                  <item.icon size={20} style={{ color: "var(--gold)" }} />
                </div>
                <h4 className="text-lg font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</h4>
                <p className="text-sm leading-relaxed mb-4 whitespace-pre-line" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>{item.detail}</p>
                {item.action && (
                  <motion.button whileTap={{ scale: 0.94 }} onClick={() => window.open(item.link, "_blank")} className="btn-secondary text-xs py-2 px-4">
                    {item.action}
                  </motion.button>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="p-8 rounded-sm" style={{ background: isDark ? "var(--dark-surface)" : "var(--light-surface)", border: "1px solid var(--dark-border)" }}>
            <h3 className="text-2xl font-bold mb-6 text-center" style={{ fontFamily: "'Cormorant Garamond', serif" }}>What to Expect</h3>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { step: "01", title: "Arrive with Expectation", desc: "Come ready. Services begin on time and the atmosphere is electric from the opening prayer." },
                { step: "02", title: "Receive a Welcome", desc: "Our ushers will receive you warmly and help you find a seat. First-timers are celebrated, not spotlighted." },
                { step: "03", title: "Encounter God", desc: "The teaching and prophetic ministry will reach you exactly where you are. Come as you are." },
              ].map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold mb-3 gold-gradient" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{s.step}</div>
                  <div className="font-bold text-sm mb-2">{s.title}</div>
                  <div className="text-sm" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ===== MEMBERS PAGE =====
function MembersPage({ isDark }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", city: "", membership: "new" });
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = () => {
    const msg = `New Online Member Registration:\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nCity: ${form.city}\nMembership: ${form.membership}`;
    window.open(`https://wa.me/${CHURCH_DATA.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
    setSubmitted(true);
  };
  const inputStyle = { background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}`, color: isDark ? "var(--text-primary)" : "var(--light-text)", borderRadius: "2px", padding: "12px 16px", width: "100%", fontSize: "14px", fontFamily: "'Raleway', sans-serif", outline: "none", transition: "border-color 0.2s" };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", color: "var(--gold)" };
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-2xl mx-auto">
          <SectionHeader eyebrow="Online Members" title="Join the Family" subtitle="Wherever you are in the world, you belong to this house." />
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center p-12 rounded-sm" style={{ background: "var(--gold-dim)", border: "1px solid rgba(212,175,55,0.4)" }}>
              <Check size={48} style={{ color: "var(--gold)" }} className="mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Welcome to the Family</h3>
              <p style={{ color: "var(--text-muted)" }}>Your registration has been sent. Our team will reach out to you via WhatsApp to complete your onboarding.</p>
            </motion.div>
          ) : (
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}>
              <motion.div variants={fadeUp} className="p-8 rounded-sm" style={{ background: isDark ? "var(--dark-surface)" : "var(--light-surface)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                <div className="space-y-5">
                  {[
                    { key: "name", label: "Full Name", type: "text", placeholder: "Your full name" },
                    { key: "email", label: "Email Address", type: "email", placeholder: "your@email.com" },
                    { key: "phone", label: "Phone Number (with country code)", type: "tel", placeholder: "+233..." },
                    { key: "city", label: "City & Country", type: "text", placeholder: "e.g. Accra, Ghana or London, UK" },
                  ].map(f => (
                    <div key={f.key}>
                      <label style={labelStyle}>{f.label}</label>
                      <input type={f.type} placeholder={f.placeholder} value={form[f.key]}
                        onChange={e => setForm({...form, [f.key]: e.target.value})}
                        style={inputStyle} />
                    </div>
                  ))}
                  <div>
                    <label style={labelStyle}>Membership Type</label>
                    <select value={form.membership} onChange={e => setForm({...form, membership: e.target.value})} style={inputStyle}>
                      <option value="new">New Member</option>
                      <option value="online">Online Member (watching remotely)</option>
                      <option value="transfer">Transfer from another church</option>
                      <option value="rededication">Rededication</option>
                    </select>
                  </div>
                  <motion.button whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                    onClick={handleSubmit} disabled={!form.name || !form.email} className="btn-primary w-full mt-4 flex items-center justify-center gap-2"
                    style={{ opacity: !form.name || !form.email ? 0.5 : 1 }}>
                    <Send size={14} /> Register via WhatsApp
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>
    </div>
  );
}

// ===== PRAYER REQUEST PAGE =====
function PrayerPage({ isDark }) {
  const [form, setForm] = useState({ name: "", request: "", urgent: false });
  const inputStyle = { background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}`, color: isDark ? "var(--text-primary)" : "var(--light-text)", borderRadius: "2px", padding: "12px 16px", width: "100%", fontSize: "14px", fontFamily: "'Raleway', sans-serif", outline: "none" };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", color: "var(--gold)" };
  const handleSubmit = () => {
    const msg = `PRAYER REQUEST${form.urgent ? " (URGENT)" : ""}:\nFrom: ${form.name}\n\n${form.request}`;
    window.open(`https://wa.me/${CHURCH_DATA.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-2xl mx-auto">
          <SectionHeader eyebrow="Send a Request" title="We Will Pray" subtitle="Your prayer request will be received with reverence and lifted before the throne. Nothing is too small or too great." />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="p-8 rounded-sm" style={{ background: isDark ? "var(--dark-surface)" : "var(--light-surface)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
            <div className="space-y-5">
              <div>
                <label style={labelStyle}>Your Name</label>
                <input type="text" placeholder="First name is fine" value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Your Prayer Request</label>
                <textarea rows={6} placeholder="Share what is on your heart. Be as detailed as you wish — this is sacred space." value={form.request} onChange={e => setForm({...form, request: e.target.value})}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative w-5 h-5 rounded-sm flex items-center justify-center cursor-pointer" onClick={() => setForm({...form, urgent: !form.urgent})}
                  style={{ background: form.urgent ? "var(--gold)" : "transparent", border: `2px solid ${form.urgent ? "var(--gold)" : "var(--dark-border)"}`, transition: "all 0.2s" }}>
                  {form.urgent && <Check size={12} color="#080808" />}
                </div>
                <span className="text-sm" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>This is an urgent prayer need</span>
              </label>
              <motion.button whileTap={{ scale: 0.94, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                onClick={handleSubmit} disabled={!form.name || !form.request} className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
                style={{ opacity: !form.name || !form.request ? 0.5 : 1 }}>
                <Send size={14} /> Submit Prayer Request
              </motion.button>
              <p className="text-xs text-center mt-3" style={{ color: "var(--text-dim)" }}>Your request will be sent directly to our prayer team via WhatsApp.</p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ===== COUNSELING PAGE =====
function CounselingPage({ isDark }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", topic: "", message: "" });
  const inputStyle = { background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}`, color: isDark ? "var(--text-primary)" : "var(--light-text)", borderRadius: "2px", padding: "12px 16px", width: "100%", fontSize: "14px", fontFamily: "'Raleway', sans-serif", outline: "none" };
  const labelStyle = { display: "block", fontSize: "11px", fontWeight: 600, letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: "6px", color: "var(--gold)" };
  const topics = ["Marriage & Relationships", "Finance & Career", "Spiritual Growth", "Family Issues", "Healing & Health", "Personal Destiny", "Other"];
  const handleSubmit = () => {
    const msg = `COUNSELING REQUEST:\nName: ${form.name}\nPhone: ${form.phone}\nEmail: ${form.email}\nTopic: ${form.topic}\n\n${form.message}`;
    window.open(`https://wa.me/${CHURCH_DATA.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
  };
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-2xl mx-auto">
          <SectionHeader eyebrow="Pastoral Counseling" title="You Don't Have to Face It Alone" subtitle="Our ministers are trained and anointed to walk with you through life's most difficult seasons." />
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="p-8 rounded-sm mb-8" style={{ background: isDark ? "var(--dark-surface)" : "var(--light-surface)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
            <div className="space-y-5">
              {[
                { key: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                { key: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+233..." },
                { key: "email", label: "Email", type: "email", placeholder: "your@email.com" },
              ].map(f => (
                <div key={f.key}>
                  <label style={labelStyle}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({...form, [f.key]: e.target.value})} style={inputStyle} />
                </div>
              ))}
              <div>
                <label style={labelStyle}>Area of Concern</label>
                <select value={form.topic} onChange={e => setForm({...form, topic: e.target.value})} style={inputStyle}>
                  <option value="">Select a topic...</option>
                  {topics.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Brief Description</label>
                <textarea rows={5} placeholder="Briefly describe what you're going through..." value={form.message} onChange={e => setForm({...form, message: e.target.value})} style={{ ...inputStyle, resize: "vertical", lineHeight: "1.7" }} />
              </div>
              <motion.button whileTap={{ scale: 0.94 }} onClick={handleSubmit} disabled={!form.name || !form.topic}
                className="btn-primary w-full flex items-center justify-center gap-2" style={{ opacity: !form.name || !form.topic ? 0.5 : 1 }}>
                <MessageCircle size={14} /> Request Counseling Session
              </motion.button>
            </div>
          </motion.div>
          <p className="text-xs text-center" style={{ color: "var(--text-dim)" }}>All counseling requests are handled with full confidentiality by our pastoral team.</p>
        </div>
      </section>
    </div>
  );
}

// ===== CONTACT PAGE =====
function ContactPage({ isDark }) {
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-5xl mx-auto">
          <SectionHeader eyebrow="Get in Touch" title="Contact Watered Garden" subtitle="We are reachable. We are responsive. We are ready for you." />
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              { icon: MapPin, title: "Address", detail: CHURCH_DATA.address, action: "Open in Maps", link: CHURCH_DATA.mapsLink },
              { icon: Phone, title: "Phone", detail: CHURCH_DATA.phone, action: "Call Now", link: `tel:${CHURCH_DATA.phone}` },
              { icon: MessageCircle, title: "WhatsApp", detail: "+233 24 308 7949", action: "Message Us", link: `https://wa.me/${CHURCH_DATA.whatsapp}` },
              { icon: Mail, title: "Email", detail: CHURCH_DATA.email, action: "Send Email", link: `mailto:${CHURCH_DATA.email}` },
            ].map((item, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }}
                className="flex gap-5 p-7 rounded-sm card-glow" style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}` }}>
                <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-sm" style={{ background: "var(--gold-dim)" }}>
                  <item.icon size={20} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <div className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: "var(--gold)" }}>{item.title}</div>
                  <div className="text-sm mb-3" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)" }}>{item.detail}</div>
                  <motion.button whileTap={{ scale: 0.94 }} onClick={() => window.open(item.link, "_blank")} className="btn-secondary text-xs py-1.5 px-4">
                    {item.action}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Google Maps Embed */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="rounded-sm overflow-hidden" style={{ border: "1px solid var(--dark-border)", height: "400px" }}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.8!2d-0.243!3d5.538!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzInMTYuOCJOIDDCsDE0JzM0LjgiVw!5e0!3m2!1sen!2sgh!4v1"
              width="100%" height="100%" style={{ border: 0, filter: isDark ? "invert(90%) hue-rotate(180deg)" : "none" }} allowFullScreen loading="lazy" title="Watered Garden Church Location" />
          </motion.div>

          {/* Social Media */}
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mt-12 text-center">
            <p className="text-xs tracking-[0.3em] uppercase mb-6" style={{ color: "var(--text-dim)" }}>Follow the Ministry</p>
            <div className="flex gap-4 justify-center flex-wrap">
              {[
                { Icon: Facebook, link: CHURCH_DATA.social.facebook, label: "Facebook" },
                { Icon: Instagram, link: CHURCH_DATA.social.instagram, label: "Instagram" },
                { Icon: Youtube, link: CHURCH_DATA.social.youtube, label: "YouTube" },
                { Icon: Twitter, link: CHURCH_DATA.social.twitter, label: "X / Twitter" },
              ].map(({ Icon, link, label }) => (
                <motion.a key={label} href={link} target="_blank" rel="noopener noreferrer"
                  whileHover={{ y: -4, scale: 1.1 }} whileTap={{ scale: 0.95 }}
                  className="w-12 h-12 rounded-full flex items-center justify-center transition-all" title={label}
                  style={{ background: "var(--gold-dim)", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <Icon size={20} style={{ color: "var(--gold)" }} />
                </motion.a>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

// ===== FAQ PAGE =====
function FAQPage({ isDark }) {
  const [open, setOpen] = useState(null);
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-3xl mx-auto">
          <SectionHeader eyebrow="FAQ" title="Common Questions" subtitle="If you have a question not answered here, contact us — we respond to every message." />
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.05 }}
                className="rounded-sm overflow-hidden" style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: `1px solid ${open === i ? "rgba(212,175,55,0.5)" : isDark ? "var(--dark-border)" : "var(--light-border)"}`, transition: "border-color 0.3s" }}>
                <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between p-5 text-left" style={{ cursor: "pointer" }}>
                  <span className="font-semibold text-sm pr-4">{faq.q}</span>
                  <motion.div animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronRight size={18} style={{ color: "var(--gold)", flexShrink: 0 }} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {open === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                      <div className="px-5 pb-5 text-sm leading-relaxed" style={{ color: isDark ? "var(--text-muted)" : "var(--light-muted)", borderTop: `1px solid ${isDark ? "var(--dark-border)" : "var(--light-border)"}`, paddingTop: "16px" }}>
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ===== TOOL PAGE: PROPHETIC COMPASS =====
function ToolPage({ isDark }) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const questions = [
    { id: "need", text: "What are you seeking most right now?", options: ["Healing & Restoration", "Direction & Purpose", "Financial Breakthrough", "Marriage & Family", "Spiritual Renewal", "Inner Peace"] },
    { id: "season", text: "Which best describes your current season?", options: ["A new beginning", "A difficult trial", "Feeling stuck", "A crossroads moment", "Seeking more of God", "Everything is well — I want to grow"] },
    { id: "frequency", text: "How often do you engage with God's Word?", options: ["Daily — it's my foundation", "A few times a week", "Occasionally", "I'm just starting"] },
  ];
  const results = {
    "Healing & Restoration": { scripture: "Jeremiah 30:17", text: "For I will restore your health and heal your wounds, declares the LORD.", rec: "Monday Prophetic Service", detail: "Attend our Monday Prophetic Service (10 AM) for a supernatural encounter. Prophet Manasseh operates specifically in the healing anointing on Mondays." },
    "Direction & Purpose": { scripture: "Proverbs 3:5-6", text: "Trust in the LORD with all your heart and lean not on your own understanding; in all your ways acknowledge him, and he will make your paths straight.", rec: "Discipleship Class + Counseling", detail: "Begin with Sunday Discipleship Class (8 AM) to build your foundational understanding, then request a counseling session for personal prophetic direction." },
    "Financial Breakthrough": { scripture: "Philippians 4:19", text: "My God will meet all your needs according to the riches of his glory in Christ Jesus.", rec: "Sunday Service + Bookstore", detail: "Attend Sunday services and pick up 'Walking In Glory' — a practical guide to aligning your finances with God's kingdom economy." },
    "Marriage & Family": { scripture: "Psalm 68:6", text: "God sets the solitary in families: he bringeth out those which are bound with chains.", rec: "Pastoral Counseling", detail: "Request a counseling session through our Counseling page. Our ministers are equipped to navigate every family situation with wisdom and prayer." },
    "Spiritual Renewal": { scripture: "Isaiah 40:31", text: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles.", rec: "Spiritual Development Meetings", detail: "Join our Tuesday–Friday Spiritual Development Meetings (9 AM–2 PM) for intensive daily formation in the presence of God." },
    "Inner Peace": { scripture: "John 14:27", text: "Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled.", rec: "First Sunday Service", detail: "Come to Sunday First Service (8:45 AM). The worship alone is transformative — and the Word will anchor you in ways no other peace can." },
  };
  const handleAnswer = (q, a) => {
    const newAnswers = { ...answers, [q]: a };
    setAnswers(newAnswers);
    if (step < questions.length - 1) setStep(step + 1);
    else {
      const primaryNeed = newAnswers["need"] || "Spiritual Renewal";
      setResult(results[primaryNeed] || results["Spiritual Renewal"]);
    }
  };
  const reset = () => { setStep(0); setAnswers({}); setResult(null); };
  return (
    <div className="page-content">
      <section className="py-32 px-6" style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)" }}>
        <div className="max-w-2xl mx-auto">
          <SectionHeader eyebrow="Prophetic Compass" title="Find Your Next Step" subtitle="Answer three questions and receive a personalised recommendation from Watered Garden." />
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div key={`step-${step}`} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}
                className="p-8 rounded-sm" style={{ background: isDark ? "var(--dark-surface)" : "var(--light-surface)", border: "1px solid var(--dark-border)" }}>
                <div className="flex gap-2 mb-8">
                  {questions.map((_, i) => (
                    <div key={i} className="flex-1 h-1 rounded-full transition-all duration-500" style={{ background: i <= step ? "var(--gold)" : isDark ? "var(--dark-border)" : "var(--light-border)" }} />
                  ))}
                </div>
                <p className="text-xs font-semibold tracking-[0.2em] uppercase mb-4" style={{ color: "var(--gold)" }}>Question {step + 1} of {questions.length}</p>
                <h3 className="text-2xl font-bold mb-8 leading-tight" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{questions[step].text}</h3>
                <div className="grid grid-cols-2 gap-3">
                  {questions[step].options.map(opt => (
                    <motion.button key={opt} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97, transition: { type: "spring", stiffness: 400, damping: 17 } }}
                      onClick={() => handleAnswer(questions[step].id, opt)}
                      className="p-4 rounded-sm text-sm font-medium text-left transition-all duration-200"
                      style={{ background: isDark ? "var(--dark-card)" : "var(--light-card)", border: "1px solid var(--dark-border)" }}>
                      {opt}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div key="result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="p-8 rounded-sm" style={{ background: "linear-gradient(135deg, rgba(212,175,55,0.12), rgba(13,27,42,0.5))", border: "1px solid rgba(212,175,55,0.4)" }}>
                <div className="text-center mb-8">
                  <Award size={40} style={{ color: "var(--gold)" }} className="mx-auto mb-4" />
                  <h3 className="text-2xl font-bold mb-2" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Your Prophetic Direction</h3>
                  <p className="text-sm" style={{ color: "var(--text-muted)" }}>Based on your answers, here is your recommended next step.</p>
                </div>
                <GoldDivider />
                <div className="mt-6 space-y-6">
                  <div className="text-center p-6 rounded-sm" style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}>
                    <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold)" }}>{result.scripture}</div>
                    <blockquote className="text-lg italic leading-relaxed" style={{ fontFamily: "'EB Garamond', serif" }}>"{result.text}"</blockquote>
                  </div>
                  <div>
                    <div className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: "var(--gold)" }}>Recommended for You</div>
                    <div className="text-xl font-bold mb-3" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{result.rec}</div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>{result.detail}</p>
                  </div>
                  <div className="flex flex-wrap gap-3 pt-4">
                    <motion.button whileTap={{ scale: 0.94 }} onClick={() => window.open(`https://wa.me/${CHURCH_DATA.whatsapp}?text=I used the Prophetic Compass and would like to take the next step`, "_blank")} className="btn-primary flex items-center gap-2">
                      <MessageCircle size={14} /> Take This Step
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.94 }} onClick={reset} className="btn-secondary text-xs">Start Over</motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>
    </div>
  );
}

// ===== AI CHATBOT =====
function Chatbot({ isDark, onClose }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Peace to you. 🙏 I'm here to answer any questions you have about Watered Garden Church, our services, or how we can pray for you. What's on your heart?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const SYSTEM_PROMPT = `You are the digital ministry assistant for Watered Garden Church, a prophetic charismatic church in Dansoman, Accra, Ghana, founded in 1989 by Prophet Prince Manasseh Atsu.

You are warm, premium, wise, and spiritually grounded. You communicate like a trusted pastor's assistant — not preachy, but genuinely caring and insightful. You feel like a premium WhatsApp conversation.

KEY DETAILS:
- Church: Watered Garden Church, A 982/17, Dansoman Roundabout, Accra, Ghana
- General Overseer: Prophet Prince Manasseh Atsu (Founder)
- Services: Sunday 8:45 AM & 11 AM, Monday Prophetic 10 AM, Daily Tue-Fri 9 AM
- Phone/WhatsApp: +233 24 308 7949
- Email: wateredgardengh@gmail.com
- Programs: Operation Church Everywhere, 5 Days of Glory, Monday Prophetic Service

YOUR CONVERSATIONAL APPROACH:
1. Identify the person's real need — loneliness, confusion, pain, seeking purpose, or curiosity
2. Meet them where they are with genuine care and insight
3. Share relevant truth about what Watered Garden can offer them spiritually
4. Gently invite them to attend a service, call, or WhatsApp
5. Never be pushy, never be robotic, never be generic

Be concise — 2-4 sentences per message. Be real. Be warm. Be excellent.`;

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: "user", content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "I'm having a brief moment of silence. Please try again.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Connection interrupted. Please WhatsApp us directly at +233 24 308 7949." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed bottom-24 right-4 md:right-8 z-50 w-80 md:w-96 rounded-2xl overflow-hidden shadow-2xl"
      style={{ background: isDark ? "#111111" : "#FFFFFF", border: "1px solid rgba(212,175,55,0.3)", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
      {/* Header */}
      <div className="p-4 flex items-center justify-between" style={{ background: "linear-gradient(135deg, #1a1208, #2d2010)", borderBottom: "1px solid rgba(212,175,55,0.2)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "var(--gold-dim)", border: "2px solid rgba(212,175,55,0.5)" }}>
            <span style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif", fontWeight: "bold" }}>WG</span>
          </div>
          <div>
            <div className="text-sm font-bold text-white">Watered Garden</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-400" style={{ animation: "goldPulse 2s ease-in-out infinite" }} /><span className="text-xs" style={{ color: "var(--text-dim)" }}>Ministry Assistant</span></div>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.1)" }}>
          <X size={16} color="white" />
        </button>
      </div>
      {/* Messages */}
      <div className="p-4 space-y-3 overflow-y-auto" style={{ height: "320px", background: isDark ? "#0d0d0d" : "#F8F5F0" }}>
        {messages.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs px-4 py-3 rounded-2xl text-sm leading-relaxed ${m.role === "user" ? "rounded-tr-sm" : "rounded-tl-sm"}`}
              style={{ background: m.role === "user" ? "linear-gradient(135deg, #D4AF37, #B8960C)" : isDark ? "#1a1a1a" : "#FFFFFF", color: m.role === "user" ? "#080808" : isDark ? "#F5F0E8" : "#1A1208", border: m.role === "assistant" ? "1px solid rgba(212,175,55,0.15)" : "none", fontFamily: "'Raleway', sans-serif" }}>
              {m.content}
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex gap-1.5" style={{ background: isDark ? "#1a1a1a" : "#FFFFFF", border: "1px solid rgba(212,175,55,0.15)" }}>
              {[0,1,2].map(n => <div key={n} className="w-2 h-2 rounded-full" style={{ background: "var(--gold)", animation: `bounce 1s ease-in-out ${n * 0.15}s infinite` }} />)}
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>
      {/* Input */}
      <div className="p-3 flex gap-2" style={{ background: isDark ? "#111111" : "#FFFFFF", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..." className="flex-1 text-sm outline-none px-4 py-2.5 rounded-xl"
          style={{ background: isDark ? "#1a1a1a" : "#F0EDE8", color: isDark ? "#F5F0E8" : "#1A1208", border: "1px solid rgba(212,175,55,0.15)", fontFamily: "'Raleway', sans-serif" }} />
        <motion.button whileTap={{ scale: 0.9 }} onClick={sendMessage} disabled={!input.trim() || loading}
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--gold)", opacity: !input.trim() || loading ? 0.5 : 1 }}>
          <Send size={16} color="#080808" />
        </motion.button>
      </div>
    </motion.div>
  );
}

// ===== FOOTER =====
function Footer({ setPage, isDark }) {
  const handleNav = (p) => { setPage(p); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid rgba(212,175,55,0.15)" }}>
      <div className="max-w-7xl mx-auto px-6 pt-20 pb-8">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "linear-gradient(135deg, #D4AF37, #B8960C)" }}>
                <span className="text-black font-bold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>WG</span>
              </div>
              <div>
                <div className="font-bold text-sm" style={{ color: "var(--gold)", fontFamily: "'Cormorant Garamond', serif" }}>Watered Garden</div>
                <div className="text-xs tracking-[0.15em] uppercase" style={{ color: "var(--text-dim)" }}>Church</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-6 italic" style={{ color: "var(--text-dim)", fontFamily: "'EB Garamond', serif" }}>"Where His Glory Flows"</p>
            <div className="flex gap-3">
              {[
                { Icon: Facebook, href: CHURCH_DATA.social.facebook },
                { Icon: Instagram, href: CHURCH_DATA.social.instagram },
                { Icon: Youtube, href: CHURCH_DATA.social.youtube },
                { Icon: Twitter, href: CHURCH_DATA.social.twitter },
              ].map(({ Icon, href }, i) => (
                <a key={i} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.2)" }}>
                  <Icon size={15} style={{ color: "var(--gold)" }} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-5" style={{ color: "var(--gold)" }}>Ministry</h4>
            {[
              { label: "About Us", page: "about" },
              { label: "Service Schedule", page: "services" },
              { label: "Branches", page: "branches" },
              { label: "News & Events", page: "news" },
              { label: "Bookstore", page: "store" },
            ].map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)} className="block text-sm mb-3 hover:text-white transition-colors text-left" style={{ color: "var(--text-dim)" }}>{label}</button>
            ))}
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-5" style={{ color: "var(--gold)" }}>Connect</h4>
            {[
              { label: "Plan a Visit", page: "visit" },
              { label: "Prayer Request", page: "prayer" },
              { label: "Counseling", page: "counseling" },
              { label: "Online Members", page: "members" },
              { label: "Prophetic Compass", page: "tool" },
              { label: "FAQ", page: "faq" },
            ].map(({ label, page }) => (
              <button key={page} onClick={() => handleNav(page)} className="block text-sm mb-3 hover:text-white transition-colors text-left" style={{ color: "var(--text-dim)" }}>{label}</button>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.25em] uppercase mb-5" style={{ color: "var(--gold)" }}>Contact</h4>
            <div className="space-y-4">
              <div className="flex gap-3 items-start">
                <MapPin size={14} style={{ color: "var(--gold)", marginTop: "2px", flexShrink: 0 }} />
                <span className="text-sm leading-relaxed" style={{ color: "var(--text-dim)" }}>{CHURCH_DATA.address}</span>
              </div>
              <a href={`tel:${CHURCH_DATA.phone}`} className="flex gap-3 items-center hover:text-white transition-colors" style={{ color: "var(--text-dim)" }}>
                <Phone size={14} style={{ color: "var(--gold)" }} />
                <span className="text-sm">{CHURCH_DATA.phone}</span>
              </a>
              <a href={`mailto:${CHURCH_DATA.email}`} className="flex gap-3 items-center hover:text-white transition-colors" style={{ color: "var(--text-dim)" }}>
                <Mail size={14} style={{ color: "var(--gold)" }} />
                <span className="text-sm text-xs break-all">{CHURCH_DATA.email}</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4" style={{ borderTop: "1px solid rgba(212,175,55,0.1)" }}>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>© {new Date().getFullYear()} Watered Garden Church. All rights reserved. Dansoman, Accra, Ghana.</p>
          <p className="text-xs" style={{ color: "var(--text-dim)" }}>Founded 1989 · Prophet Prince Manasseh Atsu</p>
        </div>
      </div>
    </footer>
  );
}

// ===== MOBILE BOTTOM NAV =====
function MobileNav({ setPage, currentPage }) {
  const tabs = [
    { icon: Zap, label: "Home", page: "home" },
    { icon: Headphones, label: "Media", page: "news" },
    { icon: Calendar, label: "Services", page: "services" },
    { icon: Heart, label: "Give", page: "prayer" },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden" style={{ background: "rgba(8,8,8,0.95)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(212,175,55,0.15)", paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex">
        {tabs.map(({ icon: Icon, label, page }) => (
          <button key={page} onClick={() => { setPage(page); window.scrollTo(0,0); }} className="flex-1 flex flex-col items-center justify-center py-3 gap-1">
            <Icon size={20} style={{ color: currentPage === page ? "var(--gold)" : "var(--text-dim)" }} />
            <span className="text-xs font-medium" style={{ color: currentPage === page ? "var(--gold)" : "var(--text-dim)" }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ===== COOKIE CONSENT =====
function CookieBanner({ onAccept }) {
  return (
    <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
      className="fixed bottom-16 md:bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-sm z-50 p-5 rounded-sm"
      style={{ background: "#111111", border: "1px solid rgba(212,175,55,0.3)", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
      <p className="text-sm mb-4 leading-relaxed" style={{ color: "var(--text-muted)" }}>We use cookies to enhance your experience on this site. By continuing, you accept our privacy policy.</p>
      <div className="flex gap-3">
        <motion.button whileTap={{ scale: 0.94 }} onClick={onAccept} className="btn-primary text-xs py-2 px-5 flex-1">Accept</motion.button>
        <motion.button whileTap={{ scale: 0.94 }} onClick={onAccept} className="btn-secondary text-xs py-2 px-4">Decline</motion.button>
      </div>
    </motion.div>
  );
}

// ===== MAIN APP =====
export default function WateredGardenChurch() {
  const [currentPage, setCurrentPage] = useState("home");
  const [isDark, setIsDark] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [showCookie, setShowCookie] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCookie(true), 3000);
    const scrollHandler = () => setShowBackToTop(window.scrollY > 500);
    window.addEventListener("scroll", scrollHandler);
    return () => { clearTimeout(timer); window.removeEventListener("scroll", scrollHandler); };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("light-mode", !isDark);
  }, [isDark]);

  const pageMap = {
    home: <HomePage setPage={setCurrentPage} isDark={isDark} />,
    about: <AboutPage setPage={setCurrentPage} isDark={isDark} />,
    services: <ServicesPage setPage={setCurrentPage} isDark={isDark} />,
    store: <StorePage isDark={isDark} />,
    branches: <BranchesPage isDark={isDark} />,
    testimonies: <TestimoniesPage isDark={isDark} />,
    news: <NewsPage isDark={isDark} />,
    visit: <VisitPage setPage={setCurrentPage} isDark={isDark} />,
    members: <MembersPage isDark={isDark} />,
    prayer: <PrayerPage isDark={isDark} />,
    counseling: <CounselingPage isDark={isDark} />,
    contact: <ContactPage isDark={isDark} />,
    faq: <FAQPage isDark={isDark} />,
    tool: <ToolPage isDark={isDark} />,
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ background: isDark ? "var(--dark-bg)" : "var(--light-bg)", color: isDark ? "var(--text-primary)" : "var(--light-text)", minHeight: "100vh", fontFamily: "'Raleway', sans-serif" }}>
        <Navbar currentPage={currentPage} setPage={setCurrentPage} isDark={isDark} toggleDark={() => setIsDark(!isDark)} />

        <AnimatePresence mode="wait">
          <motion.main key={currentPage} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            {pageMap[currentPage] || pageMap["home"]}
          </motion.main>
        </AnimatePresence>

        <Footer setPage={setCurrentPage} isDark={isDark} />
        <MobileNav setPage={setCurrentPage} currentPage={currentPage} />

        {/* Floating WhatsApp */}
        <motion.a href={`https://wa.me/${CHURCH_DATA.whatsapp}`} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          className="fixed right-4 md:right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{ bottom: "80px", background: "#25D366", boxShadow: "0 8px 32px rgba(37,211,102,0.4)" }}>
          <MessageCircle size={24} color="white" />
        </motion.a>

        {/* Floating Phone */}
        <motion.a href={`tel:${CHURCH_DATA.phone}`}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          className="fixed right-4 md:right-8 z-50 w-12 h-12 rounded-full flex items-center justify-center shadow-xl"
          style={{ bottom: "152px", background: "var(--dark-card)", border: "1px solid rgba(212,175,55,0.4)", boxShadow: "0 8px 32px rgba(0,0,0,0.3)" }}>
          <Phone size={18} style={{ color: "var(--gold)" }} />
        </motion.a>

        {/* AI Chat Button */}
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          onClick={() => setChatOpen(!chatOpen)}
          className="fixed left-4 md:left-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-xl"
          style={{ bottom: "80px", background: "linear-gradient(135deg, #D4AF37, #B8960C)", boxShadow: "0 8px 32px rgba(212,175,55,0.4)" }}>
          {chatOpen ? <X size={22} color="#080808" /> : <Sparkles size={22} color="#080808" />}
        </motion.button>

        <AnimatePresence>
          {chatOpen && <Chatbot isDark={isDark} onClose={() => setChatOpen(false)} />}
        </AnimatePresence>

        {/* Back to Top */}
        <AnimatePresence>
          {showBackToTop && (
            <motion.button initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
              whileTap={{ scale: 0.9 }} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="fixed right-4 md:right-8 z-40 w-10 h-10 rounded-full flex items-center justify-center"
              style={{ bottom: "208px", background: "var(--dark-card)", border: "1px solid var(--dark-border)" }}>
              <ArrowUp size={16} style={{ color: "var(--gold)" }} />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Cookie Banner */}
        <AnimatePresence>
          {showCookie && <CookieBanner onAccept={() => setShowCookie(false)} />}
        </AnimatePresence>
      </div>
    </>
  );
}
