import React, { useEffect, useState } from 'react'
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import "./chartbox.scss"

interface ChartData {
    month: string;
    messages: number;
    growth:number;
  }

const MessagesLineChart = () => {
    const [data, setData] = useState<ChartData[]>([]);
    const [growthRate, setGrowthRate] = useState<number>()
    const [messagesCount, setMessagesCount] = useState<number>()
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
      const apiUrl = 'http://127.0.0.1:8000/api/statistics/messages_growth_rate/';
  
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
                messages:apiData.rd_previous_month_messages,
                growth:apiData.growth_rate
            },
            {
                month:previous2ndMonthName.slice(0,3),
                messages:apiData.nd_previous_month_messages,
                growth:apiData.growth_rate
            },
            {
                month:previousMonthName.slice(0,3),
                messages:apiData.previous_month_messages,
                growth:apiData.growth_rate
            },
            {
                month:currentMonthName.slice(0,3),
                messages:apiData.current_month_messages,
                growth:apiData.growth_rate
            },

          ]
          setMessagesCount(newData[3].messages)
          setGrowthRate(newData[1].growth)
          setData(newData);
          
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }, []); // Empty dependency array ensures the effect runs once on mount

    const  growth = document.querySelector(".percentage")as HTMLElement;
    if(growth){
    if ( growthRate!=null && growthRate <0 ){
      growth.innerHTML = `-${growthRate}%`
      growth.style.color = "red"
    } 
    else{
      growth.innerHTML = `+${growthRate}%`
    }
    console.log(data)
  }
  return (
    <div className='chartbox'>
        <div className="box-info">
            <div className="title">
                <img src="/message-regular.svg" alt="" />
                <span>messages</span>
            </div>
            <div className="text">
                <span className="percentage"> 45%</span>
                <span className="duration">this month</span>
            </div>
            {/* <h2>{messagesCount}</h2> */}
        </div>
        <div className="chart-info">
            <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart width={300} height={100} data={data} >
                <Tooltip contentStyle={{background:"transparent", border:"none"}}
                labelStyle={{display:"none"}}
                />
            <Area type="monotone" dataKey="messages" stroke="#00C49F" fill="#00C49F" />
            
             </AreaChart>
            </ResponsiveContainer>
            </div>
            
        </div>
    </div>
  )
}

export default MessagesLineChart