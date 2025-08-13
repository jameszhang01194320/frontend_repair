// import React, { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Container, Card, ListGroup, Alert, Row, Col, Button, Modal } from "react-bootstrap";
// import axios from "axios";
// import { useNavigate, useLocation } from "react-router-dom";
// import { FaPencilAlt, FaTrash } from "react-icons/fa";


// const Appliances = () => {
//   const token = useSelector((state) => state.user.authToken);
//   const propertyId = useSelector((state) => state.property.propertyId); // Accessing propertyId from Redux
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [userId, setUserId] = useState(null);
//   const [applianceList, setApplianceList] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [selectedAppliance, setSelectedAppliance] = useState(null);
//   console.log("Property ID:", propertyId);

//   const handleViewAppliance = (applianceId, applianceModel) => {
//     navigate(`/view-appliance/${applianceId}`);
//     console.log("Appliance ID:", applianceId);
//     console.log("Appliance Model:", applianceModel);
//   };

//   const fetchAppliances = async () => {
//     setLoading(true);
//     if (!propertyId) {
//       setError("Property ID is required to fetch appliances");
//       setLoading(false);
//       return;
//     }
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/properties/${propertyId}`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       console.log("API response: ", response.data.appliances);
//       setApplianceList(response.data.appliances);
//     } catch (error) {
//       console.error("Error fetching appliances: ", error);
//       setError(`Error fetching appliances: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!propertyId) {
//       setError("No property selected. Redirecting...");
//       setTimeout(() => navigate("/properties"), 3000); // Redirect after 3 seconds
//     } else {
//       fetchAppliances();
//     }
//   }, [propertyId]);

//   const handleEdit = (applianceId) => {
//     navigate(`/edit-appliance/${applianceId}`);
//   };

//   const handleDelete = async () => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/appliances/${selectedAppliance.id}/`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       setApplianceList((prevList) =>
//         prevList.filter((appliance) => appliance.id !== selectedAppliance.id)
//       );
//       setShowModal(false);
//     } catch (error) {
//       setError(`Error deleting appliance: ${error.message}`);
//     }
//   };

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <Container className="bg-light">
//       {error && <Alert variant="danger">{error}</Alert>}
//       <h3 className="text-center header-banner">Appliances</h3>
//       <ListGroup>
//         <Row>
//           {applianceList.map((appliance) => (
//             <Col key={appliance.id} className="mb-4">
//               <Card className="shadow-sm">
//                 <Card.Body>
//                   <Row className="d-flex align-items-center">
//                     <Col xs={9}>
//                       <Card.Img
//                         variant="top"
//                         src={appliance.product_image}
//                         alt={appliance.name}
//                         onClick={() => {handleViewAppliance(appliance.id, appliance.model)}}
//                         className="fixed-image-size"
// />
//                     </Col>
//                     <Col xs={12}>
//                       <Card.Title>{appliance.name}</Card.Title>
//                       <Card.Text>
//                         <strong>Model:</strong> {appliance.model}
//                       </Card.Text>
//                       <Card.Text>
//                         <strong>Status:</strong> {appliance.current_status}
//                       </Card.Text>
//                       <Card.Text>
//                         <strong>Purchase Date:</strong> {appliance.purchase_date}
//                       </Card.Text>

//                       {/* icons */}
//                       <div className="d-flex justify-content-between">
//                         <Button variant="link" onClick={() => handleEdit(appliance.id)}>
//                           <FaPencilAlt />
//                         </Button>
//                         <Button
//                           variant="link"
//                           onClick={() => {
//                             setSelectedAppliance(appliance);
//                             setShowModal(true);
//                           }}
//                         >
//                           <FaTrash style={{ color: "red" }} />
//                         </Button>
//                       </div>
//                     </Col>
//                   </Row>
//                 </Card.Body>
//               </Card>
//             </Col>
//           ))}
//         </Row>
//       </ListGroup>
//       <div className="text-center mt-4">
//       <Button className="m-3" style={{ color: "whitesmoke", backgroundColor: "#84b474", border: "none"}} onClick={() => navigate("/newappliance")}>
//           Add New Appliance
//         </Button>
//         <Button className="m-3" style={{ color: "whitesmoke", backgroundColor: "#84b474", border: "none"}} onClick={() => navigate("/addinvestment")}>
//           Add Investment
//         </Button>
//         <Button className="m-3" style={{ color: "whitesmoke", backgroundColor: "#84b474", border: "none"}} onClick={() => navigate("/addrepair")}>
//           Add Repair
//         </Button>
//       </div>
//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Deletion</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to delete this appliance?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDelete}>
//             Confirm Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </Container>
//   );
// };

// export default Appliances;

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Container,
  Card,
  ListGroup,
  Alert,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import axios from "axios";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

const Appliances = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const propertyId = useSelector((state) => state.property.propertyId);
  const token = useSelector((state) => state.user.authToken);
  const [applianceList, setApplianceList] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedAppliance, setSelectedAppliance] = useState(null);
  console.log("Appliance list (outside function)", applianceList);
  console.log("Property ID:", propertyId);

  const handleViewAppliance = (applianceId) => {
    console.log("Image clicked");
    navigate(`/view-appliance/${applianceId}`);
  };

  const fetchAppliances = async () => {
    setLoading(true);
    if (!propertyId) {
      setError("Property ID is required to fetch appliances");
      setLoading(false);
      return;
    }
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/properties/${propertyId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      console.log("API response: ", response.data.appliances);
      setApplianceList(response.data.appliances);
    } catch (error) {
      console.error("Error fetching appliances: ", error);
      setError(`Error fetching appliances: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!propertyId) {
      setError("No property selected. Redirecting...");
      setTimeout(() => navigate("/properties"), 3000); // Redirect after 3 seconds
    } else {
      fetchAppliances();
    }
  }, [propertyId]);

  const handleEdit = (applianceId) => {
    navigate(`/edit-appliance/${applianceId}`);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/appliances/${
          selectedAppliance.id
        }/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setApplianceList(
        applianceList.filter(
          (appliance) => appliance.id !== selectedAppliance.id
        )
      );
      setShowModal(false);
    } catch (error) {
      setError(`Error deleting appliance: ${error.message}`);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Container>
      {error && <Alert variant="danger">{error}</Alert>}
      <h3 className="text-center header-banner">Appliances</h3>
      <ListGroup>
        <Row>
          {applianceList.length === 0 ? (
            <Col>
              <Alert variant="info" className="text-center">
                No appliances found for this property. Click "Add New Appliance"
                to get started.
              </Alert>
            </Col>
          ) : (
            applianceList.map((appliance) => (
              <Col key={appliance.id} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Body>
                    <Row className="d-flex align-items-center">
                      <Col xs={9}>
                        <Card.Img
                          variant="top"
                          src={appliance.product_image}
                          alt={appliance.name}
                          onClick={() => {
                            handleViewAppliance(appliance.id, appliance.model);
                          }}
                          className="fixed-image-size"
                        />
                      </Col>
                      <Col xs={12}>
                        <Card.Title>{appliance.name}</Card.Title>
                        <Card.Text>
                          <strong>Model:</strong> {appliance.model}
                        </Card.Text>
                        <Card.Text>
                          <strong>Appliance ID:</strong> {appliance.id}
                        </Card.Text>
                        <Card.Text>
                          <strong>Status:</strong> {appliance.current_status}
                        </Card.Text>
                        <Card.Text>
                          <strong>Purchase Date:</strong>{" "}
                          {appliance.purchase_date}
                        </Card.Text>

                        {/* icons */}
                        <div className="d-flex justify-content-between">
                          <Button
                            variant="link"
                            onClick={() => handleEdit(appliance.id)}
                          >
                            <FaPencilAlt />
                          </Button>
                          <Button
                            variant="link"
                            onClick={() => {
                              setSelectedAppliance(appliance);
                              setShowModal(true);
                            }}
                          >
                            <FaTrash style={{ color: "red" }} />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </ListGroup>
      <div className="text-center mt-4">
        <Button
          className="m-3"
          variant="primary"
          onClick={() => navigate("/newappliance")}
        >
          Add New Appliance
        </Button>
        <Button
          className="m-3"
          variant="success"
          onClick={() => navigate("/addinvestment")}
        >
          Add Investment
        </Button>
        <Button
          className="m-3"
          variant="warning"
          onClick={() => navigate("/addrepair")}
        >
          Add Repair
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this appliance?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Appliances;
