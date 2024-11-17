import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import React,{useState} from 'react';

function SignIn() {

  const[check,setCheck] = useState(false)

    const submit = (event)=>{
        event.preventDefault();
        window.location.href = "/sheetupload";
    }

    const click = (event) => {
      setCheck(!check);
    }

  return (
    <div className='uploadform'>
      <Form>
      <Form.Group className="mb-3" controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" />
      </Form.Group>

      <Form.Group className="mb-3" controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type={check? ("text"):("password")} placeholder="Password" />
      </Form.Group>
      <Form.Group className="mb-3" controlId="formBasicCheckbox">
        <Form.Check type="checkbox" label="Show password" onChange={click} />
      </Form.Group>
      <Button variant="dark" type="submit" onClick={submit}>
        Submit
      </Button>
    </Form>
    </div>
    
  );
}

export default SignIn;