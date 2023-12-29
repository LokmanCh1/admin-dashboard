import React, { useEffect, useState } from 'react';
import './NavBar.scss';
import { Link, redirect, useNavigate } from 'react-router-dom';

interface UserDetails {
  id: number;
  first_name: string;
  last_name: string;
  birth_date: string;
  gender: string;
}

export const NavBar: React.FC = () => {
  
  const [userID, setUserId] = useState<number | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const token = localStorage.getItem('token');
  const api = `http://127.0.0.1:8000/api/users/${userID ?? ''}`;
  const navigate = useNavigate();

  const fetchData = async (url: string, stateSetter: React.Dispatch<React.SetStateAction<any>>) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      stateSetter(data);
    } catch (error) {
      console.error(`Error fetching data from ${url}:`, error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchData('http://127.0.0.1:8000/api/statistics/current_user/', (data) => {
        setUserId(data.id);
        fetchData(api, setUserDetails);
      });
    }
  }, [api, token]);

  return (
    <div className="navbar">
      <div className="logo">
        <img src="/admin.svg" alt="" />
        <span>Administration</span>
      </div>
      <div className="icons">
        <Link to={'/admin/dashboard'}>
        
          <img src="/home.svg" alt="" />
        
        </Link>
        <div className="messages">
          <img src="/messages.svg" alt="" />
          <span>1</span>
        </div>
        <div className="notifications">
          <img src="/notifications.svg" alt="" />
          <span>1</span>
        </div>
      <Link to={`profile/${userID}`}>
        <div className="user">
          <img src="/noavatar.png" alt="" />
          <span>{userDetails?.first_name ?? 'user'}</span>
        </div>
        </Link>
        
        <div className="logout" onClick={()=>{fetch("http://127.0.0.1:8000/api/logout/", {
                  method: 'GET',
                  headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json',
                  },
                  credentials: 'include',
                });
                localStorage.removeItem("token");
                navigate("login")}}>
          <img src="/logout.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
