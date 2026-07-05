import { Response, NextFunction } from 'express';
import { BookingStatus } from '@prisma/client';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../utils/auth.types';
import { badRequest, forbidden, notFound } from '../utils/errors';
import { assignBookingSchema, bookingSchema, updateBookingStatusSchema } from '../schemas';
import {
  adminBookingAlertEmail,
  assignmentEmail,
  bookingConfirmationEmail,
  sendEmail,
  statusUpdateEmail,
} from '../services/email.service';
import { paramId } from '../utils/params';
import { env } from '../config/env';

async function logActivity(
  bookingId: string,
  toStatus: BookingStatus,
  changedById: string | undefined,
  fromStatus?: BookingStatus,
  note?: string
) {
  await prisma.bookingActivity.create({
    data: { bookingId, fromStatus, toStatus, changedById, note },
  });
}

export async function createBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const data = bookingSchema.parse(req.body);
    const service = await prisma.service.findUnique({ where: { id: data.serviceId } });
    if (!service || !service.isActive) throw notFound('Service not found');

    const booking = await prisma.booking.create({
      data: {
        ...data,
        preferredDate: new Date(data.preferredDate),
      },
      include: { service: true },
    });

    await logActivity(booking.id, BookingStatus.PENDING, undefined, undefined, 'Booking created');

    const dateStr = booking.preferredDate.toLocaleDateString();
    sendEmail({
      to: booking.customerEmail,
      subject: 'Booking Confirmation - Urban Home & Security',
      html: bookingConfirmationEmail({
        customerName: booking.customerName,
        serviceTitle: service.title,
        preferredDate: dateStr,
        preferredTimeSlot: booking.preferredTimeSlot,
      }),
    }).catch(console.error);

    if (env.ADMIN_NOTIFY_EMAIL) {
      sendEmail({
        to: env.ADMIN_NOTIFY_EMAIL,
        subject: 'New Booking Request',
        html: adminBookingAlertEmail({
          customerName: booking.customerName,
          customerEmail: booking.customerEmail,
          customerPhone: booking.customerPhone,
          serviceTitle: service.title,
          preferredDate: dateStr,
        }),
      }).catch(console.error);
    }

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
}

export async function listBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, serviceId, assignedToId, from, to } = req.query;
    const bookings = await prisma.booking.findMany({
      where: {
        status: status ? (status as BookingStatus) : undefined,
        serviceId: serviceId as string | undefined,
        assignedToId: assignedToId as string | undefined,
        preferredDate: from || to ? {
          gte: from ? new Date(from as string) : undefined,
          lte: to ? new Date(to as string) : undefined,
        } : undefined,
      },
      include: {
        service: true,
        assignedTo: { select: { id: true, name: true, email: true } },
        preferredStaff: { select: { id: true, name: true } },
        activities: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function getBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const id = paramId(req.params.id);
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        assignedTo: { select: { id: true, name: true, email: true, phone: true } },
        preferredStaff: { select: { id: true, name: true } },
        activities: {
          include: { changedBy: { select: { id: true, name: true } } },
          orderBy: { createdAt: 'desc' },
        },
      },
    });
    if (!booking) throw notFound();
    res.json(booking);
  } catch (err) {
    next(err);
  }
}

export async function assignBooking(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { assignedToId, managerNotes } = assignBookingSchema.parse(req.body);
    const id = paramId(req.params.id);
    const member = await prisma.user.findUnique({ where: { id: assignedToId } });
    if (!member || !member.isActive) throw badRequest('Invalid team member');

    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) throw notFound();

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        assignedToId,
        managerNotes,
        status: BookingStatus.ASSIGNED,
      },
      include: { service: true, assignedTo: true },
    });

    await logActivity(
      booking.id,
      BookingStatus.ASSIGNED,
      req.user?.id,
      existing.status,
      `Assigned to ${member.name}`
    );

    sendEmail({
      to: member.email,
      subject: 'New Job Assigned',
      html: assignmentEmail({
        memberName: member.name,
        serviceTitle: booking.service.title,
        customerName: booking.customerName,
        preferredDate: booking.preferredDate.toLocaleDateString(),
      }),
    }).catch(console.error);

    res.json(booking);
  } catch (err) {
    next(err);
  }
}

export async function updateBookingStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { status, note, managerNotes } = updateBookingStatusSchema.parse(req.body);
    const id = paramId(req.params.id);
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing) throw notFound();

    const booking = await prisma.booking.update({
      where: { id },
      data: {
        status,
        managerNotes: managerNotes ?? existing.managerNotes,
      },
      include: { service: true },
    });

    await logActivity(booking.id, status, req.user?.id, existing.status, note);

    if (status === BookingStatus.CONFIRMED || status === BookingStatus.COMPLETED) {
      sendEmail({
        to: booking.customerEmail,
        subject: `Booking ${status} - Urban Home & Security`,
        html: statusUpdateEmail({
          customerName: booking.customerName,
          serviceTitle: booking.service.title,
          status,
        }),
      }).catch(console.error);
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
}

export async function listMyBookings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw forbidden();
    const bookings = await prisma.booking.findMany({
      where: { assignedToId: req.user.id },
      include: {
        service: true,
        activities: { orderBy: { createdAt: 'desc' }, take: 3 },
      },
      orderBy: { preferredDate: 'asc' },
    });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
}

export async function updateMyBookingStatus(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.user) throw forbidden();
    const { status, note } = updateBookingStatusSchema.parse(req.body);

    const allowed: BookingStatus[] = [BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED];
    if (!allowed.includes(status)) throw badRequest('Team members can only set IN_PROGRESS or COMPLETED');

    const id = paramId(req.params.id);
    const existing = await prisma.booking.findUnique({ where: { id } });
    if (!existing || existing.assignedToId !== req.user.id) throw forbidden();

    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
      include: { service: true },
    });

    await logActivity(booking.id, status, req.user.id, existing.status, note);

    if (status === BookingStatus.COMPLETED) {
      sendEmail({
        to: booking.customerEmail,
        subject: 'Service Completed - Urban Home & Security',
        html: statusUpdateEmail({
          customerName: booking.customerName,
          serviceTitle: booking.service.title,
          status: 'COMPLETED',
        }),
      }).catch(console.error);
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
}
