import React, { useRef, useState } from 'react';
import"./add.scss"
import { GridColDef } from '@mui/x-data-grid';

type Props = {
    slug:string, 
    slug2:string,
    userID:number,
    columns:GridColDef[],
    setOpen:React.Dispatch<React.SetStateAction<boolean>>,
}
interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    gender:string;
    role:string;
  }
const Add = (props:Props) => {
    const firstNameRef = useRef<HTMLInputElement>(null);
    const lastNameRef = useRef<HTMLInputElement>(null);
    const birthDateRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const genderRef = useRef<HTMLSelectElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const roleRef = useRef<HTMLInputElement>(null);
    const [users, setUsers] = useState<User[]>([]);

    const handleSubmit = (e:React.FormEvent<HTMLFormElement>)=>{
        
        e.preventDefault();


        const firstName = firstNameRef.current?.value;
        const lastName = lastNameRef.current?.value;
        const email = emailRef.current?.value;
        const birthDate = birthDateRef.current?.value;
        const password = passwordRef.current?.value;
        const role = roleRef.current?.value;
        const gender = genderRef.current?.value;
        const token = localStorage.getItem('token');


        const data = {
            "first_name":firstName,
            "last_name":lastName,
            "gender":gender,
            "email":email,
            "account_type":role,
            "date_of_birth":birthDate,
            "password":password
        }
        if(props.slug2 === "Add new"){
            fetch("http://127.0.0.1:8000/api/users/", {
            method: 'POST',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            body: JSON.stringify(data),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(newUser => {
            setUsers([...users, newUser]);

            props.setOpen(false);

        })
        .catch(error => {
            console.error('Error:', error);
        });
        }
        else{
            const filteredData = Object.fromEntries(
                Object.entries(data).filter(([key, value]) => value !== "")
              );
            fetch(`http://127.0.0.1:8000/api/users/${props.userID}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Token ${token}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            body: JSON.stringify(filteredData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(

            ()=>{window.location.reload()}

        )
        .catch(error => {
            console.error('Error:', error);
        });
        }
        
    };
  return (
    <div className='add'>
        <div className="model">
            <span className="close" onClick={()=>props.setOpen(false)}>X</span>
            <h1>{props.slug2} {props.slug} </h1>
            <form onSubmit={handleSubmit}>
                {/* {props.columns
                .filter(item=>item.field !== "id" && item.field !== "Avatar" && item.field !== "action")
                .map(column=>(
                    <div className="item">
                        <label >{column.headerName}</label>
                        <input type={column.type} placeholder={column.field}/>
                    </div>
                ))} */}
                <div className="item first-name">
                        <label >first name</label>
                        <input type="text"  ref={firstNameRef} placeholder="first name"/>
                </div>
                <div className="item last-name">
                        <label >last name</label>
                        <input type="text" ref={lastNameRef} placeholder="last name"/>
                </div>
                <div className="item birth">
                        <label>birth date</label>
                        <input type="date" ref={birthDateRef} placeholder="first name"/>
                </div>
                <div className="item gender">
                        <label >gender</label>
                        <select id="gender" name="gender">
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                </div>
                <div className="item email">
                        <label >email</label>
                        <input type="email" ref={emailRef} placeholder="first name"/>
                </div>
                <div className="item password">
                        <label >password</label>
                        <input type="text" ref={passwordRef} placeholder="password"/>
                </div>
                <div className="item role">
                        <label >role</label>
                        <select id="role" name="role">
                            <option value="Admin">Admin</option>
                            <option value="Doctor">Doctor</option>
                            <option value="Patient">Patient</option>
                        </select>
                </div>
                
                <button type="submit" >{props.slug2}</button>
            </form>
        </div>
    </div>
  )
};

export default Add