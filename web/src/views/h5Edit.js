import React, { useRef, useEffect, useState, useContext } from "react";
import GlobalContext from "../components/GlobalContent";
import KonvaEdit from "../components/KonvaEdit";
import { Button, Radio, Select } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import TitleBar from "../components/TitleBar";
import ToolBar from "../components/ToolBar";
import ShapePanel from "../components/ShapePanel";
import { Col, Divider, Row } from "antd";

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
  const deleteItem = () => {
    editRef.current.deleteItem();
  };
  const toTop = () => {
    editRef.current.toTop();
  };
  const toBottom = () => {
    editRef.current.toBottom();
  };
  document.onkeydown = function (e) {
    var keyCode = e.keyCode || e.which || e.charCode;
    console.log(keyCode);
    const { altKey, ctrlKey, shiftKey } = e;
    if (ctrlKey && keyCode === 90) {
      moveBack();
    }
    if (ctrlKey && keyCode === 89) {
      moveForward();
    }
    if (keyCode === 46 || keyCode === 8) {
      deleteItem();
    }
    e.preventDefault();
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
    <GlobalContext.Provider value={{ test: 1 }}>
      <div>
        <TitleBar
          exportToImage={exportToImage}
          moveBack={moveBack}
          moveForward={moveForward}
          deleteItem={deleteItem}
          toTop={toTop}
          toBottom={toBottom}
          moveUp={moveUp}
          moveDown={moveDown}
        ></TitleBar>
        <ToolBar moveBack={moveBack} moveForward={moveForward}></ToolBar>

        <Dragger {...props}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">拖到此处添加到我的图形</p>
        </Dragger>
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
        <Button type="primary" onClick={deleteItem}>
          删除
        </Button>
        <Button type="primary" onClick={moveUp}>
          上移
        </Button>
        <Button type="primary" onClick={moveDown}>
          下移
        </Button>
        <Button type="primary" onClick={zoomIn}>
          放大
        </Button>
        <Button type="primary" onClick={zoomOut}>
          缩小
        </Button>
      </div>
      <br />
      <Row>
        <Col flex="100px">
          <ShapePanel></ShapePanel>
        </Col>
        <Col flex="auto">
          <KonvaEdit editRef={editRef} />
        </Col>
      </Row>
    </GlobalContext.Provider>
  );
};

export default H5Edit;
