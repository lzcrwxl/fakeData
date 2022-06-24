import {
  Routes,
  Route,
} from "react-router-dom";
import FakeData  from "./views/fakeData";

function router() {
  return (
    <Routes>
      <Route path="/" element={<FakeData />} />
    </Routes>
  );
}

export default router;
