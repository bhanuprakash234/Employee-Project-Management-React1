import axios from "axios";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function Login(){
    const [username,setUsername] = useState('');
    const[param]=useSearchParams();
    const [password,setPassword] = useState('');
    const [msg,setMsg] = useState(param.get('msg'));
    const navigate = useNavigate();
    const doLogin=()=>{
      let token = window.btoa(username + ':' + password)
      //console.log(token);
      axios.post('http://localhost:5050/auth/login',{},{
        headers:{
          'Authorization':'Basic ' + token
        }
      })
      .then(function(response){

        //handle success
        localStorage.setItem('username',username)
        localStorage.setItem('token',token)
        localStorage.setItem('id',response.data.id)
        localStorage.setItem('isLoggedIn',true)
        let role = response.data.role;

        switch (role) {
          case 'EMPLOYEE':
            navigate('/employee/dashboard')
            break;
          case 'MANAGER':
            navigate('/manager/dashboard')
            break;
         
          default:
            break;

        }
      })
      .catch(function(error){
        //handle error
        setMsg('Invalid Credentials')
      })
       
    }
    return(
      <div >
        <div className="container mt-4" >
             <div className="row" >
            <div className="col-md-6"></div>
            <div className="col-md-6" >
                <br /><br /><br />
              <div className="card"  >
              
                <div className="card-header" style={{color:"steelblue",textAlign:"center"}}>
                    <h3>Login</h3>
                </div>
                <div className="card-body">
                {msg !==  null?
                          <div className="alert alert-danger" role="alert">
                            {msg}
                        </div>
                    :''} 
               
 
                  <div className="row " style={{textAlign: "right"}}>
                    <div className="col-md-6" style={{color:"darkslategray"}} >
                      <label>Enter Username:</label>
                    </div>
                    <div className="col-md-6 mb-4">
                      <input type="email" className="form-control" 
                      onChange={(e)=>setUsername(e.target.value)}/>
                    </div>
                  </div>
                  <div className="row" style={{textAlign: "right"}}>
                    <div className="col-md-6">
                      <label>Enter Password:</label>
                    </div>
                    <div className="col-md-6">
                      <input type="password" className="form-control" 
                      onChange={(e)=>setPassword(e.target.value)} />
                    </div>
                  </div>
           
                   
                </div>
                <div className="card-footer" style={{textAlign: "center"}}>
                    <button className="btn btn-primary" 
                    onClick={()=>doLogin()}>Login</button>
                  </div>
              </div>
              <div style={{textAlign:'left',color:"white"}} className="mt-4" >
                <span style={{color:"white"}}>Don't have an Account?&nbsp;&nbsp;
                  <button className="btn btn-dark btn-sm" 
                  onClick={()=>navigate("/auth/signup")}
                  >Signup</button>

                  
                </span>

              </div>
              
            </div>
            <div className="col-md-3"></div>
          </div>


        </div>
        </div>
    );
}
export default Login;