import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";
import appConfig from "../components/appConfig";
import H5Text from "./h5Text";
import H5Image from "./h5Image";
const { width, height, scale } = appConfig.editor.content;

const BackgroundRect = () => {
  return (
    <Rect width={width} height={height} fill="#fff" name="background"></Rect>
  );
};
/**
 * 获取基础图层
 */
export function getLayers(stage) {
  if (!stage) {
    throw "请初始化Stage";
  }

  const layers = stage.getLayers();

  return {
    content: layers.find((layer) => layer.name() === "content"),
    background: layers.find((layer) => layer.name() === "background"),
  };
}

const zoomStep = 0.1;
const minZoom = 0.5;
const maxZoom = 5;

// function onChangeZoom(vector) {
//     if (($zoom <= minZoom && vector < 0) || ($zoom >= maxZoom && vector > 0)) {
//         return
//     }

//     const value = vector
//         ? parseFloat(($zoom + vector * zoomStep).toFixed(2))
//         : 1

//     dispatch('updateZoom', value)
// }

function onUpdateZoom(stage, zoom = 1) {
  const { content } = getLayers(stage);
  content.scaleX((1 / scale) * zoom);
  content.scaleY((1 / scale) * zoom);
  resizeStage(stage);
}

function resizeStage(stage) {
  const container = stage.container();
  const { content } = getLayers(stage);

  // 更新舞台尺寸
  stage.width(container.offsetWidth);
  stage.height(container.offsetHeight);

  // 更新内容图层位置
  content.x(container.offsetWidth / 2 - (width * content.scaleX()) / 2);
  content.y(container.offsetHeight / 2 - (height * content.scaleY()) / 2);

  content.draw();
}

const H5Edit = () => {
  // const [stageWidth, setStageWidth] = React.useState(window.innerWidth - 200);
  const [stageWidth, setStageWidth] = useState(window.innerWidth - 200);
  const [stageHeight, setStageHeight] = React.useState(
    window.innerHeight - 100
  );
  const stageRef = useRef();
  useEffect(() => {
    let stage = stageRef.current;
    console.log("sssssssss", stage);
    let ctn = document.getElementById("Content");
    console.log(ctn);
    let w = ctn.clientWidth;
    console.log("dddddddd", w);
    onUpdateZoom(stage);
  });

  return (
    <Stage
      width={stageWidth}
      height={stageHeight}
      container={"Content"}
      ref={stageRef}
    >
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
      >
        <BackgroundRect />
        <H5Text />
        <H5Image />
      </Layer>
      <Layer name="background"></Layer>
    </Stage>
  );
};

export default H5Edit;
