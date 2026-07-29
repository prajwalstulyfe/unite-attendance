import { PrismaClient, GlobalRole, OrgRole, Plan } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database cleanup & seed...');

  // Clean up any extra dummy users/members to ensure ONLY the 3 requested accounts exist
  const superAdminEmail = process.env['SUPER_ADMIN_EMAIL'] || 'admin@unite-attendance.com';
  const superAdminPassword = process.env['SUPER_ADMIN_PASSWORD'] || 'changeme123!';

  const allowedEmails = [
    superAdminEmail.toLowerCase(),
    'john@acme.com',
    'jane@acme.com',
  ];

  // Delete attendance records, QR codes, members, and users not in allowedEmails
  await prisma.attendanceRecord.deleteMany({});
  await prisma.qRCode.deleteMany({});
  await prisma.orgMember.deleteMany({
    where: {
      user: {
        email: {
          notIn: allowedEmails,
        },
      },
    },
  });
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: allowedEmails,
      },
    },
  });
  console.log('🧹 Cleaned up non-essential database records.');

  // 1. Create Super Admin User
  const passwordHash = await bcrypt.hash(superAdminPassword, 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { passwordHash, globalRole: GlobalRole.SUPER_ADMIN },
    create: {
      email: superAdminEmail,
      name: 'Super Admin',
      passwordHash,
      globalRole: GlobalRole.SUPER_ADMIN,
    },
  });
  console.log(`✅ Super Admin created/updated: ${superAdmin.email}`);

  // 2. Create Demo Organization
  const demoOrg = await prisma.organization.upsert({
    where: { slug: 'acme-corp' },
    update: {},
    create: {
      name: 'Acme Corporation',
      slug: 'acme-corp',
      plan: Plan.PRO,
      settings: {
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        currency: 'INR',
        allowSelfCheckIn: true,
        requireGpsForKiosk: false,
        notifyOnLateArrival: true,
        notifyOnAbsence: true,
        maxQrRegenerationsPerMonth: 50,
      },
    },
  });
  console.log(`✅ Demo Organization created: ${demoOrg.name} (${demoOrg.slug})`);

  // 3. Add Super Admin as Org Admin of Demo Org
  await prisma.orgMember.upsert({
    where: {
      userId_orgId: {
        userId: superAdmin.id,
        orgId: demoOrg.id,
      },
    },
    update: { role: OrgRole.ORG_ADMIN },
    create: {
      userId: superAdmin.id,
      orgId: demoOrg.id,
      role: OrgRole.ORG_ADMIN,
      employeeId: 'EMP-001',
      designation: 'Chief Administrator',
    },
  });

  // 4. Create Main Branch if needed
  let mainBranch = await prisma.branch.findFirst({ where: { orgId: demoOrg.id } });
  if (!mainBranch) {
    mainBranch = await prisma.branch.create({
      data: {
        orgId: demoOrg.id,
        name: 'HQ — Bengaluru',
        address: 'Indiranagar 100ft Road, Bengaluru, KA 560038',
        location: { lat: 12.9716, lng: 77.5946, radiusMeters: 300 },
      },
    });
  }

  // 5. Create Departments if needed
  let engineeringDept = await prisma.department.findFirst({ where: { orgId: demoOrg.id, name: 'Engineering' } });
  if (!engineeringDept) {
    engineeringDept = await prisma.department.create({
      data: {
        orgId: demoOrg.id,
        branchId: mainBranch.id,
        name: 'Engineering',
      },
    });
  }

  // 6. Seed ONLY the 2 requested org accounts (john@acme.com and jane@acme.com)
  const demoUsers = [
    { name: 'John Doe', email: 'john@acme.com', role: OrgRole.MANAGER, empId: 'EMP-101', deptId: engineeringDept.id },
    { name: 'Jane Smith', email: 'jane@acme.com', role: OrgRole.MEMBER, empId: 'EMP-102', deptId: engineeringDept.id },
  ];

  for (const userSeed of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userSeed.email },
      update: { passwordHash },
      create: {
        email: userSeed.email,
        name: userSeed.name,
        passwordHash,
      },
    });

    const member = await prisma.orgMember.upsert({
      where: {
        userId_orgId: {
          userId: user.id,
          orgId: demoOrg.id,
        },
      },
      update: { role: userSeed.role },
      create: {
        userId: user.id,
        orgId: demoOrg.id,
        role: userSeed.role,
        departmentId: userSeed.deptId,
        branchId: mainBranch.id,
        employeeId: userSeed.empId,
      },
    });

    // Create active QR token for member
    await prisma.qRCode.create({
      data: {
        memberId: member.id,
        orgId: demoOrg.id,
        qrToken: `TOKEN_${member.id}_DEMO`,
        type: 'MOBILE',
        isActive: true,
      },
    });
  }

  console.log('✅ Kept ONLY 3 accounts: admin@unite-attendance.com, john@acme.com, jane@acme.com');
  console.log('🎉 Cleanup & seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
