'use client';

import React, { Dispatch, ReactNode, SetStateAction, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiArrowRight, FiX } from "react-icons/fi";

type SectionType = 'overview' | 'itinerary' | 'food' | 'activities' | 'shopping' | 'health' | 'budget' | 'checklist' | 'work' | 'currency';

interface AnimatedNavProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

export const AnimatedNav = ({ activeSection, onSectionChange }: AnimatedNavProps) => {
  const [active, setActive] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <>
      <HamburgerButton active={active} setActive={setActive} isMobile={isMobile} />
      <AnimatePresence>
        {active && (
          isMobile ? (
            <MobileBottomSheet 
              activeSection={activeSection} 
              onSectionChange={onSectionChange}
              setActive={setActive}
            />
          ) : (
            <DesktopOverlay 
              activeSection={activeSection} 
              onSectionChange={onSectionChange}
              setActive={setActive}
            />
          )
        )}
      </AnimatePresence>
    </>
  );
};

// Mobile Bottom Sheet Navigation
const MobileBottomSheet = ({ 
  activeSection, 
  onSectionChange, 
  setActive 
}: { 
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  setActive: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-[90]"
        onClick={() => setActive(false)}
      />
      
      {/* Bottom Sheet */}
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[95] bg-white rounded-t-3xl shadow-2xl max-h-[80vh] overflow-hidden"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="text-2xl">🍄💕🐔</div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Thailand 2025</h3>
              <p className="text-sm text-gray-500">Mushroom & Chicken Adventure</p>
            </div>
          </div>
          <button
            onClick={() => setActive(false)}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FiX className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Navigation Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-2 gap-4">
            {MOBILE_LINKS.map((link) => (
              <MobileNavCard
                key={link.section}
                link={link}
                isActive={activeSection === link.section}
                onSectionChange={onSectionChange}
                setActive={setActive}
              />
            ))}
          </div>
          
          {/* Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  localStorage.removeItem('thailand-dashboard-auth');
                  setActive(false);
                  window.location.reload();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-full text-sm font-medium hover:bg-red-100 transition-colors"
              >
                <span>🔓</span>
                Logout
              </button>
              <div className="text-2xl">✈️🏝️</div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

// Desktop Overlay (existing functionality)
const DesktopOverlay = ({ 
  activeSection, 
  onSectionChange, 
  setActive 
}: { 
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  setActive: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <nav className="fixed right-4 top-4 z-40 h-[calc(100vh_-_32px)] w-[calc(100%_-_32px)] overflow-y-auto">
      <Logo />
      <LinksContainer 
        activeSection={activeSection} 
        onSectionChange={onSectionChange}
        setActive={setActive}
      />
      <FooterCTAs setActive={setActive} />
    </nav>
  );
};

const LinksContainer = ({ 
  activeSection, 
  onSectionChange, 
  setActive 
}: { 
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  setActive: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.div className="space-y-4 p-12 pl-4 md:pl-20">
      {LINKS.map((l, idx) => {
        return (
          <NavLink 
            key={l.title} 
            section={l.section} 
            idx={idx}
            activeSection={activeSection}
            onSectionChange={onSectionChange}
            setActive={setActive}
          >
            {l.title}
          </NavLink>
        );
      })}
    </motion.div>
  );
};

const NavLink = ({
  children,
  section,
  idx,
  activeSection,
  onSectionChange,
  setActive,
}: {
  children: ReactNode;
  section: SectionType;
  idx: number;
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
  setActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClick = () => {
    onSectionChange(section);
    setActive(false);
  };

  return (
    <motion.button
      initial={{ opacity: 0, y: -8 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: {
          delay: 0.375 + idx * 0.0625,
          duration: 0.25,
          ease: "easeInOut",
        },
      }}
      exit={{ opacity: 0, y: -8 }}
      onClick={handleClick}
      className={`block text-5xl font-semibold transition-colors md:text-7xl ${
        activeSection === section 
          ? 'text-amber-300' 
          : 'text-teal-300 hover:text-emerald-100'
      }`}
    >
      {children}.
    </motion.button>
  );
};

const Logo = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { delay: 0.25, duration: 0.25, ease: "easeInOut" },
      }}
      exit={{ opacity: 0, y: -12 }}
      className="flex flex-col items-center p-6"
    >
      {/* Cute emoji header */}
      <div className="flex items-center gap-4 mb-4">
        <motion.div
          animate={{ 
            rotate: [0, -10, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
          className="text-6xl filter drop-shadow-lg"
        >
          🍄
        </motion.div>
        <motion.div
          className="text-4xl text-pink-300 font-bold"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          💕
        </motion.div>
        <motion.div
          animate={{ 
            rotate: [0, 10, -10, 10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="text-6xl filter drop-shadow-lg"
        >
          🐔
        </motion.div>
      </div>
      
      {/* Cute title */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
          transition: { delay: 0.4, duration: 0.25 }
        }}
        className="text-center"
      >
        <h2 className="text-xl font-bold text-white mb-1">
          Mushroom & Chicken
        </h2>
        <div className="text-sm text-emerald-100 bg-white/20 px-3 py-1 rounded-full">
          ✈️ Thailand Adventure 🏝️
        </div>
      </motion.div>
    </motion.div>
  );
};

// Mobile Navigation Card Component
const MobileNavCard = ({
  link,
  isActive,
  onSectionChange,
  setActive,
}: {
  link: typeof MOBILE_LINKS[0];
  isActive: boolean;
  onSectionChange: (section: SectionType) => void;
  setActive: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleClick = () => {
    onSectionChange(link.section);
    setActive(false);
  };

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.95 }}
      className={`p-4 rounded-2xl text-left transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg' 
          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
      }`}
    >
      <div className="text-2xl mb-2">{link.icon}</div>
      <div className="text-sm font-semibold capitalize">{link.title}</div>
      <div className={`text-xs mt-1 ${isActive ? 'text-emerald-100' : 'text-gray-500'}`}>
        {link.description}
      </div>
    </motion.button>
  );
};

const HamburgerButton = ({
  active,
  setActive,
  isMobile,
}: {
  active: boolean;
  setActive: Dispatch<SetStateAction<boolean>>;
  isMobile: boolean;
}) => {
  if (isMobile) {
    return (
      <motion.button
        onClick={() => setActive((pv) => !pv)}
        className="fixed right-4 bottom-4 z-[100] h-14 w-14 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center hover:bg-white transition-colors"
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={active ? { rotate: 45 } : { rotate: 0 }}
          className="flex flex-col items-center justify-center"
        >
          {active ? (
            <FiX className="w-6 h-6 text-gray-700" />
          ) : (
            <div className="space-y-1">
              <div className="w-5 h-0.5 bg-gray-700 rounded"></div>
              <div className="w-5 h-0.5 bg-gray-700 rounded"></div>
              <div className="w-3 h-0.5 bg-gray-700 rounded"></div>
            </div>
          )}
        </motion.div>
      </motion.button>
    );
  }

  return (
    <>
      <motion.div
        initial={false}
        animate={active ? "open" : "closed"}
        variants={UNDERLAY_VARIANTS}
        style={{ top: 16, right: 16 }}
        className="fixed z-10 rounded-xl bg-gradient-to-br from-teal-600 to-emerald-500 shadow-lg shadow-teal-800/20"
      />

      <motion.button
        initial={false}
        animate={active ? "open" : "closed"}
        onClick={() => setActive((pv) => !pv)}
        className={`group fixed right-4 top-4 z-50 h-20 w-20 bg-white/0 transition-all hover:bg-white/20 ${
          active ? "rounded-bl-xl rounded-tr-xl" : "rounded-xl"
        }`}
      >
        <motion.span
          variants={HAMBURGER_VARIANTS.top}
          className="absolute block h-1 w-10 bg-white"
          style={{ y: "-50%", left: "50%", x: "-50%" }}
        />
        <motion.span
          variants={HAMBURGER_VARIANTS.middle}
          className="absolute block h-1 w-10 bg-white"
          style={{ left: "50%", x: "-50%", top: "50%", y: "-50%" }}
        />
        <motion.span
          variants={HAMBURGER_VARIANTS.bottom}
          className="absolute block h-1 w-5 bg-white"
          style={{ x: "-50%", y: "50%" }}
        />
      </motion.button>
    </>
  );
};

const FooterCTAs = ({ setActive }: { setActive: Dispatch<SetStateAction<boolean>> }) => {
  const handleLogout = () => {
    localStorage.removeItem('thailand-dashboard-auth');
    setActive(false);
    window.location.reload();
  };

  return (
    <>
      <div className="absolute bottom-6 left-6 flex gap-4 md:flex-col">
        {FOOTER_ICONS.map((l, idx) => {
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -8 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: {
                  delay: 0.5 + idx * 0.0625,
                  duration: 0.25,
                  ease: "easeInOut",
                },
              }}
              exit={{ opacity: 0, y: -8 }}
              className="text-3xl text-white transition-colors hover:text-emerald-200"
            >
              {l.icon}
            </motion.div>
          );
        })}
      </div>

      {/* Logout button */}
      <motion.button
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.625,
            duration: 0.25,
            ease: "easeInOut",
          },
        }}
        exit={{ opacity: 0, y: 8 }}
        onClick={handleLogout}
        className="absolute bottom-2 left-2 flex items-center justify-center rounded-full bg-red-600 w-12 h-12 text-white transition-colors hover:bg-red-700 md:bottom-4 md:left-4"
        title="Logout"
      >
        <span className="text-xl">🔓</span>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.5625,
            duration: 0.25,
            ease: "easeInOut",
          },
        }}
        exit={{ opacity: 0, y: 8 }}
        className="absolute bottom-2 right-2 flex items-center gap-2 rounded-full bg-teal-700 px-3 py-3 text-4xl uppercase text-teal-100 transition-colors hover:bg-white hover:text-teal-700 md:bottom-4 md:right-4 md:px-6 md:text-2xl"
      >
        <span className="hidden md:block">thailand 2025</span> <FiArrowRight />
      </motion.div>
    </>
  );
};

