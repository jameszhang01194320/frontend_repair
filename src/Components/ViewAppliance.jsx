// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import {
//   Accordion,
//   Card,
//   Container,
//   Row,
//   Col,
//   Button,
//   Modal,
//   Form,
// } from "react-bootstrap";
// import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
// import axios from "axios";
// import { useSelector } from "react-redux";

// const ViewAppliance = () => {
//   const token = useSelector((state) => state.user.authToken);
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [applianceDetails, setApplianceDetails] = useState(null);
//   const [appliance, setAppliance] = useState(null);
//   const [repairs, setRepairs] = useState([]);
//   const [investments, setInvestments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showAddRepairModal, setShowAddRepairModal] = useState(false);
//   const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
//   const [newRepair, setNewRepair] = useState({
//     repair_date: "",
//     repaired_description: "",
//     cost: "",
//     repaired_by: "",
//   });
//   const [newInvestment, setNewInvestment] = useState({
//     investment_date: "",
//     investment_description: "",
//     cost: "",
//     investment_type: "",
//   });

//   const fetchApplianceDetailsFromModel = async (model) => {
//     try {
//       const response = await axios.get(
//         `${import.meta.env.VITE_BACKEND_URL}/api/appliance-details-from-api/`,
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       const matchingAppliance = response.data.find(
//         (item) => item.model === model
//       );
//       console.log("Matching appliance:", matchingAppliance);
//       if (matchingAppliance) {
//         const detailedResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/appliance-details-from-api/${matchingAppliance.id}/`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         setApplianceDetails(detailedResponse.data);
//       } else {
//         console.error("No matching appliance found for model:", model);
//       }
//     } catch (error) {
//       console.error("Error fetching appliance details:", error);
//     }
//   };

//   useEffect(() => {
//     const fetchApplianceDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/appliances/${id}/`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         setAppliance(response.data);

//         await fetchApplianceDetailsFromModel(response.data.model);

//         const repairsResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/repairs/`,
//           {
//             params: { appliance: id },
//             headers: { Authorization: `Token ${token}` },
//           }
//         );
//         setRepairs(repairsResponse.data);

//         const investmentsResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/investments/`,
//           {
//             params: { appliance: id },
//             headers: { Authorization: `Token ${token}` },
//           }
//         );
//         setInvestments(investmentsResponse.data);
//       } catch (error) {
//         console.error("Error fetching appliance details:", error);
//         navigate("/");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchApplianceDetails();
//     }
//   }, [id, token, navigate]);

//   useEffect(() => {
//     if (repairs.length > 0 || investments.length > 0) {
//       const totalRepairCost = repairs.reduce(
//         (sum, repair) => sum + parseFloat(repair.cost || 0),
//         0
//       );
//       const totalInvestmentCost = investments.reduce(
//         (sum, investment) => sum + parseFloat(investment.cost || 0),
//         0
//       );

//       setAppliance((prev) => ({
//         ...prev,
//         total_repair_cost: totalRepairCost.toFixed(2),
//         total_investment_cost: totalInvestmentCost.toFixed(2),
//         repairs_exceed_cost: totalRepairCost > totalInvestmentCost,
//       }));
//     }
//   }, [repairs, investments]);

//   const handleAddRepair = async () => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/repairs/`,
//         {
//           ...newRepair,
//           appliance: id,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       setRepairs((prev) => [...prev, response.data]);
//       setShowAddRepairModal(false);
//       setNewRepair({
//         repair_date: "",
//         repaired_description: "",
//         cost: "",
//         repaired_by: "",
//       });
//     } catch (error) {
//       console.error("Error adding repair:", error);
//     }
//   };

//   const handleAddInvestment = async () => {
//     try {
//       const response = await axios.post(
//         `${import.meta.env.VITE_BACKEND_URL}/api/investments/`,
//         {
//           ...newInvestment,
//           appliance: id,
//         },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       setInvestments((prev) => [...prev, response.data]);
//       setShowAddInvestmentModal(false);
//       setNewInvestment({
//         investment_date: "",
//         investment_description: "",
//         cost: "",
//         investment_type: "",
//       }); 
//       console.log("Investment added:", response.data);
//     } catch (error) {
//       console.error("Error adding investment:", error);
//     }
//   };

//   const handleDeleteRepair = async (repairId) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/repairs/${repairId}/`,
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       setRepairs((prev) => prev.filter((repair) => repair.id !== repairId));
//     } catch (error) {
//       console.error("Error deleting repair:", error);
//     }
//   };

//   const handleDeleteInvestment = async (investmentId) => {
//     try {
//       await axios.delete(
//         `${import.meta.env.VITE_BACKEND_URL}/api/investments/${investmentId}/`,
//         {
//           headers: {
//             Authorization: `Token ${token}`,
//           },
//         }
//       );
//       setInvestments((prev) =>
//         prev.filter((investment) => investment.id !== investmentId)
//       );
//     } catch (error) {
//       console.error("Error deleting investment:", error);
//     }
//   };

//   if (loading) {
//     return <div>Loading appliance data...</div>;
//   }

//   if (!appliance) {
//     return <div>No appliance data available.</div>;
//   }

//   return (
//     <Container>
//       {/* Appliance Details */}
//       <Row className="align-items-center mt-4">
//         <Col md={4}>
//           <Card.Img
//             variant="top"
//             src={appliance.product_image || "https://via.placeholder.com/400"}
//             alt="Appliance"
//             style={{ width: "100%", height: "auto", maxWidth: "400px" }}
//           />
//         </Col>
//         <Col md={8}>
//           <Card style={{ maxWidth: "600px", margin: "auto" }}>
//             <Card.Body>
//               {/* made changes to date fields */}
//               <Card.Title>Appliance Details</Card.Title>
//               <p>
//                 <strong>Name:</strong> {appliance.name || "N/A"}
//               </p>
//               <p>
//                 <strong>Brand:</strong> {appliance.brand || "N/A"}
//               </p>
//               <p>
//                 <strong>Model:</strong> {appliance.model || "N/A"}
//               </p>
//               <p>
//                 <strong>Product Doc 1:</strong>{" "}
//                 {applianceDetails.product_doc_1 ? (
//                   <a href={applianceDetails.product_doc_1} target="_blank">
//                     View Doc 1
//                   </a>
//                 ) : (
//                   "N/A"
//                 )}
//               </p>
//               <p>
//                 <strong>Product Doc 2:</strong>{" "}
//                 {applianceDetails.product_doc_2 ? (
//                   <a href={applianceDetails.product_doc_2} target="_blank">
//                     View Doc 2
//                   </a>
//                 ) : (
//                   "N/A"
//                 )}
//               </p>
//               <p>
//                 <strong>MSRP:</strong> ${applianceDetails.msrp}
//               </p>
//               <p>
//                 <strong>Lowest Listed Price:</strong> $
//                 {applianceDetails.lowest_listed_price}
//               </p>
//               <p>
//                 <strong>Home Depot Price:</strong> $
//                 {applianceDetails.home_depot_price}
//               </p>
//               <p>
//                 <strong>Purchase Date:</strong>{" "}
//                 {appliance.purchase_date
//                   ? new Date(appliance.purchase_date).toLocaleDateString(
//                       "en-US",
//                       { month: "2-digit", day: "2-digit", year: "numeric" }
//                     )
//                   : "N/A"}
//               </p>
//               <p>
//                 <strong>Expected End of Life:</strong>{" "}
//                 {appliance.exp_end_of_life
//                   ? new Date(appliance.exp_end_of_life).toLocaleDateString(
//                       "en-US",
//                       { month: "2-digit", day: "2-digit", year: "numeric" }
//                     )
//                   : "N/A"}
//               </p>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>
//       {/* Summary View */}
//       <Row className="mt-4">
//         <Col md={12}>
//           <Accordion defaultActiveKey="0">
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>Summary View</Accordion.Header>
//               <Accordion.Body>
//                 <p>
//                   <strong>Total Repair Costs:</strong> $
//                   {appliance?.total_repair_cost || "0.00"}
//                 </p>
//                 <p>
//                   <strong>Total Investments:</strong> $
//                   {appliance?.total_investment_cost || "0.00"}
//                 </p>
//                 <p>
//                   <strong>Have Repairs Exceeded Cost?:</strong>{" "}
//                   {appliance?.repairs_exceed_cost ? "Yes" : "No"}
//                 </p>
//                 <p>
//                   <strong>Typical Lifespan:</strong>{" "}
//                   {appliance?.typical_lifespan_years || "N/A"} years
//                 </p>
//               </Accordion.Body>
//             </Accordion.Item>
//           </Accordion>
//         </Col>
//       </Row>

//       <Row className="mt-4">
//         <Col md={6}>
//           <Accordion defaultActiveKey="0">
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>Repairs</Accordion.Header>
//               <Accordion.Body>
//                 <Button
//                   variant="success"
//                   className="mb-3"
//                   onClick={() => setShowAddRepairModal(true)}
//                 >
//                   <FaPlus /> Add Repair
//                 </Button>
//                 {repairs.length > 0 ? (
//                   repairs.map((repair) => (
//                     <div
//                       key={repair.id}
//                       className="d-flex justify-content-between align-items-center mb-2"
//                     >
//                       <div>
//                         <p>
//                           <strong>Repair Date:</strong>{" "}
//                           {new Date(repair.repair_date).toLocaleDateString()}
//                         </p>
//                         <p>
//                           <strong>Description:</strong>{" "}
//                           {repair.repaired_description}
//                         </p>
//                         <p>
//                           <strong>Cost:</strong> ${repair.cost.toFixed(2)}
//                         </p>
//                       </div>
//                       <div>
//                         <Button
//                           variant="link"
//                           onClick={() => navigate(`/edit-repair/${repair.id}`)}
//                         >
//                           <FaPencilAlt />
//                         </Button>
//                         <Button
//                           variant="link"
//                           onClick={() => handleDeleteRepair(repair.id)}
//                         >
//                           <FaTrash style={{ color: "red" }} />
//                         </Button>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No repairs recorded.</p>
//                 )}
//               </Accordion.Body>
//             </Accordion.Item>
//           </Accordion>
//         </Col>
//         <Col md={6}>
//           <Accordion defaultActiveKey="0">
//             <Accordion.Item eventKey="0">
//               <Accordion.Header>Investments</Accordion.Header>
//               <Accordion.Body>
//                 <Button
//                   variant="success"
//                   className="mb-3"
//                   onClick={() => setShowAddInvestmentModal(true)}
//                 >
//                   <FaPlus /> Add Investment
//                 </Button>
//                 {investments.length > 0 ? (
//                   investments.map((investment) => (
//                     <div
//                       key={investment.id}
//                       className="d-flex justify-content-between align-items-center mb-2"
//                     >
//                       <div>
//                         <p>
//                           <strong>Investment Date:</strong>{" "}
//                           {new Date(
//                             investment.investment_date
//                           ).toLocaleDateString()}
//                         </p>
//                         <p>
//                           <strong>Description:</strong>{" "}
//                           {investment.investment_description}
//                         </p>
//                         <p>
//                           <strong>Cost:</strong> ${investment.cost.toFixed(2)}
//                         </p>
//                       </div>
//                       <div>
//                         <Button
//                           variant="link"
//                           onClick={() =>
//                             navigate(`/edit-investment/${investment.id}`)
//                           }
//                         >
//                           <FaPencilAlt />
//                         </Button>
//                         <Button
//                           variant="link"
//                           onClick={() => handleDeleteInvestment(investment.id)}
//                         >
//                           <FaTrash style={{ color: "red" }} />
//                         </Button>
//                       </div>
//                     </div>
//                   ))
//                 ) : (
//                   <p>No investments recorded.</p>
//                 )}
//               </Accordion.Body>
//             </Accordion.Item>
//           </Accordion>
//         </Col>
//       </Row>

//       {/* Add Repair Modal */}
//       <Modal
//         show={showAddRepairModal}
//         onHide={() => setShowAddRepairModal(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Add Repair</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Repair Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={newRepair.repair_date}
//                 onChange={(e) =>
//                   setNewRepair({ ...newRepair, repair_date: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newRepair.repaired_description}
//                 onChange={(e) =>
//                   setNewRepair({
//                     ...newRepair,
//                     repaired_description: e.target.value,
//                   })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Cost</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={newRepair.cost}
//                 onChange={(e) =>
//                   setNewRepair({ ...newRepair, cost: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Repaired By</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newRepair.repaired_by}
//                 onChange={(e) =>
//                   setNewRepair({ ...newRepair, repaired_by: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Button variant="success" onClick={handleAddRepair}>
//               Add Repair
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>

//       {/* Add Investment Modal */}
//       <Modal
//         show={showAddInvestmentModal}
//         onHide={() => setShowAddInvestmentModal(false)}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Add Investment</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group className="mb-3">
//               <Form.Label>Investment Date</Form.Label>
//               <Form.Control
//                 type="date"
//                 value={newInvestment.investment_date}
//                 onChange={(e) =>
//                   setNewInvestment({
//                     ...newInvestment,
//                     investment_date: e.target.value,
//                   })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Description</Form.Label>
//               <Form.Control
//                 type="text"
//                 value={newInvestment.investment_description}
//                 onChange={(e) =>
//                   setNewInvestment({
//                     ...newInvestment,
//                     investment_description: e.target.value,
//                   })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Cost</Form.Label>
//               <Form.Control
//                 type="number"
//                 value={newInvestment.cost}
//                 onChange={(e) =>
//                   setNewInvestment({ ...newInvestment, cost: e.target.value })
//                 }
//               />
//             </Form.Group>
//             <Form.Group className="mb-3">
//               <Form.Label>Type</Form.Label>
//               <Form.Select
//                 value={newInvestment.investment_type}
//                 onChange={(e) =>
//                   setNewInvestment({
//                     ...newInvestment,
//                     investment_type: e.target.value,
//                   })
//                 }
//               >
//                 <option value="maintenance">Maintenance</option>
//                 <option value="enhancement">Enhancement</option>
//               </Form.Select>
//             </Form.Group>
//             <Button variant="success" onClick={handleAddInvestment}>
//               Add Investment
//             </Button>
//           </Form>
//         </Modal.Body>
//       </Modal>
//     </Container>
//   );
// };

// export default ViewAppliance;






import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Accordion,
  Card,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
} from "react-bootstrap";
import { FaPencilAlt, FaTrash, FaPlus } from "react-icons/fa";
import axios from "axios";
import { useSelector } from "react-redux";

