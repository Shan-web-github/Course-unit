import React, { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";

import { Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";
import ChooseTables from "../components/ChooseTables";

export default function ChooseTimeTable() {
  const [isSplit, setIsSplit] = useState(false);
  const [timetables, setTimetables] = useState([]);

  const fetchTimetable = async () => {
    setIsSplit(!isSplit);
    try {
      const response = await axios.get(
        "http://localhost:5000/studentdata/generate-timetable"
      );
      if (response.data.success) {
        console.log(response.data.output);
        setTimetables(response.data.output);
      } else {
        console.error("Failed to fetch timetable:", response.data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const content = (
    <div>
      <h1>Main Content</h1>
      <p className="text-justify">
        The conflict resolution method implemented for the "Choose Timetable"
        page organizes subjects into non-conflicting sets to ensure efficient
        scheduling. It takes an input array of subjects and their respective
        conflicts and outputs groups of subjects that can be scheduled together
        without clashes. The algorithm prioritizes subjects with the highest
        number of conflicts, selects compatible subjects with minimal conflicts,
        and creates a non-conflicting set. This process repeats, removing used
        subjects and generating additional sets until all subjects are grouped.
        The method ensures conflict-free scheduling, optimizing timetable
        creation and enhancing user clarity by clearly displaying subject groups
        that can coexist without overlaps.
      </p>
    </div>
  );

  // Divide the timetables into left and right groups
  const leftTimetables = timetables.slice(0, 2);
  const rightTimetables = timetables.slice(2, 4);

  return (
    <div className="main">
      <Navbar path="/choosetimetable" />
      <div className="main-pane" style={{ minHeight: isSplit && "105vh" }}>
        <Container fluid className="mt-4">
          <Button
            onClick={fetchTimetable}
            className="mb-3"
            variant={isSplit ? "danger" : "primary"}
          >
            {isSplit ? "Back to Single View" : "TimeTable View"}
          </Button>

          <Row className="split-page" style={{ height: "80vh" }}>
            {isSplit ? (
              <>
                <Col md={6} className="left-pane">
                  {leftTimetables.map((timetable, timetableIndex) => (
                    <div key={timetableIndex}>
                      <h5 className="fw-semibold">Time Table {timetableIndex+1}</h5>
                      <br />
                      <ChooseTables
                        timetable={timetable}
                        timetableIndex={timetableIndex}
                      />
                    </div>
                  ))}
                </Col>
                <Col md={6} className="right-pane">
                  {rightTimetables.map((timetable, timetableIndex) => (
                    <div key={timetableIndex}>
                      <h5 className="fw-semibold">Time Table {timetableIndex+3}</h5>
                      <br />
                      <ChooseTables
                        timetable={timetable}
                        timetableIndex={timetableIndex}
                      />
                    </div>
                  ))}
                </Col>
              </>
            ) : (
              <Col>{content}</Col>
            )}
          </Row>
        </Container>
      </div>
      <Footer />
    </div>
  );
}