const LINKS = [
  {
    title: "overview",
    section: "overview" as SectionType,
  },
  {
    title: "itinerary",
    section: "itinerary" as SectionType,
  },
  {
    title: "food",
    section: "food" as SectionType,
  },
  {
    title: "activities",
    section: "activities" as SectionType,
  },
  {
    title: "shopping",
    section: "shopping" as SectionType,
  },
  {
    title: "health",
    section: "health" as SectionType,
  },
  {
    title: "budget",
    section: "budget" as SectionType,
  },
  {
    title: "checklist",
    section: "checklist" as SectionType,
  },
  {
    title: "work",
    section: "work" as SectionType,
  },
  {
    title: "currency",
    section: "currency" as SectionType,
  },
];

const MOBILE_LINKS = [
  {
    title: "overview",
    section: "overview" as SectionType,
    icon: "🏠",
    description: "Trip progress & stats"
  },
  {
    title: "itinerary",
    section: "itinerary" as SectionType,
    icon: "📅",
    description: "56-day schedule"
  },
  {
    title: "food",
    section: "food" as SectionType,
    icon: "🍜",
    description: "Must-try dishes"
  },
  {
    title: "activities",
    section: "activities" as SectionType,
    icon: "🎯",
    description: "Fun experiences"
  },
  {
    title: "shopping",
    section: "shopping" as SectionType,
    icon: "🛍️",
    description: "Markets & stores"
  },
  {
    title: "health",
    section: "health" as SectionType,
    icon: "💉",
    description: "Vaccines & health"
  },
  {
    title: "budget",
    section: "budget" as SectionType,
    icon: "💰",
    description: "Money planning"
  },
  {
    title: "checklist",
    section: "checklist" as SectionType,
    icon: "✅",
    description: "Pre-departure tasks"
  },
  {
    title: "work",
    section: "work" as SectionType,
    icon: "💼",
    description: "Remote work schedule"
  },
  {
    title: "currency",
    section: "currency" as SectionType,
    icon: "💱",
    description: "Exchange rates"
  },
];

