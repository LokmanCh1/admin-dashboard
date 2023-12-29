import React, { useEffect, useState } from 'react'
import { Area, AreaChart, Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts'
import "./chartbox.scss"

interface ChartData {
    month: string;
    feedbacks: number;
    growth:number;
  }

const FeedbacksLineChart = () => {
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
    const token = localStorage.getItem('token');

    useEffect(() => {
      const apiUrl = 'http://127.0.0.1:8000/api/statistics/feedbacks_growth_rate/';
      
      fetch(apiUrl,{
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
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
                feedbacks:apiData.rd_previous_month_feedbacks,
                growth:apiData.growth_rate
            },
            {
                month:previous2ndMonthName.slice(0,3),
                feedbacks:apiData.nd_previous_month_feedbacks,
                growth:apiData.growth_rate
            },
            {
                month:previousMonthName.slice(0,3),
                feedbacks:apiData.previous_month_feedbacks,
                growth:apiData.growth_rate
            },
            {
                month:currentMonthName.slice(0,3),
                feedbacks:apiData.current_month_feedbacks,
                growth:apiData.growth_rate
            },

          ]
          setMessagesCount(newData[3].feedbacks)
          setGrowthRate(newData[1].growth)
          setData(newData);
          
        })
        .catch(error => {
          console.error('Fetch error:', error);
        });
    }, []); // Empty dependency array ensures the effect runs once on mount

    const  growth = document.querySelector(".percentage")as HTMLElement;
    if(growth){
    if ( data[1].growth!=null && data[1].growth <0 ){
      growth.innerHTML = `-${data[1].growth}%`
      growth.style.color = "red"
    } 
    else{
      growth.innerHTML = `+${data[1].growth}%`
    }
    console.log("dsadasda",data[1].growth)
  }
  return (
    <div className='chartbox'>
        <div className="box-info">
            <div className="title">
                <img src="/feedback.svg" alt="" />
                <span>feedbacks</span>
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
            <Area type="monotone" dataKey="feedbacks" stroke="#00C49F" fill="#00C49F" />
            
             </AreaChart>
            </ResponsiveContainer>
            </div>
            
        </div>
    </div>
  )
}

export default FeedbacksLineChart