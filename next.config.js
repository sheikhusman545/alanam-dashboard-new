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
    if (isServer) {
      config.plugins.push(
        new webpack.DefinePlugin({
          'typeof document': JSON.stringify('object'),
        })
      );
      
      // Provide a mock document object for styled-jsx
      config.plugins.push(
        new webpack.ProvidePlugin({
          document: path.resolve(__dirname, 'src/polyfills.ts'),
        })
      );
    }
    
    return config;
  },
});

module.exports = nextConfig;
