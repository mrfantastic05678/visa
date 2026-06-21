/**
 * Creates the first admin user via BetterAuth.
 * Usage: npx tsx src/lib/db/seed-admin.ts <email> <password> "<name>"
 */
import { auth } from "../auth";

async function main() {
  const [email, password, name] = process.argv.slice(2);
  if (!email || !password) {
    console.error(
      'Usage: npx tsx src/lib/db/seed-admin.ts <email> <password> "<name>"'
    );
    process.exit(1);
  }

  try {
    await auth.api.signUpEmail({
      body: { email, password, name: name ?? "Visati Admin" },
    });
    console.log(`✓ Admin user created: ${email}`);
    process.exit(0);
  } catch (err) {
    console.error("Failed to create admin user:", err);
    process.exit(1);
  }
}

main();
