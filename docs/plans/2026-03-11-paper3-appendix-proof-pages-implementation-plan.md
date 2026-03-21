# Paper3 Appendix Proof Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将附录中的证明文件改为单证单页，并将营业执照、获奖证书、软著图片旋转 90 度横置，以提升可读性并减少留白。

**Architecture:** 只修改 `appendix.tex` 中的证明材料排版，不改正文叙述和图片资源本身。通过为每张证明图分别设置独立 `figure`，并使用旋转后的 `includegraphics` 控制，达到单页展示和横向放大的效果。

**Tech Stack:** LaTeX (`graphicx`, figure environment), `latexmk -xelatex`

---

### Task 1: 拆分附录证明图

**Files:**
- Modify: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\chapters\appendix.tex`

**Step 1:** 将当前并排/同页的证明图拆分为单证单页。

**Step 2:** 保留图题与标签，避免正文引用失效。

### Task 2: 旋转并放大证明图

**Files:**
- Modify: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\chapters\appendix.tex`

**Step 1:** 对营业执照、获奖证书、软著图片使用 `angle=90`。

**Step 2:** 调整 `width`/`height` 让其尽量吃满页面可用区域。

### Task 3: 编译验证

**Files:**
- Test: `D:\A_Files\A_Code\A_Program\A_Competitions\2025_XunFeiCup\AICity\.worktrees\paper3-image-rollout\docs\paper3\main.pdf`

**Step 1:** 运行 `latexmk -xelatex -interaction=nonstopmode main.tex`。

**Step 2:** 检查附录证明页是否已变成单证单页且横向显示。
