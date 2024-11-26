import React, { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";
import TableTag from "../components/Table";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import ManualTable from "../components/ManualTable";

export default function CreateTimeTable() {
  const [level, setLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [isLevelSelected, setIsLevelSelected] = useState(false);

  const [buttonClick, setButtonClick] = useState(false);
  const [buttonName, setButtonName] = useState("Continue");

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
      setColumns(clashdata.data.columns);
      setRows(clashdata.data.data);
    } catch (error) {
      console.error("get clashes file error:", error);
    }
  };

  const [coursesData, setCoursesData] = useState([]);

  const pressContinue = async (event) => {
    event.preventDefault();
    if (
      level === "" ||
      semester === ""
    ) {
      return alert("Select Level and Semester");
    } else if (buttonClick === false) {
      const coursesAttribute = `${level}-${semester}`;
      try {
        const courses = await axios.get(
          `http://localhost:5000/studentdata/courses/${coursesAttribute}`
        );
        alert("Successfully continued");

        setCoursesData(courses.data.data);
        console.log("Courses data :", courses.data.data);

        setButtonClick((prevState) => {
          const newState = !prevState;
          console.log("Button click state:", newState);
          setButtonName(newState ? "Edit" : "Update");
          return newState;
        });
      } catch (error) {
        console.error("Error fetching courses data:", error);
      }
    } else {
      setButtonClick((prevState) => {
        const newState = !prevState;
        console.log("Button click state:", newState);
        setButtonName(newState ? "Edit" : "Update");
        return newState;
      });
    }
  };

  const courseCodes = coursesData.map(course => course.CO_CODE);

  return (
    <div>
      <Navbar path="/createtimetable" />
      <div className="createtimetable">
        <div className="leftdiv">
          <div>
            <Form onSubmit={pressContinue}>
              <Form.Group>
                <Form.Label>Level</Form.Label>
                <Form.Select
                  value={level}
                  autoFocus
                  onChange={selectLevel}
                  disabled={buttonClick}
                >
                  <option value="">Select...</option>
                  <option value="1000">1000</option>
                  <option value="2000">2000</option>
                  <option value="3000">3000</option>
                </Form.Select>
              </Form.Group>
              <br />
              <Form.Group>
                <Form.Label>Semester</Form.Label>
                <Form.Select
                  value={semester}
                  onChange={selectSemester}
                  disabled={buttonClick}
                >
                  <option value="">Select...</option>
                  <option value="I">1st Semester</option>
                  <option value="II">2nd Semester</option>
                </Form.Select>
              </Form.Group>
              <br />
              <div className="button">
                <Button variant="dark" type="submit">
                  {buttonName}
                </Button>
              </div>
            </Form>
          </div>
          <div>
            {buttonClick && (
              <div>
                <hr />
                {level} Level {semester} Semester End Examination
                <hr />
                <ManualTable
                  // level={level}
                  // semester={semester}
                  columns={courseCodes}
                />
              </div>
            )}
          </div>
        </div>

        <div className="rightdiv">
          <div>
            {isLevelSelected ? (
              <div>
                <br />
                <Form.Label>{level} Level Clashes </Form.Label>
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
