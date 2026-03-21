# Paper3 Empty Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修复 `docs/paper3` 中明显空页和异常留白，同时保留现有章节视觉风格。

**Architecture:** 优先检查 `main.tex` 中导致分页的全局章节宏和封面/目录切换逻辑，再通过最小改动去掉真正多余的分页或异常空白，不重做章节设计。修改完成后重新编译 PDF，并用文本页检测与关键词搜索双重验证。

**Tech Stack:** LaTeX (`ctexbook`, `titlesec`, `tikz`), `latexmk -xelatex`, `pdftotext`

---

### Task 1: Diagnose empty-page sources

**Files:**
- Modify: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\main.tex`
- Test: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\main.pdf`

**Step 1:** 检查 `\chapter` 重定义、`\clearpage`、目录前后切换。

**Step 2:** 用 `pdftotext` 找出文本量极低的页，定位真正空页。

### Task 2: Apply minimal pagination fixes

**Files:**
- Modify: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\main.tex`

**Step 1:** 仅删除真正多余的分页控制或异常空白控制。

**Step 2:** 保留章节扉页风格，不改章节标题整体视觉语言。

### Task 3: Verify output

**Files:**
- Test: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\main.pdf`

**Step 1:** 运行 `latexmk -xelatex -interaction=nonstopmode main.tex`。

**Step 2:** 再次用 `pdftotext` 检查空页是否减少。

**Step 3:** 搜索 `system-reminder` 等脏文本，确认未出现在文档源文件中。
