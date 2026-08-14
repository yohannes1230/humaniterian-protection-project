import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, './.env') });

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SECRET_KEY!; // Service role key to bypass RLS

const supabase = createClient(supabaseUrl, supabaseKey);

const DEMO_ACCOUNTS = [
  { role: "SUPER_ADMIN", email: "admin.demo@hpis.example" },
  { role: "PROGRAM_MANAGER", email: "manager.demo@hpis.example" },
  { role: "PROTECTION_OFFICER", email: "officer.demo@hpis.example" },
  { role: "CASE_WORKER", email: "worker.demo@hpis.example" },
  { role: "DATA_OFFICER", email: "data.demo@hpis.example" },
  { role: "FIELD_OFFICER", email: "field.demo@hpis.example" },
  { role: "AUDITOR", email: "auditor.demo@hpis.example" },
  { role: "VIEWER", email: "viewer.demo@hpis.example" },
];

async function seed() {
  for (const account of DEMO_ACCOUNTS) {
    const { data: user, error } = await supabase.auth.admin.createUser({
      email: account.email,
      password: 'demo1234',
      email_confirm: true,
      user_metadata: {
        full_name: `${account.role} Demo`
      }
    });

    if (error) {
      console.log(`Failed to create ${account.email}:`, error.message);
    } else {
      console.log(`Created ${account.email}`);
      // The trigger creates the profile with 'VIEWER' role, we need to update it
      await supabase
        .from('profiles')
        .update({ role: account.role })
        .eq('id', user.user.id);
      console.log(`Updated role to ${account.role}`);
    }
  }
}

seed().catch(console.error);
