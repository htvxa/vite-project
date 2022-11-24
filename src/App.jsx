import { React } from "react";
import "./App.css";
import "antd/dist/antd.css";

import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import DataTable from "./component/Table";
import GetAll from "./component/GetAll";
import Upload from "./component/Upload";

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
        </Link>
      </div>
      <Routes>
        <Route path="/" element={<DataTable />} />
        <Route path="get-all" element={<GetAll />} />
        <Route path="upload" element={<Upload />} />
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
