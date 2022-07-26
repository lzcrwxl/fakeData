import React, { useRef } from "react";
import { Stage, Layer, Star, Text, Rect, Image as KImage} from "react-konva";
import appConfig from "../components/appConfig";
import logo from '../assets/image/web/logo.png';
const { width, height, scale } = appConfig.editor.content;

const H5Image = () => {
  // 创建图片
  let image = new Image();
  image.src = logo;
  return <KImage image={image} />;
};

export default H5Image;
