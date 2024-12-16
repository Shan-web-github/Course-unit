import React, { useState, useEffect } from "react";
import {
  getSessionData,
  removeSessionData,
  clearSessionData,
} from "../utils/storage/sessionStorageUtils";
import { useNavigate } from "react-router-dom";

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
  }, [timeTable1, timeTable2, timeTable3]);

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
        <Container>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto" defaultActiveKey={props.path}>
              <Nav.Item>
                <Nav.Link href="/home">Home</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/choosetimetable">Choose TimeTable</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link href="/createtimetable">Create TimeTable</Nav.Link>
              </Nav.Item>
            </Nav>
            <Nav>
              <NavDropdown title="User" id="collapsible-nav-dropdown">
                {timeTable1 && (
                  <NavDropdown.Item onClick={(event) => popUpTable(event, timeTable1, 1000)}>
                    1000 Level Timetable
                  </NavDropdown.Item>
                )}
                {timeTable2 && (
                  <NavDropdown.Item onClick={(event) => popUpTable(event, timeTable2, 2000)}>
                    2000 Level Timetable
                  </NavDropdown.Item>
                )}
                {timeTable3 && (
                  <NavDropdown.Item onClick={(event) => popUpTable(event, timeTable3, 3000)}>
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
