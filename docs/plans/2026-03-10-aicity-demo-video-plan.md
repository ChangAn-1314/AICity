# AICity Demo Video Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a no-screen-recording, 82-second Remotion product demo for AICity that feels professional, grand, and smooth for a competition defense.

**Architecture:** Replace the current monolithic `SceneV2` approach with a sequence-driven composition backed by static script data, shared design tokens, and reusable scene primitives. Use DOM-based motion for most UI and light 3D only where spatial depth or scene reconstruction meaningfully improves the story.

**Tech Stack:** Remotion 4, React 18, TypeScript, `@remotion/three`, React Three Fiber, Zod, Vitest, ESLint, pnpm

---

### Task 1: Add lightweight test and verification tooling

**Files:**
- Modify: `demo-video/package.json`
- Modify: `demo-video/tsconfig.json`
- Create: `demo-video/vitest.config.ts`
- Create: `demo-video/src/lib/__tests__/smoke.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';

describe('vitest smoke', () => {
  it('runs inside demo-video', () => {
    expect(2 + 2).toBe(4);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video exec vitest run src/lib/__tests__/smoke.test.ts`
Expected: FAIL because `vitest` is not installed or configured yet.

**Step 3: Write minimal implementation**

```json
{
  "scripts": {
    "start": "remotion studio",
    "build": "remotion render",
    "lint": "eslint src --ext ts,tsx,js,jsx",
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

```ts
import {defineConfig} from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
```

Also install dev dependencies with: `pnpm --dir demo-video add -D vitest jsdom @vitest/coverage-v8`

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video test`
Expected: PASS with `1 passed`.

**Step 5: Commit**

```bash
git add demo-video/package.json demo-video/tsconfig.json demo-video/vitest.config.ts demo-video/src/lib/__tests__/smoke.test.ts
git commit -m "test: add demo-video verification harness"
```

### Task 2: Define the video script schema and frame timing helpers

**Files:**
- Create: `demo-video/src/data/video-script.ts`
- Create: `demo-video/src/lib/timing.ts`
- Create: `demo-video/src/lib/__tests__/timing.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {getSceneWindow, getTotalDuration} from '../timing';
import {videoScript} from '../../data/video-script';

describe('video timing', () => {
  it('sums to 2460 frames', () => {
    expect(getTotalDuration(videoScript.scenes)).toBe(2460);
  });

  it('resolves the prediction scene window', () => {
    expect(getSceneWindow(videoScript.scenes, 'prediction')).toEqual({
      start: 1260,
      end: 1559,
      duration: 300,
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video exec vitest run src/lib/__tests__/timing.test.ts`
Expected: FAIL with module resolution errors because `timing.ts` and `video-script.ts` do not exist yet.

**Step 3: Write minimal implementation**

```ts
import {z} from 'zod';

export const sceneSchema = z.object({
  id: z.string(),
  title: z.string(),
  durationInFrames: z.number().int().positive(),
});

export const videoScript = {
  fps: 30,
  width: 1920,
  height: 1080,
  scenes: [
    {id: 'opening', title: '开场定调', durationInFrames: 240},
    {id: 'monitoring', title: '全域态势监测', durationInFrames: 300},
    {id: 'analysis', title: '多源舆情识别', durationInFrames: 360},
    {id: 'reconstruction', title: 'AI 场景还原', durationInFrames: 360},
    {id: 'prediction', title: '趋势预测', durationInFrames: 300},
    {id: 'simulation', title: '决策模拟', durationInFrames: 360},
    {id: 'report', title: '报告生成', durationInFrames: 240},
    {id: 'outro', title: '结尾收束', durationInFrames: 300},
  ],
} as const;
```

