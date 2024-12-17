import { React, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

//components
import TableTag from "../components/TableTag";
import CalendarIcon from "../assets/Icons/table_icon.png";

//bootstrapt lib
import { Container, Card, Form, Button } from "react-bootstrap";
import Footer from "../components/Footer";

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
    <div className="main">
      <Navbar path="/home" />
      <div>
        <Container
          fluid
          className="d-flex justify-content-center align-items-center min-vh-100 bg-light"
        >
          <Card className="p-4 shadow-sm" style={{ width:  viewTable ? "100%" : "24rem" }}>
            <div className="text-center mb-4">
              <h2 className="fw-bold d-flex justify-content-center align-items-center">
                <img
                  src={CalendarIcon}
                  alt="Logo"
                  className="me-2"
                  width="30"
                />
                Check <span className="text-primary">YourTables</span>
              </h2>
            </div>
            <div>
              <Form.Group className="mb-3">
                <Form.Select
                  value={tableName}
                  onChange={(event) => setTableName(event.target.value)}
                >
                  <option value="">Select a table...</option>
                  <option value="courses">Offered all courses</option>
                  <option value="offer_course_exm">
                    Offered courses for exam
                  </option>
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
          </Card>
        </Container>
      </div>
      <Footer/>
    </div>
  );
}
