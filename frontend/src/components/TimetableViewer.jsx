import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from "react-router-dom";

import { popUpdata } from "./Navbar";

import { Card, Badge, Modal, CloseButton, Form, Button } from "react-bootstrap";

// import {
//   PDFDownloadLink,
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: { padding: 30, fontFamily: "Helvetica" },
//   title:{fontSize: 28, textAlign: "center", fontWeight: "bold" },
//   dayContainer: { marginBottom: 20 },
//   dayTitle: { fontSize: 18, marginBottom: 10, textAlign: "center", fontWeight: "bold" },
//   sessionTitle: { fontSize: 16, textTransform: "capitalize", marginBottom: 5 },
//   levelTitle: { fontSize: 14, marginTop: 5 },
//   subjectBadge: {
//     fontSize: 12,
//     marginRight: 5,
//     fontWeight: "bold",
//     padding: 5,
//     // backgroundColor: "#007bff",
//     color: "black",
//     borderRadius: 5,
//   },
//   noSubjects: { fontSize: 12, color: "gray" },
// });

// const TimetableDocument = ({ timetable }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//     <Text style={styles.title}>Time Table</Text>
//       {timetable.map((day) => (
//         <View key={day.id} style={styles.dayContainer}>
//           <Text style={styles.dayTitle}>{day.date_name}</Text>
//           {["morning", "evening"].map((session) => (
//             <View key={session}>
//               <Text style={styles.sessionTitle}>{session} Session</Text>
//               {Object.entries(day.schedule_data[session] || {}).map(
//                 ([level, subjects]) => (
//                   <View key={level}>
//                     <Text style={styles.levelTitle}>{level.toUpperCase()}</Text>
//                     {subjects.length > 0 ? (
//                       subjects.map((subject) => (
//                         <Text key={subject} style={styles.subjectBadge}>
//                           {subject}
//                         </Text>
//                       ))
//                     ) : (
//                       <Text style={styles.noSubjects}>No subjects</Text>
//                     )}
//                   </View>
//                 )
//               )}
//             </View>
//           ))}
//         </View>
//       ))}
//     </Page>
//   </Document>
// );

// import {
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
//   PDFDownloadLink,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: { padding: 30, fontFamily: "Helvetica" },
//   title: { fontSize: 24, textAlign: "center", marginBottom: 20 },

//   dayBlock: { marginBottom: 30 },
//   dayTitle: { fontSize: 18, textAlign: "center", marginBottom: 10, fontWeight: "bold" },

//   sessionCard: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 6,
//     padding: 10,
//     marginBottom: 15,
//   },
//   sessionTitle: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginBottom: 5,
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     paddingBottom: 3,
//   },

//   levelBlock: { marginTop: 8, marginBottom: 5 },
//   levelTitle: { fontSize: 14, marginBottom: 3, fontWeight: "bold" },

//   subjectTag: {
//     fontSize: 12,
//     padding: 4,
//     borderRadius: 4,
//     backgroundColor: "#e0e0e0",
//     marginRight: 5,
//     marginBottom: 5,
//     display: "inline-block",
//   },
//   tagContainer: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//   },
//   noSubjects: { fontSize: 12, color: "gray" },
// });

// const TimetableDocument = ({ timetable }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.title}>Time Table</Text>

//       {timetable.map((day) => (
//         <View key={day.id} style={styles.dayBlock}>
//           <Text style={styles.dayTitle}>{day.date_name}</Text>

//           {["morning", "evening"].map((session) => (
//             <View key={session} style={styles.sessionCard}>
//               <Text style={styles.sessionTitle}>{session.toUpperCase()} SESSION</Text>

//               {Object.entries(day.schedule_data[session] || {}).map(
//                 ([level, subjects]) => (
//                   <View key={level} style={styles.levelBlock}>
//                     <Text style={styles.levelTitle}>{level.toUpperCase()}</Text>
//                     {subjects.length > 0 ? (
//                       <View style={styles.tagContainer}>
//                         {subjects.map((subject, idx) => (
//                           <Text key={idx} style={styles.subjectTag}>
//                             {subject}
//                           </Text>
//                         ))}
//                       </View>
//                     ) : (
//                       <Text style={styles.noSubjects}>No subjects</Text>
//                     )}
//                   </View>
//                 )
//               )}
//             </View>
//           ))}
//         </View>
//       ))}
//     </Page>
//   </Document>
// );

// import {
//   PDFDownloadLink,
//   Document,
//   Page,
//   Text,
//   View,
//   StyleSheet,
// } from "@react-pdf/renderer";

// const styles = StyleSheet.create({
//   page: { padding: 30, fontFamily: "Helvetica" },
//   title: { fontSize: 24, textAlign: "center", marginBottom: 20 },

