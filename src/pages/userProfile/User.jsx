import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import "./user.scss";
import Add from '../../components/add/Add';

const User = () => {
    let accountType;
    // const btn = document.querySelector(".block-btn");
    const [deleteUserId, setDeleteUserId] = useState(null);
    const [blockedUserId, setBlockedUserId] = useState(null);
    const [open, setOpen] = useState(false);
    const { id } = useParams();
    const [userDetails, setUserDetails] = useState(null); // Set initial state to null
    const api = `http://127.0.0.1:8000/api/users/${id}`;
    const token = localStorage.getItem('token');


    const hundleEdit= ()=>{
    }
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch(api, {
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
                setUserDetails(data);
                
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };

        fetchUser();
    }, [api]); 
    if (!userDetails) {
        // return <div>Loading...</div>;
        return(<div className="User">
        <div className="container">
            <div className="header">
                <div className="avatar">
                    <img src="/noavatar.png" alt="" />
                </div>
                <div className="name">
                    user example 
                    <div className="role">
                        Patient
                    </div>
                </div>
            </div>
            
            <div className="info">
                <div className="first-name"><h4>first name:</h4> user</div>
                <div className="last-name"><h4>last name:</h4> example</div>
                <div className="birth"><h4>birth date:</h4> 21/21/21</div>
                <div className="gender"><h4>gender:</h4> male</div>
                <div className="email"><h4>email:</h4>example@gmail.com</div>
            </div>
            <div className="buttons">
              <button>edit</button>
              <button>block</button>
              <button>delete</button>
            </div>
            </div>
            </div>
            )
    }

    // if(userDetails.account_type == "A"){
    //   accountType = "Admin";
    // }
    // else if(userDetails.account_type == "D"){
    //   accountType = "Doctor";
    // }
    // else{
    //   accountType = "Patient"
    // }
    return (
        <div className="User">
            <div className="container">
                <div className="header">
                    <div className="avatar">
                        <img src="/noavatar.png" alt="" />
                    </div>
                    <div className="name">
                        {userDetails.first_name} {userDetails.last_name} {userDetails.is_blocked === true ? '(blocked)' : ''}
                        <div className="role">
                            {userDetails.account_type}
                        </div>
                    </div>
                </div>
                
                <div className="info">
                    <div className="first-name"><h4>first name:</h4> {userDetails.first_name}</div>
                    <div className="last-name"><h4>last name:</h4> {userDetails.last_name}</div>
                    <div className="birth"><h4>birth date:</h4> {userDetails.date_of_birth}</div>
                    <div className="gender"><h4>gender:</h4> {userDetails.gender}</div>
                    <div className="email"><h4>email:</h4> {userDetails.email}</div>
                </div>

                <div className="buttons">
                    
                    <button onClick={() => setOpen(true)}>edit</button>
                    <button className='block-btn' onClick={()=>{
            const popup = document.querySelector(".b-container");
            const title = document.querySelector(".b-container .popup-container p");
            popup.style.display = "flex";
            fetch(`http://127.0.0.1:8000/api/users/${id}`, {
              method: 'GET',
              headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            },)
            .then(response => response.json())
            .then(data =>{
              if(data.is_blocked == true){
                
                title.innerHTML = "Are you sure you want to unblock this user?";
                
              }
              else{
                title.innerHTML = "Are you sure you want to block this user?";
                
              }
              })

              
            // fetch(`http://127.0.0.1:8000/api/users/${params.row.id}`)
            // .then(response => response.json())
            // .then(data =>{
            //   if(data.is_blocked == true){
            //     const title = document.querySelector(".b-container .popup-container p")as HTMLElement;
            //     title.innerHTML = "Are you sure you want to unblock this user?"
            //   }
            // })
            setBlockedUserId(id);
            
            
          }}>{userDetails.is_blocked === true ? 'Unblock' : userDetails.is_blocked === false ? 'Block' : 'N/A'}</button>
                    <button onClick={()=>{
            const popup = document.querySelector(".p-container");
            popup.style.display = "flex";
            setDeleteUserId(id);
          }}>delete</button>
                    {open && <Add slug2 = "Edit" slug="user" userID = {id}  setOpen={setOpen} />}

                </div>
            </div>
            <div className="p-container">
    <div className="popup-container" id="popup">
  <p>Are you sure you want to delete?</p>
  <div className="popup-buttons">
    <button className="confirm-btn" onClick={()=>{
      
      const popup = document.querySelector(".p-container") ;
      fetch(`http://127.0.0.1:8000/api/users/${deleteUserId}`, {
        method: 'Delete',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
       
    }).then(()=>window.location.href = '/admin/dashboard/users')
      popup.style.display = "none";
    }}>Confirm</button>
    <button className="cancel-btn" onClick={()=>{
      const popup = document.querySelector(".p-container") ;
      popup.style.display = "none";
    }}>Cancel</button>
   </div>
    </div>
  </div>

  <div className="b-container">
    <div className="popup-container" id="popup">
  <p></p>
  <div className="popup-buttons">
    <button className="confirm-btn" onClick={()=>{
      
      const popup = document.querySelector(".b-container");
      fetch(`http://127.0.0.1:8000/api/users/${blockedUserId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then(response => response.json())
        .then(data =>{
              if(data.is_blocked == true){
                const data={
                  "is_blocked":false
                };
                fetch(`http://127.0.0.1:8000/api/users/${blockedUserId}`, {
                       method: 'PATCH',
                       headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify(data),
       
                }).then(window.location.reload())
              }
              else{
                const data={
                  "is_blocked":true
                };
                fetch(`http://127.0.0.1:8000/api/users/${blockedUserId}`, {
                       method: 'PATCH',
                       headers: {
                        'Authorization': `Token ${token}`,
                        'Content-Type': 'application/json',
                      },
                      credentials: 'include',
                      body: JSON.stringify(data),
       
                }).then(window.location.reload())
              }
            })
      
      
      popup.style.display = "none";
    }}>Confirm</button>
    <button className="cancel-btn" onClick={()=>{
      const popup = document.querySelector(".b-container");
      popup.style.display = "none";
    }}>Cancel</button>
   </div>
    </div>
  </div>
        </div>
        
    );
};

export default User;
