// 获取图层尺寸
import appConfig from "../components/appConfig";
import { Stage, Layer, Star, Text, Rect } from "react-konva";

import H5Stage from "./h5Stage";
const { width, height, scale } = appConfig.editor.content;

// 创建内容布局
const contentLayer = () => {
  console.log("================================", H5Stage.width());
  return <Layer name="content" x={H5Stage.width() / 2 - width / 2}></Layer>;
};

export default contentLayer;
