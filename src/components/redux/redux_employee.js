import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { Card, ListGroup, Nav } from "react-bootstrap";
import { useNavigate } from "react-router";
import { getProjects } from "../../store/actions/home";

function ReduxEmployeeHome(){
    const dispatch=useDispatch();
    let {list}=useSelector((state)=>state.project)
    const navigate = useNavigate();
    useEffect(()=>{
        dispatch(getProjects())
    },[dispatch])

    return(<div className="container mt-4">
    <Card>
      <Card.Header className="bg-primary text-white">Projects</Card.Header>
      <ListGroup variant="flush">
        {list.map((p, index) => (
          <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
            <Nav.Link onClick={() => navigate("/employee/backlog/sprint/tasks&pid=" + p.id)}>
              {p.title}
            </Nav.Link>
            <span className="text-muted"><strong>Status: </strong>{p.status}</span>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  </div>)
}
export default ReduxEmployeeHome;