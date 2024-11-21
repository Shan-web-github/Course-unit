import React, { useState } from "react";

import Navbar from "../components/Navbar";

//bootstrapt lib
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

export default function CreateTimeTable() {
  const [level, setLevel] = useState();
  const [clashes, setClashes] = useState();

  const selectLevel = (event) => {
    setLevel(event.target.value);
    // console.log(level);
  };

  const selectClashesSet = (event) => {
    setClashes(event.target.value);
  };

  const submit = async (event) => {
    event.preventDefault();
    
    // try {
    //   await axios
    //     .post("http://localhost:5000/studentdata/upload", formData, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((res) => {
    //       alert(res.status);
    //       // navigate("/home");
    //     })
    //     .catch((error) => {
    //       alert(error);
    //     });

    //   alert("Successfully uploaded");
    // } catch (error) {
    //   console.error("Upload error:", error);
    //   alert("An error occurred while uploading files.");
    // }
  };

  return (
    <div>
      <Navbar path="/createtimetable" />
      <div className="uploadform">
        <Form onSubmit={submit}>
        <label>LEVEL</label>
          <Form.Select onChange={selectLevel}>
            <option>1000</option>
            <option>2000</option>
            <option>3000</option>
          </Form.Select>
          <br />
          <label>Clashes Sets</label>
          <Form.Select onChange={selectClashesSet}>
            <option>2 sets</option>
            <option>3 sets</option>
            <option>4 sets</option>
          </Form.Select>
          <div className="button">
            <Button variant="dark" type="submit">
              Submit
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
