'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, X, Minimize2 } from 'lucide-react';
import { publicApi } from '@/lib/api';
import {
  type BookingDraft,
  type BookingStep,
  type ChatContext,
  type ChatMessage,
  type ChatService,
  buildBookingPayload,
  getWelcomeMessage,
  processUserInput,
} from '@/lib/chatbotEngine';
import { cn } from '@/lib/utils';

type FaqRow = { question: string; answer: string };

const CHATBOT_ICON = '/chatbot-icon.png';

export function SiteChatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [bookingStep, setBookingStep] = useState<BookingStep>('idle');
  const [bookingDraft, setBookingDraft] = useState<BookingDraft>({});
  const [submitting, setSubmitting] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { data: services = [] } = useQuery({
    queryKey: ['chatbot-services'],
    queryFn: () => publicApi.services() as Promise<ChatService[]>,
    staleTime: 5 * 60_000,
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ['chatbot-faqs'],
    queryFn: () => publicApi.faqs() as Promise<FaqRow[]>,
    staleTime: 5 * 60_000,
  });

  const { data: settings = {} } = useQuery({
    queryKey: ['chatbot-settings'],
    queryFn: () => publicApi.settings(),
    staleTime: 5 * 60_000,
  });

  const ctx: ChatContext = useMemo(
    () => ({ services, faqs, settings }),
    [services, faqs, settings]
  );

  useEffect(() => {
    if (!open || initialized) return;
    if (!services.length && !faqs.length && !Object.keys(settings).length) return;
    setMessages([getWelcomeMessage({ services, faqs, settings })]);
    setInitialized(true);
  }, [open, initialized, services, faqs, settings]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  useEffect(() => {
    if (open) {
      const t = setTimeout(() => inputRef.current?.focus(), 200);
      return () => clearTimeout(t);
    }
  }, [open, bookingStep]);

  const appendMessages = useCallback((next: ChatMessage[]) => {
    setMessages((prev) => [...prev, ...next]);
  }, []);

  const submitBooking = useCallback(
    async (draft: BookingDraft) => {
      const payload = buildBookingPayload(draft);
      if (!payload) return;

      setSubmitting(true);
      try {
        await publicApi.book(payload);
        const svc = services.find((s) => s.id === draft.serviceId);
        appendMessages([
          {
            id: `ok-${Date.now()}`,
            role: 'bot',
            text: `You're all set! Your ${svc?.title || 'service'} appointment is booked for ${draft.preferredDate} at ${draft.preferredTimeSlot}. We'll confirm by email at ${draft.customerEmail}.`,
            links: [
              { label: 'View appointment page', href: '/appointment' },
              { label: 'Contact us', href: '/contact' },
            ],
          },
        ]);
        setBookingStep('idle');
        setBookingDraft({});
      } catch (err) {
        appendMessages([
          {
            id: `err-${Date.now()}`,
            role: 'bot',
            text:
              err instanceof Error
                ? `Sorry, booking failed: ${err.message}. You can try our full booking form instead.`
                : 'Sorry, something went wrong. Please try our booking form or call us.',
            links: [{ label: 'Book on appointment page', href: '/appointment' }],
          },
        ]);
        setBookingStep('idle');
        setBookingDraft({});
      } finally {
        setSubmitting(false);
      }
    },
    [appendMessages, services]
  );

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || submitting) return;

      setInput('');
      const result = processUserInput(trimmed, ctx, bookingStep, bookingDraft);
      appendMessages(result.messages);
      setBookingStep(result.step);
      setBookingDraft(result.draft);

      if (bookingStep === 'confirm' && normalizeConfirm(trimmed)) {
        await submitBooking(result.draft);
      }
    },
    [appendMessages, bookingDraft, bookingStep, ctx, submitBooking, submitting]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleChip = (value: string) => {
    void send(value);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-4 z-[90] flex h-[min(520px,calc(100vh-7rem))] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl ring-1 ring-slate-100"
            role="dialog"
            aria-label="Chat assistant"
            aria-modal="false"
          >
            <div className="flex items-center justify-between bg-navy px-4 py-3 text-white">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white/10 ring-1 ring-gold/30">
                  <Image
                    src={CHATBOT_ICON}
                    alt=""
                    width={36}
                    height={36}
                    className="h-full w-full object-contain p-0.5"
                  />
                </span>
                <div>
                  <p className="text-sm font-semibold">
                    {(settings.businessName as string) || 'Josef'} Assistant
                  </p>
                  <p className="text-[10px] text-white/60">Services · FAQs · Booking</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Minimize chat"
                >
                  <Minimize2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-lg p-1.5 text-white/70 transition hover:bg-white/10 hover:text-white"
                  aria-label="Close chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap',
                      msg.role === 'user'
                        ? 'rounded-br-md bg-navy text-white'
                        : 'rounded-bl-md border border-border bg-slate-50 text-slate-700'
                    )}
                  >
                    {msg.text}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {msg.links.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            className="inline-flex rounded-md bg-white px-2.5 py-1 text-xs font-medium text-navy ring-1 ring-border transition hover:ring-gold"
                            onClick={() => setOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                    )}
                    {msg.chips && msg.chips.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {msg.chips.map((chip) => (
                          <button
                            key={chip.value}
                            type="button"
                            onClick={() => handleChip(chip.value)}
                            disabled={submitting}
                            className="rounded-full border border-gold/40 bg-gold/10 px-2.5 py-1 text-xs font-medium text-navy transition hover:bg-gold/25 disabled:opacity-50"
                          >
                            {chip.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {submitting && (
                <p className="text-center text-xs text-slate-400">Booking your appointment…</p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-border p-3">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    bookingStep === 'idle'
                      ? 'Ask about services, booking, hours…'
                      : 'Type your reply…'
                  }
                  disabled={submitting}
                  className="input flex-1 py-2.5 text-sm"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || submitting}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy text-white transition hover:bg-navy/90 disabled:opacity-40"
                  aria-label="Send message"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'fixed bottom-5 right-4 z-[90] flex items-center gap-2.5 rounded-full shadow-lg transition',
          open
            ? 'bg-navy px-4 py-3 text-sm font-semibold text-white hover:bg-navy/90'
            : 'bg-transparent p-0 hover:scale-[1.03]',
          open && 'ring-2 ring-gold/50'
        )}
        whileHover={{ scale: open ? 1.03 : 1.05 }}
        whileTap={{ scale: 0.97 }}
        aria-expanded={open}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
      >
        {open ? (
          <>
            <X className="h-5 w-5" />
            <span className="hidden sm:inline">Close</span>
          </>
        ) : (
          <>
            <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-navy shadow-xl ring-2 ring-gold/50">
              <Image
                src={CHATBOT_ICON}
                alt="Chat with Urban Home & Security"
                width={56}
                height={56}
                className="h-full w-full object-contain p-1"
                priority
              />
            </span>
            <span className="hidden rounded-full bg-navy px-3 py-2 text-sm font-semibold text-white shadow-lg sm:inline">
              Chat with us
            </span>
          </>
        )}
      </motion.button>
    </>
  );
}

function normalizeConfirm(text: string) {
  return text.trim().toLowerCase() === 'confirm';
}
