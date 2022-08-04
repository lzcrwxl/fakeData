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

const queue = new circularQueue(10);

let KonvaEdit = ({ editRef }) => {
  const stageRef = useRef();
  const [infos, setInfo] = useState([]);
  const baseInfo = {
    id: infos.length + 1,
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
      setInfo([...infos, TempText]);
      queue.enqueue(TempText);
      //需要处理的数据
    },
    toDataURL: () => {
      return stageRef.current.toDataURL();
    },
    changeFont: (fontFamily, url) => {
      if (url) {
        addFontFaceToCss(fontFamily, url);
      } else {
        queue.enqueue({ fontFamily });
        setChanged({ fontFamily });
      }
    },
    moveBack: () => {
      queue.moveBack();
      let current = queue.getCurrent();
      setChanged(current);
    },
    moveForward: () => {
      queue.moveForward();
      let current = queue.getCurrent();
      setChanged(current);
    },
    addImage: (url) => {
      console.log(url);
      url = "http://localhost:3000" + url;
      let img = { ...baseInfo, url };
      queue.enqueue(img);
      setInfo([...infos, img]);
    },
  }));
  const [showTransformer, setShowTransformer] = useState(true);
  const [selectedId, setSelected] = useState(1);
  const [selectedItemChange, setChanged] = useState();

  const handleInfo = (v) => {
    queue.enqueue(v);
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
  useEffect(() => {
    if (
      selectedItemChange &&
      Object.keys(selectedItemChange).length &&
      selectedId
    ) {
      const index = infos.findIndex((i) => i.id === selectedId);
      const selecteditem = infos[index];
      const properties = {
        ...selecteditem,
        ...selectedItemChange,
      };
      const newInfos = [...infos];
      newInfos.splice(index, 1, properties);
      setInfo(newInfos);
    }
  }, [selectedItemChange]); // 更改选中元素的属性

  return (
    <Stage width={1200} height={1000} ref={stageRef}>
      {infos.map((i, idx) => (
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
