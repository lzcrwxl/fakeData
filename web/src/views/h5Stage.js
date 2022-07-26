import React from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import H5Layer from "./h5layer";

const H5Stage = () => {
  return (
    <Stage
      width={window.innerWidth - 200}
      height={window.innerHeight - 100}
      container={"Content"}
    >
      <H5Layer></H5Layer>
    </Stage>
  );
};

export default H5Stage;
