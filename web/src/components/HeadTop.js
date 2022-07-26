import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Breadcrumb } from "antd";
import { HashRouter, Link, Route, Routes, useLocation } from "react-router-dom";
const breadcrumbNameMap = {
  "/fakeData": "生成假数据",
  "/konvaDemo": "konvaDemo",
  "/h5-edit": "h5-edit",
};
const HeadTop = () => {
  const location = useLocation();
  const pathSnippets = location.pathname.split("/").filter((i) => i);
  console.log("Location", location);
  console.log("pathSnippets", pathSnippets);
  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join("/")}`;
    return (
      <Breadcrumb.Item key={url}>
        <Link to={url}>{breadcrumbNameMap[url]}</Link>
      </Breadcrumb.Item>
    );
  });
  return (
    <Breadcrumb style={{ margin: "16px 0" }}>{breadcrumbItems}</Breadcrumb>
  );
};

export default HeadTop;
