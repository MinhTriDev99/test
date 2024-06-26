import { Button } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";

const WebcamCapture = () => {
  const [url, setUrl] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setUrl(imageSrc);
    }
  }, [webcamRef]);

  //? press F8 to capture 
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === "F8") {
        capture();
      }
    };
    document.addEventListener("keydown", handleKeyPress);
    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [capture]);

  return (
    <>
      <Webcam
        ref={webcamRef}
        audio={false}
        height={400}
        screenshotFormat="image/jpeg"
      />
      <Button onClick={capture} variant="contained" color="success">
        Capture photo
      </Button>
      {url && <img src={url} alt="" />}
      <p style={{ wordWrap: "break-word" }}>{url}</p>
    </>
  );
};

export default WebcamCapture;
