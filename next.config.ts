import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // GitHub Pages 项目站点:仓库名 resume-show,路径前缀 /resume-show;本地 dev 不需要
  basePath: process.env.NODE_ENV === "production" ? "/resume-show" : "",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
