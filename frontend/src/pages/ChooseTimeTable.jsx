import React,{ useState} from 'react'
import Navbar from '../components/Navbar'

import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ChooseTimeTable() {

  const [isSplit, setIsSplit] = useState(false);

  const content = (
    <div>
      <h1>Main Content</h1>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.
      </p>
      <p>More content here...</p>
    </div>
  );

  return (
    <div>
      <Navbar path="/choosetimetable"/>
      <Container fluid className="mt-4">
      <Button
        onClick={() => setIsSplit(!isSplit)}
        className="mb-3"
        variant={isSplit ? 'danger' : 'primary'}
      >
        {isSplit ? 'Back to Single View' : 'Split View'}
      </Button>

      <Row className="split-page" style={{ height: '80vh' }}>
        {isSplit ? (
          <>
            <Col
              md={6}
              className="left-pane"
              style={{
                overflowY: 'auto',
                borderRight: '1px solid #ddd',
                padding: '1rem',
              }}
            >
              {content}
            </Col>
            <Col
              md={6}
              className="right-pane"
              style={{
                overflowY: 'auto',
                padding: '1rem',
              }}
            >
              <h1>Right Side Content</h1>
              <p>Add any content here...</p>
            </Col>
          </>
        ) : (
          <Col>{content}</Col>
        )}
      </Row>
    </Container>
    </div>
  )
}
