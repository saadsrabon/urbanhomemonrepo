export type ChatService = {
  id: string;
  title: string;
  slug: string;
  shortDesc?: string | null;
};

export type ChatFaq = {
  question: string;
  answer: string;
};

export type ChatChip = {
  label: string;
  value: string;
};

export type ChatLink = {
  label: string;
  href: string;
};

export type ChatMessage = {
  id: string;
  role: 'user' | 'bot';
  text: string;
  chips?: ChatChip[];
  links?: ChatLink[];
};

export type BookingDraft = {
  serviceId?: string;
  preferredDate?: string;
  preferredTimeSlot?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  address?: string;
};

export type BookingStep =
  | 'idle'
  | 'service'
  | 'date'
  | 'time'
  | 'name'
  | 'email'
  | 'phone'
  | 'confirm';

export type ChatContext = {
  services: ChatService[];
  faqs: ChatFaq[];
  settings: Record<string, unknown>;
};

export const TIME_SLOTS = ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

export const QUICK_CHIPS: ChatChip[] = [
  { label: 'Our services', value: 'What services do you offer?' },
  { label: 'Book appointment', value: 'I want to book an appointment' },
  { label: 'Free quote', value: 'Do you offer free quotes?' },
  { label: 'Service area', value: 'What areas do you serve?' },
  { label: 'Contact info', value: 'How can I contact you?' },
];

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function bot(text: string, extras?: Pick<ChatMessage, 'chips' | 'links'>): ChatMessage {
  return { id: uid(), role: 'bot', text, ...extras };
}

function user(text: string): ChatMessage {
  return { id: uid(), role: 'user', text };
}

