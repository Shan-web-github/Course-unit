import React, { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import TableTag from "../components/Table";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function CreateTimeTable() {
  const [level, setLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [isLevelSelected, setIsLevelSelected] = useState(false);

  const selectLevel = (event) => {
    const value = event.target.value;
    setLevel(value);
    setIsLevelSelected(value !== "");
    findClashes(value);
  };

  const selectSemester = (event) => {
    setSemester(event.target.value);
  };

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const findClashes = async (level) => {

    if (level === "") {
      return alert("Select Level");
    }

    try {
      const clashdata = await axios.get(
        `http://localhost:5000/studentdata/clashes/${level}`
      );
      alert(clashdata.status);
      setColumns(clashdata.data.columns);
      setRows(clashdata.data.data);
    } catch (error) {
      console.error("get clashes file error:", error);
    }
  };

  return (
    <div>
      <Navbar path="/createtimetable" />
      <div className="createtimetable">
        <div className="leftdiv">
          <Form>
            <Form.Group>
              <Form.Label>Level</Form.Label>
              <Form.Select value={level} autoFocus onChange={selectLevel}>
                <option value="">Select...</option>
                <option value="1000">1000</option>
                <option value="2000">2000</option>
                <option value="3000">3000</option>
              </Form.Select>
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Semester</Form.Label>
              <Form.Select value={semester} onChange={selectSemester}>
                <option value="">Select...</option>
                <option value="I">1st Semester</option>
                <option value="II">2nd Semester</option>
              </Form.Select>
            </Form.Group>
            <br />
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Exam Start date</Form.Label>
              <Form.Control type="date" />
            </Form.Group>
            <br />
            <Form.Group>
              <Form.Label>Time Slote</Form.Label>
              <Form.Select>
                <option value="">Select...</option>
                <option value="Morning">Morning</option>
                <option value="Evening">Evening</option>
                <option value="Both">Both</option>
              </Form.Select>
            </Form.Group>
            <br />
            <div className="button">
              <Button variant="dark" type="submit">
                Continue
              </Button>
            </div>
          </Form>
        </div>

        <div className="rightdiv">
          <div>
            {isLevelSelected ? (
              <div>
                <br />
                <Form.Label>{level} Level Clashes </Form.Label>
                {/* <Button variant="dark" type="submit" onClick={findClashes}>
                  Find
                </Button> */}
                <br />
                <label className="label">
                  <TableTag columns={columns} rows={rows} />
                </label>
              </div>
            ) : (
              <div>
                <br />
                <Form.Label>Select Level To Find Clashes </Form.Label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
