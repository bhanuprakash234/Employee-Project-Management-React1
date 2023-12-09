import axios from "axios";

export const getProjects = ()=>(dispatch)=>{
    const uid = localStorage.getItem("id");
  const eid = parseInt(uid, 10) + 1;
    console.log('in getProducts of Action....')

    axios.get(`http://localhost:5050/project/getAll/employee/${eid}`)
    .then(response=> {
        //give the response to the reducer
        //dispatch({type : 'GET_LIST',payload: response.data})
        dispatch(
            {
                type : 'GET_LIST',
                payload: response.data
            } 
        )
    })
}