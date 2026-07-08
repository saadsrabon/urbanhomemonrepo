import { PrismaClient, UserRole, PriceType } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@urbanhomeandsecurity.com';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD || 'Admin@123456';
  const adminName = process.env.SEED_ADMIN_NAME || 'Super Admin';

  const passwordHash = await argon2.hash(adminPassword);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: adminName,
      email: adminEmail,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      phone: '(346) 365-7221',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@urbanhomeandsecurity.com' },
    update: {},
    create: {
      name: 'Operations Manager',
      email: 'manager@urbanhomeandsecurity.com',
      passwordHash: await argon2.hash('Manager@123456'),
      role: UserRole.MANAGER,
      phone: '(346) 365-7222',
    },
  });

  const homeImprovement = await prisma.serviceCategory.upsert({
    where: { slug: 'home-improvement' },
    update: {},
    create: {
      name: 'Home Improvement',
      slug: 'home-improvement',
      description: 'Remodeling, roofing, painting, flooring and more',
      sortOrder: 1,
    },
  });

  const securityServices = await prisma.serviceCategory.upsert({
    where: { slug: 'security-services' },
    update: {},
    create: {
      name: 'Security Services',
      slug: 'security-services',
      description: 'Security installations, guard services, and protection solutions',
      sortOrder: 2,
    },
  });

  const services = [
    {
      title: 'Remodeling & Renovation',
      slug: 'remodeling-and-renovation',
      categoryId: homeImprovement.id,
      shortDesc: 'Transform your space with expert remodeling and renovation services.',
      description: 'Urban Home and Security specializes in comprehensive remodeling and renovation services that enhance the functionality and aesthetics of your home or business.',
      featureBullets: ['Kitchen Remodeling', 'Bathroom Renovation', 'Commercial Remodeling'],
      benefitBullets: ['High-Quality Materials', 'Experienced Team', 'Clear Communication'],
      processSteps: [
        { title: 'Consultation and Planning', description: 'We start with an in-depth consultation to understand your vision, budget, and preferences.' },
        { title: 'Execution and Quality Control', description: 'Our experienced craftsmen work diligently to complete your remodel on schedule.' },
      ],
      durationMinutes: 180,
      sortOrder: 1,
    },
    {
      title: 'Security Installations',
      slug: 'security-installations',
      categoryId: securityServices.id,
      shortDesc: 'Keep your property secure with professional security installations.',
      description: 'Our expert security installation services are designed to safeguard your property with durable and reliable solutions.',
      featureBullets: ['Air Conditioner Cages', 'Burglar Doors', 'Generator Enclosures'],
      benefitBullets: ['Military-Grade Durability', 'Custom Solutions', 'Professional Installation'],
      processSteps: [],
      durationMinutes: 120,
      sortOrder: 2,
    },
    {
      title: 'Air Conditioning Steel Cage',
      slug: 'air-conditioning-steel-cage',
      categoryId: securityServices.id,
      shortDesc: 'High-quality steel cages to protect your AC units and valuables.',
      description: 'Our expertly crafted steel cages offer robust protection for high-value items.',
      featureBullets: ['High-end electronics protection', 'Jewelry and valuables', 'Important documents'],
      benefitBullets: ['Unmatched Expertise', 'Commitment to Quality'],
      processSteps: [
        { title: 'Consultation and Planning', description: 'We understand your security needs and budget.' },
        { title: 'Design & Planning', description: 'Comprehensive design plan with detailed drawings and timeline.' },
      ],
      durationMinutes: 90,
      sortOrder: 3,
    },
    {
      title: 'Electrical Services',
      slug: 'electrical-services',
      categoryId: homeImprovement.id,
      shortDesc: 'Licensed electricians for installations, repairs, and maintenance.',
      description: 'Our licensed electricians provide installations, repairs, and maintenance for all your electrical needs.',
      featureBullets: ['Installations', 'Repairs', 'Maintenance'],
      benefitBullets: ['Safe and efficient', 'Industry compliant'],
      processSteps: [],
      durationMinutes: 60,
      sortOrder: 4,
    },
    {
      title: 'Painting & Power Washing',
      slug: 'painting-and-power-washing',
      categoryId: homeImprovement.id,
      shortDesc: 'Refresh your property with expert painting and power washing.',
      description: 'Give your property a facelift with our professional painting and power washing services.',
      featureBullets: ['Exterior Painting', 'Interior Painting', 'Power Washing'],
      benefitBullets: ['Enhanced Aesthetics', 'Increased Property Value', 'Durability'],
      processSteps: [],
      durationMinutes: 60,
      sortOrder: 5,
    },
    {
      title: 'Roofing',
      slug: 'roofing',
      categoryId: homeImprovement.id,
      shortDesc: 'Reliable roofing solutions for lasting protection.',
      description: 'High-quality roofing services to protect your property and improve its appearance.',
      featureBullets: ['New Roof Installation', 'Roof Repairs', 'Roof Maintenance'],
      benefitBullets: ['Quality Materials', 'Experienced Team', 'Guaranteed Workmanship'],
      processSteps: [],
      durationMinutes: 240,
      sortOrder: 6,
    },
    {
      title: 'Flooring & Cabinet Replacement',
      slug: 'flooring-cabinet-replacement',
      categoryId: homeImprovement.id,
      shortDesc: 'Upgrade your interiors with stylish flooring and cabinetry.',
      description: 'Replace old flooring and cabinetry with modern, stylish options that match your taste.',
      featureBullets: ['Flooring Installation', 'Cabinet Replacement'],
      benefitBullets: ['Variety of Choices', 'Quality Craftsmanship', 'Affordable Options'],
      processSteps: [],
      durationMinutes: 180,
      sortOrder: 7,
    },
    {
      title: 'Security Guard Services',
      slug: 'security-guard-services',
      categoryId: securityServices.id,
      shortDesc: 'Professional security guard services for construction sites and properties.',
      description: 'Security solutions to protect what matters most for homes and businesses.',
      featureBullets: ['Construction Site Security', 'Residential Security', 'Commercial Security'],
      benefitBullets: ['Highest safety standards', 'Peace of mind'],
      processSteps: [],
      durationMinutes: 480,
      sortOrder: 8,
    },
    {
      title: 'Strip Plaza Security Service',
      slug: 'strip-plaza-security',
      categoryId: securityServices.id,
      shortDesc: 'Dedicated security for strip plazas and commercial properties.',
      description: 'Comprehensive security solutions for commercial strip plazas.',
      featureBullets: ['Patrol Services', 'Access Control', 'Emergency Response'],
      benefitBullets: ['Professional team', 'Custom security plans'],
      processSteps: [],
      durationMinutes: 480,
      sortOrder: 9,
    },
    {
      title: 'House Sitting Services',
      slug: 'house-sitting-services',
      categoryId: securityServices.id,
      shortDesc: 'Reliable house sitting while you are away.',
      description: 'Keep your home safe and maintained while you travel.',
      featureBullets: ['Property checks', 'Mail collection', 'Emergency contact'],
      benefitBullets: ['Trusted professionals', 'Flexible scheduling'],
      processSteps: [],
      durationMinutes: 480,
      sortOrder: 10,
    },
    {
      title: 'Pest Control',
      slug: 'pest-control',
      categoryId: homeImprovement.id,
      shortDesc: 'Effective pest control solutions for your home.',
      description: 'Professional pest control to keep your property safe and clean.',
      featureBullets: ['Inspection', 'Treatment', 'Prevention'],
      benefitBullets: ['Safe methods', 'Long-lasting results'],
      processSteps: [],
      durationMinutes: 120,
      sortOrder: 11,
    },
  ];

  for (const svc of services) {
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {},
      create: { ...svc, priceType: PriceType.QUOTE },
    });
  }

  const teamMembers = [
    { name: 'Ryan Francies', email: 'ryan@urbanhomeandsecurity.com', designation: 'Plumber', yearsExperience: 6 },
    { name: 'Cassidy', email: 'cassidy@urbanhomeandsecurity.com', designation: 'Electrician', yearsExperience: 3 },
    { name: 'Jethro', email: 'jethro@urbanhomeandsecurity.com', designation: 'Carpenter', yearsExperience: 8 },
    { name: 'Houston', email: 'houston@urbanhomeandsecurity.com', designation: 'Electrician', yearsExperience: 3 },
  ];

  for (const member of teamMembers) {
    const user = await prisma.user.upsert({
      where: { email: member.email },
      update: {},
      create: {
        name: member.name,
        email: member.email,
        passwordHash: await argon2.hash('Team@123456'),
        role: UserRole.TEAM_MEMBER,
        teamProfile: {
          create: {
            designation: member.designation,
            yearsExperience: member.yearsExperience,
            isPublic: true,
            skills: [member.designation],
          },
        },
      },
    });
    console.log(`Team member: ${user.name}`);
  }

  const testimonials = [
    { name: 'Sarah L.', role: 'Homeowner', location: 'Austin, TX', quote: 'We had our bathroom completely renovated by Urban Home and Security, and the results exceeded our expectations!' },
    { name: 'John D.', role: 'Homeowner', location: 'Houston, TX', quote: 'We recently hired Urban Home and Security for a complete kitchen remodel, and we could not be happier!' },
    { name: 'Mike R.', role: 'Homeowner', location: 'Dallas, TX', quote: 'Urban Home and Security transformed our backyard into an amazing outdoor living space!' },
  ];

  for (let i = 0; i < testimonials.length; i++) {
    const t = testimonials[i];
    const existing = await prisma.testimonial.findFirst({ where: { name: t.name } });
    if (!existing) {
      await prisma.testimonial.create({ data: { ...t, sortOrder: i + 1, rating: 5 } });
    }
  }

  const faqs = [
    { question: 'How do I book a service?', answer: 'You can book online through our appointment page or call us directly at (346) 365-7221.' },
    { question: 'Do you offer free quotes?', answer: 'Yes, we provide free quotes for all our services. Contact us to schedule a consultation.' },
    { question: 'What areas do you serve?', answer: 'We primarily serve the Houston, TX area and surrounding regions.' },
    { question: 'Are your team members licensed?', answer: 'Yes, all our professionals are licensed, insured, and background-checked.' },
  ];

  for (let i = 0; i < faqs.length; i++) {
    const f = faqs[i];
    const existing = await prisma.faq.findFirst({ where: { question: f.question } });
    if (!existing) {
      await prisma.faq.create({ data: { ...f, sortOrder: i + 1 } });
    }
  }

  const plans = [
    { name: 'Basic Plan', priceMonthly: 75, priceYearly: 95, features: ['Basic handyman services', 'Monthly inspection', 'Email support'] },
    { name: 'Silver Plan', priceMonthly: 100, priceYearly: 120, features: ['Priority scheduling', 'Quarterly maintenance', 'Phone support', '10% discount on services'] },
    { name: 'Gold Plan', priceMonthly: 120, priceYearly: 180, features: ['VIP scheduling', 'Monthly maintenance', '24/7 support', '20% discount on services', 'Free annual inspection'], isFeatured: true },
  ];

  for (let i = 0; i < plans.length; i++) {
    const p = plans[i];
    const existing = await prisma.pricingPlan.findFirst({ where: { name: p.name } });
    if (!existing) {
      await prisma.pricingPlan.create({ data: { ...p, sortOrder: i + 1 } });
    }
  }

  const locations = [
    { name: 'Houston HQ', addressLine: 'Houston, TX', phone: '(346) 365-7221', email: 'info@urbanhomeandsecurity.com', workingHours: 'Mon-Fri: 8 AM - 5 PM, Sat-Sun: 8 AM - 2 PM' },
    { name: 'Kansas City', addressLine: 'No 58 A, East Madison Street, Baltimore, MD, USA 3303', phone: '000-123-456789', email: 'info@printme.com', workingHours: 'Mon-Fri: 8 AM - 5 PM' },
  ];

  for (let i = 0; i < locations.length; i++) {
    const l = locations[i];
    const existing = await prisma.location.findFirst({ where: { name: l.name } });
    if (!existing) {
      await prisma.location.create({ data: { ...l, sortOrder: i + 1 } });
    }
  }

  const settings = {
    businessName: 'Urban Home & Security',
    tagline: 'One Stop Handyman Service',
    contactEmail: 'info@urbanhomeandsecurity.com',
    contactPhone: '(346) 365-7221',
    workingHours: 'Mon–Fri: 8 AM – 5 PM\nSat–Sun: 8 AM – 2 PM',
    address: 'Houston, TX',
    heroTitle: 'We Will Make Your Home Better',
    heroSubtitle: 'Exceptional services like Repairing, Plumbing, Electrical, and Security within your budget',
    statYears: 10,
    statProjects: 500,
    statCustomers: 1000,
    statBranches: 4,
    promoTitle: 'Book Your First Service & Get 30% Off',
    socialFacebook: '#',
    socialInstagram: '#',
    socialLinkedin: '#',
    socialTwitter: '#',
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  const sampleProjects = [
    {
      title: 'Kitchen Remodeling',
      categoryId: homeImprovement.id,
      coverImageUrl: '/before-after/kitchen-after.jpg',
      description: 'Full kitchen transformation with custom cabinets, quartz countertops, and modern lighting.',
      isFeatured: true,
      sortOrder: 1,
    },
    {
      title: 'Bathroom Renovation',
      categoryId: homeImprovement.id,
      coverImageUrl: '/before-after/bathroom-after.jpg',
      description: 'Spa-inspired bathroom with new tile, fixtures, and vanity installation.',
      isFeatured: true,
      sortOrder: 2,
    },
    {
      title: 'Roof Replacement',
      categoryId: homeImprovement.id,
      coverImageUrl: '/before-after/roof-after.jpg',
      description: 'Complete roof installation with premium weather-resistant materials.',
      sortOrder: 3,
    },
    {
      title: 'Burglar Door & AC Cage',
      categoryId: securityServices.id,
      coverImageUrl: '/before-after/security-after.jpg',
      description: 'Custom security door and AC steel cage installation for a Houston residential property.',
      sortOrder: 4,
    },
    {
      title: 'Exterior Painting',
      categoryId: homeImprovement.id,
      coverImageUrl: '/before-after/exterior-after.jpg',
      description: 'Full exterior repaint with power washing and trim detail work.',
      sortOrder: 5,
    },
    {
      title: 'Living Space Remodel',
      categoryId: homeImprovement.id,
      coverImageUrl: '/before-after/remodel-after.jpg',
      description: 'Open-concept living area upgrade with new flooring, lighting, and built-ins.',
      sortOrder: 6,
    },
  ];

  for (const project of sampleProjects) {
    const existing = await prisma.project.findFirst({ where: { title: project.title } });
    if (!existing) {
      await prisma.project.create({
        data: {
          ...project,
          images: project.coverImageUrl ? [project.coverImageUrl] : [],
          completedAt: new Date(),
          isActive: true,
        },
      });
    } else {
      await prisma.project.update({
        where: { id: existing.id },
        data: {
          coverImageUrl: project.coverImageUrl,
          images: project.coverImageUrl ? [project.coverImageUrl] : [],
        },
      });
    }
  }

  console.log('Seed completed');
  console.log(`Super Admin: ${admin.email} / ${adminPassword}`);
  console.log(`Manager: ${manager.email} / Manager@123456`);
  console.log('Team members password: Team@123456');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
