import { Container, Navbar } from "react-bootstrap";

function MainNavbar() {
  return (
    <div>
      <Navbar bg="dark" variant="dark" style={{ height: "50px" }}>
        
          <Navbar.Brand href="#home" style={{ paddingLeft: 0 }}>
            <div style={{ width: "100%" }}>&nbsp;&nbsp;&nbsp;TeamFlow</div>
          </Navbar.Brand>
        
      </Navbar>
    </div>
  );
}

export default MainNavbar;