import {
    Button,
    Checkbox,
    Form,
    Input,
    Select,
    InputNumber,
    DatePicker,
  } from "antd";
  import moment from "moment";
  import React, { useState, useEffect } from "react";
  const { Option } = Select;
  
  export default function SelectItems(props) {
    let key = props.parentKey;
    let parentValueType = props.parentValueType;
    let subType = [...key]
    let subValueType = [...key]
    subType[subType.length-1] = "Type" + subType[subType.length-1]
    subValueType[subValueType.length-1] = "ValueType" + subValueType[subValueType.length-1]
    if (parentValueType !== "obj") {
      return (
        <>
          <Form.Item name={subType} noStyle>
            <Select>
              <Option value="zdz">指定值</Option>
              <Option value="sjs">随机数</Option>
            </Select>
          </Form.Item>
          <Form.Item name={subValueType} noStyle>
            <Select>
              <Option value="num">数字</Option>
              <Option value="str">字符串</Option>
              <Option value="Bool">Bool</Option>
              <Option value="date">日期</Option>
              <Option value="objId">ObjectId</Option>
              <Option value="tel">电话</Option>
              <Option value="cph">车牌号</Option>
              <Option value="obj">对象</Option>
              <Option value="email">邮箱</Option>
              <Option value="ip">ip地址</Option>
              <Option value="sfz">身份证</Option>
              <Option value="xm">姓名</Option>
            </Select>
          </Form.Item>
        </>
      );
    }
  }