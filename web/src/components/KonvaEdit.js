import React, {
  useRef,
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import { Stage, Layer, Star, Text, Rect, Group } from "react-konva";
import withTransform from "./withTransform";
import MyImage from "./KonvaImg";
import MyText from "./KonvaText";
import FontFaceObserver from "fontfaceobserver";
import circularQueue from "../utils/circularQueue";

const KonvaImage = withTransform(MyImage);
const KonvaText = withTransform(MyText);

const stepCached = new circularQueue(10);
let KonvaEdit = ({ editRef }) => {
  const stageRef = useRef();
  const [steps, setSteps] = useState([]);
  const [stageScale, setStageScale] = useState(1);
  const [showTransformer, setShowTransformer] = useState(true);
  const [selectedId, setSelected] = useState(1);
  const [selectedItemChange, setChanged] = useState();

  // 添加新元素时
  const onAdd = (item) => {
    const infos = stepCached.getCurrent();
    let idMax, list;
    const newItem = { ...item, id: 0 };
    if (infos) {
      let idArr = infos.map((info) => info.id);
      idMax = Math.max(...idArr);
    }
    const newId = idMax ? idMax + 1 : 1000;
    newItem.id = newId;
    if (infos) {
      list = [...infos, newItem];
    } else {
      list = [newItem];
    }
    stepCached.enqueue(list);
    setSteps(stepCached.getCurrent());
    setSelected(newId);
  };

  const baseInfo = {
    scaleX: 1,
    scaleY: 1,
    skewY: 0,
    skewX: 0,
    fontSize: 50,
    rotation: 0,
    x: 100,
    y: 100,
  };
  const TempText = {
    ...baseInfo,
    text: "hello world",
  };

  useImperativeHandle(editRef, () => ({
    addText: () => {
      onAdd(TempText);
    },
    toDataURL: () => {
      return stageRef.current.toDataURL();
    },
    changeFont: (fontFamily, url) => {
      if (url) {
        addFontFaceToCss(fontFamily, url);
      } else {
        setChanged({ fontFamily });
      }
    },
    moveBack: () => {
      stepCached.moveBack();
      let currentInfos = stepCached.getCurrent();
      setSteps(currentInfos);
    },
    moveForward: () => {
      stepCached.moveForward();
      let currentInfos = stepCached.getCurrent();
      setSteps(currentInfos);
    },
    addImage: (url) => {
      url = "http://localhost:3000" + url;
      let img = { ...baseInfo, url };
      onAdd(img);
    },
    zoomIn: () => {
      let scale = stageRef.current.attrs.scaleX;
      canvasScale(scale * 1.25);
    },
    zoomOut: () => {
      let scale = stageRef.current.attrs.scaleX;
      canvasScale(scale * 0.8);
    },
    deleteItem: () => {
      const infos = [...steps];
      const index = infos.findIndex((i) => i.id === selectedId);
      if (index >= 0) {
        infos.splice(index, 1);
        stepCached.enqueue(infos);
        setSteps(stepCached.getCurrent());
      }
    },
    moveUp: () => {
      moveLayer(1);
    },
    moveDown: () => {
      moveLayer(-1);
    },
  }));

  const handleInfo = (v) => {
    console.log(selectedId);
    setChanged(v);
  };
  const addFontFaceToCss = (fontFamily, url) => {
    const id = "fontStyle" + "_" + fontFamily;
    const styleElement = document.getElementById(id);

    if (styleElement) {
      setChanged({ fontFamily });
    } else {
      const el = document.createElement("style");
      el.id = id;
      const str = `  
    @font-face {
      font-family: ${fontFamily};
      src: url(${url});}
    `; // 构造代码
      el.innerText = str;
      document.head.append(el);
      const font = new FontFaceObserver(fontFamily);
      // 这里需要加一些loading
      font
        .load()
        .then(function () {
          setChanged({ fontFamily });
          console.log("Output Sans has loaded.");
        })
        .catch(function (err) {
          console.log(err);
          console.log("Output Sans failed to load.");
        });
    }
  };
  // i正数往上移动，负数往下移动
  const moveLayer = (i) => {
    let current = stepCached.getCurrent();
    const currentLayerIndex = current.findIndex((c) => c.id === selectedId);
    let isChanged = false;
    if (currentLayerIndex >= 0) {
      const tmp = current[currentLayerIndex];

      if (i > 0) {
        if (currentLayerIndex < current.length - 1) {
          // 界限
          current[currentLayerIndex] = current[currentLayerIndex + 1];
          current[currentLayerIndex + 1] = tmp;
          isChanged = true;
        }
      } else if (i < 0) {
        if (currentLayerIndex > 0) {
          // 界限
          current[currentLayerIndex] = current[currentLayerIndex - 1];
          current[currentLayerIndex - 1] = tmp;
          isChanged = true;
        }
      }
    }
    if (isChanged) {
      stepCached.enqueue(current); // 本地数据更改
      setSteps(stepCached.getCurrent()); // 绑定state
    }
  };
  const canvasScale = (ratio) => {
    // ratio属于[0.25,2]
    // 获取画布中心的位置
    if (ratio <= 2 && ratio >= 0.25) {
      setStageScale(ratio);
    }
  };

  useEffect(() => {
    if (
      selectedItemChange &&
      Object.keys(selectedItemChange).length &&
      selectedId
    ) {
      const index = steps.findIndex((i) => i.id === selectedId);
      const selecteditem = steps[index];
      const properties = {
        ...selecteditem,
        ...selectedItemChange,
      };
      const newInfos = [...steps];
      newInfos.splice(index, 1, properties);
      stepCached.enqueue(newInfos);
      setSteps(newInfos);
    }
  }, [selectedItemChange]); // 更改选中元素的属性

  return (
    <Stage
      width={1200}
      height={1000}
      ref={stageRef}
      scaleX={stageScale}
      scaleY={stageScale}
      style={{ backgroundColor: "#fff" }}
    >
      {steps.map((i, idx) => (
        <Layer key={i.id}>
          {i.text && (
            <KonvaText
              {...i}
              stageRef={stageRef}
              isSelected={i.id === selectedId}
              setShowTransformer={setShowTransformer}
              handleInfo={handleInfo}
              showTransformer={showTransformer}
              handleSelected={setSelected.bind(null, i.id)}
            />
          )}
          {i.url && (
            <KonvaImage
              {...i}
              isSelected={i.id === selectedId}
              handleInfo={handleInfo}
              handleSelected={setSelected.bind(null, i.id)}
            />
          )}
        </Layer>
      ))}
    </Stage>
  );
};
KonvaEdit = forwardRef(KonvaEdit);
export default KonvaEdit;
