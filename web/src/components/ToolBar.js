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
const { CheckableTag } = Tag;

const { Option } = Select;
const fonts = [
  {
    name: "微软雅黑",
    fontFamily: "Microsoft YaHei",
  },
  { name: "fantasy", fontFamily: "Fantasy" }, // 本地
  { name: "sans-serif", fontFamily: "sans-serif" }, // 本地
  {
    name: "frutiger",
    fontFamily: "frutiger",
    url: "http://lib.mytac.cn/frutiger.ttf", // 远程，需要下载到本地
  },
  {
    name: "Blackletter",
    fontFamily: "Blackletter",
    url: "http://lib.mytac.cn/Blackletter.TTF", // 远程，需要下载到本地
  },
];
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
    value: "black",
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
  const fontKeys = ["fontFamily", "fontSize", "fontStyle", "textDecoration"];

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
      if (k === "textDecoration" &&attrs[k]) {
        arr.push('underline')
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
    console.log(type);
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
        <Tooltip title={tag.name} key={tag.name}>
          <CheckableTag
            key={tag.key}
            checked={selectedTags.some((i) => i === tag.value)}
            onChange={(checked) => handleChangeFontStyle(tag, checked)}
          >
            {tag.icon}
          </CheckableTag>
        </Tooltip>
      ))}
    </div>
  );
};

export default forwardRef(ToolBar);
