import React, { useState, useEffect, createContext } from "react";
import {
  getSessionData,
  removeSessionData,
  clearSessionData,
} from "../utils/storage/sessionStorageUtils";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import CalendarIcon from "../assets/Icons/calendar-icon.jpg";
import Usericon from "../assets/Icons/userIcon4.png";

import UserTimeTable from "./TimetablePopup";
import TimetableViewer from "./TimetableViewer";

import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";

export const popUpdata = createContext();

export default function NavigationBar(props) {
  const navigate = useNavigate();
  const ipAddress = process.env.REACT_APP_IPADDRESS;

  const [show, setShow] = useState(false);

  const [isTable1Exist, setIsTable1Exist] = useState(false);
  const [isTable2Exist, setIsTable2Exist] = useState(false);
  const [isTable3Exist, setIsTable3Exist] = useState(false);
  const [isTable4Exist, setIsTable4Exist] = useState(false);

  useEffect(() => {
    const checkTableExist = async (tableName, setFunction) => {
      try {
        const { data } = await axios.get(
          `http://${ipAddress}:5000/studentdata/checktable/${tableName}`
        );
        setFunction(data.tableExists);
      } catch (error) {
        console.error("Error checking table existence:", error);
        alert(error);
      }
    };

    checkTableExist("table1", setIsTable1Exist);
    checkTableExist("table2", setIsTable2Exist);
    checkTableExist("table3", setIsTable3Exist);
    checkTableExist("table4", setIsTable4Exist);
  }, [ipAddress]);

  const [timeTable1, setTimeTable1] = useState([]);
  const [timeTable2, setTimeTable2] = useState([]);
  const [timeTable3, setTimeTable3] = useState([]);

  useEffect(() => {
    setTimeTable1(getSessionData("1000_level"));
    setTimeTable2(getSessionData("2000_level"));
    setTimeTable3(getSessionData("3000_level"));
  }, []);

  // State for showing timetable
  const [selectedTable1, setSelectedTable1] = useState(null);
  const [selectedTable2, setSelectedTable2] = useState(null);

  const logout = () => {
    removeSessionData("jwt_token");
    clearSessionData();
    navigate("/");
  };

  const popUpTable1 = (event, tableData, level) => {
    event.preventDefault();
    setSelectedTable1({ data: tableData, level });
    setShow(true);
  };

  const popUpTable2 = (event, tableIndex) => {
    event.preventDefault();
    setSelectedTable2(tableIndex);
    setShow(true);
  };

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
            <Nav
              className="fw-bold d-flex justify-content-start align-items-sm-start align-items-md-center align-items-lg-center me-auto gap-3 ps-md-5 ps-sm-0 ps-xs-0"
              defaultActiveKey={props.path}
            >
              <Nav.Item className="nav-item-center">
                <Nav.Link href="/home" className="me-lg-3 fw-semibold">
                  Home
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item-center">
                <Nav.Link
                  href="/choosetimetable"
                  className="me-lg-3 fw-semibold"
                >
                  Choose TimeTable
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item-center">
                <Nav.Link
                  href="/createtimetable"
                  className="me-lg-3 fw-semibold"
                >
                  Create TimeTable
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item-center">
                <Nav.Link href="/clashcheck" className="me-lg-3 fw-semibold">
                  Clash Check
                </Nav.Link>
              </Nav.Item>
              <Nav.Item className="nav-item-center">
                <Nav.Link
                  href="/hallarrangement"
                  className="me-3 fw-semibold"
                >
                  Hall Arrangement
                </Nav.Link>
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
                    onClick={(event) => popUpTable1(event, timeTable1, 1000)}
                  >
                    1000 Level Timetable
                  </NavDropdown.Item>
                )}
                {timeTable2 && (
                  <NavDropdown.Item
                    onClick={(event) => popUpTable1(event, timeTable2, 2000)}
                  >
                    2000 Level Timetable
                  </NavDropdown.Item>
                )}
                {timeTable3 && (
                  <NavDropdown.Item
                    onClick={(event) => popUpTable1(event, timeTable3, 3000)}
                  >
                    3000 Level Timetable
                  </NavDropdown.Item>
                )}
                {isTable1Exist && (
                  <NavDropdown.Item onClick={(event) => popUpTable2(event, 1)}>
                    Timetable 01
                  </NavDropdown.Item>
                )}
                {isTable2Exist && (
                  <NavDropdown.Item onClick={(event) => popUpTable2(event, 2)}>
                    Timetable 02
                  </NavDropdown.Item>
                )}
                {isTable3Exist && (
                  <NavDropdown.Item onClick={(event) => popUpTable2(event, 3)}>
                    Timetable 03
                  </NavDropdown.Item>
                )}
                {isTable4Exist && (
                  <NavDropdown.Item onClick={(event) => popUpTable2(event, 4)}>
                    Timetable 04
                  </NavDropdown.Item>
                )}
                {(timeTable1 ||
                  timeTable2 ||
                  timeTable3 ||
                  isTable1Exist ||
                  isTable2Exist ||
                  isTable3Exist ||
                  isTable4Exist) && <NavDropdown.Divider />}
                <NavDropdown.Item onClick={logout}>Log out</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Render timetable if selected */}

      {selectedTable1 && (
        <popUpdata.Provider value={{ show, setShow }}>
          <UserTimeTable
            timetableData={selectedTable1.data}
            level={selectedTable1.level}
          />
        </popUpdata.Provider>
      )}

      {selectedTable2 && (
        <popUpdata.Provider value={{ show, setShow }}>
          <TimetableViewer tableIndex={selectedTable2} />
        </popUpdata.Provider>
      )}
    </>
  );
}
