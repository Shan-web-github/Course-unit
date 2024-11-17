import { React, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

//components
import Table from "../components/Table";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

export default function Home() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const [tableName, setTableName] = useState("");

  const load = async (event) => {
    event.preventDefault();
    if (!tableName) {
      return alert("Please enter a table name.");
    }
    try {
      const loadData = await axios.get(
        `http://localhost:5000/studentdata/data/${tableName}`
      );
      setColumns(loadData.data.columns);
      setRows(loadData.data.data);
    } catch (error) {
      console.error("Load error:", error);
      alert("An error occurred while loading data.");
    }
  };
  return (
    <div>
      <Navbar />
      <div>
        <div className="uploadform">
          <InputGroup className="mb-3">
            <InputGroup.Text id="inputGroup-sizing-default">
              Enter table name
            </InputGroup.Text>
            <Form.Control
              aria-label="Default"
              aria-describedby="inputGroup-sizing-default"
              type="text"
              placeholder="Enter table name"
              onChange={(event) => setTableName(event.target.value)}
            />
          </InputGroup>
          <Button variant="dark" type="button" onClick={load}>
            Submit
          </Button>
        </div>
        <div>
          <label className="label">
            <Table columns={columns} rows={rows} />
          </label>
        </div>
      </div>
    </div>
  );
}
