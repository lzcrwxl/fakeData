import React from "react";
import "./App.less";

import PageContainer from "./components/PageContainer";

import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <Router>
      <PageContainer></PageContainer>;
    </Router>
  );
}

export default App;
