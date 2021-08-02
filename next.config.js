module.exports = {
  images: {
    domains: ["image.tmdb.org", "www.themoviedb.org", "chpistel.sirv.com"],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|mp3|aif|svg)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "static/media/[name].[hash:8].[ext]",
          },
        },
      ],
    });

    return config;
  },
};
