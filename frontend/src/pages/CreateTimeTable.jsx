import React, { useState, useMemo } from "react";
import axios from "axios";
import { debounce } from "lodash";

import Navbar from "../components/Navbar";
import ManualTable from "../components/ManualTable";
import TableTag from "../components/TableTag";
import SampleTimeTable from "../components/SampleTimeTable";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import { Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";

export default function CreateTimeTable() {
  const [level, setLevel] = useState("");
  const [semester, setSemester] = useState("");
  const [isLevelSelected, setIsLevelSelected] = useState(false);

  const [buttonClick, setButtonClick] = useState(false);
  const [buttonName, setButtonName] = useState("Continue");

  const [isSplit, setIsSplit] = useState(false);

  const [tableState, setTableState] = useState({
    groupTableData: [],
    startDateArray: [],
    timeSlotArray: [],
  });

  const ipAddress = "10.40.48.115";

  const debouncedSave = useMemo(() => {
    return debounce((groupData, startDates, timeSlots) => {
      setTableState({
        groupTableData: groupData,
        startDateArray: startDates,
        timeSlotArray: timeSlots,
      });
    }, 300);
  }, [setTableState]);

  const handleSaveData = (groupData, startDates, timeSlots) => {
    console.log("Saving data:", { groupData, startDates, timeSlots });
    setTableState({
      groupTableData: groupData,
      startDateArray: startDates,
      timeSlotArray: timeSlots,
    });
    debouncedSave(groupData, startDates, timeSlots);
  };

  const selectLevel = (event) => {
    const value = event.target.value;
    setLevel(value);
    setIsLevelSelected(value !== "");
    findClashes(value);
  };

  const selectSemester = (event) => {
    setSemester(event.target.value);
    createClashes();
  };

  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);

  const findClashes = async (level) => {
    if (level === "") {
      return alert("Select Level");
    }

    try {
      const clashdata = await axios.get(
        `http://${ipAddress}:5000/studentdata/clashes/${level}`
      );
      setColumns(clashdata.data.columns);
      setRows(clashdata.data.data);
    } catch (error) {
      console.error("get clashes file error:", error);
    }
  };

  const createClashes = async () => {
    try {
      await axios.get(`http://${ipAddress}:5000/studentdata/createClashes`);
      console.log("Successfully created clashes table.");
    } catch (error) {
      console.error(
        "repeatclahes error:",
        error.response?.data || error.message
      );
      alert("An error occurred while creating clashes table.");
    }
  };

  const pressContinue = async (event) => {
    event.preventDefault();
    if (level === "" || semester === "") {
      return alert("Select Level and Semester");
    } else if (buttonClick === false) {
      try {
        await axios.post(
          `http://${ipAddress}:5000/studentdata/uploadClashes/${level}`,
          {
            headers: columns,
            rows: rows,
          }
        );

        setButtonClick((prevState) => {
          const newState = !prevState;
          console.log("Button click state:", newState);
          setButtonName(newState ? "Edit" : "Update");
          return newState;
        });
      } catch (error) {
        console.error("Error upload clash courses data:", error);
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

  const mainContent = (
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
            <Button variant={buttonClick ? "dark" : "primary"} type="submit">
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
              level={level}
              semester={semester}
              buttonClick={buttonClick}
              onSave={handleSaveData}
            />
          </div>
        )}
      </div>
    </div>
  );

  const rightContent = (
    <div className="rightdiv">
      {isLevelSelected ? (
        <div>
          <br />
          <Form.Label className="fw-bold d-flex justify-content-center align-items-center">
            {level} Level <span className="text-primary ms-2"> Clashes</span>
          </Form.Label>
          <br />
          <div className="scrollable-container">
            <TableTag columns={columns} rows={rows} hover responsive />
          </div>
          <br />
          <div>
            {tableState.groupTableData.map((data, index) => (
              <div key={index}>
                {index === 0 && (
                  <h5 className="fw-bold d-flex justify-content-center align-items-center">
                    {" "}
                    {level}Level {semester} Semester{" "}
                    <span className="text-primary">EndExamination </span>
                  </h5>
                )}
                <SampleTimeTable
                  key={index}
                  tableData={data}
                  startDate={tableState.startDateArray[index]}
                  timeSlot={tableState.timeSlotArray[index]}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <br />
          <Form.Label>Select Level To Find Clashes </Form.Label>
        </div>
      )}
    </div>
  );

  return (
    <div
      className="main"
      style={{ minHeight: buttonClick && !isSplit && "155vh" }}
    >
      <Navbar path="/createtimetable" />
      <div className="main-pane" style={{ minHeight: isSplit && "105vh" }}>
        <Container fluid className="mt-4">
          <Button
            onClick={() => setIsSplit(!isSplit)}
            className="mb-3"
            disabled={level ? false : true}
            variant={isSplit ? "danger" : "primary"}
          >
            {isSplit ? "Back to Single View" : "Clashes View"}
          </Button>

          <Row className="split-page" style={{ height: "80vh" }}>
            {isSplit ? (
              <>
                <Col md={6} className="left-pane">
                  {mainContent}
                </Col>
                <Col md={6} className="right-pane">
                  {rightContent}
                </Col>
              </>
            ) : (
              <Col>{mainContent}</Col>
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
