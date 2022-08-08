import React, { useState, useEffect, useRef } from "react";
import { Menu } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";

const items = [
  {
    label: "文件",
    key: "file",
    children: [
      {
        label: "下载",
        key: "download",
      },
    ],
  },
  {
    label: "编辑",
    key: "edit",
    children: [
      {
        label: "撤销   (Ctrl + Z)",
        icon: <UndoOutlined />,
        key: "undo",
      },
      {
        label: "恢复 (Ctrl + Y)",
        icon: <RedoOutlined />,
        key: "redo",
      },
      {
        label: "剪切",
        key: "cut",
      },
      {
        label: "复制",
        key: "copy",
      },
      {
        label: "粘贴",
        key: "paste",
      },
      {
        label: "删除 (Del/Backspace)",
        key: "delete",
      },
    ],
  },
  {
    label: "视图",
    key: "view",
    children: [
      {
        label: "放大",
        key: "zoomIn",
      },
      {
        label: "缩小",
        key: "zoomOut",
      },
    ],
  },
  {
    label: "插入",
    key: "insert",
    children: [
      {
        label: "文字",
        key: "text",
      },
      {
        label: "图片",
        key: "pic",
      },
    ],
  },
  {
    label: "页面",
    key: "page",
  },
  {
    label: "排列",
    key: "sort",
    children: [
      {
        label: "置于顶层",
        key: "toTop",
      },
      {
        label: "置于底层",
        key: "toBottom",
      },
      {
        label: "上移一层",
        key: "moveUp",
      },
      {
        label: "下移一层",
        key: "moveDown",
      },
    ],
  },
  {
    label: "帮助",
    key: "help",
  },
];

const TitleBar = ({
  exportToImage = () => {},
  moveBack,
  moveForward,
  deleteItem,
  toTop,
  toBottom,
  moveUp,
  moveDown,
  zoomIn,
  zoomOut,
  addText,
  addPic
}) => {
  const [current, setCurrent] = useState();

  const onClick = ({ key }) => {
    if (key === "download") {
      exportToImage();
    }
    if (key === "undo") {
      moveBack();
    }
    if (key === "redo") {
      moveForward();
    }
    if (key === "delete") {
      deleteItem();
    }
    if (key === "toTop") {
      toTop();
    }
    if (key === "toBottom") {
      toBottom();
    }
    if (key === "moveUp") {
      moveUp();
    }
    if (key === "moveDown") {
      moveDown();
    }
    if (key === "zoomIn") {
      zoomIn();
    }
    if (key === "moveDown") {
      zoomOut();
    }
    if(key === "text") {
      addText();
    }
    if(key === "pic") {
      addPic()
    }
  };

  return (
    <Menu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={items}
    />
  );
};

export default TitleBar;
