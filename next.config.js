const path = require("path");
const withImages = require("next-images");

const nextConfig = withImages({
  transpilePackages: ["@fullcalendar"],
  sassOptions: {
    includePaths: [path.join(__dirname, 'assets/scss')],
  },
  trailingSlash: true,
  webpack: (config) => {
    // Handle font files
    config.module.rules.push({
      test: /\.(eot|ttf|woff|woff2)$/,
      type: "asset/resource",
    });
    return config;
  },
});

module.exports = nextConfig;
