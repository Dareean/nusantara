import fs from 'fs';
import path from 'path';
import { createAdminClient } from '../src/lib/supabase/admin';
import { getSeedUsers, hashPassword } from '../src/app/auth/serverAuth';

async function migrate() {
  console.log('=== MIGRATING AUTH STORE & SEEDS TO SUPABASE PERSISTENT STORE ===');
  const admin = createAdminClient();

  // 1. Seed accounts (demo, admin, juri)
  const seeds = getSeedUsers();
  for (const [email, user] of Object.entries(seeds)) {
    console.log(`Provisioning seed user: ${email}...`);
    const { data: existing } = await admin
      .from('user_progress')
      .select('progress')
      .eq('email', email)
      .maybeSingle();

    const progress = (existing?.progress as Record<string, unknown>) || {};
    const updatedProgress = {
      ...progress,
      _auth: {
        name: user.name,
        email: user.email,
        passwordHash: user.passwordHash,
        isAdmin: user.isAdmin || false,
        isJury: user.isJury || false,
        avatarUrl: user.avatarUrl || '',
      },
    };

    const { error } = await admin.from('user_progress').upsert(
      {
        email,
        progress: updatedProgress,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'email' }
    );
    if (error) {
      console.error(`Error provisioning ${email}:`, error.message);
    } else {
      console.log(`✓ Provisioned ${email} successfully!`);
    }
  }

  // 2. Existing users from laras_auth_store.json
  const storePath = path.join(process.cwd(), 'laras_auth_store.json');
  if (fs.existsSync(storePath)) {
    const raw = fs.readFileSync(storePath, 'utf8');
    try {
      const parsed = JSON.parse(raw);
      if (parsed.users) {
        for (const [email, u] of Object.entries(parsed.users as Record<string, any>)) {
          console.log(`Migrating local user: ${email}...`);
          const { data: existing } = await admin
            .from('user_progress')
            .select('progress')
            .eq('email', email.toLowerCase())
            .maybeSingle();

          const progress = (existing?.progress as Record<string, unknown>) || {};
          const updatedProgress = {
            ...progress,
            _auth: {
              name: u.name || email.split('@')[0],
              email: email.toLowerCase(),
              passwordHash: u.passwordHash,
              isAdmin: email.toLowerCase() === 'admin@laras.id',
              isJury: email.toLowerCase() === 'juri@laras.id',
              avatarUrl: u.avatarUrl || '',
            },
          };

          const { error } = await admin.from('user_progress').upsert(
            {
              email: email.toLowerCase(),
              progress: updatedProgress,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'email' }
          );
          if (error) {
            console.error(`Error migrating ${email}:`, error.message);
          } else {
            console.log(`✓ Migrated ${email} successfully!`);
          }
        }
      }
    } catch (e: any) {
      console.error('Failed to parse laras_auth_store.json:', e.message);
    }
  }

  console.log('\n=== MIGRATION COMPLETE ===');
}

migrate();
