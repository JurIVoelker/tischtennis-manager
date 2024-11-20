import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
};

export default withPWA({
  dest: "public", // destination directory for the PWA files
  register: true, // register the PWA service worker
  skipWaiting: true, // skip waiting for service worker activation
  disable: process.env.NODE_ENV === "development",
})(nextConfig);
