import {
  MailOutlined,
  SettingOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { useNavigate } from "react-router-dom";

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}

const items = [
  getItem("生成假数据", "sub1", <MailOutlined />, [
    getItem("假数据", "/fakeData", null),
  ]),
  getItem("测试konva", "sub2", <MailOutlined />, [
    getItem("h5-edit", "/h5-edit", null),
  ]),
];

const SideBar = () => {
  let navigate = useNavigate();
  const onClick = (e) => {
    navigate(e.key);
    console.log("click ", e);
  };

  return (
    <Menu
      onClick={onClick}
      defaultSelectedKeys={["1"]}
      defaultOpenKeys={["sub1"]}
      mode="inline"
      theme="dark"
      items={items}
    />
  );
};

export default SideBar;
