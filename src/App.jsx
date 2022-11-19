import "./App.css";
import DataTable from "./component/Table";
import "antd/dist/antd.css";

import { translate } from "./component/constants";
import GetAll from "./component/GetAll";

function App() {
  return (
    <div className="App">
      <GetAll></GetAll>
      <DataTable />
    </div>
  );
}

export default App;
