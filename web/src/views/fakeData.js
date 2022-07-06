import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  message,
  Space,
  Tag,
} from "antd";
import moment from "moment";
import React, { useState, useEffect } from "react";
import axios from "axios";
import FormItem from "./formItem";
import SelectItems from "./selectItems";

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
  const [loading, setLoading] = useState(false);
  const [isDisabled, setDisabled] = useState(true);

  const onFinish = (values) => {
    let { parseValue, ...params } = values;
    console.log("===========>", params);
    setLoading(true);
    axios
      .post("/service/fakeData/batchInsert", params)
      .then((res) => {
        console.log("Success:", res);
        if (res.status === 200) {
          console.log(res.data.n);
          message.success(
            `${params.collection || "数据库"}成功插入${res.data.n}条数据！`
          );
        }
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  const onValuesChange = (key, allValues) => {
    setFormObj(allValues);
  };

  const transferObjValues = (v) => {
    let keys = [];
    let nv = { ...v };
    Object.keys(nv).forEach((key) => {
      // 数字
      if (typeof nv[key] === "number") {
        nv["ValueType" + key] = "num";
      } else if (typeof nv[key] === "boolean") {
        nv["ValueType" + key] = "Bool";
      } else if (typeof nv[key] === "string" && nv[key].includes("date")) {
        nv["ValueType" + key] = "date";
        nv[key] = nv[key].replace(/date/g, "");
      } else if (typeof nv[key] === "string" && nv[key].includes("objId")) {
        nv["ValueType" + key] = "objId";
        nv[key] = nv[key].replace(/objId/g, "");
      } else if (
        Object.prototype.toString.call(nv[key]) === "[object Object]" &&
        key !== "nv" &&
        key !== "keys"
      ) {
        nv["ValueType" + key] = "obj";
        let value = transferObjValues(nv[key]);
        nv[key] = value.nv;
      } else {
        nv["ValueType" + key] = "str";
      }
      nv["Type" + key] = "zdz";
      if (key !== "_id") {
        keys.push(key);
      } else {
        delete v._id;
      }
    });
    return { nv, keys };
  };

  const ParseValue = async () => {
    let v = form.getFieldValue("parseValue");
    await form.validateFields(["parseValue"]);
    v = transferValues(v);
    let { nv, keys } = transferObjValues(v);
    console.log(nv, "nnnnnnnnnnnnnnnnn");
    setKeyArr(keys);
    // 动态更新parentId的值
    // useEffect(() => {
    // });
    form.setFieldsValue(nv);
    setDisabled(false);
    setFormObj(nv);
  };
  const getValue = async () => {
    await form.validateFields(["mongodburl", "database", "collection"]);
    let params = form.getFieldsValue(["mongodburl", "database", "collection"]);
    console.log(params);
    axios
      .post("/service/fakeData/getOne", params)
      .then((res) => {
        console.log("Success:", res);
        if (res.status === 200 && res.data) {
          form.setFieldsValue({ parseValue: JSON.stringify(res.data) });
        }
      })
      .catch((err) => {
        message.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
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
        mongodburl: "",
        database: "",
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      autoComplete="off"
    >
      <Form.Item
        label="mongodburl"
        rules={[
          {
            required: true,
            message: "Please input mongodburl!",
          },
        ]}
      >
        <Form.Item name="mongodburl" noStyle>
          <Input />
        </Form.Item>
        <span>示例：mongodb://admin:123456@192.168.21.135:27017</span>
      </Form.Item>
      <Form.Item
        label="database"
        name="database"
        rules={[
          {
            required: true,
            message: "Please input database!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="collection"
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
        <Space>
          <Button type="primary" onClick={getValue}>
            获取单条数据
          </Button>
          <Button type="primary" onClick={ParseValue}>
            解析
          </Button>
          <Button type="primary" htmlType="submit" disabled={isDisabled}>
            生成语句
          </Button>
        </Space>
      </Form.Item>
      {keyArr.map((key, k) => (
        <Form.Item label={key} key={key}>
          <FormItem
            parentType={formObj["Type" + key]}
            parentValueType={formObj["ValueType" + key]}
            parentKey={key}
          />
          <SelectItems
            parentKey={[key]}
            parentValueType={formObj["ValueType" + key]}
          />
          <Form.Item shouldUpdate>
            {() => {
              if (k === 0) {
                return (
                  <>
                    <span>
                      <Tag color="#2db7f5">说明：</Tag>
                    </span>
                    <span>
                      当选择随机数，输入框包含<b>","</b>
                      会从指定输入框中的多个数据选择随机数，否则从字典表中选择随机数
                    </span>
                  </>
                );
              }
            }}
          </Form.Item>
        </Form.Item>
      ))}
    </Form>
  );
};

export default Vehicle;
