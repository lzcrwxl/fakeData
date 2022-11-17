import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Stage, Layer, Star, Text, Rect } from "react-konva";

let KonvaText = (
  { stageRef, myRef, handleSelected, setShowTransformer, handleInfo, ...props },
  ref
) => {
  const [showText, setShowText] = useState(true);
  const onDblClick = (e) => {
    const textNode = e.target;

    const textPosition = textNode.getAbsolutePosition();
    const stageBox = stageRef.current.container().getBoundingClientRect();
    const areaPosition = {
      x: stageBox.left + textPosition.x,
      y: stageBox.top + textPosition.y,
    };
    setShowText(false);
    const textarea = document.createElement("textarea");
    if (setShowTransformer) {
      setShowTransformer(false);
    }
    document.body.appendChild(textarea);
    textarea.value = textNode.text();
    textarea.style.position = "absolute";
    textarea.style.top = areaPosition.y + "px";
    textarea.style.left = areaPosition.x + "px";
    textarea.style.width = textNode.width() - textNode.padding() * 2 + "px";
    textarea.style.height =
      textNode.height() - textNode.padding() * 2 + 5 + "px";
    textarea.style.fontSize = textNode.fontSize() + "px";
    textarea.style.border = "none";
    textarea.style.padding = "0px";
    textarea.style.margin = "0px";
    textarea.style.overflow = "hidden";
    textarea.style.background = "none";
    textarea.style.outline = "none";
    textarea.style.resize = "none";
    textarea.style.lineHeight = textNode.lineHeight();
    textarea.style.fontFamily = textNode.fontFamily();
    textarea.style.transformOrigin = "left top";
    textarea.style.textAlign = textNode.align();
    textarea.style.color = textNode.fill();

    let rotation = textNode.rotation();
    let transform = "";
    if (rotation) {
      transform += "rotateZ(" + rotation + "deg)";
    }

    let px = 0;
    const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
    if (isFirefox) {
      px += 2 + Math.round(textNode.fontSize() / 20);
    }
    transform += "translateY(-" + px + "px)";
    textarea.style.transform = transform;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + 3 + "px";

    textarea.focus();
    function removeTextarea() {
      try {
        if (textarea) {
          console.log(textarea);
          document.body.removeChild(textarea);
          setShowText(true);
        }
      } catch (err) {
        console.log(err);
      }
    }
    function setTextareaWidth(newWidth) {
      if (!newWidth) {
        // set width for placeholder
        newWidth = textNode.placeholder.length * textNode.fontSize();
      }
      // some extra fixes on different browsers
      const isSafari = /^((?!chrome|android).)*safari/i.test(
        navigator.userAgent
      );
      const isFirefox =
        navigator.userAgent.toLowerCase().indexOf("firefox") > -1;
      if (isSafari || isFirefox) {
        newWidth = Math.ceil(newWidth);
      }
      const isEdge = document.documentMode || /Edge/.test(navigator.userAgent);
      if (isEdge) {
        newWidth += 1;
      }
      textarea.style.width = newWidth + "px";
    }

    textarea.addEventListener("keydown", function (e) {
      if (setShowTransformer) {
        setShowTransformer(false);
      }
      if (e.keyCode === 27) {
        removeTextarea();
      }

      const scale = textNode.getAbsoluteScale().x;
      setTextareaWidth(textNode.width() * scale);
      textarea.style.height = "auto";
      textarea.style.height =
        textarea.scrollHeight + textNode.fontSize() + "px";
    });
    textarea.addEventListener("blur", function () {
      if (e.target !== textarea) {
        textNode.text(textarea.value); //  注意这里
        handleInfo({
          x: textPosition.x,
          y: textPosition.y,
          text: textarea.value,
        });
        if (setShowTransformer) {
          setShowTransformer(true);
        }
        removeTextarea();
      }
    });
  };
  return (
    <>
      {showText && (
        <Text
          text={props.value} // 注意这里
          ref={myRef}
          onDblClick={onDblClick}
          onClick={() => {
            setShowTransformer(true);
            handleSelected();
          }}
          fontSize={20}
          fontFamily="Microsoft YaHei"
          align="center"
          {...props}
        />
      )}
    </>
  );
};
export default KonvaText;
