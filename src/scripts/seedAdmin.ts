import 'dotenv/config';
import { connectDB, disconnectDB } from '../app/manager/database';
import { User } from '../app/modules/user/repositories/schemas/user.schema';

async function main() {
  try {
    await connectDB();

    const email = (process.env.ADMIN_EMAIL ?? 'admin@quickhire.test').toLowerCase();
    const password = process.env.ADMIN_PASSWORD ?? 'Admin123!';
    const name = process.env.ADMIN_NAME ?? 'QuickHire Admin';

    const existing = await User.findOne({ email });
    if (existing) {
      // eslint-disable-next-line no-console
      console.log(`Admin already exists: ${existing.email}`);
      return;
    }

    const admin = await User.create({
      name,
      email,
      password,
      role: 'admin',
    });

    // eslint-disable-next-line no-console
    console.log(`Admin created: ${admin.email}`);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to seed admin user', err);
    process.exitCode = 1;
  } finally {
    await disconnectDB();
  }
}

main();

