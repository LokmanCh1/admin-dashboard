import React, { useEffect, useState } from 'react';
import "./pychart.scss";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Link } from 'react-router-dom';

interface ChartData {
  patients: number;
  doctors: number;
  admins: number;
  
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const PichartBox = () => {
  const [data, setData] = useState<ChartData | null>(null);
  const[total, setTotal] = useState();

  useEffect(() => {
    const apiUrl = 'http://127.0.0.1:8000/api/statistics/users_types/';

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(apiData => {
        // Set the fetched data to the state
        const newData: ChartData = {
          patients: apiData.patients,
          doctors: apiData.doctors,
          admins: apiData.admins,
        
        };
        setTotal(apiData.total);
        setData(newData);
      })
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }, []); // Empty dependency array ensures the effect runs once on mount

  return (
    <div className="piechart">
      <div className="header">
      <div className="title">
      <Link to={"users"}>
      <h1>
        Users
      </h1>
      </Link>
      </div>
      <div className="users-count">
          
          <h3>{total}</h3>
      </div>
      </div>
      
      
      <div className="chart">
        <ResponsiveContainer width="99%" height={300}>
          <PieChart>
            <Tooltip contentStyle={{ background: "white", borderRadius: "5px" }} />
            {data && (
              <Pie
                data={Object.entries(data).map(([key, value]) => ({ name: key, value }))}
                innerRadius={"70%"}
                outerRadius={"90%"}
                paddingAngle={5}
                dataKey="value"
              >
                {Object.keys(data).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="options">
        {data && Object.entries(data).map(([key, value], index) => (
          <div className="option" key={index}>
            <div className="title">
              <div className="dot" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <span>{key}</span>
            </div>
            <span className="number">
              {value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PichartBox;
