import { handleLogout } from '@auth0/nextjs-auth0';

export const runtime = 'nodejs';

export const GET = handleLogout({
  returnTo: '/',
});
