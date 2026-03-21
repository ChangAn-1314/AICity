# AICity Apple Film Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a polished Apple-style Remotion product film for AICity inside `demo-video2/`, using music-driven pacing, modular scenes, and reusable design primitives.

**Architecture:** Create a fresh Remotion project in `demo-video2/` with one main composition, Zod-driven props, a script data layer, timing utilities, shared visual components, and scene modules. Follow `@remotion-best-practices` for transitions, timing, fonts, asset loading, text measurement, audio, and optional 3D.

**Tech Stack:** Remotion 4, React 19, TypeScript, `@remotion/transitions`, `@remotion/media`, `@remotion/fonts`, `@remotion/layout-utils`, Zod, Vitest, pnpm

---

### Task 1: Bootstrap the `demo-video2` Remotion workspace

**Files:**
- Create: `demo-video2/package.json`
- Create: `demo-video2/tsconfig.json`
- Create: `demo-video2/remotion.config.ts`
- Create: `demo-video2/vitest.config.ts`
- Create: `demo-video2/src/index.ts`
- Create: `demo-video2/src/Root.tsx`
- Create: `demo-video2/src/lib/__tests__/smoke.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';

describe('demo-video2 workspace', () => {
  it('runs Vitest inside the new Remotion project', () => {
    expect(true).toBe(true);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/smoke.test.ts`
Expected: FAIL because `demo-video2` is not initialized and `vitest` is not installed yet.

**Step 3: Write minimal implementation**

```json
{
  "name": "demo-video2",
  "version": "1.0.0",
  "private": true,
  "packageManager": "pnpm@10.24.0",
  "scripts": {
    "start": "remotion studio",
    "render": "remotion render AICityAppleFilm out/aicity-apple-film.mp4",
    "render:still": "remotion still AICityAppleFilm out/checkpoint.png",
    "test": "vitest run"
  },
  "dependencies": {
    "@remotion/cli": "^4.0.434",
    "@remotion/fonts": "^4.0.434",
    "@remotion/layout-utils": "^4.0.434",
    "@remotion/media": "^4.0.434",
    "@remotion/transitions": "^4.0.434",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "remotion": "^4.0.434",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@types/node": "^24.6.0",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "jsdom": "^27.0.0",
    "typescript": "^5.9.3",
    "vitest": "^3.2.4"
  }
}
```

```ts
// demo-video2/src/index.ts
import {registerRoot} from 'remotion';
import {RemotionRoot} from './Root';

registerRoot(RemotionRoot);
```

```ts
// demo-video2/src/Root.tsx
import {Composition} from 'remotion';

const Placeholder = () => null;

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="AICityAppleFilm"
      component={Placeholder}
      durationInFrames={30}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
```

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 install && pnpm --dir demo-video2 test`
Expected: PASS with `1 passed`.

**Step 5: Commit**

```bash
git add demo-video2/package.json demo-video2/tsconfig.json demo-video2/remotion.config.ts demo-video2/vitest.config.ts demo-video2/src/index.ts demo-video2/src/Root.tsx demo-video2/src/lib/__tests__/smoke.test.ts
git commit -m "chore: bootstrap demo-video2 remotion workspace"
```

### Task 2: Define typed film props, script data, and timing helpers

**Files:**
- Create: `demo-video2/src/lib/film-props.ts`
- Create: `demo-video2/src/data/film-script.ts`
- Create: `demo-video2/src/lib/timing.ts`
- Create: `demo-video2/src/lib/metadata.ts`
- Create: `demo-video2/src/lib/__tests__/timing.test.ts`
- Create: `demo-video2/src/lib/__tests__/metadata.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {filmScript} from '../../data/film-script';
import {getTotalDuration, getSceneWindow} from '../timing';

