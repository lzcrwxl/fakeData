import React, { useRef, useEffect, useState } from "react";
import { Image, Transformer, Text } from "react-konva";
import { debounce } from "../utils/index";

const withTransform = (Component) => {
  const Inner = (props) => {
    const {
      isSelected = false,
      handleInfo = () => {},
      opacity = 0.8,
      handleSelected,
      showTransformer = true,
    } = props;
    const [info, setInfo] = useState({
      x: 100,
      y: 100,
      isDragging: false,
    });
    const eleRef = useRef();
    const trRef = useRef();
    const debounceHandleInfo = debounce((newBox) => {
      trRef.current.forceUpdate();
    }, 100);

    const boundBoxFunc = (oldBox, newBox) => {
      if (newBox.width < 5 || newBox.height < 5) {
        return oldBox;
      }
      debounceHandleInfo(newBox);
      return newBox;
    };

    useEffect(() => {
      if (trRef) {
        const tr = trRef.current;
        if (!tr) return;
        if (isSelected && showTransformer) {
          tr.show();
          tr.forceUpdate();
        } else {
          tr.hide();
        }
      }
    }, [isSelected, showTransformer, trRef]);

    useEffect(() => {
      if (isSelected && trRef) {
        trRef.current.nodes([eleRef.current]);
        trRef.current.getLayer().batchDraw();
      }
    }, [isSelected]);

    const handleDragStart = () => {
      handleSelected();
      setInfo({
        ...info,
        isDragging: true,
      });
    };
    const handleDragEnd = (e) => {
      setInfo({
        ...info,
        x: e.target.x(),
        y: e.target.y(),
        isDragging: false,
      });
      handleInfo(info);
    };

    return (
      <>
        <Component
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          shadowColor="black"
          shadowBlur={10}
          shadowOpacity={0.6}
          shadowOffsetX={info.isDragging ? 10 : 5}
          shadowOffsetY={info.isDragging ? 10 : 5}
          scaleX={info.isDragging ? 1.2 : 1}
          scaleY={info.isDragging ? 1.2 : 1}
          opacity={opacity}
          draggable
          // rotation={info.rotation}
          ref={eleRef}
          myRef={eleRef}
          onClick={handleSelected}
          {...props}
        />
        {isSelected && (
          <Transformer
            ref={trRef}
            boundBoxFunc={boundBoxFunc}
            onTransformEnd={(a) => {
              const { scaleX, scaleY, rotation, skewX, skewY, x, y } =
                a.target.attrs;
              handleInfo({ scaleX, scaleY, rotation, skewX, skewY, x, y });
            }}
          />
        )}
      </>
    );
  };
  return Inner;
};

export default withTransform;
