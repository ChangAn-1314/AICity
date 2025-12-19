# AICity Demo Video Generator

This project uses [Remotion](https://www.remotion.dev/) and [React Three Fiber](https://docs.pmndrs.assets/react-three-fiber) to generate a high-quality, Apple-style product demo video for the AICity project.

## Prerequisites

- Node.js installed
- `npm` or `yarn`

## Setup

1.  Install dependencies (if you haven't already):
    ```bash
    npm install
    ```

2.  **Add your Screen Recording**:
    -   Record your AICity frontend usage (1920x1080 recommended).
    -   Name the file `screen.mp4`.
    -   Place it in `src/assets/videos/screen.mp4`.
    -   *Note: A placeholder box is displayed if no video is present, but you need to uncomment the video texture code in `Phone.tsx` once you have the file.*

3.  **(Optional) Add Custom 3D Models**:
    -   If you have a `.glb` model of an iPhone or Laptop, place it in `src/assets/models/`.
    -   Update `src/components/Phone.tsx` to load it using `useGLTF`.

## Running the Preview

Start the Remotion Studio to preview and edit your video in real-time:

```bash
npm start
```

## Rendering the Video

Render the final MP4 file:

```bash
npm run build
```

## Project Structure

-   `src/Root.tsx`: Entry point, defines the video composition properties (fps, duration).
-   `src/Scene.tsx`: The 3D scene setup (Lights, Camera, Environment).
-   `src/components/Phone.tsx`: The device mockup component. currently a procedural 3D rounded box.
