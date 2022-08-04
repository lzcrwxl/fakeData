import React, { useRef, useEffect, useState } from "react";

import KonvaEdit from "../components/KonvaEdit";
import { Button, Radio, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
const { Dragger } = Upload;

const { Option } = Select;

const fonts = [
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

const H5Edit = () => {
  const editRef = useRef();

  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const exportToImage = () => {
    const uri = editRef.current.toDataURL();
    downloadURI(uri, "stage.png");
  };
  const onClick = () => {
    console.log(editRef.current);
    editRef.current.addText();
  };
  const handleChange = (value) => {
    const { fontFamily, url } = fonts.find((f) => f.fontFamily === value);
    editRef.current.changeFont(fontFamily, url);
  };
  const moveBack = () => {
    editRef.current.moveBack();
  };
  const moveForward = () => {
    editRef.current.moveForward();
  };
  const moveUp = () => {
    editRef.current.moveUp();
  };
  const moveDown = () => {
    editRef.current.moveDown();
  };
  const zoomIn = () => {
    editRef.current.zoomIn();
  };
  const zoomOut = () => {
    editRef.current.zoomOut();
  };
  const props = {
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
      editRef.current.addImage(file.response.url);
    },
  };
  return (
    <>
      <div>
        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">拖到此处添加到我的图形</p>
        </Dragger>
        <Button type="primary" onClick={exportToImage}>
          export
        </Button>
        <Button type="primary" onClick={onClick}>
          add Text
        </Button>
        <Select
          defaultValue="Fantasy"
          style={{
            width: 120,
          }}
          onChange={handleChange}
        >
          {fonts.map((f) => (
            <Option value={f.fontFamily} key={f.name}>
              {f.name}
            </Option>
          ))}
        </Select>
        <Button type="primary" onClick={moveBack}>
          回退
        </Button>
        <Button type="primary" onClick={moveForward}>
          前进
        </Button>
        <Button type="primary" onClick={moveUp}>
          图层上移
        </Button>
        <Button type="primary" onClick={moveDown}>
          图层下移
        </Button>
        <Button type="primary" onClick={zoomIn}>
          放大
        </Button>
        <Button type="primary" onClick={zoomOut}>
          缩小
        </Button>
      </div>
      <br />
      <KonvaEdit editRef={editRef} />
    </>
  );
};

export default H5Edit;
