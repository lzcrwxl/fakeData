import React, { useRef, useEffect, useState, useContext } from "react";
import GlobalContext from "../components/GlobalContent";
import KonvaEdit from "../components/KonvaEdit";
import { ConfigProvider } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import TitleBar from "../components/TitleBar";
import ToolBar from "../components/ToolBar";
import ShapePanel from "../components/ShapePanel";
import "./h5Edit.less";

const H5Edit = () => {
  const editRef = useRef();
  const titleBarRef = useRef();
  const toolBarRef = useRef();

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
  const addText = () => {
    editRef.current.addText();
  };
  const changeFont = (value) => {
    editRef.current.changeFont(value);
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

  const addImage = (file) => {
    editRef.current.addImage(file);
  };
  const getAttrs = (attrs) => {
    console.log("aaaaaaaaaaaaaaaa", attrs);
    toolBarRef.current.getAttrs()
  };

  document.onkeydown = function (e) {
    var keyCode = e.keyCode || e.which || e.charCode;
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
  };
  const [componentSize, setComponentSize] = useState("small");

  return (
    <GlobalContext.Provider value={{ test: 1 }}>
      <ConfigProvider componentSize={componentSize}>
        <TitleBar
          titleBarRef={titleBarRef}
          exportToImage={exportToImage}
          moveBack={moveBack}
          moveForward={moveForward}
          deleteItem={deleteItem}
          toTop={toTop}
          toBottom={toBottom}
          moveUp={moveUp}
          moveDown={moveDown}
          zoomIn={zoomIn}
          zoomOut={zoomOut}
          addText={addText}
        ></TitleBar>
        <ToolBar
          toolBarRef={toolBarRef}
          moveBack={moveBack}
          moveForward={moveForward}
          changeFont={changeFont}
        ></ToolBar>
        <ShapePanel addImage={addImage}></ShapePanel>
        <KonvaEdit editRef={editRef} getAttrs={getAttrs} />
      </ConfigProvider>
    </GlobalContext.Provider>
  );
};

export default H5Edit;
