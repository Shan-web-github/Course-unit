import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";

import { Dropdown, Form } from "react-bootstrap";

function Dropdownstyle({
  courseList,
  concatenatedOptions,
  selectedSubjects,
  semester,
  level,
  onChange,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("Select an option");
  const [inputTime, setInputTime] = useState("");


  const selectedSubjectArray = useMemo(() => {
    return Array.isArray(selectedSubjects)
      ? selectedSubjects.flatMap((obj) =>
          ["morning", "evening"]
            .map((time) => obj[time]?.selectedOption)
            .filter(Boolean)
        )
      : [];
  }, [selectedSubjects]);

  const filteredColumns = courseList.filter(
    (list) => !selectedSubjectArray.includes(list)
  );
  
  const [columns, setColumns] = useState(filteredColumns);


  useEffect(() => {
    const dynamicOptions = async () => {
      try {
        let response;
        if (concatenatedOptions && !selectedSubjects) {
          response = await axios.get(
            `http://localhost:5000/studentdata/notclashes1/${concatenatedOptions}?semester=${semester}&level=${level}`
          );
          // setColumns(response.data.data);
          // console.log(response.data.data);
        } else if (concatenatedOptions && selectedSubjects) {
          // const selectedSubjectArray = selectedSubjects.flatMap((obj) =>
          //   ["morning", "evening"]
          //     .map((time) => obj[time]?.selectedOption)
          //     .filter(Boolean)
          // );
  
          response = await axios.get(
            `http://localhost:5000/studentdata/notclashes2/${concatenatedOptions}?selectedSubjects=${selectedSubjectArray}&semester=${semester}&level=${level}`
          );
          // setColumns(response.data.data);
          // console.log(response.data.data);
        } 
        // else if (!concatenatedOptions && selectedSubjects) {
        //   // const selectedSubjectArray = selectedSubjects.flatMap((obj) =>
        //   //   ["morning", "evening"]
        //   //     .map((time) => obj[time]?.selectedOption)
        //   //     .filter(Boolean)
        //   // );
  
        //   const filteredColumns = courseList.filter(
        //     (list) => !selectedSubjectArray.includes(list)
        //   );
        //   // console.log(filteredColumns);
        //   setColumns(filteredColumns);
        // }

        if (response?.data?.data) {
          setColumns(response.data.data);
        }

      } catch (error) {
        console.error("Error fetching not clash courses data:", error);
      }
    };

    dynamicOptions();

  }, [concatenatedOptions, selectedSubjects, selectedSubjectArray, courseList, level, semester]);

  // const dynamicOptions = async () => {
  //   if (concatenatedOptions && !selectedSubjects) {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/studentdata/notclashes1/${concatenatedOptions}?semester=${semester}&level=${level}`
  //       );
  //       setColumns(response.data.data);
  //       console.log(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching not clash courses data:", error);
  //     }
  //   }
  //   if (concatenatedOptions && selectedSubjects) {
  //     const selectedSubjectArray = selectedSubjects.flatMap((obj) =>
  //       ["morning", "evening"]
  //         .map((time) => obj[time]?.selectedOption)
  //         .filter(Boolean)
  //     );

  //     try {
  //       const response = await axios.get(
  //         `http://localhost:5000/studentdata/notclashes2/${concatenatedOptions}?selectedSubjects=${selectedSubjectArray}&semester=${semester}&level=${level}`
  //       );
  //       setColumns(response.data.data);
  //       console.log(response.data.data);
  //     } catch (error) {
  //       console.error("Error fetching not clash courses data:", error);
  //     }
  //   }
  //   if (!concatenatedOptions && selectedSubjects) {
  //     const selectedSubjectArray = selectedSubjects.flatMap((obj) =>
  //       ["morning", "evening"]
  //         .map((time) => obj[time]?.selectedOption)
  //         .filter(Boolean)
  //     );
  //     const filteredColumns = columns.filter(
  //       (column) => !selectedSubjectArray.includes(column)
  //     );

  //     setColumns(filteredColumns);
  //   }
  // };

  const filteredOptions = useMemo(() => {
    const courseListNew = columns.map((course) => course.CO_CODE);
    return courseListNew.filter(
      (option) =>
        option.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedSubjectArray.includes(option)
    );
  }, [columns, searchTerm, selectedSubjectArray]);

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputTime(value);
    if (onChange) onChange("inputTime", value);
  };

  return (
    <div className="dropdownstyle">
      <div>
        <Dropdown 
          // onClick={dynamicOptions}
          >
          <Dropdown.Toggle variant="primary" id="dropdown-basic">
            {selectedOption}
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
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <Dropdown.Item
                  key={index}
                  onClick={() => {
                    setSelectedOption(option);
                    setSearchTerm("");
                    if (onChange) onChange("selectedOption", option);
                  }}
                >
                  {option}
                </Dropdown.Item>
              ))
            ) : (
              <Dropdown.Item disabled>No options found</Dropdown.Item>
            )}
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div>
        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
          <Form.Control
            type="text"
            value={inputTime}
            onChange={handleInputChange}
            placeholder="Enter Time"
          />
        </Form.Group>
      </div>
    </div>
  );
}

export default Dropdownstyle;
