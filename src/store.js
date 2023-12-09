import { configureStore } from "@reduxjs/toolkit";
import project from "./store/reducers/home";
export default configureStore({
    reducer: {project} //all reducers go here 
})