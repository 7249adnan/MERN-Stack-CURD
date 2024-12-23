import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Col, Row } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify'; // Corrected import
import 'react-toastify/dist/ReactToastify.css';
import AddCourse from './addcourse';
import UpdateCourse from './updatecourse';

function CourseTable() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCourse, setSelectedCourse] = useState({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  // Fetch courses from API
  useEffect(() => {
    LoadData();
  }, []);

  const LoadData = () => {
    axios
      .get('http://localhost:5000/courses') // Adjust the API URL as needed
      .then((response) => {
        setCourses(response.data);
        setFilteredCourses(response.data); // Initialize filteredCourses
      })
      .catch((error) => {
        console.error('There was an error fetching the courses!', error);
      });
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Filter courses by name
    const filtered = courses.filter((course) =>
      course.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  // Sorting the courses array based on srNo
  const sortedCourses = [...filteredCourses].sort((a, b) => a.srno - b.srno);

  // Function to handle the Edit action
  const handleEdit = (data) => {
    setSelectedCourse(data);
    setShowUpdateModal(true);
  };

  // Function to handle the Delete action with confirmation
  const handleDelete = (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this course?');
    if (confirmDelete) {
      axios
        .delete(`http://localhost:5000/course/${id}`)
        .then(() => {
          setCourses(courses.filter((course) => course.id !== id));
          setFilteredCourses(filteredCourses.filter((course) => course.id !== id));
          toast.success('Course deleted successfully!');
        })
        .catch((error) => {
          console.error('There was an error deleting the course!', error);
          toast.error('Failed to delete course!');
        });
    }
  };

  return (
    <div>
      <ToastContainer position="top-center" className="p-3" autoClose={2000} />

      <UpdateCourse
        LoadTableData={LoadData}
        hideModal={() => setShowUpdateModal(false)}
        showModal={showUpdateModal}
        data={selectedCourse}
      />

      <div style={{ textAlign: 'end', paddingRight: '10%' }}>
        <AddCourse LoadTableData={LoadData} />
      </div>

      <br />

   {/* Search Box and Add Course Button */}
<div style={{ width: '50%', margin: '0 auto', textAlign: 'center' }}>
  <Form.Group as={Row} className="align-items-center">
    {/* Search Input */}
    <Col md={7}>
      <Form.Control
        type="text"
        placeholder=". . . Search by Course Name"
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </Col>
    {/* Add Course Button */}
    <Col md={3}>
      <Button style={{marginLeft:"-70%"}} variant="secondary" onClick={() => {handleSearchChange();}}>
       Search
      </Button>
    </Col>
  </Form.Group>
</div>


      <br />

      <Table striped bordered hover responsive style={{ width: '80%', margin: '0 auto' }}>
        <thead>
          <tr>
            <th>Sr No</th>
            <th>Course Name</th>
            <th>Course Description</th>
            <th>Publish</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedCourses.map((course) => (
            <tr key={course.id}>
              <td>{course.srno}</td>
              <td>{course.name}</td>
              <td>{course.description}</td>
              <td>{course.isActive ? 'Yes' : 'No'}</td>
              <td>
                <Button
                  variant="success"
                  size="sm"
                  onClick={() => handleEdit(course)}
                  className="mr-3"
                >
                  Edit
                </Button>{' '}
                &nbsp;
                <Button variant="danger" size="sm" onClick={() => handleDelete(course.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

export default CourseTable;
