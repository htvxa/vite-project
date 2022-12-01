import { React } from "react";
import "./App.css";
import "antd/dist/antd.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DataTable from "./component/Table";
import GetAll from "./component/GetAll";
import Upload from "./component/Upload";
import HandleShortText from "./component/HandleShortText";
import MergeObject from "./component/MergeObject";
import Skill from "./component/Skill";
import Step from "./component/Step/Step";
import LocalTable from "./component/LocalTable";
import HandleFile from "./component/HandleFile";

function App() {
  return (
    <BrowserRouter>
      <div className="div-link">
        <Link to="/" className="link">
          Home
        </Link>
        <Link to="/get-all" className="link">
          Get all
        </Link>
        <Link to="/upload" className="link">
          Upload
        </Link>{" "}
        <Link to="/table" className="link">
          Local Table
        </Link>
        {/* <Link to="/handle" className="link">
          Handle
        </Link> */}
        <Link to="/merge" className="link">
          Merge
        </Link>{" "}
        {/* <Link to="/skill" className="link">
          Translate Skill
        </Link>{" "} */}
        <Link to="/step" className="link">
          Step by Step
        </Link>{" "}
        <Link to="/handle-file" className="link">
          Handle Character
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<DataTable />} />
        <Route path="get-all" element={<GetAll />} />
        <Route path="upload" element={<Upload />} />
        <Route path="table" element={<LocalTable />} />
        {/* <Route path="handle" element={<HandleShortText />} /> */}
        <Route path="merge" element={<MergeObject />} />
        {/* <Route path="skill" element={<Skill />} /> */}
        <Route path="step" element={<Step />} />
        <Route path="handle-file" element={<HandleFile />} />
      </Routes>
    </BrowserRouter>
  );
}

// function App() {
//   const [tab, setTab] = useState("table");
//   return (
//     <div className="App">
//       <button onClick={() => setTab("upload")}>Upload</button>
//       <button onClick={() => setTab("table")}>Table</button>
//       {tab === "table" && (
//         <>
//           <GetAll></GetAll>
//           <DataTable />
//         </>
//       )}
//       {tab === "upload" && <Upload></Upload>}
//     </div>
//   );
// }

export default App;
