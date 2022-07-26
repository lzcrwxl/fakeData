import React, { useRef } from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import appConfig from "../components/appConfig";
const { width, height, scale } = appConfig.editor.content;

const H5Text = () => {
  return <Text text="text" fontSize={30}></Text>;
};

export default H5Text;
