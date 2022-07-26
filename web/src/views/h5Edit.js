import React from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import H5Stage from "./h5Stage";
import H5Layer from "./h5layer";
import appConfig from "../components/appConfig";
const { width, height } = appConfig.editor.content;

const backgroundLayer = () => {
  return (
    <Rect width={width} height={height} fill="#fff" name="background"></Rect>
  );
};

const H5Edit = () => {
  return (
    <H5Stage>
      <div>333333</div>
      <H5Layer />
      <backgroundLayer />
    </H5Stage>
  );
};

export default H5Edit;
