import {
  Routes,
  Route,
} from "react-router-dom";
import FakeData  from "./views/fakeData";
import H5Edit  from "./views/h5Edit";

function router() {
  return (
    <Routes>
      <Route path="/fakeData" element={<FakeData />} />
      <Route path="/h5-edit" element={<H5Edit />} />
    </Routes>
  );
}

export default router;
