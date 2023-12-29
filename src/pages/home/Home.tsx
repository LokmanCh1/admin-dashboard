 import React from "react";
 import "./home.scss";
import ChartBox from "../../components/chartBox/MessagesLineChart";
import PichartBox from "../../components/piechartBox/PichartBox";
import MyAreaChart from "../../components/areaChart/AreaChart";
import MessagesLineChart from "../../components/chartBox/MessagesLineChart";
import FeedbacksLineChart from "../../components/chartBox/FeedbacksLineChart";
import ActiveUsers from "../../components/activeUsers/ActiveUsers"
import { redirect, useNavigate } from "react-router-dom";


 const Home  =() =>{
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    
    // if (token === null) {
    //     redirect('/admin/login');
    //     return null; 
    //   }
      // const fetchCurrentUser = async () => {
      //   try {
      //     const response = await fetch("http://127.0.0.1:8000/api/statistics/current_user/", {
      //       method: 'GET',
      //       headers: {
      //         'Authorization': `Token ${token}`,
      //         'Content-Type': 'application/json',
      //       },
      //       credentials: 'include',
      //     });
      
      //     if (!response.ok) {
      //       throw new Error(`HTTP error! Status: ${response.status}`);
      //     }
      
      //     const data = await response.json();
      //     console.log('Received User Data:', data);
      //   } catch (error) {
      //     // Handle error
      //     console.error('Error fetching user data:', error);
      //   }
      // };
      
      // fetchCurrentUser();
        return (
            <div className="home">
                <div className="box box1"><ActiveUsers /></div>
                <div className="box box2"> <MessagesLineChart /></div>
                <div className="box box3"><FeedbacksLineChart /></div>
                <div className="box box4"> <PichartBox /></div>
                {/* <div className="box box5"> <MessagesLineChart /></div>
                <div className="box box6"></div> */}
                <div className="box box7"><MyAreaChart /></div>
                {/* <div className="box box8">box8</div>
                <div className="box box9">box9</div> */}
            </div>
        );
 }

 export default Home