const ViewAppliance = () => {
  const token = useSelector((state) => state.user.authToken);
  const { id } = useParams();
  const navigate = useNavigate();
  const [applianceDetails, setApplianceDetails] = useState(null);
  const [appliance, setAppliance] = useState(null);
  const [repairs, setRepairs] = useState([]);
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddRepairModal, setShowAddRepairModal] = useState(false);
  const [showAddInvestmentModal, setShowAddInvestmentModal] = useState(false);
  const [newRepair, setNewRepair] = useState({
    repair_date: "",
    repaired_description: "",
    cost: "",
    repaired_by: "",
  });
  const [newInvestment, setNewInvestment] = useState({
    investment_date: "",
    investment_description: "",
    cost: "",
    investment_type: "",
  });

  const fetchApplianceDetailsFromModel = async (model) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/appliance-details-from-api/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      const matchingAppliance = response.data.find(
        (item) => item.model === model
      );
      console.log("Matching appliance:", matchingAppliance);
      if (matchingAppliance) {
        const detailedResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/appliance-details-from-api/${matchingAppliance.id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        setApplianceDetails(detailedResponse.data);
      } else {
        console.error("No matching appliance found for model:", model);
      }
    } catch (error) {
      console.error("Error fetching appliance details:", error);
    }
  };