describe('film timing', () => {
  it('sums to 2280 frames after transition subtraction', () => {
    expect(getTotalDuration(filmScript)).toBe(2280);
  });

  it('resolves the prediction window', () => {
    expect(getSceneWindow(filmScript, 'prediction')).toEqual({
      start: 1140,
      end: 1499,
      duration: 360,
    });
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/timing.test.ts`
Expected: FAIL because the data and timing modules do not exist yet.

**Step 3: Write minimal implementation**

```ts
// demo-video2/src/lib/film-props.ts
import {z} from 'zod';

export const filmPropsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  theme: z.enum(['apple-black']).default('apple-black'),
  musicFile: z.string(),
});

export type FilmProps = z.infer<typeof filmPropsSchema>;
```

```ts
// demo-video2/src/data/film-script.ts
export const filmScript = {
  fps: 30,
  width: 1920,
  height: 1080,
  scenes: [
    {id: 'opening', durationInFrames: 240},
    {id: 'product', durationInFrames: 300},
    {id: 'analysis', durationInFrames: 360},
    {id: 'monitoring', durationInFrames: 360},
    {id: 'prediction', durationInFrames: 360},
    {id: 'decision', durationInFrames: 360},
    {id: 'outro', durationInFrames: 360},
  ],
  transitions: [15, 15, 15, 15, 15, 15],
} as const;
```

```ts
// demo-video2/src/lib/timing.ts
export const getTotalDuration = (script: {scenes: {durationInFrames: number}[]; transitions: readonly number[];}) => {
  const sceneTotal = script.scenes.reduce((sum, scene) => sum + scene.durationInFrames, 0);
  const transitionTotal = script.transitions.reduce((sum, transition) => sum + transition, 0);
  return sceneTotal - transitionTotal;
};

export const getSceneWindow = (script: {scenes: {id: string; durationInFrames: number}[]; transitions: readonly number[];}, sceneId: string) => {
  let cursor = 0;
  for (let i = 0; i < script.scenes.length; i++) {
    const scene = script.scenes[i];
    const start = cursor;
    const end = start + scene.durationInFrames - 1;
    if (scene.id === sceneId) {
      return {start, end, duration: scene.durationInFrames};
    }
    cursor += scene.durationInFrames - (script.transitions[i] ?? 0);
  }
  throw new Error(`Unknown scene: ${sceneId}`);
};
```

```ts
// demo-video2/src/lib/metadata.ts
import type {CalculateMetadataFunction} from 'remotion';
import {filmScript} from '../data/film-script';
import type {FilmProps} from './film-props';
import {getTotalDuration} from './timing';

export const calculateFilmMetadata: CalculateMetadataFunction<FilmProps> = async ({props}) => {
  return {
    durationInFrames: getTotalDuration(filmScript),
    defaultOutName: `${props.title}-apple-film.mp4`,
  };
};
```

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/timing.test.ts src/lib/__tests__/metadata.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add demo-video2/src/lib/film-props.ts demo-video2/src/data/film-script.ts demo-video2/src/lib/timing.ts demo-video2/src/lib/metadata.ts demo-video2/src/lib/__tests__/timing.test.ts demo-video2/src/lib/__tests__/metadata.test.ts
git commit -m "feat: add typed film script and timing model"
```

### Task 3: Add fonts, tokens, and reusable Apple-style primitives

**Files:**
- Create: `demo-video2/src/theme/tokens.ts`
- Create: `demo-video2/src/theme/fonts.ts`
- Create: `demo-video2/src/components/shared/FilmBackground.tsx`
- Create: `demo-video2/src/components/shared/HeroTitle.tsx`
- Create: `demo-video2/src/components/shared/GlassPanel.tsx`
- Create: `demo-video2/src/components/shared/MetricStrip.tsx`
- Create: `demo-video2/src/components/shared/NoiseOverlay.tsx`
- Create: `demo-video2/src/lib/__tests__/tokens.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {tokens} from '../../theme/tokens';

describe('design tokens', () => {
  it('defines the Apple-black palette', () => {
    expect(tokens.colors.bg).toBe('#05070b');
    expect(tokens.radius.panel).toBe(32);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/tokens.test.ts`
Expected: FAIL because the theme files do not exist.

**Step 3: Write minimal implementation**

```ts
// demo-video2/src/theme/tokens.ts
export const tokens = {
  colors: {
    bg: '#05070b',
    bgSoft: '#10141b',
    text: '#f5f7fb',
    textDim: '#aeb8c7',
    ice: '#b9d7ff',
    cyan: '#78c8ff',
    amber: '#ffb45c',
    line: 'rgba(255,255,255,0.08)',
  },
  radius: {
    panel: 32,
    chip: 999,
  },
  shadow: {
    panel: '0 30px 80px rgba(0,0,0,0.35)',
  },
} as const;
```

```ts
// demo-video2/src/theme/fonts.ts
import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const loadFilmFonts = async () => {
  await Promise.all([
    loadFont({family: 'AICitySans', url: staticFile('assets/fonts/AICitySans-Regular.woff2'), weight: '400'}),
    loadFont({family: 'AICitySans', url: staticFile('assets/fonts/AICitySans-Medium.woff2'), weight: '500'}),
    loadFont({family: 'AICitySans', url: staticFile('assets/fonts/AICitySans-Semibold.woff2'), weight: '600'}),
  ]);
};
```

Also create the shared components using only these tokens and the `AICitySans` family. The `HeroTitle` component must use `fitText()` from `@remotion/layout-utils` after fonts are loaded.

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/tokens.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add demo-video2/src/theme/tokens.ts demo-video2/src/theme/fonts.ts demo-video2/src/components/shared/FilmBackground.tsx demo-video2/src/components/shared/HeroTitle.tsx demo-video2/src/components/shared/GlassPanel.tsx demo-video2/src/components/shared/MetricStrip.tsx demo-video2/src/components/shared/NoiseOverlay.tsx demo-video2/src/lib/__tests__/tokens.test.ts
git commit -m "feat: add apple-style film theme primitives"
```

### Task 4: Stage public assets and verify `staticFile()`-based loading

**Files:**
- Create: `demo-video2/public/assets/images/logo-new.png`
- Create: `demo-video2/public/assets/images/ui-main-interface.png`
- Create: `demo-video2/public/assets/images/ui-ai-analysis.png`
- Create: `demo-video2/public/assets/images/ui-decision-sim.png`
- Create: `demo-video2/public/assets/images/ui-trend-analysis.png`
- Create: `demo-video2/public/assets/models/passenger.glb`
- Create: `demo-video2/public/assets/models/squatting-person.glb`
- Create: `demo-video2/public/assets/audio/film-bed.wav`
- Create: `demo-video2/src/lib/__tests__/assets.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {filmAssets} from '../assets';

describe('film assets manifest', () => {
  it('references only public assets', () => {
    expect(filmAssets.logo).toBe('assets/images/logo-new.png');
    expect(filmAssets.music).toBe('assets/audio/film-bed.wav');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/assets.test.ts`
Expected: FAIL because the manifest does not exist.

**Step 3: Write minimal implementation**

- Copy `source/logo/logo-new.png` to `demo-video2/public/assets/images/logo-new.png`
- Copy `docs/source/UI/ui_main_interface.png` to `demo-video2/public/assets/images/ui-main-interface.png`
- Copy `docs/source/UI/ui_ai_analysis.png` to `demo-video2/public/assets/images/ui-ai-analysis.png`
- Copy `docs/source/UI/ui_decision_sim.png` to `demo-video2/public/assets/images/ui-decision-sim.png`
- Copy `docs/source/UI/ui_trend_analysis.png` to `demo-video2/public/assets/images/ui-trend-analysis.png`
- Copy `AICityFornt/public/models/passenger.glb` to `demo-video2/public/assets/models/passenger.glb`
- Copy `AICityFornt/public/models/squatting_person_compressed.glb` to `demo-video2/public/assets/models/squatting-person.glb`
- Add `demo-video2/src/lib/assets.ts`:

```ts
export const filmAssets = {
  logo: 'assets/images/logo-new.png',
  uiMain: 'assets/images/ui-main-interface.png',
  uiAnalysis: 'assets/images/ui-ai-analysis.png',
  uiDecision: 'assets/images/ui-decision-sim.png',
  uiTrend: 'assets/images/ui-trend-analysis.png',
  passengerModel: 'assets/models/passenger.glb',
  squatModel: 'assets/models/squatting-person.glb',
  music: 'assets/audio/film-bed.wav',
} as const;
```

If no approved music file exists yet, create a temporary silent placeholder WAV in `demo-video2/public/assets/audio/film-bed.wav` so the path contract is stable.

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/assets.test.ts`
Expected: PASS.

**Step 5: Commit**

```bash
git add demo-video2/public/assets demo-video2/src/lib/assets.ts demo-video2/src/lib/__tests__/assets.test.ts
git commit -m "feat: stage demo-video2 public assets"
```

### Task 5: Build the opening and product reveal scenes

**Files:**
- Create: `demo-video2/src/scenes/OpeningScene.tsx`
- Create: `demo-video2/src/scenes/ProductRevealScene.tsx`
- Create: `demo-video2/src/scenes/__tests__/opening-copy.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {filmScript} from '../../data/film-script';

describe('opening script copy', () => {
  it('starts with the approved opening line', () => {
    expect(filmScript.copy.openingHeadline).toBe('看见城市情绪，只是第一步。');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/scenes/__tests__/opening-copy.test.ts`
Expected: FAIL because the opening copy is not in the script yet.

**Step 3: Write minimal implementation**

- Extend `demo-video2/src/data/film-script.ts` with:

```ts
copy: {
  openingHeadline: '看见城市情绪，只是第一步。',
  openingSubhead: '真正重要的是，更早理解、更稳决策。',
  productLabel: 'AICity',
  productCaption: 'AI 城市智慧舆情分析与决策模拟系统',
}
```

- Implement `OpeningScene.tsx` using:
  - `spring({config: {damping: 200}})` for headline entrance
  - `HeroTitle` for text fitting
  - `FilmBackground` and `NoiseOverlay` for restrained atmosphere
- Implement `ProductRevealScene.tsx` using:
  - `<Img src={staticFile(filmAssets.uiMain)} />`
  - a glass-frame container, subtle push-in, and a thin specular highlight sweep

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 exec vitest run src/scenes/__tests__/opening-copy.test.ts`
Expected: PASS.

**Step 5: Verify visually**

Run: `pnpm --dir demo-video2 exec remotion still src/index.ts AICityAppleFilm out/opening-checkpoint.png --frame=120`
Expected: a clean black-titanium frame with oversized headline and controlled highlights.

**Step 6: Commit**

```bash
git add demo-video2/src/data/film-script.ts demo-video2/src/scenes/OpeningScene.tsx demo-video2/src/scenes/ProductRevealScene.tsx demo-video2/src/scenes/__tests__/opening-copy.test.ts
git commit -m "feat: add opening and product reveal scenes"
```

### Task 6: Build the analysis, monitoring, and prediction scenes

**Files:**
- Create: `demo-video2/src/scenes/AnalysisScene.tsx`
- Create: `demo-video2/src/scenes/MonitoringScene.tsx`
- Create: `demo-video2/src/scenes/PredictionScene.tsx`
- Create: `demo-video2/src/scenes/__tests__/scene-ids.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {filmScript} from '../../data/film-script';

describe('mid-film scene ids', () => {
  it('contains analysis, monitoring, and prediction in order', () => {
    expect(filmScript.scenes.slice(2, 5).map((scene) => scene.id)).toEqual([
      'analysis',
      'monitoring',
      'prediction',
    ]);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/scenes/__tests__/scene-ids.test.ts`
Expected: FAIL if the script order is still incomplete or different.

**Step 3: Write minimal implementation**

- `AnalysisScene.tsx`:
  - show source chips, sentiment bars, and keyword grouping
  - use `MetricStrip` and `GlassPanel`
  - animate card reveal with local `useCurrentFrame()` values inside nested `Sequence`
- `MonitoringScene.tsx`:
  - use the UI image plus risk circles and location callouts
  - reserve a subtle zoom and pan, not dashboard chaos
- `PredictionScene.tsx`:
  - use line/path overlays and a forecast card
  - shift accent color from ice blue to a restrained amber

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 exec vitest run src/scenes/__tests__/scene-ids.test.ts`
Expected: PASS.

**Step 5: Verify visually**

Run: `pnpm --dir demo-video2 exec remotion still src/index.ts AICityAppleFilm out/prediction-checkpoint.png --frame=1320`
Expected: the prediction scene shows a clean forecast composition, not a cluttered dashboard.

**Step 6: Commit**

```bash
git add demo-video2/src/scenes/AnalysisScene.tsx demo-video2/src/scenes/MonitoringScene.tsx demo-video2/src/scenes/PredictionScene.tsx demo-video2/src/scenes/__tests__/scene-ids.test.ts demo-video2/src/data/film-script.ts
git commit -m "feat: add mid-film intelligence scenes"
```

### Task 7: Build the decision, report, and optional 3D accent scene

**Files:**
- Create: `demo-video2/src/scenes/DecisionScene.tsx`
- Create: `demo-video2/src/scenes/OutroScene.tsx`
- Create: `demo-video2/src/scenes/SpatialAccentScene.tsx`
- Create: `demo-video2/src/scenes/__tests__/outro-copy.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {filmScript} from '../../data/film-script';

describe('outro copy', () => {
  it('ends with the approved brand line', () => {
    expect(filmScript.copy.outroLine).toBe('AICity，让城市风险更早被看见，更稳被决策。');
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/scenes/__tests__/outro-copy.test.ts`
Expected: FAIL because the outro line is not defined yet.

**Step 3: Write minimal implementation**

- Add `outroLine` to `filmScript.copy`
- `DecisionScene.tsx` should compare `2-3` options with response speed, risk drop, and recommendation badge
- `SpatialAccentScene.tsx` may use `@remotion/three` only if the render cost stays acceptable:

```tsx
<ThreeCanvas width={width} height={height}>
  <ambientLight intensity={0.35} />
  <directionalLight position={[5, 5, 5]} intensity={0.8} />
  <Sequence layout="none">
    <mesh rotation={[0, frame * 0.01, 0]}>{/* ... */}</mesh>
  </Sequence>
</ThreeCanvas>
```

- `OutroScene.tsx` should consolidate modules back into one hero frame with logo, product name, and final statement

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 exec vitest run src/scenes/__tests__/outro-copy.test.ts`
Expected: PASS.

**Step 5: Verify visually**

Run: `pnpm --dir demo-video2 exec remotion still src/index.ts AICityAppleFilm out/outro-checkpoint.png --frame=2160`
Expected: the closing frame feels premium, centered, and uncluttered.

**Step 6: Commit**

```bash
git add demo-video2/src/scenes/DecisionScene.tsx demo-video2/src/scenes/OutroScene.tsx demo-video2/src/scenes/SpatialAccentScene.tsx demo-video2/src/scenes/__tests__/outro-copy.test.ts demo-video2/src/data/film-script.ts
git commit -m "feat: add closing decision and brand scenes"
```

### Task 8: Assemble the final composition, transitions, and audio bed

**Files:**
- Modify: `demo-video2/src/Root.tsx`
- Create: `demo-video2/src/compositions/AICityAppleFilm.tsx`
- Create: `demo-video2/src/lib/__tests__/root.test.ts`

**Step 1: Write the failing test**

```ts
import {describe, expect, it} from 'vitest';
import {getTotalDuration} from '../timing';
import {filmScript} from '../../data/film-script';

describe('root duration contract', () => {
  it('matches the computed film duration', () => {
    expect(getTotalDuration(filmScript)).toBe(2280);
  });
});
```

**Step 2: Run test to verify it fails**

Run: `pnpm --dir demo-video2 exec vitest run src/lib/__tests__/root.test.ts`
Expected: FAIL until the root and composition use the shared timing contract.

**Step 3: Write minimal implementation**

- `AICityAppleFilm.tsx` should use `TransitionSeries` with six short transitions:

```tsx
<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={240}>
    <OpeningScene />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames: 15})}
  />
  {/* continue for all scenes */}
</TransitionSeries>
```

- Add one background `<Audio>` layer:

```tsx
<Audio
  src={staticFile(filmAssets.music)}
  volume={(f) => interpolate(f, [0, 45, 2200, 2280], [0, 0.45, 0.45, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })}
/>
```

- `Root.tsx` must register the composition with:
  - `schema={filmPropsSchema}`
  - `defaultProps={{title: 'AICity', subtitle: 'AI 城市智慧舆情分析与决策模拟系统', theme: 'apple-black', musicFile: 'assets/audio/film-bed.wav'}}`
  - `calculateMetadata={calculateFilmMetadata}`

**Step 4: Run test to verify it passes**

Run: `pnpm --dir demo-video2 test`
Expected: PASS with all tests green.

**Step 5: Verify render output**

Run: `pnpm --dir demo-video2 exec remotion render src/index.ts AICityAppleFilm out/aicity-apple-film.mp4`
Expected: successful render with a complete premium-looking 1080p film.

**Step 6: Commit**

```bash
git add demo-video2/src/Root.tsx demo-video2/src/compositions/AICityAppleFilm.tsx demo-video2/src/lib/__tests__/root.test.ts
git commit -m "feat: assemble the AICity apple film composition"
```

### Task 9: Final polish, checkpoints, and delivery notes

**Files:**
- Create: `demo-video2/README.md`
- Create: `demo-video2/out/.gitkeep`

**Step 1: Write the failing test**

There is no code test here. Instead, write down the verification checklist first and treat any missing output as failure:

- Missing opening still
- Missing prediction still
- Missing outro still
- Missing final render command in README

**Step 2: Run verification to observe the failure**

Run these commands one by one and note any missing files or render errors:

`pnpm --dir demo-video2 exec remotion still src/index.ts AICityAppleFilm out/opening-checkpoint.png --frame=120`

`pnpm --dir demo-video2 exec remotion still src/index.ts AICityAppleFilm out/prediction-checkpoint.png --frame=1320`

`pnpm --dir demo-video2 exec remotion still src/index.ts AICityAppleFilm out/outro-checkpoint.png --frame=2160`

`pnpm --dir demo-video2 exec remotion render src/index.ts AICityAppleFilm out/aicity-apple-film.mp4`

Expected: at least one command fails before the README and output directory contract are fully in place.

**Step 3: Write minimal implementation**

Create `demo-video2/README.md` with exact usage instructions:

```md
# demo-video2

## Commands

- `pnpm install`
- `pnpm start`
- `pnpm test`
- `pnpm render`

## Checkpoints

- `pnpm exec remotion still src/index.ts AICityAppleFilm out/opening-checkpoint.png --frame=120`
- `pnpm exec remotion still src/index.ts AICityAppleFilm out/prediction-checkpoint.png --frame=1320`
- `pnpm exec remotion still src/index.ts AICityAppleFilm out/outro-checkpoint.png --frame=2160`
```

**Step 4: Re-run verification**

Run the four Remotion commands again.
Expected: all succeed and produce export artifacts in `demo-video2/out/`.

**Step 5: Commit**

```bash
git add demo-video2/README.md demo-video2/out/.gitkeep
git commit -m "docs: add demo-video2 render instructions"
```
