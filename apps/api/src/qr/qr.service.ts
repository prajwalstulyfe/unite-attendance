import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import * as QRCodeImage from 'qrcode';

@Injectable()
export class QrService {
  constructor(private prisma: PrismaService) {}

  async getMemberQR(orgId: string, memberId: string) {
    const qr = await this.prisma.qRCode.findFirst({
      where: { orgId, memberId, isActive: true },
      include: {
        member: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            department: { select: { name: true } },
          },
        },
      },
    });

    if (!qr) {
      throw new NotFoundException('Active QR code not found for this member');
    }

    // Generate QR image as Data URL if qrImageUrl is null
    let qrImageUrl = qr.qrImageUrl;
    if (!qrImageUrl) {
      qrImageUrl = await QRCodeImage.toDataURL(qr.qrToken, { width: 300, margin: 2 });
    }

    return {
      ...qr,
      qrImageUrl,
    };
  }

  async generate(orgId: string, memberId: string) {
    // Invalidate existing active QRs
    await this.prisma.qRCode.updateMany({
      where: { orgId, memberId, isActive: true },
      data: { isActive: false },
    });

    const qrToken = `QR_${memberId}_${Date.now()}`;
    const qrDataUrl = await QRCodeImage.toDataURL(qrToken, { width: 300, margin: 2 });

    const newQr = await this.prisma.qRCode.create({
      data: {
        memberId,
        orgId,
        qrToken,
        qrImageUrl: qrDataUrl,
        type: 'MOBILE',
        isActive: true,
      },
      include: {
        member: {
          include: {
            user: { select: { name: true, avatarUrl: true } },
            department: { select: { name: true } },
          },
        },
      },
    });

    return newQr;
  }

  async regenerate(orgId: string, memberId: string) {
    return this.generate(orgId, memberId);
  }
}