//   table: {
//     display: "table",
//     width: "auto",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderRightWidth: 0,
//     borderBottomWidth: 0,
//   },
//   tableRow: { flexDirection: "row" },
//   tableColHeader: {
//     width: "25%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     backgroundColor: "#f0f0f0",
//     padding: 5,
//     fontWeight: "bold",
//   },
//   tableCol: {
//     width: "25%",
//     borderStyle: "solid",
//     borderWidth: 1,
//     borderLeftWidth: 0,
//     borderTopWidth: 0,
//     padding: 5,
//     fontSize: 10,
//   },
// });

// const TimetableDocument = ({ timetable }) => (
//   <Document>
//     <Page size="A4" style={styles.page}>
//       <Text style={styles.title}>Time Table</Text>

//       <View style={styles.table}>
//         {/* Table Header */}
//         <View style={styles.tableRow}>
//           <Text style={styles.tableColHeader}>Date</Text>
//           <Text style={styles.tableColHeader}>Session</Text>
//           <Text style={styles.tableColHeader}>Level</Text>
//           <Text style={styles.tableColHeader}>Subjects</Text>
//         </View>

//         {/* Table Data */}
//         {timetable.map((day) =>
//           ["morning", "evening"].flatMap((session) =>
//             Object.entries(day.schedule_data[session] || {}).map(
//               ([level, subjects]) => (
//                 <View key={`${day.id}-${session}-${level}`} style={styles.tableRow}>
//                   <Text style={styles.tableCol}>{day.date_name}</Text>
//                   <Text style={styles.tableCol}>{session}</Text>
//                   <Text style={styles.tableCol}>{level.toUpperCase()}</Text>
//                   <Text style={styles.tableCol}>
//                     {subjects.length > 0 ? subjects.join(", ") : "No subjects"}
//                   </Text>
//                 </View>
//               )
//             )
//           )
//         )}
//       </View>
//     </Page>
//   </Document>
// );

import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  dateTitle: { fontSize: 18, fontWeight: "bold", marginTop: 20, marginBottom: 10 },

  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { flexDirection: "row" },
  tableColHeader: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    backgroundColor: "#f0f0f0",
    padding: 5,
    fontWeight: "bold",
  },
  tableCol: {
    width: "33.33%",
    borderStyle: "solid",
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    padding: 5,
    fontSize: 10,
  },
});

const TimetableDocument = ({ timetable }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Time Table</Text>

      {timetable.map((day) => (
        <View key={day.id}>
          <Text style={styles.dateTitle}>{day.date_name}</Text>

          <View style={styles.table}>
            {/* Table Header */}
            <View style={styles.tableRow}>
              <Text style={styles.tableColHeader}>Session</Text>
              <Text style={styles.tableColHeader}>Level</Text>
              <Text style={styles.tableColHeader}>Subjects</Text>
            </View>

            {/* Table Body */}
            {["morning", "evening"].flatMap((session) =>
              Object.entries(day.schedule_data[session] || {}).map(
                ([level, subjects]) => (
                  <View
                    key={`${day.id}-${session}-${level}`}
                    style={styles.tableRow}
                  >
                    <Text style={styles.tableCol}>{session}</Text>
                    <Text style={styles.tableCol}>{level.toUpperCase()}</Text>
                    <Text style={styles.tableCol}>
                      {subjects.length > 0 ? subjects.join(", ") : "No subjects"}
                    </Text>
                  </View>
                )
              )
            )}
          </View>
        </View>
      ))}
    </Page>
  </Document>
);

