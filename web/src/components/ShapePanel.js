import React, { useState, useEffect, useRef } from "react";
import { Collapse, Divider, message, Upload, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";

import "./ShapePanel.less";

const { Dragger } = Upload;

const { Option } = Select;

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const ShapePanel = ({addImage,...props}) => {
  const onChange = (key) => {
    console.log(key);
  };
  const uploadProps = {
    name: "file",
    multiple: false,
    listType: "picture",
    action: "http://localhost:3000/service/konva/uploadImg",
    onChange(info) {
      const { status } = info.file;

      if (status === "done") {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onPreview(file) {
      console.log(file)
      addImage(file)
    },
  };
  return (
    <div id="shape_panel">
      <Collapse defaultActiveKey={["1"]} onChange={onChange}>
        <Panel header="我的图形" key="1">
          <Dragger {...uploadProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">拖到此处添加到我的图形</p>
          </Dragger>
        </Panel>
        <Panel header="基础图形" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="自定义图形" key="3">
          <p>{text}</p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ShapePanel;
