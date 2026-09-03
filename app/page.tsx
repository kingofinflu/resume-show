import { resume } from "@/data/resume";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/site/Footer";
import Hero from "@/components/story/Hero";
import ChapterShell from "@/components/story/ChapterShell";
import Chapter01Medical from "@/components/story/Chapter01Medical";
import Chapter02Crossover from "@/components/story/Chapter02Crossover";
import Chapter03Projects from "@/components/story/Chapter03Projects";
import Chapter04Honors from "@/components/story/Chapter04Honors";
import PrintResume from "@/components/print/PrintResume";

/** 按 id 取章节数据(hero 章节由 Hero 组件自带 id="hero",不走 ChapterShell) */
function chapterOf(id: string) {
  return resume.chapters.find((c) => c.id === id);
}

export default function Page() {
  const medical = chapterOf("medical");
  const crossover = chapterOf("crossover");
  const projects = chapterOf("projects");
  const honors = chapterOf("honors");

  return (
    <>
      {/* 屏幕版章节流(打印时隐藏) */}
      <Navbar />
      <main className="print:hidden">
        <Hero />
        {medical && (
          <ChapterShell chapter={medical}>
            <Chapter01Medical />
          </ChapterShell>
        )}
        {crossover && (
          <ChapterShell chapter={crossover}>
            <Chapter02Crossover />
          </ChapterShell>
        )}
        {projects && (
          <ChapterShell chapter={projects}>
            <Chapter03Projects />
          </ChapterShell>
        )}
        {honors && (
          <ChapterShell chapter={honors}>
            <Chapter04Honors />
          </ChapterShell>
        )}
      </main>
      <Footer />

      {/* 打印版 A4 简历(屏幕时隐藏,打印时显示) */}
      <div className="hidden print:block">
        <PrintResume />
      </div>
    </>
  );
}
