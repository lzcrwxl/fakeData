import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
} from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FormItem from "./formItem";

const { RangePicker } = DatePicker;

const { Option } = Select;
const { TextArea } = Input;

const Vehicle = () => {
  const [form] = Form.useForm();
  let [keyArr, setKeyArr] = useState([]);
  let [formObj, setFormObj] = useState({});
  const onFinish = (values) => {
    console.log("Success:", values);
    let { parseValue, ...params } = values;
    axios
      .post("/service/fakeData/batchInsert", { ...params, keyArr })
      .then((res) => {
        console.log("Success:", res);
        if (res.status === 200) {
          message.success(`成功插入${res.data.n}条数据！`);
        }
      });
    // let expression = `
    // db.${values.collection}.insertMany(${expArr});
    // `;
    // console.log("expression:", expression);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onValuesChange = (key, allValues) => {
    console.log("Key:", key);
    console.log(allValues);
    setFormObj(allValues);
  };
  const ParseValue = () => {
    let keys = [];
    let v = form.getFieldValue("parseValue");
    if (typeof v === "string") {
      v = eval("(" + v + ")");
    }
    Object.keys(v).forEach((key) => {
      keys.push(key);
    });
    setKeyArr(keys);
    // 动态更新parentId的值
    // useEffect(() => {
    // });
    Object.keys(v).forEach((key) => {
      v["Type" + key] = "zdz";
      v["ValueType" + key] = "num";
    });
    form.setFieldsValue(v);
    setFormObj(v);
  };

  return (
    <Form
      form={form}
      name="basic"
      onValuesChange={onValuesChange}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 16,
      }}
      initialValues={{ generateNum: 1, deleted: false }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="表名"
        name="collection"
        rules={[
          {
            required: true,
            message: "Please input collection!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="单条数据"
        name="parseValue"
        rules={[
          {
            required: true,
            message: "Please input parseValue!!!!!",
          },
        ]}
      >
        <TextArea rows={10} />
      </Form.Item>
      <Form.Item label="生成条数" name="generateNum">
        <InputNumber min={1} />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 16,
        }}
      >
        <Button type="primary" onClick={ParseValue}>
          解析
        </Button>
        <Button type="primary" htmlType="submit">
          生成语句
        </Button>
      </Form.Item>
      {keyArr.map((key, k) => (
        <Form.Item label={key} key={key}>
          <FormItem
            parentType={formObj["Type" + key]}
            parentValueType={formObj["ValueType" + key]}
            parentKey={key}
          />
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
            </Select>
          </Form.Item>
        </Form.Item>
      ))}
    </Form>
  );
};

export default Vehicle;
