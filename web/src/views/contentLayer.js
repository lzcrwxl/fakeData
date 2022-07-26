import React, { useRef } from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import appConfig from "../components/appConfig";
import h5Edit from "./h5Stage";
const { width, height, scale } = appConfig.editor.content;

const ContentLayer = () => {
  const [stageWidth, setStageWidth] = React.useState(window.innerWidth - 200);
  const [stageHeight, setStageHeight] = React.useState(
    window.innerHeight - 100
  );

  return (
    <Layer
      name="content"
      x={stageWidth / 2 - width / 3}
      y={stageHeight / 2 - height / 6}
      scaleX={1 / scale}
      scaleY={1 / scale}
      clip={{
        x: 0,
        y: 0,
        width: width,
        height: height,
      }}
    ></Layer>
  );
};

export default ContentLayer;