```ts
export const getTotalDuration = (scenes: {durationInFrames: number}[]) =>
  scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);

export const getSceneWindow = (
  scenes: {id: string; durationInFrames: number}[],
  targetId: string,
) => {
  let cursor = 0;
  for (const scene of scenes) {
    const start = cursor;
    const end = cursor + scene.durationInFrames - 1;
    if (scene.id === targetId) {
      return {start, end, duration: scene.durationInFrames};
    }
    cursor += scene.durationInFrames;
  }
  throw new Error(`Unknown scene: ${targetId}`);
};
```

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video exec vitest run src/lib/__tests__/timing.test.ts`
Expected: PASS with `2 passed`.

**Step 5: Commit**

```bash
git add demo-video/src/data/video-script.ts demo-video/src/lib/timing.ts demo-video/src/lib/__tests__/timing.test.ts
git commit -m "feat: define AICity demo timing script"
```

### Task 3: Create the video theme and shared stage primitives

**Files:**
- Create: `demo-video/src/theme/tokens.ts`
- Create: `demo-video/src/theme/fonts.ts`
- Create: `demo-video/src/components/shared/FullScreenStage.tsx`
- Create: `demo-video/src/components/shared/SectionTitle.tsx`
- Create: `demo-video/src/components/shared/MetricCard.tsx`
- Create: `demo-video/src/lib/__tests__/tokens.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {tokens} from '../../theme/tokens';