const FOOTER_ICONS = [
  {
    icon: "💰",
  },
  {
    icon: "✅",
  },
  {
    icon: "💼",
  },
];

const UNDERLAY_VARIANTS = {
  open: {
    width: "calc(100% - 32px)",
    height: "calc(100vh - 32px)",
    transition: { type: "spring" as const, mass: 3, stiffness: 400, damping: 50 },
  },
  closed: {
    width: "80px",
    height: "80px",
    transition: {
      delay: 0.375,
      type: "spring" as const,
      mass: 3,
      stiffness: 400,
      damping: 50,
    },
  },
};

const HAMBURGER_VARIANTS = {
  top: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      top: ["35%", "50%", "50%"],
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      top: ["50%", "50%", "35%"],
    },
  },
  middle: {
    open: {
      rotate: ["0deg", "0deg", "-45deg"],
    },
    closed: {
      rotate: ["-45deg", "0deg", "0deg"],
    },
  },
  bottom: {
    open: {
      rotate: ["0deg", "0deg", "45deg"],
      bottom: ["35%", "50%", "50%"],
      left: "50%",
    },
    closed: {
      rotate: ["45deg", "0deg", "0deg"],
      bottom: ["50%", "50%", "35%"],
      left: "calc(50% + 10px)",
    },
  },
};