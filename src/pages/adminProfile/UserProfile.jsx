import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import "../userProfile/user.scss";
import Add from '../../components/add/Add';

const UserProfile = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: '',
    gender: '',
    email: '',
  });
  
  const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const birthDateRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    // const passwordRef = useRef<HTMLInputElement>(null);
    // const roleRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const [userDetails, setUserDetails] = useState(null);
  const api = `http://127.0.0.1:8000/api/users/${id}`;
    const token = localStorage.getItem('token');
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
                console.log(data);
                
            } catch (error) {
                console.error("Error fetching user details:", error);
            }
        };
        fetchUser();
    }, []); 
    return (
      <div className="User">
        <div className="container">
          <div className="header">
            <div className="avatar">
              <img src="/noavatar.png" alt="" />
            </div>
            <div className="name">
              {userDetails && (
                <>
                  {userDetails.first_name} {userDetails.last_name} {userDetails.is_blocked === true ? '(blocked)' : ''}
                </>
              )}
            </div>
          </div>
  
          <div className="info">
            {userDetails && (
              <>
                <div className="first-name"><h4>first name:</h4> {userDetails.first_name}</div>
                <div className="last-name"><h4>last name:</h4> {userDetails.last_name}</div>
                <div className="birth"><h4>birth date:</h4> {userDetails.date_of_birth}</div>
                <div className="gender"><h4>gender:</h4> {userDetails.gender}</div>
                <div className="email"><h4>email:</h4> {userDetails.email}</div>
              </>
            )}
          </div>
          <div className="input-info">
            {userDetails && (
              <>
                <div className="first-name"><h4>first name:</h4><input type="text" placeholder={userDetails.first_name} /></div>
                <div className="last-name"><h4>last name:</h4> <input type="text" placeholder={userDetails.last_name}/></div>
                <div className="birth"><h4>birth date:</h4> <input type="text" placeholder={userDetails.date_of_birth} /> </div>
                <div className="gender"><h4>gender:</h4> <input type="text" placeholder={userDetails.gender}/> </div>
                <div className="email"><h4>email:</h4><input type="text" placeholder={userDetails.email} /> </div>
              </>
            )}
          </div>
          <div className="edit">
            <button className='edit-profile' onClick={()=>{
              const oldInfo = document.querySelector(".info");
              const pswdbtn = document.querySelector(".change-password");
              const editbtn = document.querySelector(".save");
              const newInfo = document.querySelector(".input-info");
              const cancel = document.querySelector(".cancel");
              cancel.style.display = "flex";
              cancel.innerHTML = "Cancel"
              console.log(newInfo);
              pswdbtn.style.display = "none";
              editbtn.style.display = "flex";
              oldInfo.style.display = "none";
              newInfo.style.display = "flex";
            }}>Edit Profile</button>
            <button className='save' onClick={()=>{
              
              const firstName = firstNameRef.current?.value;
              const lastName = lastNameRef.current?.value;
              const email = emailRef.current?.value;
              const birthDate = birthDateRef.current?.value;
              const gender = genderRef.current?.value;
              if (firstName === undefined || lastName === undefined || email === undefined || birthDate === undefined || gender === undefined) {
                console.error('Some values are undefined');
                return;
              }
    
              const dataToSend = {
                "first_name": firstName,
                "last_name": lastName,
                "date_of_birth": birthDate,
                "gender": gender,
                "email": email,
              }
              const filteredData = Object.fromEntries(
                Object.entries(dataToSend).filter(([key, value]) => value !== "")
              );
              console.log(dataToSend);
            fetch(`http://127.0.0.1:8000/api/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            body: JSON.stringify(filteredData),
          })
         .then(response => {
            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            return response.json();
          })
          .then(
            console.log("success")
            // ()=>{window.location.reload()}

          )
          .catch(error => {
            console.error('Error:', error);
          });
        }}>Save</button>
            <button className='cancel' onClick={()=>{
              const oldInfo = document.querySelector(".info");
              const newInfo = document.querySelector(".input-info");
              const cancel = document.querySelector(".cancel");
              const pswdbtn = document.querySelector(".change-password");
              const editbtn = document.querySelector(".edit-profile");
              cancel.style.display = "none";
              oldInfo.style.display = "flex";
              newInfo.style.display = "none";
              pswdbtn.style.display = "flex";
              editbtn.innerHTML = "Edit Profile";
              
            }}>Cancel</button>
            <button className='change-password'>Change Password</button>
          </div>
        </div>
      </div>
    );
  };
  

export default UserProfile;
