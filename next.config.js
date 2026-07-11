/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // C'est cette ligne qui synchronise les hash CSS
  },
};

module.exports = nextConfig;
