import React from "react";
import { Button } from "antd";
import "./App.less";

import PageContainer from "./components/PageContainer";

import { BrowserRouter as Router, Link } from "react-router-dom";

function App() {
  return (
    <Router>
      <PageContainer></PageContainer>;
    </Router>
  );
}

export default App;
