import { PrismaClient, GlobalRole, OrgRole, Plan } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  const superAdminEmail = process.env['SUPER_ADMIN_EMAIL'] || 'admin@unite-attendance.com';
  const superAdminPassword = process.env['SUPER_ADMIN_PASSWORD'] || 'changeme123!';

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

  // 4. Create Main Branch
  const mainBranch = await prisma.branch.create({
    data: {
      orgId: demoOrg.id,
      name: 'HQ — Bengaluru',
      address: 'Indiranagar 100ft Road, Bengaluru, KA 560038',
      location: { lat: 12.9716, lng: 77.5946, radiusMeters: 300 },
    },
  });

  // 5. Create Departments
  const engineeringDept = await prisma.department.create({
    data: {
      orgId: demoOrg.id,
      branchId: mainBranch.id,
      name: 'Engineering',
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      orgId: demoOrg.id,
      branchId: mainBranch.id,
      name: 'Human Resources',
    },
  });

  // 6. Create Default Attendance Rule
  await prisma.attendanceRule.create({
    data: {
      orgId: demoOrg.id,
      name: 'Standard Shift (9 AM - 6 PM)',
      workStart: '09:00',
      workEnd: '18:00',
      lateThresholdMin: 15,
      halfDayThresholdMin: 240,
      requireGps: false,
      preventDuplicateMin: 5,
      isDefault: true,
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
    },
  });
  console.log('✅ Default Attendance Rule created');

  // 7. Seed Demo Members
  const demoUsers = [
    { name: 'John Doe', email: 'john@acme.com', role: OrgRole.MANAGER, empId: 'EMP-101', deptId: engineeringDept.id },
    { name: 'Jane Smith', email: 'jane@acme.com', role: OrgRole.MEMBER, empId: 'EMP-102', deptId: engineeringDept.id },
    { name: 'Alice Johnson', email: 'alice@acme.com', role: OrgRole.MEMBER, empId: 'EMP-103', deptId: hrDept.id },
    { name: 'Bob Williams', email: 'bob@acme.com', role: OrgRole.MEMBER, empId: 'EMP-104', deptId: engineeringDept.id },
  ];

  for (const userSeed of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: userSeed.email },
      update: {},
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
      update: {},
      create: {
        userId: user.id,
        orgId: demoOrg.id,
        role: userSeed.role,
        departmentId: userSeed.deptId,
        branchId: mainBranch.id,
        employeeId: userSeed.empId,
      },
    });

    // Create active QR token for each demo member
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

  console.log('✅ Demo Members & QR codes seeded successfully!');
  console.log('🎉 Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
