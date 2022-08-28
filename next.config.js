const withMDX = require("@next/mdx")({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [],
    rehypePlugins: []
  }
})

module.exports = withMDX({
  // swcMinify: true,
  images: {
    domains: [
      process.env.NEXT_PUBLIC_APP_URL.split("://").pop().split(":")[0],
      process.env.NEXT_PUBLIC_SUPABASE_URL.split("://").pop(),
      "api.producthunt.com",
      "static.alchemyapi.io",
      ""
    ]
  },
  experimental: {
    esmExternals: true
  },
  pageExtensions: ["ts", "tsx", "md", "mdx"]
})
