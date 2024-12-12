import React from "react";
import {
  getSessionData,
  removeSessionData,
} from "../utils/storage/sessionStorageUtils";
import { useNavigate } from "react-router-dom";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function NavigationBar(props) {
  const navigate = useNavigate();

  const timeTable1 = getSessionData("1000_level");
  const timeTable2 = getSessionData("2000_level");
  const timeTable3 = getSessionData("3000_level");

  const logout = () => {
    removeSessionData("jwt_token");
    navigate("/");
  };
  return (
    <Navbar
      collapseOnSelect
      expand="md"
      className="bg-body-tertiary"
      bg="light"
      data-bs-theme="light"
      sticky="top"
    >
      <Container>
        {/* <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto" defaultActiveKey={props.path}>
            <Nav.Item>
              <Nav.Link href="/home">Home</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/choosetimetable">ChooseTimeTable</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/createtimetable">CreateTimeTable</Nav.Link>
            </Nav.Item>
          </Nav>
          <Nav>
            <NavDropdown title="User" id="collapsible-nav-dropdown">
              {timeTable1 && (<NavDropdown.Item href="#action/3.1">
                1000 Level Timetable
              </NavDropdown.Item>)}
              {timeTable2 && (<NavDropdown.Item href="#action/3.2">
                2000 Level Timetable
              </NavDropdown.Item>)}
              {timeTable3 && (<NavDropdown.Item href="#action/3.3">
                3000 Level Timetable
              </NavDropdown.Item>)}
              {(timeTable1 || timeTable2 || timeTable3) &&  (<NavDropdown.Divider />)}
              <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
