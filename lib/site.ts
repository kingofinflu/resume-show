import { resume } from "@/data/resume";

/**
 * basePath 处理:GitHub Pages 项目站点需要 /resume-show 前缀,
 * 手写的 <img src>、锚点跳转等资源路径统一走这里;next/link 自动带 basePath。
 * 本地 dev 无 basePath(NODE_ENV !== 'production')。
 */
export function withBase(path: string): string {
  const base = process.env.NODE_ENV === "production" ? `/${resume.meta.repoName}` : "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