describe('theme tokens', () => {
  it('defines the approved competition palette', () => {
    expect(tokens.colors.canvas).toBe('#061018');
    expect(tokens.colors.accent).toBe('#58e0ff');
    expect(tokens.colors.warning).toBe('#ff9b52');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video exec vitest run src/lib/__tests__/tokens.test.ts`
Expected: FAIL because `tokens.ts` does not exist yet.

**Step 3: Write minimal implementation**

```ts
export const tokens = {
  colors: {
    canvas: '#061018',
    panel: '#0c1a26',
    panelEdge: 'rgba(88, 224, 255, 0.18)',
    accent: '#58e0ff',
    accentMuted: '#8fe9ff',
    warning: '#ff9b52',
    danger: '#ff5b6e',
    textPrimary: '#f4f8fb',
    textSecondary: '#9bb2c7',
  },
  radius: {
    lg: 28,
    md: 20,
  },
} as const;
```

```tsx
export const FullScreenStage: React.FC<React.PropsWithChildren> = ({children}) => (
  <div
    style={{
      width: '100%',
      height: '100%',
      background:
        'radial-gradient(circle at top, rgba(88,224,255,0.14), transparent 35%), #061018',
      color: '#f4f8fb',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);
```

Use a bundled local Chinese-capable font or load a stable open-source font in `fonts.ts` before any scene renders.

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video exec vitest run src/lib/__tests__/tokens.test.ts`
Expected: PASS with `1 passed`.

**Step 5: Commit**

```bash
git add demo-video/src/theme/tokens.ts demo-video/src/theme/fonts.ts demo-video/src/components/shared/FullScreenStage.tsx demo-video/src/components/shared/SectionTitle.tsx demo-video/src/components/shared/MetricCard.tsx demo-video/src/lib/__tests__/tokens.test.ts
git commit -m "feat: add premium video design system"
```

### Task 4: Replace the current composition with a sequence-driven skeleton

**Files:**
- Create: `demo-video/src/compositions/ProductDemo82.tsx`
- Create: `demo-video/src/scenes/OpeningScene.tsx`
- Create: `demo-video/src/scenes/MonitoringScene.tsx`
- Create: `demo-video/src/scenes/AnalysisScene.tsx`
- Create: `demo-video/src/scenes/ReconstructionScene.tsx`
- Create: `demo-video/src/scenes/PredictionScene.tsx`
- Create: `demo-video/src/scenes/SimulationScene.tsx`
- Create: `demo-video/src/scenes/ReportScene.tsx`
- Create: `demo-video/src/scenes/OutroScene.tsx`
- Modify: `demo-video/src/Root.tsx`

**Step 1: Write the failing visual checkpoint**

Create each new scene as a temporary TODO placeholder:

```tsx
export const OpeningScene: React.FC = () => (
  <div style={{color: '#ff5b6e', fontSize: 80}}>TODO OpeningScene</div>
);
```

**Step 2: Run verification to confirm the placeholder shows up**

Run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 product-demo-checkpoint.png --frame=120`
Expected: The generated frame clearly shows the red `TODO OpeningScene` placeholder. This is the intentional failing checkpoint.

**Step 3: Write minimal implementation**

```tsx
import {AbsoluteFill, Sequence} from 'remotion';
import {videoScript} from '../data/video-script';

export const ProductDemo82: React.FC = () => {
  const [opening, monitoring] = videoScript.scenes;

  return (
    <AbsoluteFill>
      <Sequence from={0} durationInFrames={opening.durationInFrames}>
        <OpeningScene />
      </Sequence>
      <Sequence from={opening.durationInFrames} durationInFrames={monitoring.durationInFrames}>
        <MonitoringScene />
      </Sequence>
    </AbsoluteFill>
  );
};
```

Update `Root.tsx` so the main composition is `ProductDemo82` with `durationInFrames={2460}`, `fps={30}`, `width={1920}`, `height={1080}`.

**Step 4: Run verification to ensure the skeleton loads**

Run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 product-demo-checkpoint.png --frame=120`
Expected: The frame renders successfully from the new composition without crashing, even if later scenes are still placeholders.

**Step 5: Commit**

```bash
git add demo-video/src/compositions/ProductDemo82.tsx demo-video/src/scenes demo-video/src/Root.tsx
git commit -m "refactor: scaffold sequence-driven demo composition"
```

### Task 5: Implement the opening, monitoring, and analysis scenes

**Files:**
- Modify: `demo-video/src/scenes/OpeningScene.tsx`
- Modify: `demo-video/src/scenes/MonitoringScene.tsx`
- Modify: `demo-video/src/scenes/AnalysisScene.tsx`
- Create: `demo-video/src/components/shared/HotspotPulse.tsx`
- Create: `demo-video/src/components/shared/TickerRow.tsx`
- Create: `demo-video/src/components/shared/KeywordCluster.tsx`
- Create: `demo-video/src/components/shared/SignalBars.tsx`

**Step 1: Write the failing visual checkpoint**

Keep the scene placeholders for these three scenes and add a clear red label like `TODO MonitoringScene`.

**Step 2: Run verification to confirm it fails visually**

Run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 monitoring-checkpoint.png --frame=420`
Expected: The checkpoint shows the placeholder instead of a polished monitoring scene.

**Step 3: Write minimal implementation**

```tsx
export const MonitoringScene: React.FC = () => {
  return (
    <FullScreenStage>
      <SectionTitle eyebrow="全域感知" title="城市态势一屏总览" />
      <MetricCard label="实时热点" value="128" accent="accent" />
      <HotspotPulse />
      <TickerRow />
    </FullScreenStage>
  );
};
```

```tsx
export const AnalysisScene: React.FC = () => {
  return (
    <FullScreenStage>
      <SectionTitle eyebrow="智能识别" title="多源舆情结构化分析" />
      <KeywordCluster />
      <SignalBars />
      <MetricCard label="负面倾向" value="82%" accent="danger" />
    </FullScreenStage>
  );
};
```

Use `spring()`, `interpolate()`, and subtle staggered entrances instead of abrupt opacity toggles.

**Step 4: Run verification to confirm it passes visually**

Run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 monitoring-checkpoint.png --frame=420`
Expected: The frame shows a complete monitoring scene with map context, metrics, and active hotspots.

Also run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 analysis-checkpoint.png --frame=720`
Expected: The frame shows a complete analysis scene with structured insight modules instead of TODO text.

**Step 5: Commit**

```bash
git add demo-video/src/scenes/OpeningScene.tsx demo-video/src/scenes/MonitoringScene.tsx demo-video/src/scenes/AnalysisScene.tsx demo-video/src/components/shared/HotspotPulse.tsx demo-video/src/components/shared/TickerRow.tsx demo-video/src/components/shared/KeywordCluster.tsx demo-video/src/components/shared/SignalBars.tsx
git commit -m "feat: build opening and insight scenes"
```

### Task 6: Implement AI scene reconstruction with model fallback

**Files:**
- Modify: `demo-video/src/scenes/ReconstructionScene.tsx`
- Create: `demo-video/src/components/shared/SceneModelStage.tsx`
- Create: `demo-video/src/lib/model-fallback.ts`
- Create: `demo-video/src/lib/__tests__/model-fallback.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {getFallbackMode} from '../model-fallback';

describe('model fallback', () => {
  it('uses geometry fallback when no model path is provided', () => {
    expect(getFallbackMode(undefined)).toBe('geometry');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video exec vitest run src/lib/__tests__/model-fallback.test.ts`
Expected: FAIL because `model-fallback.ts` does not exist yet.

**Step 3: Write minimal implementation**

```ts
export const getFallbackMode = (modelPath?: string) =>
  modelPath ? 'model' : 'geometry';
```

```tsx
export const ReconstructionScene: React.FC = () => {
  return (
    <FullScreenStage>
      <SectionTitle eyebrow="现场还原" title="AI 将事件转化为可视态势" />
      <SceneModelStage primaryModel="/models/passenger.glb" />
    </FullScreenStage>
  );
};
```

`SceneModelStage` should attempt a real `glb` first and degrade to geometric silhouettes, rings, and outlines if the asset is missing or too heavy.

**Step 4: Run verification to confirm it passes**

Run: `pnpm --dir demo-video exec vitest run src/lib/__tests__/model-fallback.test.ts`
Expected: PASS with `1 passed`.

Also run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 reconstruction-checkpoint.png --frame=1080`
Expected: The frame shows a meaningful reconstruction stage, not a blank or crashed render.

**Step 5: Commit**

```bash
git add demo-video/src/scenes/ReconstructionScene.tsx demo-video/src/components/shared/SceneModelStage.tsx demo-video/src/lib/model-fallback.ts demo-video/src/lib/__tests__/model-fallback.test.ts
git commit -m "feat: add AI reconstruction stage"
```

### Task 7: Implement prediction, simulation, and report scenes

**Files:**
- Modify: `demo-video/src/scenes/PredictionScene.tsx`
- Modify: `demo-video/src/scenes/SimulationScene.tsx`
- Modify: `demo-video/src/scenes/ReportScene.tsx`
- Create: `demo-video/src/components/shared/TrendLine.tsx`
- Create: `demo-video/src/components/shared/DecisionCard.tsx`
- Create: `demo-video/src/components/shared/ReportSheet.tsx`

**Step 1: Write the failing visual checkpoint**

Leave placeholder TODO labels in these three scene files.

**Step 2: Run verification to confirm the placeholders appear**

Run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 prediction-checkpoint.png --frame=1380`
Expected: The frame still shows the placeholder, proving these segments are not implemented yet.

**Step 3: Write minimal implementation**

```tsx
export const PredictionScene: React.FC = () => (
  <FullScreenStage>
    <SectionTitle eyebrow="趋势预测" title="风险将如何扩散" />
    <TrendLine />
    <MetricCard label="48h 风险指数" value="76" accent="warning" />
  </FullScreenStage>
);
```

```tsx
export const SimulationScene: React.FC = () => (
  <FullScreenStage>
    <SectionTitle eyebrow="决策模拟" title="多方案推演与结果对比" />
    <DecisionCard title="方案 A" score="89" />
    <DecisionCard title="方案 B" score="72" />
    <DecisionCard title="方案 C" score="64" />
  </FullScreenStage>
);
```

```tsx
export const ReportScene: React.FC = () => (
  <FullScreenStage>
    <SectionTitle eyebrow="自动交付" title="研判报告一键汇总" />
    <ReportSheet />
  </FullScreenStage>
);
```

**Step 4: Run verification to confirm they pass visually**

Run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 prediction-checkpoint.png --frame=1380`
Expected: The prediction frame shows a future-facing trend panel and risk meter.

Also run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 simulation-checkpoint.png --frame=1740`
Expected: The frame shows multiple decision cards with clear comparative hierarchy.

Also run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 report-checkpoint.png --frame=2040`
Expected: The frame shows a polished report layout rather than placeholder text.

**Step 5: Commit**

```bash
git add demo-video/src/scenes/PredictionScene.tsx demo-video/src/scenes/SimulationScene.tsx demo-video/src/scenes/ReportScene.tsx demo-video/src/components/shared/TrendLine.tsx demo-video/src/components/shared/DecisionCard.tsx demo-video/src/components/shared/ReportSheet.tsx
git commit -m "feat: implement forecast and decision scenes"
```

### Task 8: Finish the outro, polish motion, and verify the full render

**Files:**
- Modify: `demo-video/src/scenes/OutroScene.tsx`
- Modify: `demo-video/src/compositions/ProductDemo82.tsx`
- Modify: `demo-video/src/data/video-script.ts`
- Modify: `demo-video/src/components/shared/*.tsx`

**Step 1: Write the failing visual checkpoint**

Render a late outro frame before motion polish is applied.

**Step 2: Run verification to confirm it is not production-ready yet**

Run: `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 outro-checkpoint.png --frame=2340`
Expected: The scene renders, but motion hierarchy, spacing, or closing composition still looks unfinished.

**Step 3: Write minimal implementation**

```tsx
export const OutroScene: React.FC = () => (
  <FullScreenStage>
    <SectionTitle
      eyebrow="AICity"
      title="智慧城市舆情态势监测与决策推演系统"
      subtitle="看得见风险, 看得懂态势, 推得出演化, 交付出结论"
    />
  </FullScreenStage>
);
```

Polish requirements:

- Normalize all scene transitions so no cut feels abrupt
- Remove any placeholder text, unused legacy `SceneV2` hooks, and mismatched typography
- Ensure every scene uses the same spacing, border, shadow, and accent logic

**Step 4: Run verification to confirm it passes**

Run: `pnpm --dir demo-video test`
Expected: PASS.

Run: `pnpm --dir demo-video exec tsc --noEmit`
Expected: PASS with no TypeScript errors.

Run: `pnpm --dir demo-video exec remotion render src/index.ts ProductDemo82 aicity-demo-final.mp4`
Expected: Successful render of a full-length `1920x1080 / 30fps` video with no missing-scene crashes.

**Step 5: Commit**

```bash
git add demo-video/src/scenes/OutroScene.tsx demo-video/src/compositions/ProductDemo82.tsx demo-video/src/data/video-script.ts demo-video/src/components/shared
git commit -m "feat: finalize AICity demo video"
```

## Final verification checklist

- Run `pnpm --dir demo-video test`
- Run `pnpm --dir demo-video exec tsc --noEmit`
- Run `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 opening-checkpoint.png --frame=120`
- Run `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 reconstruction-checkpoint.png --frame=1080`
- Run `pnpm --dir demo-video exec remotion still src/index.ts ProductDemo82 report-checkpoint.png --frame=2040`
- Run `pnpm --dir demo-video exec remotion render src/index.ts ProductDemo82 aicity-demo-final.mp4`

## Notes for execution

- Follow `@remotion-best-practices` for composition structure, animation timing, 3D usage, and assets.
- Before declaring the work done, apply `@superpowers/verification-before-completion` and report actual command results.
- Do not reuse the old `FullDemoV2` visual language unchanged; this plan intentionally moves to a cleaner and more professional answer-defense style.
