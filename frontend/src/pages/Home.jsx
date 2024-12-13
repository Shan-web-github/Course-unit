import { React, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

//components
import TableTag from "../components/TableTag";
import background from "../assets/background.jpg";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

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
              width: viewTable ? "100%" : "auto",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(10px)",
              borderRadius: "10px",
              color: "white",
            }}
          >
            <div>
              <Form.Group className="mb-3"> 
                <Form.Label>Select a table</Form.Label>
                <Form.Select
                  value={tableName}
                  onChange={(event) => setTableName(event.target.value)}
                >
                  <option value="">Select a table...</option>
                  <option value="courses">Offered all courses</option>
                  <option value="offer_course_exm">Offered courses for exam</option>
                  <option value="sem_reg">Semester registrations</option>
                  <option value=" mapping">Old courses mapping</option>
                </Form.Select>
              </Form.Group>
              <Button variant="dark" type="button" onClick={load}>
                Submit
              </Button>
            </div>
            <br />
            {viewTable && (
              <div className="scrollable-container">
                <TableTag columns={columns} rows={rows} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
