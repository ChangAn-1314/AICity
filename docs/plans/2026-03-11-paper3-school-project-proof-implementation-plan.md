# Paper3 School Project Proof Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将“信阳学院大学生校级科研项目”证明图补入团队章节与附录，增强团队连续研究积累的证据链。

**Architecture:** 在团队章节补充一段关于校级科研项目积累的正式说明，并插入证明图；在附录关键证明材料中新增单证单页展示。为避免中文文件名兼容问题，优先创建 ASCII 别名图片再引用。

**Tech Stack:** LaTeX (`figure`, `includegraphics`), `latexmk -xelatex`

---

### Task 1: Create ASCII alias image

**Files:**
- Create: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\picture\vision-agent-school-project.png`

**Step 1:** 复制中文文件名图片为 ASCII 别名。

### Task 2: Update team chapter

**Files:**
- Modify: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\chapters\chapter8_team.tex`

**Step 1:** 在团队项目积累段落中补充校级科研项目说明。

**Step 2:** 插入证明图并保持与现有风格一致。

### Task 3: Update appendix proof section

**Files:**
- Modify: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\chapters\appendix.tex`

**Step 1:** 在关键证明材料中新增单页证明图。

**Step 2:** 保持附录证据标题与叙述口径正式。

### Task 4: Verify output

**Files:**
- Test: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\main.pdf`

**Step 1:** 运行 `latexmk -xelatex -interaction=nonstopmode main.tex`。

**Step 2:** 检查新证明图是否在团队章节和附录中都已出现。
