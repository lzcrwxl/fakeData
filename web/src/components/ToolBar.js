import React, { useState, useEffect, useRef } from "react";
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

const ToolBar = ({ toolBarRef, moveBack, moveForward, changeFont }) => {
  const [keyboard, setKeyboard] = useState(true);
  const handleChangeFontFamily = (value) => {
    const { fontFamily, url } = fonts.find((f) => f.fontFamily === value);
    changeFont({ fontFamily, url });
  };
  const handleChangeFont = (type, value) => {
    changeFont({ [type]: value });
  };
  const [selectedTags, setSelectedTags] = useState([]);

  const handleChangeFontStyle = ({ key, value }, checked) => {
    console.log(key, value);
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
    const getAttrs = () => {
      console.log("33333333333333333333333333");
    };
  };
  return (
    <div ref={toolBarRef}>
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
          defaultValue="Microsoft YaHei"
          onChange={handleChangeFontFamily}
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

export default ToolBar;
