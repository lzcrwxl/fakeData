import React, { useState, useEffect, useRef } from "react";
import { UndoOutlined,RedoOutlined, ArrowRightOutlined } from "@ant-design/icons";

import { Button, Tooltip } from "antd";

const ToolBar = ({  moveBack, moveForward }) => {
  const [current, setCurrent] = useState();

  return (
    <>
      <Tooltip title="撤销">
        <Button icon={<UndoOutlined />} onClick={moveBack}></Button>
      </Tooltip>
      <Tooltip title="恢复">
        <Button icon={<RedoOutlined />} onClick={moveForward}></Button>
      </Tooltip>
      <Tooltip title="字体">
        <Button icon={<ArrowRightOutlined />}></Button>
      </Tooltip>
      <Tooltip title="字号">
        <Button icon={<ArrowRightOutlined />}></Button>
      </Tooltip>
      <Tooltip title="粗体">
        <Button icon={<ArrowRightOutlined />}></Button>
      </Tooltip>
      <Tooltip title="斜体">
        <Button icon={<ArrowRightOutlined />}></Button>
      </Tooltip>
      <Tooltip title="下划线">
        <Button icon={<ArrowRightOutlined />}></Button>
      </Tooltip>
      <Tooltip title="文本颜色">
        <Button icon={<ArrowRightOutlined />}></Button>
      </Tooltip>
    </>
  );
};

export default ToolBar;
