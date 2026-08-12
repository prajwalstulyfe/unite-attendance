import { PrismaClient, GlobalRole, OrgRole, Plan, AttendanceStatus, AttendanceType, AttendanceMethod, QRCodeType } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Cleaning previous records & seeding fresh live organization: Unite India (unite-india)...');

  const superAdminEmail = process.env['SUPER_ADMIN_EMAIL'] || 'admin@unite-attendance.com';
  const defaultPassword = process.env['DEMO_USER_PASSWORD'] || 'Welcome123!';
  const superAdminPassword = process.env['SUPER_ADMIN_PASSWORD'] || 'changeme123!';

  const allowedEmails = [
    superAdminEmail.toLowerCase(),
    'rohit@unite-india.com',
    'aarav@unite-india.com',
    'ananya@unite-india.com',
    'rohan@unite-india.com',
  ];

  // 0. Clean database
  await prisma.attendanceRecord.deleteMany({});
  await prisma.qRCode.deleteMany({});
  await prisma.attendanceRule.deleteMany({});
  await prisma.orgMember.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.branch.deleteMany({});
  await prisma.organization.deleteMany({});
  await prisma.user.deleteMany({
    where: {
      email: {
        notIn: allowedEmails,
      },
    },
  });
  console.log('🧹 Purged previous organizations and outdated data.');

  // 1. Create Super Admin User
  const adminPasswordHash = await bcrypt.hash(superAdminPassword, 10);
  const superAdmin = await prisma.user.upsert({
    where: { email: superAdminEmail },
    update: { passwordHash: adminPasswordHash, globalRole: GlobalRole.SUPER_ADMIN },
    create: {
      email: superAdminEmail,
      name: 'Super Admin',
      passwordHash: adminPasswordHash,
      globalRole: GlobalRole.SUPER_ADMIN,
    },
  });
  console.log(`✅ Super Admin created: ${superAdmin.email}`);

  // 2. Create FRESH Live Organization: Unite India
  const uniteOrg = await prisma.organization.create({
    data: {
      name: 'Unite India',
      slug: 'unite-india',
      plan: Plan.ENTERPRISE,
      settings: {
        timezone: 'Asia/Kolkata',
        dateFormat: 'DD/MM/YYYY',
        timeFormat: '12h',
        currency: 'INR',
        allowSelfCheckIn: true,
        requireGpsForKiosk: false,
        notifyOnLateArrival: true,
        notifyOnAbsence: true,
        maxQrRegenerationsPerMonth: 100,
      },
    },
  });
  console.log(`✅ Organization Created: ${uniteOrg.name} (${uniteOrg.slug})`);

  // 3. Create 2 Office Branches
  const hqBranch = await prisma.branch.create({
    data: {
      orgId: uniteOrg.id,
      name: 'Dwarka, Nashik',
      address: 'Dwarka Circle, Nashik, Maharashtra 422011',
      location: { lat: 19.9975, lng: 73.7898, radiusMeters: 300 },
    },
  });

  const techBranch = await prisma.branch.create({
    data: {
      orgId: uniteOrg.id,
      name: 'Indira Nagar, Nashik',
      address: 'Indira Nagar, Nashik, Maharashtra 422009',
      location: { lat: 19.9702, lng: 73.7717, radiusMeters: 250 },
    },
  });
  console.log('✅ Office Branches Created: Dwarka, Nashik & Indira Nagar, Nashik');

  // 4. Create 3 Departments
  const engDept = await prisma.department.create({
    data: {
      orgId: uniteOrg.id,
      branchId: hqBranch.id,
      name: 'Software Engineering',
    },
  });

  const hrDept = await prisma.department.create({
    data: {
      orgId: uniteOrg.id,
      branchId: techBranch.id,
      name: 'Human Resources',
    },
  });

  const salesDept = await prisma.department.create({
    data: {
      orgId: uniteOrg.id,
      branchId: techBranch.id,
      name: 'Product Sales',
    },
  });
  console.log('✅ Departments Created: Software Engineering, Human Resources, Product Sales');

  // 5. Default Attendance Rule for Unite India
  await prisma.attendanceRule.create({
    data: {
      orgId: uniteOrg.id,
      name: 'Standard General Shift (9 AM - 6 PM)',
      workStart: '09:00',
      workEnd: '18:00',
      lateThresholdMin: 15,
      workingDays: ['mon', 'tue', 'wed', 'thu', 'fri'],
      requireGps: false,
      isDefault: true,
      isActive: true,
    },
  });
  console.log('✅ Attendance Rule Created: Standard General Shift (9 AM - 6 PM)');

  // 6. Create 4 Live Members for Unite India
  const userPasswordHash = await bcrypt.hash(defaultPassword, 10);
  const demoUsers = [
    {
      name: 'Rohit Sharma',
      email: 'rohit@unite-india.com',
      role: (OrgRole as any).DEPT_HEAD || OrgRole.ORG_ADMIN,
      empId: 'EMP-101',
      designation: 'Department Head — Software Engineering',
      deptId: engDept.id,
      branchId: hqBranch.id,
    },
    {
      name: 'Aarav Verma',
      email: 'aarav@unite-india.com',
      role: (OrgRole as any).BRANCH_MANAGER || OrgRole.MEMBER,
      empId: 'EMP-102',
      designation: 'Branch Manager — Dwarka, Nashik',
      deptId: engDept.id,
      branchId: hqBranch.id,
    },
    {
      name: 'Ananya Iyer',
      email: 'ananya@unite-india.com',
      role: (OrgRole as any).DEPT_HEAD || OrgRole.ORG_ADMIN,
      empId: 'EMP-103',
      designation: 'Department Head — Human Resources',
      deptId: hrDept.id,
      branchId: techBranch.id,
    },
    {
      name: 'Rohan Mehta',
      email: 'rohan@unite-india.com',
      role: OrgRole.MEMBER,
      empId: 'EMP-104',
      designation: 'Senior Product Sales Specialist',
      deptId: salesDept.id,
      branchId: techBranch.id,
    },
  ];

  const createdMembers = [];

  for (const uSeed of demoUsers) {
    const user = await prisma.user.upsert({
      where: { email: uSeed.email },
      update: { name: uSeed.name, passwordHash: userPasswordHash },
      create: {
        email: uSeed.email,
        name: uSeed.name,
        passwordHash: userPasswordHash,
      },
    });

    const member = await prisma.orgMember.create({
      data: {
        userId: user.id,
        orgId: uniteOrg.id,
        role: uSeed.role,
        departmentId: uSeed.deptId,
        branchId: uSeed.branchId,
        employeeId: uSeed.empId,
        designation: uSeed.designation,
      },
    });

    // Create Active QR Code Pass
    await prisma.qRCode.create({
      data: {
        memberId: member.id,
        orgId: uniteOrg.id,
        qrToken: `QR_${member.id.slice(-8).toUpperCase()}_ACTIVE`,
        type: QRCodeType.MOBILE,
        isActive: true,
      },
    });

    createdMembers.push({ user, member });
  }

  // Link Heads to Departments & Branches
  await prisma.department.update({
    where: { id: engDept.id },
    data: { headId: createdMembers[0]!.member.id },
  });

  await prisma.department.update({
    where: { id: hrDept.id },
    data: { headId: createdMembers[2]!.member.id },
  });

  console.log('✅ 4 Live Members created for Unite India with active logins & dynamic QR tokens');

  // 7. Seed 4 Live Telemetry Attendance Records for Today
  const today = new Date();
  const todayTimes = [
    new Date(today.setHours(9, 5, 0, 0)),
    new Date(today.setHours(9, 12, 0, 0)),
    new Date(today.setHours(9, 14, 0, 0)),
    new Date(today.setHours(9, 42, 0, 0)), // Late
  ];

  for (let i = 0; i < createdMembers.length; i++) {
    const m = createdMembers[i]!;
    await prisma.attendanceRecord.create({
      data: {
        orgId: uniteOrg.id,
        memberId: m.member.id,
        type: AttendanceType.CHECK_IN,
        method: AttendanceMethod.QR_MOBILE,
        status: i === 3 ? AttendanceStatus.FLAGGED : AttendanceStatus.VALID,
        timestamp: todayTimes[i],
        gpsLocation: { lat: 28.6315, lng: 77.2167, accuracy: 10 },
        validationErrors: i === 3 ? ['LATE_CHECKIN'] : [],
      },
    });
  }

  console.log('✅ Seeded 4 live check-in telemetry records for today');
  console.log('------------------------------------------------------------------');
  console.log('🔑 LIVE ORGANIZATIONAL LOGINS FOR CLIENT (Password: Welcome123!):');
  console.log(' 1. rohit@unite-india.com   (Rohit Sharma — Department Head)');
  console.log(' 2. aarav@unite-india.com   (Aarav Verma — Branch Manager)');
  console.log(' 3. ananya@unite-india.com  (Ananya Iyer — Department Head)');
  console.log(' 4. rohan@unite-india.com   (Rohan Mehta — Member)');
  console.log('------------------------------------------------------------------');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
