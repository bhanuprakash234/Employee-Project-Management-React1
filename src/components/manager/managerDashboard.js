

import { useSearchParams } from "react-router-dom";
import ProjectEmployeeComponent from "./components/projectcomp";
import ManagerEmployeeComponent from "./components/employeecomp";
import ManagerHome from "./components/mhome";
import ManagerNavbar from "./components/mNavbar";
import YourProfile1 from "./components/your_profile";


function ManagerDashboard() {
  
  const [param] = useSearchParams();

  const process = () => {
    if (!param.get('page')) {
      return (
        <div>
          <ManagerHome />
        </div>
      );
    }
    if (param.get('page') === 'home') {
      return (
        <div>
          <ManagerHome />
        </div>
      );
    }
    if (param.get('page') === 'employees') {
      return (
        <div>
          <ManagerEmployeeComponent />
        </div>
      );
    }
    if (param.get('page') === 'project') {
      return (
        <div>
          <ProjectEmployeeComponent />
        </div>
      );
    }
    if (param.get('page') === 'your_profile') {
      return (
        <div>
          <YourProfile1 />
        </div>
      );
    }
    
  };

  return (
    <div>
      <ManagerNavbar />
      {process()}
    </div>
  );
}

export default ManagerDashboard;
