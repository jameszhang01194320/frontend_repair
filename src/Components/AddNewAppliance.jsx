import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Form, Button, Alert, Container, Modal, Row, Col } from "react-bootstrap";

const NewAppliance = () => {
  const propertyId = useSelector((state) => state.property.propertyId);
  const userID = useSelector((state) => state.user.userId);
  const [modelNumber, setModelNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [applianceData, setApplianceData] = useState("");
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const token = useSelector((state) => state.user.authToken);
  const navigate = useNavigate();
  console.log("Token:", token);
  console.log("Property ID:", propertyId);
  console.log("User ID:", userID);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const errors = validateForm();
    setErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);
      setError(null);

      const applianceData = {
        model: modelNumber,
        user: userID,
        property_id: propertyId,
        purchase_date: new Date(purchaseDate).toISOString().split("T")[0],
      };
      console.log("Appliance Data: ", applianceData);

      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        navigate("/login");
        return;
      }
    
      try {
        const response = await axios.post(
          "${import.meta.env.VITE_BACKEND_URL}/api/decode-appliance/",
          applianceData,
          {
            headers: {
              "Content-type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        console.log("Appliance data:", applianceData)
        setApplianceData(response.data.appliances);
        setShowSuccessModal(true);
      } catch (error) {
        console.error("Error submitting form:", error);
        setError(error.toString());
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  useEffect(() => {
    console.log("Appliance Data: ", applianceData);
  }, [applianceData]);

  const validateForm = () => {
    const errors = {};
    if (!modelNumber) errors.modelNumber = "Must enter model number";
    if (!purchaseDate || isNaN(new Date(purchaseDate))) errors.purchaseDate = "Must enter date of purchase";
    return errors;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }
    
  return (
    <Container>
      {isLoading && <Alert variant="info">Submitting Appliance Data...</Alert>}
      {error && (
        <Alert variant="danger">Error Submitting Appliance: {error}</Alert>
      )}
    <Row>
        <Col md={6}>
        <Form onSubmit={handleSubmit}>
            <h2 className="m-3">Enter New Appliance Details</h2>

            <Form.Group controlId="formGroupModelNumber">
            <Form.Label>Enter Model Number: </Form.Label>
            <Form.Control
                type="text"
                name="modelNumber"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
            />
            {errors.modelNumber && (
                <div style={{ color: "red" }}>{errors.modelNumber}</div>
            )}
            </Form.Group>

            <Form.Group controlId="formGroupPurchaseDate">
            <Form.Label>Date of Purchase</Form.Label>
            <Form.Control
                type="date"
                name="purchaseDate"
                value={purchaseDate}
                onChange={(e) => setPurchaseDate(e.target.value)}
            />
            {errors.purchaseDate && (
                <div style={{ color: "red" }}>{errors.purchaseDate}</div>
            )}
            </Form.Group>

            <Button className="mt-3" style={{ color: "whitesmoke", backgroundColor: "#84b474", border: "none"}} type="submit">
            Submit
            </Button>
        </Form>

        <Modal show={showSuccessModal}>
            <Modal.Header closeButton>
            <Modal.Title>Your New Appliance was Added Succesfully!</Modal.Title>
            </Modal.Header>
            <Modal.Body>Thank you!!</Modal.Body>
            <Modal.Footer>
            <Button
            style={{ color: "whitesmoke", backgroundColor: "#84b474", border: "none"}}
                onClick={() => {
                setShowSuccessModal(false);
                navigate("/properties");
                }}
            >
                Close
            </Button>
            </Modal.Footer>
        </Modal>
        </Col>
    </Row>
    </Container>
  );
}
export default NewAppliance;