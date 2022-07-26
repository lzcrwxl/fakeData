import { Layout } from "antd";
import SideBar from "./SideBar";
import HeadTop from "./HeadTop";
import "./PageContainer.less";

import Routers from "../router";
const { Header, Footer, Sider, Content } = Layout;

function PageContainer() {
  return (
    <Layout>
      <Sider
        breakpoint="lg"
        trigger={null}
        collapsible
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <SideBar></SideBar>
      </Sider>
      <Layout
        style={{
          marginLeft: 200,
        }}
      >
        <Header
          className="site-layout-sub-header-background"
          id="headerBar"
          style={{
            padding: 0,
          }}
        >
          <HeadTop></HeadTop>
        </Header>
        <Content id="Content">
          <Routers></Routers>
        </Content>
      </Layout>
    </Layout>
  );
}

export default PageContainer;
