import React, { useState, useEffect } from "react";
import {
  getSessionData,
  removeSessionData,
  clearSessionData,
} from "../utils/storage/sessionStorageUtils";
import { useNavigate } from "react-router-dom";

import CalendarIcon from "../assets/Icons/calendar-icon.jpg";
import Usericon from "../assets/Icons/userIcon4.png";

import UserTimeTable from "./TimetablePopup";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function NavigationBar(props) {
  const navigate = useNavigate();

  const [timeTable1, setTimeTable1] = useState([]);
  const [timeTable2, setTimeTable2] = useState([]);
  const [timeTable3, setTimeTable3] = useState([]);

  // Retrieve timetable data
  const funcTimeTable1 = () => {
    setTimeTable1(getSessionData("1000_level"));
  };
  const funcTimeTable2 = () => {
    setTimeTable2(getSessionData("2000_level"));
  };
  const funcTimeTable3 = () => {
    setTimeTable3(getSessionData("3000_level"));
  };

  // State for showing timetable
  const [selectedTable, setSelectedTable] = useState(null);

  const logout = () => {
    removeSessionData("jwt_token");
    clearSessionData();
    navigate("/");
  };

  const popUpTable = (event, tableData, level) => {
    event.preventDefault();
    setSelectedTable({ data: tableData, level });
  };

  useEffect(() => {
    funcTimeTable1();
    funcTimeTable2();
    funcTimeTable3();
  }, []);

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="md"
        className="bg-body-tertiary"
        bg="light"
        data-bs-theme="light"
        sticky="top"
      >
        <Container fluid>
          <Navbar.Brand
            href="/home"
            className="fw-bold d-flex justify-content-center align-items-center"
          >
            <img src={CalendarIcon} alt="Logo" className="me-2" width="30" />
            SetUpExam<span className="text-primary">TimeTable</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto gap-3 ps-md-5 ps-sm-0 ps-xs-0" defaultActiveKey={props.path}>
              <Nav.Item>
                <Nav.Link href="/home" className="me-3 fw-semibold">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/choosetimetable" className="me-3 fw-semibold">Choose TimeTable</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/createtimetable" className="fw-semibold">Create TimeTable</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav>
              <NavDropdown
                title={
                  <img
                    src={Usericon}
                    alt="User Icon"
                    style={{ width: "40px", height: "40px" }}
                  />
                }
                id="collapsible-nav-dropdown"
                align="end"
              >
                {timeTable1 && (
                  <NavDropdown.Item
                    onClick={(event) => popUpTable(event, timeTable1, 1000)}
                  >
                    1000 Level Timetable
                  </NavDropdown.Item>
                )}
                {timeTable2 && (
                  <NavDropdown.Item
                    onClick={(event) => popUpTable(event, timeTable2, 2000)}
                  >
                    2000 Level Timetable
                  </NavDropdown.Item>
                )}
                {timeTable3 && (
                  <NavDropdown.Item
                    onClick={(event) => popUpTable(event, timeTable3, 3000)}
                  >
                    3000 Level Timetable
                  </NavDropdown.Item>
                )}
                {(timeTable1 || timeTable2 || timeTable3) && (
                  <NavDropdown.Divider />
                )}
                <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Render timetable if selected */}
      {selectedTable && (
        <UserTimeTable
          timetableData={selectedTable.data}
          level={selectedTable.level}
          isShow={true}
        />
      )}
    </>
  );
}
