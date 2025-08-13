import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../redux/userSlice";
import { FaUser } from "react-icons/fa"; 
import "./styles.css"; 
import Logo from "../assets/rr_logo_transparent.png";
import { Link } from "react-router-dom";

const NavigationBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const authToken = useSelector((state) => state.user.authToken);

  const handleLogOut = () => {
    dispatch(logOut());
    localStorage.removeItem("authToken");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
<Navbar expand="md" className="navbar" style={{ backgroundColor: '#b8b6b0' }} variant="light">

  
<Container>
  <Navbar.Toggle aria-controls="basic-navbar-nav" />
  <Navbar.Collapse id="basic-navbar-nav">
    <Nav className="me-auto d-flex align-items-center">
      <Navbar.Brand as={NavLink} to="/" className="d-flex">
        <img
          src={Logo}
          alt="Logo"
          style={{ width: "125px", cursor: "pointer" }}
        />
      </Navbar.Brand>
       {authToken && (
        <Nav.Link as={NavLink} to="/profile" className="d-flex">
          <FaUser className="me-2" size={20} /> Profile
        </Nav.Link>
      )}

      {authToken && (
        <Nav.Link as={NavLink} to="/properties" className="d-flex">
          Properties
        </Nav.Link>
      )}

     
      {authToken && (
        <Nav.Link as={NavLink} to="/pay" className="d-flex">
          💳 Pay
        </Nav.Link>
      )}
      
    </Nav>

    {authToken ? (
      <Button
        onClick={handleLogOut}
        className="btn"
        style={{
          marginLeft: "1rem",
          color: "whitesmoke",
          backgroundColor: "#84b474",
          border: "none",
        }}
      >
        Log Out
      </Button>
    ) : (
      <Button
        onClick={() => navigate("/login")}
        className="btn"
        style={{
          marginLeft: "1rem",
          color: "whitesmoke",
          backgroundColor: "#84b474",
          border: "none",
        }}      >
        Login
      </Button>
    )}
  </Navbar.Collapse>
</Container>


    </Navbar>
  );
};

export default NavigationBar;

