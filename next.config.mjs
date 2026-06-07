import { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants.js';

/**
 * Use a separate build directory for production so `next build` / `next start`
 * never clobber the `.next` folder that a running `next dev` is serving from.
 * (Building into the live `.next` was causing the dev server to 404 its chunks.)
 */
export default (phase) => {
  const isProd = phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER;
  // Vercel (and other CI) expect the default `.next` output dir. Only redirect
  // to `.next-build` for LOCAL prod builds so they don't clobber a running dev.
  const isCI = process.env.VERCEL || process.env.CI;

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    distDir: isProd && !isCI ? '.next-build' : '.next',
  };
  return nextConfig;
};
