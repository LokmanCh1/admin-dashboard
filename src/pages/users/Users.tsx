import { GridColDef } from "@mui/x-data-grid";
import DataTable from "../../components/dataTable/DataTable";
import "./Users.scss";
import { useEffect, useState } from "react";
import Add from "../../components/add/Add";
import { userRows } from "../../data";
import { Link } from "react-router-dom";
// import { useQuery } from "@tanstack/react-query";



const Users = () => {
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState([]);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [blockedUserId, setBlockedUserId] = useState(null);

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "img",
      headerName: "Avatar",
      width: 100,
      renderCell: (params) => {
        return <img src={params.row.img || "/noavatar.png"} alt="" />;
      },
    },
    {
      field: "first_name",
      type: "string",
      headerName: "First name",
      width: 150,
    },
    {
      field: "last_name",
      type: "string",
      headerName: "Last name",
      width: 150,
    },
    
    {
      field: "email",
      type: "string",
      headerName: "Email",
      width: 250,
    },
    {
      field: "account_type",
      headerName: "Role",
      width: 100,
      type: "string",
    },
    {
      field: "is_blocked",
      headerName: "Is Blocked",
      width: 150,
      type: "boolean",
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell:(params)=>{
        return <div className="action">
          <div className="view"><Link to={`${params.row.id}`}>
          <img src="/view.svg" alt="" /></Link>
          </div>
          <div className="delete" onClick={()=>{
            const popup = document.querySelector(".p-container") as HTMLElement;
            popup.style.display = "flex";
            setDeleteUserId(params.row.id);
          }}>
            
            <img src="/delete.svg" alt="" />
            
          </div>
          <div className="block" onClick={()=>{
            const popup = document.querySelector(".b-container") as HTMLElement;
            const title = document.querySelector(".b-container .popup-container p")as HTMLElement;
            popup.style.display = "flex";
            fetch(`http://127.0.0.1:8000/api/users/${params.row.id}`)
            .then(response => response.json())
            .then(data =>{
              if(data.is_blocked == true){
                
                title.innerHTML = "Are you sure you want to unblock this user?"
              }
              else{
                title.innerHTML = "Are you sure you want to block this user?"
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
            setBlockedUserId(params.row.id);
            
            
          }}>
            <img src="/block.svg" alt="" />
          </div>
        </div>
      } 
    },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await fetch("http://127.0.0.1:8000/api/users/",
          {
            method: 'GET',
            headers: {
              'Authorization': `Token ${token}`,
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRows(data);
        console.log(data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []);
  
  // TEST THE API

  // const { isLoading, data } = useQuery({
  //   queryKey: ["allusers"],
  //   queryFn: () =>
  //     fetch("http://localhost:8800/api/users").then(
  //       (res) => res.json()
  //     ),
  // });

  return (
    <div className="users">
      <div className="info">
        <h1>Users</h1>
        <button className="add-users" onClick={() => setOpen(true)}>Add New User</button>
      </div>
      <DataTable  columns={columns} rows={rows} />
      {/* TEST THE API */}

      {/* {isLoading ? (
        "Loading..."
      ) : (
        <DataTable slug="users" columns={columns} rows={data} />
      )} */}
      {open && <Add slug2 = "Add new"slug="user" userID={1} columns={columns} setOpen={setOpen} />}
  <div className="p-container">
    <div className="popup-container" id="popup">
  <p>Are you sure you want to delete?</p>
  <div className="popup-buttons">
    <button className="confirm-btn" onClick={()=>{
      
      const popup = document.querySelector(".p-container") as HTMLElement;
      const token = localStorage.getItem('token');

      fetch(`http://127.0.0.1:8000/api/users/${deleteUserId}`, {
        method: 'Delete',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
       
    })
    .then(()=>window.location.reload())
    
      popup.style.display = "none";
    }}>Confirm</button>
    <button className="cancel-btn" onClick={()=>{
      const popup = document.querySelector(".p-container") as HTMLElement;
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
      const token = localStorage.getItem('token');
      const popup = document.querySelector(".b-container") as HTMLElement;
      fetch(`http://127.0.0.1:8000/api/users/${blockedUserId}`,{
        method:'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
            .then(response => response.json())
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
       
                })
                .then(() => window.location.reload())
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
       
                })
                .then(() => window.location.reload())
              }
            })
      
      
      popup.style.display = "none";
    }}>Confirm</button>
    <button className="cancel-btn" onClick={()=>{
      const popup = document.querySelector(".b-container") as HTMLElement;
      popup.style.display = "none";
    }}>Cancel</button>
   </div>
    </div>
  </div>


    </div>
    
  );
};

export default Users;