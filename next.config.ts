import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/_app/i18n/request.ts");

const API_ORIGIN = process.env.API_ORIGIN ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_ORIGIN}/api/:path*`,
      },
    ];
  },
  turbopack: {
    rules: {
      "*.svg": [
        {
          condition: { query: /[?&]react(?=&|$)/ },
          loaders: ["@svgr/webpack"],
          as: "*.js",
        },
        {
          condition: { not: { query: /[?&]react(?=&|$)/ } },
          type: "asset",
        },
      ],
    },
  },
  webpack(config) {
    const fileLoaderRule = config.module?.rules?.find(
      (rule: { test?: { test?: (value: string) => boolean } }) =>
        rule.test?.test?.(".svg"),
    );

    if (!fileLoaderRule || typeof fileLoaderRule !== "object") {
      throw new Error("Could not find existing webpack rule for .svg files");
    }

    const existingResourceQueryNot =
      typeof fileLoaderRule.resourceQuery === "object" &&
      fileLoaderRule.resourceQuery !== null &&
      "not" in fileLoaderRule.resourceQuery &&
      Array.isArray(fileLoaderRule.resourceQuery.not)
        ? fileLoaderRule.resourceQuery.not
        : [];

    config.module?.rules?.push(
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: /react/,
        use: ["@svgr/webpack"],
      },
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: { not: [...existingResourceQueryNot, /react/] },
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default withNextIntl(nextConfig);
