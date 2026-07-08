'use client';

import Link from 'next/link';
import { motion, useInView, useMotionValue, useSpring, useTransform, AnimatePresence, type Variants } from 'framer-motion';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const handler = () => setReduced(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return reduced;
}

interface AnimateInProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimateIn({ children, className, delay = 0 }: AnimateInProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

type RevealVariant = 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'scale';

const revealVariants: Record<RevealVariant, Variants> = {
  fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  'slide-up': { hidden: { opacity: 0, y: 32 }, visible: { opacity: 1, y: 0 } },
  'slide-left': { hidden: { opacity: 0, x: -32 }, visible: { opacity: 1, x: 0 } },
  'slide-right': { hidden: { opacity: 0, x: 32 }, visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } },
};

export function Reveal({
  children,
  className,
  variant = 'slide-up',
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  variant?: RevealVariant;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      variants={revealVariants[variant]}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerChildren({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function CountUp({
  value,
  suffix = '',
  className,
  duration = 1.5,
}: {
  value: number;
  suffix?: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(reduced ? value : 0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    let startTime = 0;
    const tick = (now: number) => {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [inView, value, duration, reduced]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}

export function Marquee({
  items,
  className,
  speed = 30,
}: {
  items: string[];
  className?: string;
  speed?: number;
}) {
  const reduced = useReducedMotion();
  const doubled = [...items, ...items];

  if (reduced) {
    return (
      <div className={cn('flex flex-wrap gap-3 justify-center', className)}>
        {items.map((item) => (
          <span key={item} className="rounded-full border border-border bg-white px-4 py-1.5 text-sm font-medium text-navy">
            {item}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="marquee-track flex gap-6 whitespace-nowrap" style={{ animationDuration: `${speed}s` }}>
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gold/30 bg-navy/5 px-5 py-2 text-sm font-semibold text-navy"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 });

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      onMouseMove={(e) => {
        const rect = ref.current?.getBoundingClientRect();
        if (!rect) return;
        x.set((e.clientX - rect.left) / rect.width - 0.5);
        y.set((e.clientY - rect.top) / rect.height - 0.5);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function MagneticButton({
  children,
  className,
  onClick,
  href,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
}) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });

  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    if (reduced) return;
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.15);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.15);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const style = reduced ? {} : { x: springX, y: springY };
  const motionHandlers = {
    onMouseMove: handleMove,
    onMouseLeave: handleLeave,
  };

  if (href) {
    const isExternal =
      href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:') || href.startsWith('#');

    if (isExternal) {
      return (
        <motion.a href={href} className={className} style={style} {...motionHandlers}>
          {children}
        </motion.a>
      );
    }

    return (
      <motion.div style={style} className="inline-flex" {...motionHandlers}>
        <Link href={href} className={className}>
          {children}
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.button
      type="button"
      className={className}
      style={style}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
}

export { AnimatePresence };
