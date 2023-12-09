import logo from './logo.svg';
import './App.css';

import MainNavbar from './components/mainNavbar';
import Login from './components/auth/login';
import EmployeeDashboard from './components/employee/employeeDashboard';
import ManagerDashboard from './components/manager/managerDashboard';
import SignUp from './components/auth/signup';
import Logout from './components/auth/logout';
import FirstPage from './components/firstpage';
import { Route, Routes } from 'react-router';
import PostEmployee from './components/manager/components/postemployee';
import PostEmployeeProject from './components/manager/components/postemployeeproject';
import PostProject from './components/manager/components/postproject';
import Backlog from './components/manager/components/backlog';
import CreateTask from './components/manager/components/create_task';
import CreateSprint from './components/manager/components/create_sprint';
import ViewTask from './components/manager/components/view_task';
import EmployeeTask from './components/employee/components/employee_task';
import CreateBacklog from './components/manager/components/create_backlog';
import EmployeeBacklog from './components/employee/components/employee_backlog';
import Reset from './components/auth/reset';

function App() {
  return (
    <div className="app-body" >
      
      <Routes>
          <Route path="/" element={<FirstPage />}></Route>
         
          <Route path="/employee/dashboard" element={<EmployeeDashboard />}></Route>
          <Route path="/backlog/sprint/tasks:pid" element={<Backlog />}></Route>
          <Route path="/post/employee/project" element={<PostEmployeeProject />}></Route>
          <Route path="/manager/dashboard" element={<ManagerDashboard />}></Route>
          <Route path="/employee/post" element={<PostEmployee />}></Route>
          <Route path="/auth/login" element={<FirstPage />}></Route>
          <Route path="/auth/reset" element={<Reset />}></Route>
          <Route path="/auth/signup" element={<SignUp />}></Route>
          <Route path="/auth/logout" element={<Logout />}></Route>
          <Route path="/manager/dashboard" element={<ManagerDashboard />}></Route>
          <Route path="/post/project" element={<PostProject />}></Route>
          <Route path="/create/task:sid" element={<CreateTask />}></Route>
          <Route path="/create/sprint:bid" element={<CreateSprint />}></Route>
          <Route path="/task:tid" element={<ViewTask />}></Route>
          
          <Route path="/employee/task:tid" element={<EmployeeTask />}></Route> 
          <Route path="/create/backlog/:pid" element={<CreateBacklog />}></Route> 
          <Route path="/employee/backlog/sprint/tasks:pid" element={<EmployeeBacklog />}></Route>
          
        </Routes>
    </div>
  );
}

export default App;
