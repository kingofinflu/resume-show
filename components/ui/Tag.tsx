/** 小标签:领域/机制词,如 "LLM Judge"、"AB 实验" */
export default function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block rounded-full border border-line bg-card px-2.5 py-0.5 text-xs text-ink-2">
      {children}
    </span>
  );
}
