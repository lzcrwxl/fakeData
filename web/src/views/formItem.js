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
import SelectItems from "./selectItems";
const { RangePicker } = DatePicker;

const { Option } = Select;
const { TextArea } = Input;

export default function FormItem({ parentType, parentValueType, parentKey }) {
  const form = Form.useFormInstance();
  let value = form.getFieldValue(parentKey);
  if (parentValueType === "obj") {
    console.log("ffffffffffff", value);
    let result = Object.keys(value).map((key) => {
      if (!key.includes("Type") && !key.includes("Value")) {
        return (
          <Form.Item key={key} label={key}>
            <Form.Item name={[parentKey, key]} noStyle>
              <Input />
            </Form.Item>
            <SelectItems parentKey={key} parentName={parentKey} />
          </Form.Item>
        );
      }
    });
    return result;
  } else if (parentType === "sjs" && parentValueType === "date") {
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
