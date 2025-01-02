declare global {
  interface Window {
    PandaPlayer: any;
  }
}

interface PandaVideoPlayerProps {
  iframeSrc: string;
}

export const PandaVideoPlayer = ({ iframeSrc }: PandaVideoPlayerProps) => {
  const controlsTheme = "controlsColor=%23ffffff&color=%230267FF";

  return (
    <div style={{ position: "relative", paddingTop: "56.25%" }}>
      <iframe
        id="panda-player"
        key={iframeSrc}
        src={`${iframeSrc}&${controlsTheme}`}
        style={{
          border: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};
