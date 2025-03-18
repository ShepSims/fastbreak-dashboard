import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

export default withMiddlewareAuthRequired();

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - auth/* (auth routes)
     * - / (root route)
     * - api/* (API routes)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth|api|$).*)",
  ],
}