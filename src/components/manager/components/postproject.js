import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router";
import ManagerNavbar from "./mNavbar";

function PostProject(){
    const[title,setTitle]=useState('');
    const[longDesc,setLongDesc]=useState('');
    const[endDate,setEndDate]=useState('');
    const[msg,setMsg]=useState('');
    const[project,setProject]=useState([]);
    const navigate= useNavigate();
    const AddProject=()=>{
        let projectObj ={
            "title":title,
            "longDesc":longDesc,
            
            "endDate":endDate
        }
        //console.log(JSON.stringify(customerObj))
        const uid = localStorage.getItem('id')
        
        
        const mid = parseInt(uid, 10) + 1;

        axios.post('http://localhost:5050/project/add/'+mid,projectObj)
        .then(response=>{
            setProject(response.data)
            navigate('/manager/dashboard?page=home')
        })
        .catch(function(error){
            setMsg("Issue in processing in signup")
        });
    }
    return(
        <div>
          <ManagerNavbar />
        <div className="container mt-4">
   <div className="row">
     <div className="col-md-3"></div>
     <div className="col-md-6">
       <div className="card">
         
         <div className="card-body">
           {msg !== "" ? (
             <div className="alert alert-danger" role="alert">
               {msg}
             </div>
           ) : (
             ""
           )}
           <div className="row " style={{ textAlign: "right" }}>
               
             {/* Read Name */}
             <div className="col-md-6">
               <label>Enter Project Title:</label>
             </div>
             <div className="col-md-6 mb-4">
               <input
                 type="text"
                 className="form-control"
                 onChange={(e) => setTitle(e.target.value)}
               />
             </div>
             <div className="col-md-6">
               <label>Enter Description:</label>
             </div>
             <div className="col-md-6 mb-4">
               <input
                 type="text"
                 className="form-control"
                 onChange={(e) => setLongDesc(e.target.value)}
               />
             </div>
             

             
             <div className="col-md-6">
               <label>Enter End Date:</label>
             </div>
             <div className="col-md-6 mb-4">
               <input
                 type="date"
                 className="form-control"
                 onChange={(e) => setEndDate(e.target.value)}
               />
             </div>
             
           
           </div>
         </div>
         <div className="card-footer" style={{ textAlign: "center" }}>
           <button className="btn btn-primary" onClick={() => AddProject()} >
             Add Project
           </button>
         </div>
       </div>
      
     </div>
     <div className="col-md-3"></div>
   </div>
 </div>
 <br /><br /><br /><br /><br />
 
   </div>
       
    )
}
export default PostProject;