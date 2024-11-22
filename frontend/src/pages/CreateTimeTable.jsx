import React, { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import TableTag from "../components/Table";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function CreateTimeTable() {
  const [level, setLevel] = useState("");
  const [clashes, setClashes] = useState("");

  const selectLevel = (event) => {
    setLevel(event.target.value);
  };

  const selectClashesSet = (event) => {
    setClashes(event.target.value);
  };

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const submit = async (event) => {
    event.preventDefault();
    console.log(level, clashes);

    if (level==="" || clashes==="") {
      return alert("Select Level and Clashes set");
    }

    try {
      const clashdata = await axios.get(`http://localhost:5000/studentdata/clashes/${level}`);
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
      <div className="uploadform">
        <Form onSubmit={submit}>
          <Form.Group>
            <Form.Label>LEVEL</Form.Label>
            <Form.Select value={level} autoFocus onChange={selectLevel}>
              <option value="">Select...</option>
              <option value="1000">1000</option>
              <option value="2000">2000</option>
              <option value="3000">3000</option>
            </Form.Select>
          </Form.Group>
          <br />
          <Form.Group>
            <Form.Label>Clashes Sets</Form.Label>
            <Form.Select value={clashes} onChange={selectClashesSet}>
              <option value="">Select...</option>
              <option value="2 sets">2 sets</option>
              <option value="3 sets">3 sets</option>
              <option value="4 sets">4 sets</option>
            </Form.Select>
          </Form.Group>
          <br />
          <div className="button">
            <Button variant="dark" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
      <div>
          <label className="label">
            <TableTag columns={columns} rows={rows} />
          </label>
        </div>
    </div>
  );
}