//   useEffect(() => {
//     const fetchApplianceDetails = async () => {
//       try {
//         const response = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/appliances/${id}/`,
//           {
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Token ${token}`,
//             },
//           }
//         );
//         setAppliance(response.data);

//         await fetchApplianceDetailsFromModel(response.data.model);

//         const repairsResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/repairs/`,
//           {
//             params: { appliance: id },
//             headers: { Authorization: `Token ${token}` },
//           }
//         );
//         setRepairs(repairsResponse.data);

//         const investmentsResponse = await axios.get(
//           `${import.meta.env.VITE_BACKEND_URL}/api/investments/`,
//           {
//             params: { appliance: id },
//             headers: { Authorization: `Token ${token}` },
//           }
//         );
//         setInvestments(investmentsResponse.data);
//       } catch (error) {
//         console.error("Error fetching appliance details:", error);
//         navigate("/");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchApplianceDetails();
//     }
//   }, [id, token, navigate]);

useEffect(() => {
    const fetchApplianceDetails = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/appliances/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Token ${token}`,
            },
          }
        );
        setAppliance(response.data);
  
        // 原代码：调用 fetchApplianceDetailsFromModel
        // await fetchApplianceDetailsFromModel(response.data.model);
  
        // 修改后代码：分离模型数据处理
        if (response.data.model) {
          try {
            const applianceDetailsResponse = await axios.get(
              `-back-end.onrender.com/api/appliance-details-from-api/`,
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Token ${token}`,
                },
              }
            );
            const matchingAppliance = applianceDetailsResponse.data.find(
              (item) => item.model === response.data.model
            );
            if (matchingAppliance) {
              const detailedResponse = await axios.get(
                `${import.meta.env.VITE_BACKEND_URL}/api/appliance-details-from-api/${matchingAppliance.id}/`,
                {
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Token ${token}`,
                  },
                }
              );
              setApplianceDetails(detailedResponse.data);
            } else {
              console.error("No matching appliance found for model:", response.data.model);
            }
          } catch (error) {
            console.error("Error fetching appliance details from model:", error);
          }
        }
  
        //  repairs 
        // const repairsResponse = await axios.get(
        //   `${import.meta.env.VITE_BACKEND_URL}/api/repairs/`,
        //   {
        //     params: { appliance: id },
        //     headers: { Authorization: `Token ${token}` },
        //   }
        // );
        // setRepairs(repairsResponse.data);
  
        //  repairs 
        const repairsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/repairs/`,
          {
            params: { appliance: id },
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("Repairs for appliance ID:", id, repairsResponse.data);
        setRepairs(repairsResponse.data);
  
        //  investments 
        // const investmentsResponse = await axios.get(
        //   `${import.meta.env.VITE_BACKEND_URL}/api/investments/`,
        //   {
        //     params: { appliance: id },
        //     headers: { Authorization: `Token ${token}` },
        //   }
        // );
        // setInvestments(investmentsResponse.data);
  
        // update： investments 
        const investmentsResponse = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/investments/`,
          {
            params: { appliance: id },
            headers: { Authorization: `Token ${token}` },
          }
        );
        console.log("Investments for appliance ID:", id, investmentsResponse.data);
        setInvestments(investmentsResponse.data);
      } catch (error) {
        console.error("Error fetching appliance details:", error);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
  
    if (token) {
      fetchApplianceDetails();
    }
  }, [id, token]); // delete navigate 
  

  useEffect(() => {
    if (repairs.length > 0 || investments.length > 0) {
      const totalRepairCost = repairs.reduce(
        (sum, repair) => sum + parseFloat(repair.cost || 0),
        0
      );
      const totalInvestmentCost = investments.reduce(
        (sum, investment) => sum + parseFloat(investment.cost || 0),
        0
      );

      setAppliance((prev) => ({
        ...prev,
        total_repair_cost: totalRepairCost.toFixed(2),
        total_investment_cost: totalInvestmentCost.toFixed(2),
        repairs_exceed_cost: totalRepairCost > totalInvestmentCost,
      }));
    }
  }, [repairs, investments]);

  const handleAddRepair = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/repairs/`,
        {
          ...newRepair,
          appliance: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setRepairs((prev) => [...prev, response.data]);
      setShowAddRepairModal(false);
      setNewRepair({
        repair_date: "",
        repaired_description: "",
        cost: "",
        repaired_by: "",
      });
    } catch (error) {
      console.error("Error adding repair:", error);
    }
  };

  const handleAddInvestment = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/investments/`,
        {
          ...newInvestment,
          appliance: id,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${token}`,
          },
        }
      );
      setInvestments((prev) => [...prev, response.data]);
      setShowAddInvestmentModal(false);
      setNewInvestment({
        investment_date: "",
        investment_description: "",
        cost: "",
        investment_type: "",
      }); 
      console.log("Investment added:", response.data);
    } catch (error) {
      console.error("Error adding investment:", error);
    }
  };

  const handleDeleteRepair = async (repairId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/repairs/${repairId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setRepairs((prev) => prev.filter((repair) => repair.id !== repairId));
    } catch (error) {
      console.error("Error deleting repair:", error);
    }
  };

  const handleDeleteInvestment = async (investmentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/investments/${investmentId}/`,
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );
      setInvestments((prev) =>
        prev.filter((investment) => investment.id !== investmentId)
      );
    } catch (error) {
      console.error("Error deleting investment:", error);
    }
  };

  if (loading) {
    return <div>Loading appliance data...</div>;
  }

  if (!appliance) {
    return <div>No appliance data available.</div>;
  }

  return (
    <Container>
      {/* Appliance Details */}
      <Row className="align-items-center mt-4">
        <Col md={4}>
          <Card.Img
            variant="top"
            src={appliance.product_image || "https://via.placeholder.com/400"}
            alt="Appliance"
            style={{ width: "100%", height: "auto", maxWidth: "400px" }}
          />
        </Col>
        <Col md={8}>
          <Card style={{ maxWidth: "600px", margin: "auto" }}>
            <Card.Body>
              {/* made changes to date fields */}
              <Card.Title>Appliance Details</Card.Title>
              <p>
                <strong>Name:</strong> {appliance.name || "N/A"}
              </p>
              <p>
                <strong>Brand:</strong> {appliance.brand || "N/A"}
              </p>
              <p>
                <strong>Model:</strong> {appliance.model || "N/A"}
              </p>
              <p>
                <strong>Product Doc 1:</strong>{" "}
                {applianceDetails.product_doc_1 ? (
                  <a href={applianceDetails.product_doc_1} target="_blank">
                    View Doc 1
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>Product Doc 2:</strong>{" "}
                {applianceDetails.product_doc_2 ? (
                  <a href={applianceDetails.product_doc_2} target="_blank">
                    View Doc 2
                  </a>
                ) : (
                  "N/A"
                )}
              </p>
              <p>
                <strong>MSRP:</strong> ${applianceDetails.msrp}
              </p>
              <p>
                <strong>Lowest Listed Price:</strong> $
                {applianceDetails.lowest_listed_price}
              </p>
              <p>
                <strong>Home Depot Price:</strong> $
                {applianceDetails.home_depot_price}
              </p>
              <p>
                <strong>Purchase Date:</strong>{" "}
                {appliance.purchase_date
                  ? new Date(appliance.purchase_date).toLocaleDateString(
                      "en-US",
                      { month: "2-digit", day: "2-digit", year: "numeric" }
                    )
                  : "N/A"}
              </p>
              <p>
                <strong>Expected End of Life:</strong>{" "}
                {appliance.exp_end_of_life
                  ? new Date(appliance.exp_end_of_life).toLocaleDateString(
                      "en-US",
                      { month: "2-digit", day: "2-digit", year: "numeric" }
                    )
                  : "N/A"}
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Summary View */}
      <Row className="mt-4">
        <Col md={12}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Summary View</Accordion.Header>
              <Accordion.Body>
                <p>
                  <strong>Total Repair Costs:</strong> $
                  {appliance?.total_repair_cost || "0.00"}
                </p>
                <p>
                  <strong>Total Investments:</strong> $
                  {appliance?.total_investment_cost || "0.00"}
                </p>
                <p>
                  <strong>Have Repairs Exceeded Cost?:</strong>{" "}
                  {appliance?.repairs_exceed_cost ? "Yes" : "No"}
                </p>
                <p>
                  <strong>Typical Lifespan:</strong>{" "}
                  {appliance?.typical_lifespan_years || "N/A"} years
                </p>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col md={6}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Repairs</Accordion.Header>
              <Accordion.Body>
                <Button
                  variant="success"
                  className="mb-3"
                  onClick={() => setShowAddRepairModal(true)}
                >
                  <FaPlus /> Add Repair
                </Button>
                {repairs.length > 0 ? (
                  repairs.map((repair) => (
                    <div
                      key={repair.id}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <div>
                        <p>
                          <strong>Repair Date:</strong>{" "}
                          {new Date(repair.repair_date).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Description:</strong>{" "}
                          {repair.repaired_description}
                        </p>
                        <p>
                          <strong>Cost:</strong> ${repair.cost.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <Button
                          variant="link"
                          onClick={() => navigate(`/edit-repair/${repair.id}`)}
                        >
                          <FaPencilAlt />
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleDeleteRepair(repair.id)}
                        >
                          <FaTrash style={{ color: "red" }} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No repairs recorded.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
        <Col md={6}>
          <Accordion defaultActiveKey="0">
            <Accordion.Item eventKey="0">
              <Accordion.Header>Investments</Accordion.Header>
              <Accordion.Body>
                <Button
                  variant="success"
                  className="mb-3"
                  onClick={() => setShowAddInvestmentModal(true)}
                >
                  <FaPlus /> Add Investment
                </Button>
                {investments.length > 0 ? (
                  investments.map((investment) => (
                    <div
                      key={investment.id}
                      className="d-flex justify-content-between align-items-center mb-2"
                    >
                      <div>
                        <p>
                          <strong>Investment Date:</strong>{" "}
                          {new Date(
                            investment.investment_date
                          ).toLocaleDateString()}
                        </p>
                        <p>
                          <strong>Description:</strong>{" "}
                          {investment.investment_description}
                        </p>
                        <p>
                          <strong>Cost:</strong> ${investment.cost.toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <Button
                          variant="link"
                          onClick={() =>
                            navigate(`/edit-investment/${investment.id}`)
                          }
                        >
                          <FaPencilAlt />
                        </Button>
                        <Button
                          variant="link"
                          onClick={() => handleDeleteInvestment(investment.id)}
                        >
                          <FaTrash style={{ color: "red" }} />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No investments recorded.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        </Col>
      </Row>

      {/* Add Repair Modal */}
      <Modal
        show={showAddRepairModal}
        onHide={() => setShowAddRepairModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Repair</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Repair Date</Form.Label>
              <Form.Control
                type="date"
                value={newRepair.repair_date}
                onChange={(e) =>
                  setNewRepair({ ...newRepair, repair_date: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newRepair.repaired_description}
                onChange={(e) =>
                  setNewRepair({
                    ...newRepair,
                    repaired_description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                value={newRepair.cost}
                onChange={(e) =>
                  setNewRepair({ ...newRepair, cost: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Repaired By</Form.Label>
              <Form.Control
                type="text"
                value={newRepair.repaired_by}
                onChange={(e) =>
                  setNewRepair({ ...newRepair, repaired_by: e.target.value })
                }
              />
            </Form.Group>
            <Button variant="success" onClick={handleAddRepair}>
              Add Repair
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Add Investment Modal */}
      <Modal
        show={showAddInvestmentModal}
        onHide={() => setShowAddInvestmentModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Investment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Investment Date</Form.Label>
              <Form.Control
                type="date"
                value={newInvestment.investment_date}
                onChange={(e) =>
                  setNewInvestment({
                    ...newInvestment,
                    investment_date: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={newInvestment.investment_description}
                onChange={(e) =>
                  setNewInvestment({
                    ...newInvestment,
                    investment_description: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cost</Form.Label>
              <Form.Control
                type="number"
                value={newInvestment.cost}
                onChange={(e) =>
                  setNewInvestment({ ...newInvestment, cost: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={newInvestment.investment_type}
                onChange={(e) =>
                  setNewInvestment({
                    ...newInvestment,
                    investment_type: e.target.value,
                  })
                }
              >
                <option value="maintenance">Maintenance</option>
                <option value="enhancement">Enhancement</option>
              </Form.Select>
            </Form.Group>
            <Button variant="success" onClick={handleAddInvestment}>
              Add Investment
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ViewAppliance;
