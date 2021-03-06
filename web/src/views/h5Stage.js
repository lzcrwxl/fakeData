import React, { useRef } from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import appConfig from "../components/appConfig";
const { width, height, scale } = appConfig.editor.content;

const H5Stage = () => {
  const [stageWidth, setStageWidth] = React.useState(window.innerWidth - 200);
  const [stageHeight, setStageHeight] = React.useState(
    window.innerHeight - 100
  );

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      container={"Content"}
    ></Stage>
  );
};

export default H5Stage;
