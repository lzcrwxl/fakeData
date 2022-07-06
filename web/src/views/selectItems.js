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
  let name = props.parentName;
  let parentValueType = props.parentValueType;
  if (name && parentValueType !== "obj") {
    return (
      <>
        <Form.Item name={[name, "Type" + key]} noStyle>
          <Select>
            <Option value="zdz">指定值</Option>
            <Option value="sjs">随机数</Option>
          </Select>
        </Form.Item>
        <Form.Item name={[name, "ValueType" + key]} noStyle>
          <Select>
            <Option value="num">数字</Option>
            <Option value="str">字符串</Option>
            <Option value="Bool">Bool</Option>
            <Option value="date">日期</Option>
            <Option value="objId">ObjectId</Option>
            <Option value="tel">电话</Option>
            <Option value="cph">车牌号</Option>
            <Option value="obj">对象</Option>
          </Select>
        </Form.Item>
      </>
    );
  }
  if (parentValueType !== "obj") {
    return (
      <>
        <Form.Item name={"Type" + key} noStyle>
          <Select>
            <Option value="zdz">指定值</Option>
            <Option value="sjs">随机数</Option>
          </Select>
        </Form.Item>
        <Form.Item name={"ValueType" + key} noStyle>
          <Select>
            <Option value="num">数字</Option>
            <Option value="str">字符串</Option>
            <Option value="Bool">Bool</Option>
            <Option value="date">日期</Option>
            <Option value="objId">ObjectId</Option>
            <Option value="tel">电话</Option>
            <Option value="cph">车牌号</Option>
            <Option value="obj">对象</Option>
          </Select>
        </Form.Item>
      </>
    );
  }
}
