import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';  // Import toast directly
import axios from 'axios';

function AddCourse({ LoadTableData }) {
  const [show, setShow] = useState(false);
  const [formData, setFormData] = useState({
    srNo: '',
    courseName: '',
    courseDescription: '',
    isActive: false,
  });

  const [errors, setErrors] = useState({});

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Clear field-specific error on user input
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: '',
    }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.srNo) newErrors.srNo = 'Serial Number is required.';
    if (!formData.courseName) newErrors.courseName = 'Course Name is required.';
    if (!formData.courseDescription) newErrors.courseDescription = 'Course Description is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log(formData);

    // Send data to the API
    try {
      const response = await axios.post(' http://localhost:5000/course', {
        srno: formData.srNo,
        name: formData.courseName,
        description: formData.courseDescription,
        isActive: formData.isActive,
      });

      LoadTableData();
      // Show success toast message
      toast.success('Course added successfully!');  // Display success toast
      handleClose(); // Close the modal

      // Reset the form
      setFormData({
        srNo: '',
        courseName: '',
        courseDescription: '',
        isActive: false,
      });
    } catch (error) {
      // Show error toast message if API call fails
      toast.error('Failed to add course. Please try again.');  // Display error toast
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Course
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>

            {/* SrNo and isActive on the Same Row */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formSrNo">
                  <Form.Label>Sr No :</Form.Label>
                  <Form.Control
                    type="number"
                    name="srNo"
                    placeholder="Enter Serial Number"
                    value={formData.srNo}
                    onChange={handleChange}
                    isInvalid={!!errors.srNo}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.srNo}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6} className="d-flex align-items-center mt-4">
                <Form.Group controlId="formIsActive">
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    label="Publish"
                    checked={formData.isActive}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Course Name Field */}
            <Form.Group className="mb-3" controlId="formCourseName">
              <Form.Label>Course Name :</Form.Label>
              <Form.Control
                type="text"
                name="courseName"
                placeholder="Enter Course Name"
                value={formData.courseName}
                onChange={handleChange}
                isInvalid={!!errors.courseName}
              />
              <Form.Control.Feedback type="invalid">
                {errors.courseName}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Course Description Field */}
            <Form.Group className="mb-3" controlId="formCourseDescription">
              <Form.Label>Course Description :</Form.Label>
              <Form.Control
                as="textarea"
                name="courseDescription"
                rows={3}
                placeholder="Enter Course Description"
                value={formData.courseDescription}
                onChange={handleChange}
                isInvalid={!!errors.courseDescription}
              />
              <Form.Control.Feedback type="invalid">
                {errors.courseDescription}
              </Form.Control.Feedback>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          {/* Save and Cancel Buttons */}
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddCourse;
