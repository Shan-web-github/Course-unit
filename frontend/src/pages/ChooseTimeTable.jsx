import React, { useState } from "react";
import axios from "axios";

import Navbar from "../components/Navbar";

import { Button, Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "../components/Footer";

export default function ChooseTimeTable() {
  const [isSplit, setIsSplit] = useState(false);
  const [timetable, setTimetable] = useState([]);

  const fetchTimetable = async () => {
    setIsSplit(!isSplit);
    try {
      const response = await axios.get(
        "http://localhost:5000/studentdata/generate-timetable"
      );
      if (response.data.success) {
        console.log(response.data.output);
        setTimetable(response.data.output);
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
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
        varius enim in eros elementum tristique.
      </p>
      <p>More content here...</p>
    </div>
  );

  return (
    <div>
      <Navbar path="/choosetimetable" />
      <Container fluid className="mt-4">
        <Button
          // onClick={() => setIsSplit(!isSplit)}
          onClick={fetchTimetable}
          className="mb-3"
          variant={isSplit ? "danger" : "primary"}
        >
          {isSplit ? "Back to Single View" : "Split View"}
        </Button>

        <Row className="split-page" style={{ height: "80vh" }}>
          {isSplit ? (
            <>
              <Col
                md={6}
                className="left-pane"
                style={{
                  overflowY: "auto",
                  borderRight: "1px solid #ddd",
                  padding: "1rem",
                }}
              >
                {content}
              </Col>
              <Col
                md={6}
                className="right-pane"
                style={{
                  overflowY: "auto",
                  padding: "1rem",
                }}
              >
                <h1>Right Side Content</h1>
                <p>Add any content here...</p>
                {/* <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Time Slot</th>
                    </tr>
                  </thead>
                  <tbody>
                    {timetable.map(({ subject_id, time_slot }) => (
                      <tr key={subject_id}>
                        <td>{subject_id}</td>
                        <td>{time_slot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table> */}
                {timetable}
              </Col>
            </>
          ) : (
            <Col>{content}</Col>
          )}
        </Row>
      </Container>
      <Footer />
    </div>
  );
}