function normalize(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function words(text: string) {
  return normalize(text).split(' ').filter((w) => w.length > 2);
}

function scoreOverlap(a: string, b: string) {
  const wa = new Set(words(a));
  const wb = words(b);
  if (!wa.size || !wb.length) return 0;
  let hits = 0;
  for (const w of wb) {
    if (wa.has(w)) hits++;
  }
  return hits / Math.max(wa.size, wb.length);
}

function getBusinessName(ctx: ChatContext) {
  return (ctx.settings.businessName as string) || 'Josef Home Services';
}

function getPhone(ctx: ChatContext) {
  return (ctx.settings.contactPhone as string) || '(346) 365-7221';
}

function getEmail(ctx: ChatContext) {
  return (ctx.settings.contactEmail as string) || 'info@josefhomeservices.com';
}

function getHours(ctx: ChatContext) {
  return (ctx.settings.workingHours as string) || 'Mon–Sat 8:00 AM – 6:00 PM';
}

function getAddress(ctx: ChatContext) {
  return (ctx.settings.address as string) || 'Greater Houston, TX';
}

function findFaq(ctx: ChatContext, text: string): ChatFaq | null {
  let best: ChatFaq | null = null;
  let bestScore = 0;
  for (const faq of ctx.faqs) {
    const qScore = scoreOverlap(text, faq.question);
    const aScore = scoreOverlap(text, faq.answer) * 0.5;
    const score = Math.max(qScore, aScore);
    if (score > bestScore) {
      bestScore = score;
      best = faq;
    }
  }
  return bestScore >= 0.25 ? best : null;
}

function findService(ctx: ChatContext, text: string): ChatService | null {
  const n = normalize(text);
  let best: ChatService | null = null;
  let bestScore = 0;
  for (const s of ctx.services) {
    const title = normalize(s.title);
    const slug = s.slug.replace(/-/g, ' ');
    if (n.includes(title) || n.includes(slug)) return s;
    const score = scoreOverlap(text, `${s.title} ${slug} ${s.shortDesc || ''}`);
    if (score > bestScore) {
      bestScore = score;
      best = s;
    }
  }
  return bestScore >= 0.35 ? best : null;
}

function servicesListMessage(ctx: ChatContext): ChatMessage {
  if (!ctx.services.length) {
    return bot('We offer home repair, remodeling, roofing, plumbing, electrical, and security services. Visit our services page for details.', {
      links: [{ label: 'View all services', href: '/services' }],
    });
  }
  const lines = ctx.services.slice(0, 8).map((s) => `• ${s.title}${s.shortDesc ? ` — ${s.shortDesc}` : ''}`);
  const more = ctx.services.length > 8 ? `\n\n…and ${ctx.services.length - 8} more.` : '';
  return bot(`Here are the services we provide:\n\n${lines.join('\n')}${more}`, {
    chips: ctx.services.slice(0, 5).map((s) => ({ label: s.title, value: `Tell me about ${s.title}` })),
    links: [{ label: 'Browse all services', href: '/services' }],
  });
}

function serviceDetailMessage(ctx: ChatContext, service: ChatService): ChatMessage {
  const desc = service.shortDesc ? `\n\n${service.shortDesc}` : '';
  return bot(`${service.title}${desc}\n\nWould you like to book this service or learn more on our website?`, {
    chips: [
      { label: `Book ${service.title}`, value: `Book ${service.title}` },
      { label: 'Other services', value: 'What services do you offer?' },
    ],
    links: [{ label: `View ${service.title}`, href: `/services/${service.slug}` }],
  });
}

function isBookingIntent(text: string) {
  const n = normalize(text);
  return /\b(book|appointment|schedule|reserve|booking)\b/.test(n);
}

function isServicesIntent(text: string) {
  const n = normalize(text);
  return /\b(service|services|offer|provide|do you do|what do you)\b/.test(n);
}

function isContactIntent(text: string) {
  const n = normalize(text);
  return /\b(contact|phone|call|email|reach|talk)\b/.test(n);
}

function isHoursIntent(text: string) {
  const n = normalize(text);
  return /\b(hour|hours|open|close|when are you)\b/.test(n);
}

function isAreaIntent(text: string) {
  const n = normalize(text);
  return /\b(area|areas|serve|location|where|houston|region)\b/.test(n);
}

function isGreeting(text: string) {
  const n = normalize(text);
  return /^(hi|hello|hey|good morning|good afternoon|good evening|howdy)\b/.test(n);
}

function parseDateInput(text: string): string | null {
  const trimmed = text.trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;
  const d = new Date(trimmed);
  if (!Number.isNaN(d.getTime()) && d > new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  const lower = trimmed.toLowerCase();
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (lower.includes('tomorrow')) {
    const y = tomorrow.getFullYear();
    const m = String(tomorrow.getMonth() + 1).padStart(2, '0');
    const day = String(tomorrow.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }
  return null;
}

function parseTimeInput(text: string): string | null {
  const n = normalize(text);
  for (const slot of TIME_SLOTS) {
    if (n.includes(normalize(slot))) return slot;
  }
  if (n.includes('morning')) return '10:00 AM';
  if (n.includes('afternoon')) return '2:00 PM';
  if (n.includes('noon') || n.includes('lunch')) return '12:00 PM';
  return null;
}

function isValidEmail(text: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text.trim());
}

export function getWelcomeMessage(ctx: ChatContext): ChatMessage {
  const name = getBusinessName(ctx);
  return bot(
    `Hi! I'm the ${name} assistant. I can help you explore our services, answer common questions, or book an appointment. What can I help you with?`,
    { chips: QUICK_CHIPS }
  );
}

export function processUserInput(
  text: string,
  ctx: ChatContext,
  step: BookingStep,
  draft: BookingDraft
): { messages: ChatMessage[]; step: BookingStep; draft: BookingDraft } {
  const trimmed = text.trim();
  if (!trimmed) {
    return { messages: [bot('Please type a message or pick one of the options below.')], step, draft };
  }

  const out: ChatMessage[] = [user(trimmed)];

  if (step !== 'idle') {
    return handleBookingStep(trimmed, ctx, step, draft, out);
  }

  if (isGreeting(trimmed)) {
    out.push(
      bot(`Hello! Welcome to ${getBusinessName(ctx)}. How can I help you today?`, { chips: QUICK_CHIPS })
    );
    return { messages: out, step, draft };
  }

  const matchedService = findService(ctx, trimmed);
  if (matchedService && /\b(book)\b/.test(normalize(trimmed))) {
    return {
      messages: [
        ...out,
        bot(`Great — let's book ${matchedService.title}. What date works for you? (e.g. tomorrow or 2026-07-15)`, {
          chips: [{ label: 'Tomorrow', value: 'tomorrow' }],
        }),
      ],
      step: 'date',
      draft: { ...draft, serviceId: matchedService.id },
    };
  }

  if (isBookingIntent(trimmed)) {
    if (!ctx.services.length) {
      out.push(
        bot('You can book online on our appointment page or call us directly.', {
          links: [
            { label: 'Book appointment', href: '/appointment' },
            { label: `Call ${getPhone(ctx)}`, href: `tel:${getPhone(ctx).replace(/\D/g, '')}` },
          ],
        })
      );
      return { messages: out, step, draft };
    }
    out.push(
      bot('I can help you book right here. Which service do you need?', {
        chips: ctx.services.slice(0, 6).map((s) => ({ label: s.title, value: `Book ${s.title}` })),
        links: [{ label: 'Full booking form', href: '/appointment' }],
      })
    );
    return { messages: out, step: 'service', draft };
  }

  if (matchedService) {
    out.push(serviceDetailMessage(ctx, matchedService));
    return { messages: out, step, draft };
  }

  if (isServicesIntent(trimmed)) {
    out.push(servicesListMessage(ctx));
    return { messages: out, step, draft };
  }

  if (isContactIntent(trimmed)) {
    out.push(
      bot(
        `You can reach us at:\n\n📞 ${getPhone(ctx)}\n✉️ ${getEmail(ctx)}\n📍 ${getAddress(ctx)}\n\nOr send us a message through our contact page.`,
        {
          links: [
            { label: 'Contact form', href: '/contact' },
            { label: 'Book appointment', href: '/appointment' },
          ],
          chips: [{ label: 'Book appointment', value: 'I want to book an appointment' }],
        }
      )
    );
    return { messages: out, step, draft };
  }

  if (isHoursIntent(trimmed)) {
    out.push(
      bot(`Our hours are: ${getHours(ctx)}.\n\nNeed to schedule outside these hours? Call us at ${getPhone(ctx)}.`, {
        chips: [{ label: 'Book appointment', value: 'I want to book an appointment' }],
      })
    );
    return { messages: out, step, draft };
  }

  if (isAreaIntent(trimmed)) {
    const faq = ctx.faqs.find((f) => normalize(f.question).includes('area'));
    out.push(
      bot(
        faq?.answer ||
          `We serve ${getAddress(ctx)} and surrounding communities. Call ${getPhone(ctx)} to confirm we cover your address.`,
        { chips: [{ label: 'Book appointment', value: 'I want to book an appointment' }] }
      )
    );
    return { messages: out, step, draft };
  }

  const faq = findFaq(ctx, trimmed);
  if (faq) {
    out.push(
      bot(faq.answer, {
        chips: [
          { label: 'Book appointment', value: 'I want to book an appointment' },
          { label: 'Our services', value: 'What services do you offer?' },
        ],
      })
    );
    return { messages: out, step, draft };
  }

  out.push(
    bot(
      `I'm not sure about that, but I can help with services, booking, hours, or contact info. You can also call us at ${getPhone(ctx)}.`,
      { chips: QUICK_CHIPS, links: [{ label: 'Contact us', href: '/contact' }] }
    )
  );
  return { messages: out, step, draft };
}

function handleBookingStep(
  text: string,
  ctx: ChatContext,
  step: BookingStep,
  draft: BookingDraft,
  out: ChatMessage[]
): { messages: ChatMessage[]; step: BookingStep; draft: BookingDraft } {
  const service = ctx.services.find((s) => s.id === draft.serviceId);

  if (step === 'service') {
    const picked = findService(ctx, text) || ctx.services.find((s) => normalize(text).includes(normalize(s.title)));
    if (!picked) {
      out.push(
        bot('Please pick a service from the list, or type the service name.', {
          chips: ctx.services.slice(0, 6).map((s) => ({ label: s.title, value: `Book ${s.title}` })),
        })
      );
      return { messages: out, step, draft };
    }
    out.push(
      bot(`Perfect — ${picked.title}. What date works for you? (e.g. tomorrow or YYYY-MM-DD)`, {
        chips: [{ label: 'Tomorrow', value: 'tomorrow' }],
      })
    );
    return { messages: out, step: 'date', draft: { ...draft, serviceId: picked.id } };
  }

  if (step === 'date') {
    const date = parseDateInput(text);
    if (!date) {
      out.push(
        bot('Please enter a valid future date (e.g. tomorrow or 2026-07-15).', {
          chips: [{ label: 'Tomorrow', value: 'tomorrow' }],
        })
      );
      return { messages: out, step, draft };
    }
    out.push(
      bot(`Got it — ${date}. Which time slot works best?`, {
        chips: TIME_SLOTS.map((t) => ({ label: t, value: t })),
      })
    );
    return { messages: out, step: 'time', draft: { ...draft, preferredDate: date } };
  }

  if (step === 'time') {
    const slot = parseTimeInput(text);
    if (!slot) {
      out.push(
        bot('Please pick a time slot:', {
          chips: TIME_SLOTS.map((t) => ({ label: t, value: t })),
        })
      );
      return { messages: out, step, draft };
    }
    out.push(bot('What is your full name?'));
    return { messages: out, step: 'name', draft: { ...draft, preferredTimeSlot: slot } };
  }

  if (step === 'name') {
    if (text.length < 2) {
      out.push(bot('Please enter your full name (at least 2 characters).'));
      return { messages: out, step, draft };
    }
    out.push(bot('What is your email address?'));
    return { messages: out, step: 'email', draft: { ...draft, customerName: text } };
  }

  if (step === 'email') {
    if (!isValidEmail(text)) {
      out.push(bot('Please enter a valid email address.'));
      return { messages: out, step, draft };
    }
    out.push(bot('What is your phone number?'));
    return { messages: out, step: 'phone', draft: { ...draft, customerEmail: text } };
  }

  if (step === 'phone') {
    if (text.replace(/\D/g, '').length < 6) {
      out.push(bot('Please enter a valid phone number.'));
      return { messages: out, step, draft };
    }
    const svc = service?.title || 'your service';
    out.push(
      bot(
        `Please confirm your booking:\n\n• Service: ${svc}\n• Date: ${draft.preferredDate}\n• Time: ${draft.preferredTimeSlot}\n• Name: ${draft.customerName}\n• Email: ${draft.customerEmail}\n• Phone: ${text}\n\nReply "confirm" to submit, or "cancel" to start over.`,
        {
          chips: [
            { label: 'Confirm booking', value: 'confirm' },
            { label: 'Cancel', value: 'cancel' },
          ],
        }
      )
    );
    return { messages: out, step: 'confirm', draft: { ...draft, customerPhone: text } };
  }

  if (step === 'confirm') {
    if (normalize(text) === 'cancel') {
      out.push(bot('Booking cancelled. How else can I help?', { chips: QUICK_CHIPS }));
      return { messages: out, step: 'idle', draft: {} };
    }
    if (normalize(text) !== 'confirm') {
      out.push(
        bot('Reply "confirm" to submit your booking, or "cancel" to start over.', {
          chips: [
            { label: 'Confirm booking', value: 'confirm' },
            { label: 'Cancel', value: 'cancel' },
          ],
        })
      );
      return { messages: out, step, draft };
    }
    out.push(
      bot('Submitting your booking…', {
        chips: [],
      })
    );
    return { messages: out, step: 'confirm', draft };
  }

  return { messages: out, step, draft };
}

export function buildBookingPayload(draft: BookingDraft) {
  if (
    !draft.serviceId ||
    !draft.preferredDate ||
    !draft.preferredTimeSlot ||
    !draft.customerName ||
    !draft.customerEmail ||
    !draft.customerPhone
  ) {
    return null;
  }
  return {
    serviceId: draft.serviceId,
    preferredDate: new Date(`${draft.preferredDate}T12:00:00`).toISOString(),
    preferredTimeSlot: draft.preferredTimeSlot,
    customerName: draft.customerName,
    customerEmail: draft.customerEmail,
    customerPhone: draft.customerPhone,
    address: draft.address,
  };
}
