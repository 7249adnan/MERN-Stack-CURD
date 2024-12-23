import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { toast } from 'react-toastify';  // Import toast directly
import axios from 'axios';

function UpdateCourse({ LoadTableData, data, hideModal, showModal }) {
  const [formData, setFormData] = useState(data);  // Initialize form data with passed 'data'
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setFormData(data);  // Set formData whenever 'data' changes
  }, [data]);

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
    if (!formData.srno) newErrors.srno = 'Serial Number is required.';
    if (!formData.name) newErrors.name = 'Course Name is required.';
    if (!formData.description) newErrors.description = 'Course Description is required.';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.put(`http://localhost:5000/course/${formData.id}`, {
        srno: formData.srno,
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive,
      });

      LoadTableData();  // Reload the table data after successful update
      toast.success('Course updated successfully!');  // Display success toast
      hideModal();  // Close the modal after success

    } catch (error) {
      toast.error('Failed to update course. Please try again.');  // Display error toast
    }
  };

  return (
    <>
      <Modal show={showModal} onHide={hideModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Course</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            {/* SrNo and isActive on the Same Row */}
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="formsrno">
                  <Form.Label>Sr No :</Form.Label>
                  <Form.Control
                    type="number"
                    name="srno"
                    placeholder="Enter Serial Number"
                    value={formData.srno}
                    onChange={handleChange}
                    isInvalid={!!errors.srno}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.srno}
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
            <Form.Group className="mb-3" controlId="formname">
              <Form.Label>Course Name :</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="Enter Course Name"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            {/* Course Description Field */}
            <Form.Group className="mb-3" controlId="formdescription">
              <Form.Label>Course Description :</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                rows={3}
                placeholder="Enter Course Description"
                value={formData.description}
                onChange={handleChange}
                isInvalid={!!errors.description}
              />
              <Form.Control.Feedback type="invalid">
                {errors.description}
              </Form.Control.Feedback>
            </Form.Group>

          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="secondary" onClick={hideModal}>Cancel</Button>
          <Button variant="primary" type="submit" onClick={handleSubmit}>Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateCourse;
