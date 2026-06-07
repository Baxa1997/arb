import { PHASE_PRODUCTION_BUILD, PHASE_PRODUCTION_SERVER } from 'next/constants.js';

/**
 * Use a separate build directory for production so `next build` / `next start`
 * never clobber the `.next` folder that a running `next dev` is serving from.
 * (Building into the live `.next` was causing the dev server to 404 its chunks.)
 */
export default (phase) => {
  const isProd = phase === PHASE_PRODUCTION_BUILD || phase === PHASE_PRODUCTION_SERVER;

  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    distDir: isProd ? '.next-build' : '.next',
  };
  return nextConfig;
};
