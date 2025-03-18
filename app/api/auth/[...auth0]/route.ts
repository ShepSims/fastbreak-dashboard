import { handleAuth, handleLogin, handleCallback } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
  login: handleLogin({
    returnTo: '/dashboard',
    authorizationParams: {
      scope: 'openid profile email'
    }
  }),
  callback: handleCallback({
    redirectTo: '/dashboard',
    async afterCallback(req, res, session) {
      console.log('[Auth0 Callback] Raw Session:', session);
      if (session?.user) {
        console.log('[Auth0 Callback] User data:', session.user);
        // Ensure we have all required user data
        session.user = {
          ...session.user,
          email: session.user.email || session.user.sub,
          name: session.user.name || session.user.email?.split('@')[0] || 'User',
          picture: session.user.picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.user.name || session.user.email?.split('@')[0] || 'User')}`
        };
      }
      return session;
    }
  })
}); 