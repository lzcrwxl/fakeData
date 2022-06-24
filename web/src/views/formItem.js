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
import axios from "axios";

const { RangePicker } = DatePicker;

const { Option } = Select;
const { TextArea } = Input;

export default function FormItem({ parentType, parentValueType, parentKey }) {
  const form = Form.useFormInstance();

  if (parentType === "sjs" && parentValueType === "date") {
    console.log(parentKey);
    let value = form.getFieldValue(parentKey);
    console.log(value);
    if (typeof value === "string") {
      form.setFieldsValue({ [parentKey]: "" });
    }
    return (
      <Form.Item name={parentKey} noStyle>
        <RangePicker />
      </Form.Item>
    );
  } else {
    return (
      <Form.Item name={parentKey} noStyle>
        <Input />
      </Form.Item>
    );
  }
}
