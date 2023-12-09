const initialState={
    list: []
}
const project=(state=initialState,action)=>{
    if(action.type === 'GET_LIST'){
        return {...state,list: action.payload}
        
    }
    return state;

    
    
}

/*
action={
            type : 'GET_LIST',
            payload: response.data
        } 
*/


export default project;
