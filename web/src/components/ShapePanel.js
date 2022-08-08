import React, { useState, useEffect, useRef } from "react";
import { Collapse, Divider } from "antd";
import "./ShapePanel.less"

const { Panel } = Collapse;

const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

const ShapePanel = () => {
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <div id="shape_panel">
      <Collapse defaultActiveKey={["1"]} onChange={onChange}>
        <Panel header="This is panel header 1" key="1">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 2" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="This is panel header 3" key="3">
          <p>{text}</p>
        </Panel>
      </Collapse>
    </div>
  );
};

export default ShapePanel;
