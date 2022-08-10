import React, {
  useState,
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  UndoOutlined,
  RedoOutlined,
  ArrowRightOutlined,
  BoldOutlined,
  ItalicOutlined,
  UnderlineOutlined,
  FontColorsOutlined,
} from "@ant-design/icons";
import { Button, Tooltip, Divider, Select, InputNumber, Tag } from "antd";
import { fonts } from "../utils/const";
import { SketchPicker } from "react-color";
import "./ToolBar.less";

const { CheckableTag } = Tag;
const { Option } = Select;
const decimalToHex = (alpha) =>
  alpha === 0 ? "00" : Math.round(255 * alpha).toString(16);

const tagsData = [
  {
    name: "粗体",
    key: "fontWeight",
    value: "bold",
    icon: <BoldOutlined />,
  },
  {
    name: "斜体",
    key: "fontStyle",
    value: "italic",
    icon: <ItalicOutlined />,
  },
  {
    name: "下划线",
    key: "textDecoration",
    value: "underline",
    icon: <UnderlineOutlined />,
  },
  {
    name: "文本颜色",
    key: "fill",
    value: "fill",
    icon: <FontColorsOutlined />,
  },
];

const ToolBar = (
  { moveBack, moveForward, changeFont, attrs, ...props },
  ref
) => {
  const defaultValue = "Microsoft YaHei";
  const [keyboard, setKeyboard] = useState(true);
  const [fontFamilyValue, setFontFamilyValue] = useState(defaultValue);
  const [fontSizeValue, setFontSizeValue] = useState(20);
  const [selectedTags, setSelectedTags] = useState([]);
  const fontKeys = ["fontFamily", "fontSize", "fontStyle", "textDecoration",'fill'];
  const defaultColor = "#000000ff"
  const [acolor, setColor] = useState(defaultColor);

  useEffect(() => {
    if (!attrs) return;
    setAttributes(attrs);
  }, [attrs]);
  let arr = [];
  const setAttributes = (attrs) => {
    fontKeys.forEach((k) => {
      if (k === "fontFamily") {
        setFontFamilyValue(attrs[k] || defaultValue);
      }
      if (k === "fontSize") {
        setFontSizeValue(attrs[k] || 20);
      }
      if (k === "fontStyle") {
        if (!attrs[k]) {
          setSelectedTags(arr);
          return;
        }
        if (attrs[k].includes("bold")) {
          arr.push("bold");
        }
        if (attrs[k].includes("italic")) {
          arr.push("italic");
        }
      }
      if (k === "textDecoration" && attrs[k]) {
        arr.push("underline");
      }
      if(k==='fill'){
        if(attrs[k]) {
          arr.push('fill');
        }
        setColor(attrs[k]||defaultColor)
      }
      setSelectedTags(arr);
    });
  };
  const handleChangeFontFamily = (value) => {
    console.log(`selected ${value}`);
    setFontFamilyValue(value);
    const { fontFamily, url } = fonts.find((f) => f.fontFamily === value);
    changeFont({ fontFamily, url });
  };
  const handleChangeFont = (type, value) => {
    if (type === "fontSize") {
      setFontSizeValue(value);
    }
    changeFont({ [type]: value });
  };

  const handleChangeFontStyle = ({ key, value }, checked) => {
    const nextSelectedTags = checked
      ? [...selectedTags, value]
      : selectedTags.filter((t) => t !== value);
    console.log("You are interested in: ", nextSelectedTags);
    let fObj = {};
    tagsData.map((t) => {
      if (nextSelectedTags.includes(t.value)) {
        fObj[t.key] = t.value;
      } else {
        fObj[t.key] = "normal";
      }
    });
    if (fObj["fontWeight"] === "bold") {
      let tArr = ["bold"];
      if (fObj["fontStyle"].includes("italic")) {
        tArr = [...tArr, "italic"];
      }
      fObj["fontStyle"] = tArr.join(" ");
    }
    console.log(fObj);
    changeFont(fObj);
    setSelectedTags(nextSelectedTags);
  };

  useImperativeHandle(ref, () => ({
    setAttributes: (attrs) => {
      setAttributes(attrs);
    },
  }));

  // const hideListener = (e) => {
  //   if (ref && visible) {
  //     const ele = e.target;
  //     const validArea = ref.current;
  //     if (!validArea.contains(ele)) {
  //       setVisible(false);
  //       changeColor({ color: acolor }); // 已经发送为啥木有生效？
  //     }
  //   }
  // };

  return (
    <div>
      <Tooltip title="撤销">
        <Button type="text" icon={<UndoOutlined />} onClick={moveBack}></Button>
      </Tooltip>
      <Tooltip title="恢复">
        <Button
          type="text"
          icon={<RedoOutlined />}
          onClick={moveForward}
        ></Button>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="字体">
        <Select
          defaultValue={defaultValue}
          onChange={handleChangeFontFamily}
          value={fontFamilyValue}
        >
          {fonts.map((f) => (
            <Option value={f.fontFamily} key={f.name}>
              {f.name}
            </Option>
          ))}
        </Select>
      </Tooltip>
      <Divider type="vertical" />
      <Tooltip title="字号">
        <InputNumber
          min={13}
          max={100}
          keyboard={keyboard}
          value={fontSizeValue}
          bordered={false}
          defaultValue={20}
          formatter={(value) => `${value}px`}
          parser={(value) => value.replace("px", "")}
          onChange={handleChangeFont.bind(null, "fontSize")}
        />
      </Tooltip>
      <Divider type="vertical" />
      {tagsData.map((tag) => (
        <span className="checkable-tag" key={tag.name}>
          <Tooltip title={tag.name} key={tag.name}>
            <CheckableTag
              key={tag.key}
              checked={selectedTags.some((i) => i === tag.value)}
              onChange={(checked) => handleChangeFontStyle(tag, checked)}
            >
              {tag.icon}
            </CheckableTag>
            {selectedTags.includes("fill") && tag.key === "fill" && (
              <div id="color_picker" className="color_picker">
                <SketchPicker
                  color={acolor}
                  onChange={(c) => {
                    const hexCode = `${c.hex}${decimalToHex(c.rgb.a)}`;
                    setColor(hexCode);
                    changeFont({ fill: hexCode });
                  }}
                />
              </div>
            )}
          </Tooltip>
        </span>
      ))}
    </div>
  );
};

export default forwardRef(ToolBar);
