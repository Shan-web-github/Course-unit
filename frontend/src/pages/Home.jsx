import { React, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

//components
import TableTag from "../components/TableTag";
import background from "../assets/background.jpg";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";

export default function Home() {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [viewTable, setViewTable] = useState(false);

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
      setViewTable(true);
    } catch (error) {
      console.error("Load error:", error);
      alert("An error occurred while loading data.");
    }
  };
  return (
    <div>
      <Navbar path="/home" />
      <div>
        <div
          className="d-flex align-items-center justify-content-center vh-100"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="card p-4 text-center d-flex align-items-center justify-content-center"
            style={{
              width: "100%",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              color: "white",
            }}
          >
            <div>
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
            {viewTable && (
              <div
                  // className=" scrollable-container"
                  // style={{
                  //   width: "100%",
                  //   maxHeight: "70vh",
                  //   overflowY: "auto",
                  //   background: "rgba(255, 255, 255, 0.8)",
                  //   borderRadius: "10px",
                  //   padding: "20px",
                  //   boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
                  // }}
                >
                  <TableTag columns={columns} rows={rows} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
