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

const { Option } = Select;
const { TextArea } = Input;

const transferValues = (str) => {
  str = str.replace(/NumberInt\(/g, "");
  // 替换date
  str = str.replace(/ISODate\("/g, '"date');
  // 替换objectId
  str = str.replace(/ObjectId\("/g, '"objId');
  str = str.replace(/\)/g, "");
  if (typeof str === "string") {
    str = eval("(" + str + ")");
  }
  return str;
};

const Vehicle = () => {
  const [form] = Form.useForm();
  let [keyArr, setKeyArr] = useState([]);
  let [formObj, setFormObj] = useState({});
  const onFinish = (values) => {
    let { parseValue, ...params } = values;
    axios
      .post("/service/fakeData/batchInsert", { ...params, keyArr })
      .then((res) => {
        console.log("Success:", res);
        if (res.status === 200) {
          message.success(`成功插入${res.data.n}条数据！`);
        }
      })
      .catch((err) => {
        message.error(err);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onValuesChange = (key, allValues) => {
    console.log("Key:", key);
    setFormObj(allValues);
  };
  const ParseValue = () => {
    let keys = [];
    let v = form.getFieldValue("parseValue");

    v = transferValues(v);
    Object.keys(v).forEach((key) => {
      // 数字
      if (typeof v[key] === "number") {
        v["ValueType" + key] = "num";
      } else if (typeof v[key] === "boolean") {
        v["ValueType" + key] = "Bool";
      } else if (typeof v[key] === "string" && v[key].includes("date")) {
        v["ValueType" + key] = "date";
        v[key] = v[key].replace(/date/g, "");
      } else if (typeof v[key] === "string" && v[key].includes("objId")) {
        v["ValueType" + key] = "objId";
        v[key] = v[key].replace(/objId/g, "");
      } else {
        v["ValueType" + key] = "str";
      }
      v["Type" + key] = "zdz";
      if (key !== "_id") {
        keys.push(key);
      } else {
        delete v._id;
      }
    });
    console.log("vvvvvvvvvv", v);
    setKeyArr(keys);
    // 动态更新parentId的值
    // useEffect(() => {
    // });
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
      initialValues={{
        generateNum: 1,
        deleted: false,
        mongodburl: "mongodb://${user}:${password}@${IPidress}:27017",
        dbName: "",
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="mongodburl"
        name="mongodburl"
        rules={[
          {
            required: true,
            message: "Please input mongodburl!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="dbName"
        name="dbName"
        rules={[
          {
            required: true,
            message: "Please input dbName!",
          },
        ]}
      >
        <Input />
      </Form.Item>
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
