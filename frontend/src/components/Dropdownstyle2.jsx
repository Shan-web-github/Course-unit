import React, { useState, useMemo, useRef } from "react";

import { Dropdown, Form } from "react-bootstrap";

export default function Dropdownstyle2({courseList, selectedCourses, onChange}) {
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCourse, setSelectedCourse] = useState("");
  const selectedCoursesRef = useRef("");

  const filteredCourses = courseList.filter(
    (list) => !selectedCourses.includes(list)
  );

  
  const filteredNewCourses = useMemo(() => {
    const courseListNew = filteredCourses.map((course) => course.CO_CODE);
    return courseListNew.filter(
      (option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedCourses.includes(option)
    );
  }, [filteredCourses, searchTerm, selectedCourses]);

  return (
      <div>
        <Dropdown>
          <Dropdown.Toggle variant="outline-dark" id="dropdown-basic">
          {selectedCourse || "Select a Courses"}
          </Dropdown.Toggle>

          <Dropdown.Menu style={{ maxHeight: "200px", overflowY: "auto" }}>
            {/* Search Input */}
            <Form.Control
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              style={{ margin: "0.5rem" }}
            />

            {/* Dropdown Items */}
            {filteredNewCourses.length > 0 ? (
              filteredNewCourses.map((course, index) => (
                <Dropdown.Item
                  key={index}
                  value={course}
                  onClick={() => {
                    setSelectedCourse(course);
                    selectedCoursesRef.current = course;
                    setSearchTerm("");
                    if (onChange) onChange(course);
                  }}
                >
                  {course}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No options found</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
  );
};
