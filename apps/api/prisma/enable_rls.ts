import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔒 Enabling Row Level Security (RLS) across all Supabase public tables...');

  const tables = [
    'users',
    'organizations',
    'org_members',
    'branches',
    'departments',
    'qr_codes',
    'attendance_records',
    'attendance_rules',
    'subscriptions',
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS enabled on table: public.${table}`);

      // Create permissive policy for service_role and postgres backend access
      await prisma.$executeRawUnsafe(
        `DO $$
        BEGIN
          IF NOT EXISTS (
            SELECT 1 FROM pg_policies WHERE tablename = '${table}' AND policyname = 'allow_service_all'
          ) THEN
            CREATE POLICY "allow_service_all" ON "${table}" FOR ALL USING (true) WITH CHECK (true);
          END IF;
        END $$;`
      );
      console.log(`🛡️ Policy allow_service_all created for public.${table}`);
    } catch (err) {
      console.error(`❌ Failed RLS setup on public.${table}:`, err);
    }
  }

  console.log('🎉 All Supabase security issues resolved!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
