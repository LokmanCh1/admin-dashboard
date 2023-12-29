import React, { useEffect, useState } from 'react' 
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import "./style.scss"


interface ChartData {
    month: string;
    users: number;
    growth:number;
  }

const MyAreaChart = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [growthRate, setGrowthRate] = useState<number>()
    const currentDate = new Date();
    const previousMonth = new Date();
    previousMonth.setMonth(currentDate.getMonth() - 1);
    const previousMonthName = previousMonth.toLocaleString('default', { month: 'long' });
    const previous2ndMonth = new Date();
    previous2ndMonth.setMonth(currentDate.getMonth() - 2);
    const previous2ndMonthName = previous2ndMonth.toLocaleString('default', { month: 'long' });
    const currentMonthName = currentDate.toLocaleString('default', { month: 'long' });
    const previous3rdMonth = new Date();
    previous3rdMonth.setMonth(currentDate.getMonth() - 3);
    const previous3rdMonthName = previous3rdMonth.toLocaleString('default', { month: 'long' });

    useEffect(() => {
      const apiUrl = 'http://127.0.0.1:8000/api/statistics/users_growth_rate';
  
      // Fetch data from the API
      fetch(apiUrl)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(apiData => {
          // Set the fetched data to the state
          const newData:ChartData[] = [
            {
                month:previous3rdMonthName.slice(0,3),
                users:apiData.rd_previous_month_registrations,
                growth:apiData.growth_rate
            },
            {
                month:previous2ndMonthName.slice(0,3),
                users:apiData.nd_previous_month_registrations,
                growth:apiData.growth_rate
            },
            {
                month:previousMonthName.slice(0,3),
                users:apiData.previous_month_registrations,
                growth:apiData.growth_rate
            },
            {
                month:currentMonthName.slice(0,3),
                users:apiData.current_month_registrations,
                growth:apiData.growth_rate
            },

          ]
          
          setGrowthRate(newData[1].growth)
          setData(newData);
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }, []); // Empty dependency array ensures the effect runs once on mount

    const  growth = document.querySelector(".growth-rate h2")as HTMLElement;
    if(growth){
    if ( growthRate!=null && growthRate <0 ){
      growth.innerHTML = `-${growthRate}%`
      growth.style.color = "red"
    } 
    else{
      growth.innerHTML = `+${growthRate}%`
    }
  }
    return (
      <div className="areaChart">
        <div className="header">
          <div className="title">
            <img src="user.svg" alt="" />
          <h2>New Registrations</h2>
          </div>
          <div className="growth-rate">
            <h2>
              
            </h2>
            <span>this month</span>
          </div>
        </div>
        
        <div className="chart">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          width={500}
          height={400}
          data={data}
          
          margin={{
            top: 10,
            right: 30,
            left: 0,
            bottom: 0,
          }}
          
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="users" stroke="#00C49F" fill="#00C49F" />
        </AreaChart>
      </ResponsiveContainer>
      </div>
      </div>
    );
  };

  
  export default MyAreaChart;