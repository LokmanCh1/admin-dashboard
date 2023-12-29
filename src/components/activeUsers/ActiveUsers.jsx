import React, { useState, useEffect } from 'react';
import "./activeUsers.scss";

const ActiveUsers = () => {
  const apiUrl = "http://127.0.0.1:8000/api/statistics/active_users/";
  const [activeUsers, setActiveUsers] = useState();
  const [usersIDs, setUsersIDs] = useState();
  const [users, setUsers] = useState();
  const token = localStorage.getItem('token');


  useEffect(() => {
    const users = async () => {
      try {
        let users = [];
        const response = await fetch("http://127.0.0.1:8000/api/users/", 
        {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        users = data.map(user => ({
          id: user.id,
          firstName: user.first_name,
          lastName: user.last_name
        }));
        
        setUsers(users);
        
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
    const fetchData = async () => {
      try {
        const response = await fetch(apiUrl,  {
          method: 'GET',
          headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
        const apiData = await response.json();
        setActiveUsers(apiData.active_users_count);
        setUsersIDs(apiData.active_user_ids);
        console.log("sadas");
        
        // Call the users function here
        
        
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
    // Call fetchData when the component mounts
    fetchData();
    users();
  }, [apiUrl]);
console.log(usersIDs);
console.log(users);
  return (
    <div className="container">
      <div className="header">
        <div className="title">

          <h3>Current active users</h3>
          
        </div>
        <div className="count">
          <h3>{activeUsers}</h3>
        </div>
      </div>
      <div className="users-list">
        
          {users && users.map(user => (
             usersIDs.includes(user.id) && (
              <div className='user' key={user.id}>

                <h4>
                {user.firstName} {user.lastName}
                </h4>
                
              </div>
            )
          ))}
        
      </div>
    </div>
    
  );
}

export default ActiveUsers;
