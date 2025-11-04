const path = require("path");
const withImages = require("next-images");

const nextConfig = withImages({
  transpilePackages: ["@fullcalendar"],
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets/scss')],
  },
  trailingSlash: true,
  webpack: (config, { isServer, webpack }) => {
    // Handle font files
    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2)$/,
      type: "asset/resource",
    });
    
    
    // Polyfill document for styled-jsx during SSR/build
    // Note: We import polyfills in _app.tsx and _document.tsx instead of modifying webpack entries
    // This avoids webpack chunk issues
    
    return config;
  },
});

module.exports = nextConfig;
