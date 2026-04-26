import {Composition} from "remotion";
import {PromoVideo} from "./Composition";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromoVideo"
        component={PromoVideo}
        durationInFrames={2370}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="PromoVideo-Preview"
        component={PromoVideo}
        durationInFrames={2370}
        fps={30}
        width={960}
        height={540}
      />
    </>
  );
};
