import { Composition } from 'remotion';
import { MainScene } from './Scene';
import { SceneV2 } from './SceneV2';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MainScene"
        component={MainScene}
        durationInFrames={2400}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="FullDemoV2"
        component={SceneV2}
        durationInFrames={3900}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