export default function TimetableViewer({ tableIndex }) {
  const { show, setShow } = useContext(popUpdata);
  const [timetable, setTimetable] = useState([]);

  const navigate = useNavigate();

  const ipAddress = process.env.REACT_APP_IPADDRESS;

  // Fetch timetable from backend
  useEffect(() => {
    axios
      .get(`http://${ipAddress}:5000/studentdata/view-schedule/${tableIndex}`)
      .then((response) => setTimetable(response.data))
      .catch((error) => console.error("Error fetching timetable:", error));
  }, [tableIndex, ipAddress]);

  // update exam date
  const updateDate = (id, newDate) => {
    setTimetable((prev) =>
      prev.map((day) => (day.id === id ? { ...day, date_name: newDate } : day))
    );
  };

  //add a new day
  const addNewDay = () => {
    const newDay = {
      id: Date.now(),
      date_name: "",
      schedule_data: {
        morning: {},
        evening: {},
      },
    };
    setTimetable((prev) => [...prev, newDay]);
  };

  // add a subject to a session and level
  const addSubject = (dayId, session, level, subject) => {
    setTimetable((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const updatedSession = {
            ...day.schedule_data[session],
            [level]: [...(day.schedule_data[session][level] || []), subject],
          };
          return {
            ...day,
            schedule_data: { ...day.schedule_data, [session]: updatedSession },
          };
        }
        return day;
      })
    );
  };

  // remove a Date
  const removeDate = (dayId) => {
    setTimetable((prev) => prev.filter((day) => day.id !== dayId));
  };

  // remove a subject
  const removeSubject = (dayId, session, level, subject) => {
    setTimetable((prev) =>
      prev.map((day) => {
        if (day.id === dayId) {
          const updatedSession = {
            ...day.schedule_data[session],
            [level]: day.schedule_data[session][level].filter(
              (s) => s !== subject
            ),
          };
          return {
            ...day,
            schedule_data: { ...day.schedule_data, [session]: updatedSession },
          };
        }
        return day;
      })
    );
  };

  // save timetable in sorted order
  const saveUpdatedTimetable = async () => {
    try {
      // Sort timetable by date
      const sortedTimetable = [...timetable].sort(
        (a, b) => new Date(a.date_name) - new Date(b.date_name)
      );

      // Send updated timetable to backend
      await axios.put(
        `http://${ipAddress}:5000/studentdata/update-schedule/${tableIndex}`,
        { timetable: sortedTimetable }
      );

      alert("Timetable updated successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Error saving timetable:", error);
      alert("Failed to update timetable");
    }
  };

  const handleClose = () => {
    setShow(false);
    // if (onClose) onClose();
  };

  return (
    <div>
      <Modal show={show} onHide={handleClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Time Table</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d-flex flex-column align-items-center">
          <Form.Group>
            <Form.Label className="required">
              If you need to add another subjects into a session, Please{" "}
              <a
                href="/clashcheck"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "red",
                  textDecoration: "underline",
                  cursor: "pointer",
                }}
              >
                check
              </a>{" "}
              subject conflict of the session.
            </Form.Label>
          </Form.Group>
          {timetable.map((day) => (
            <Card key={day.id} className="container mt-4">
              <Card.Body>
                <Card.Title>
                  <Form.Group className="mb-3">
                    <Form.Label className="d-flex align-items-center justify-content-between">
                      <h5>{day.date_name || "Select Date"}</h5>
                      <CloseButton
                        style={{ cursor: "pointer" }}
                        onClick={() => removeDate(day.id)}
                      />
                    </Form.Label>
                    <Form.Control
                      type="date"
                      value={""}
                      // value={
                      //   day.date_name && !isNaN(new Date(day.date_name))
                      //     ? new Date(day.date_name).toISOString().split("T")[0]
                      //     : ""
                      // }
                      onChange={(e) => updateDate(day.id, e.target.value)}
                    />
                  </Form.Group>
                </Card.Title>
                {["morning", "evening"].map((session) => (
                  <Card key={session} className="mb-3">
                    <Card.Body>
                      <Card.Title className="text-capitalize">
                        {session} Session
                      </Card.Title>

                      {Object.entries(day.schedule_data[session] || {}).map(
                        ([level, subjects]) => (
                          <div key={level} className="mb-2">
                            <h5>{level.toUpperCase()}</h5>
                            {subjects.length > 0 ? (
                              subjects.map((subject) => (
                                <Badge
                                  key={subject}
                                  bg="primary"
                                  size="sm"
                                  className="me-2 p-2 mb-2"
                                >
                                  <span
                                    className="d-flex align-items-center justify-content-between"
                                    style={{ gap: "5px" }}
                                  >
                                    <label className="mb-0">{subject}</label>
                                    <CloseButton
                                      style={{ cursor: "pointer" }}
                                      onClick={() =>
                                        removeSubject(
                                          day.id,
                                          session,
                                          level,
                                          subject
                                        )
                                      }
                                    />
                                  </span>
                                </Badge>
                              ))
                            ) : (
                              <p className="text-muted">No subjects</p>
                            )}
                          </div>
                        )
                      )}

                      {/* Add Subject Section */}
                      <Form className="d-flex align-items-center mt-2">
                        <Form.Control
                          type="text"
                          placeholder="Enter Subject"
                          id={`subject-input-${day.id}-${session}`}
                        />
                        <Form.Select
                          id={`level-select-${day.id}-${session}`}
                          className="mx-2"
                        >
                          <option value="">Select Level</option>
                          <option value="level1">Level 1</option>
                          <option value="level2">Level 2</option>
                          <option value="level3">Level 3</option>
                        </Form.Select>
                        <Button
                          variant="success"
                          onClick={() => {
                            const subjectInput = document.getElementById(
                              `subject-input-${day.id}-${session}`
                            );
                            const levelSelect = document.getElementById(
                              `level-select-${day.id}-${session}`
                            );
                            if (subjectInput.value && levelSelect.value) {
                              addSubject(
                                day.id,
                                session,
                                levelSelect.value,
                                subjectInput.value
                              );
                              subjectInput.value = "";
                            }
                          }}
                        >
                          Add
                        </Button>
                      </Form>
                    </Card.Body>
                  </Card>
                ))}
              </Card.Body>
            </Card>
          ))}
          <Button variant="primary" className="mb-3 mt-3" onClick={addNewDay}>
            Add New Day
          </Button>
        </Modal.Body>
        <Modal.Footer>
          <PDFDownloadLink
            document={<TimetableDocument timetable={timetable} />}
            fileName="timetable.pdf"
          >
            {({ loading }) =>
              loading ? "Preparing document..." : "Download PDF"
            }
          </PDFDownloadLink>
          <Button
            variant="success"
            onClick={saveUpdatedTimetable}
            className="ms-3"
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
