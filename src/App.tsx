import Home from "./pages/home/Home.tsx"
import Users from "./pages/users/Users.jsx";
import NavBar from "./components/navbar/NavBar.tsx";
import User from "./pages/userProfile/User.jsx";
// import Menu from "./components/menu/Menu";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useNavigate
} from "react-router-dom";
import Login from "./pages/login/Login.jsx";
import "./styles/global.scss"
import { useState } from "react";
import UserProfile from "./pages/adminProfile/UserProfile.jsx";




function App() {
  // if (token === null) {
  //     navigate('/admin/login');
  //     return null; 
  //   }
  // const token = localStorage.getItem('token');
  // const [userID, setUserId] = useState<number>(Number);
  
  //   const fetchCurrentUser = async () => {
  //     try {
  //       const response = await fetch("http://127.0.0.1:8000/api/statistics/current_user/", {
  //         method: 'GET',
  //         headers: {
  //           'Authorization': `Token ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //         credentials: 'include',
  //       });
    
  //       if (!response.ok) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setUserId(data.id);
  //       console.log('Received User Data:', data);
  //     } catch (error) {
  //       // Handle error
  //       console.error('Error fetching user data:', error);
  //     }
  //   };
  //   fetchCurrentUser();
  const Layout = ()=>{
    return(
      <div className="main">
        <NavBar/>
        <div className="container">
          <div className="contentContainer">
            <Outlet/>
          </div>
        </div>
        {/* <Footer/> */}

      </div>
    )
  }
  const router = createBrowserRouter([
    {
      path:"/admin/",
      element:<Layout/>,
      children:[
        {
          path: "dashboard",
          element: (
            <Home/>
          ),
        },
        {
          path: "dashboard/users",
          element: <Users/>,
        },
        {
          path:"/admin/dashboard/users/:id",
          element:<User/>
        },
        {
          path:"/admin/profile/:id",
          element:<UserProfile/>
        },
        

      ]
    },
    {
      path:"/admin/login",
      element:<Login/>
    },
    
  ]);

  return <RouterProvider router={router}/>
  
}

export default App
