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

export default function FormItem({
  parentType,
  parentValueType,
  parentKey,
  parentValue,
}) {
  const form = Form.useFormInstance();
  let value = parentValue || form.getFieldValue(parentKey);
  if (Object.prototype.toString.call(value) === "[object Object]") {
    let result = Object.keys(value).map((key) => {
      let subParentKey = [parentKey, key].join(",");
      if (
        !key.substring(0, 4).includes("Type") &&
        !key.substring(0, 5).includes("Value") &&
        Object.prototype.toString.call(value[key]) !== "[object Object]"
      ) {
        return (
          <Form.Item key={key} label={key}>
            <Form.Item name={subParentKey.split(",")} noStyle>
              <Input />
            </Form.Item>
            <SelectItems parentKey={subParentKey.split(",")} />
          </Form.Item>
        );
      } else if (
        Object.prototype.toString.call(value[key]) === "[object Object]"
      ) {
        return (
          <Form.Item label={key} key={key}>
            <FormItem
              parentType={value["Type" + key]}
              parentValueType={value["ValueType" + key]}
              parentKey={subParentKey.split(",")}
              parentValue={value[key]}
            />
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
