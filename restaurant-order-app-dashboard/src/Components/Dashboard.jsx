import "../Style/dashboard.css"
import Cards from "./Cards";
import React, { useState, useEffect, useRef } from "react"
import Chart from "chart.js/auto"

function Dashboard() {

    const [orders, setOrders] = useState([]);
    const [foods, setFoods] = useState([]);
    const [showButton, setShowButton] = useState(false);

    const chartRefOrders = useRef(null);
    const chartRefIncome = useRef(null);

    useEffect(() => {
        fetch('../foods.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching foods');
                }
                return response.json();
            })
            .then(data => setFoods(data))
            .catch(error => console.error('Error fetching foods:', error));
    }, []);
    
    useEffect(() => {
        fetch('../orders.json')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error fetching orders');
                }
                return response.json();
            })
            .then(data => setOrders(data))
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    useEffect(() => {
        if (chartRefOrders.current) {
            const ctx = chartRefOrders.current.getContext("2d");
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
            const lastWeekOrders = orders.filter(order => {
                return new Date(order.order_date) >= oneWeekAgo;
            });
        
            const uniqueDates = new Set(lastWeekOrders.map(order => order.order_date));
            let dates = [...uniqueDates];
            dates = dates.reverse();
        
            const orderCounts = dates.map(date => {
                const ordersOnDate = lastWeekOrders.filter(order => order.order_date === date);
                return ordersOnDate.length;
            });
        
            if (chartRefOrders.current && chartRefOrders.current.chart) {
                chartRefOrders.current.chart.destroy();
            }
        
            const chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Orders",
                        data: orderCounts,
                        backgroundColor: "hsl(337, 29%, 49%)",
                        borderColor: "hsl(337, 29%, 49%)",
                        tension: 0.3,
                    }]
                },
                options: {
                    width: 800,
                    height: 400,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                            },
                            stepSize: 1,
                            precision: 0
                        },
                    }
                }
            });        
            chartRefOrders.current.chart = chart;
        }
    }, [orders]);

    useEffect(() => {
        if (chartRefIncome.current) {
            const ctx = chartRefIncome.current.getContext("2d");
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
            const lastWeekOrders = orders.filter(order => {
                return new Date(order.order_date) >= oneWeekAgo;
            });
        
            const uniqueDates = new Set(lastWeekOrders.map(order => order.order_date));
            let dates = [...uniqueDates];
            dates = dates.reverse();
        
            const incomePerDay = dates.map(date => {
                const ordersOnDate = lastWeekOrders.filter(order => order.order_date === date);
                return ordersOnDate.reduce((total, order) => total + order.total_price, 0);
            });
        
            if (chartRefIncome.current && chartRefIncome.current.chart) {
                chartRefIncome.current.chart.destroy();
            }
        
            const chart = new Chart(ctx, {
                type: "line",
                data: {
                    labels: dates,
                    datasets: [{
                        label: "Income",
                        data: incomePerDay,
                        backgroundColor: "hsl(240, 100%, 60%)",
                        borderColor: "hsl(240, 100%, 60%)",
                        tension: 0.3,
                    }]
                },
                options: {
                    width: 800,
                    height: 400,
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                            },
                            precision: 2
                        },
                    }
                }
            });        
            chartRefIncome.current.chart = chart;
        }
    }, [orders]);

    function findMostOrderedProduct(orders) {
        const productCount = {};
    
        orders.forEach(order => {
            order.items.forEach(item => {
                const productName = item.name;
                if (productCount[productName]) {
                    productCount[productName]++;
                } else {
                    productCount[productName] = 1;
                }
            });
        });
    
        let mostOrderedProduct = null;
        let maxCount = 0;
    
        Object.entries(productCount).forEach(([productName, count]) => {
            if (count > maxCount) {
                mostOrderedProduct = productName;
                maxCount = count;
            }
        });
    
        return mostOrderedProduct;
    }

    const toggleButton = () => {
        setShowButton(!showButton);
    };

    const handleTotalOrdersClick = () => {
        setShowChart(true);
    };

    return(
        <div className="dashboard-container">
            <div className="top-container">
                <img src="../src/assets/logo.png" className="logo"/>
                <input className="search-bar" placeholder="Search..."/>
            </div>
            <div className="statistics-cards">
                <Cards name="Total Orders" statistic={orders.length} unit="Orders"  showButton={false} handleClick={handleTotalOrdersClick}/>
                <Cards name="Total Income" statistic={orders.length > 0 ? orders.reduce((total, order) => total + order.total_price, 0).toFixed(2) : 0} unit="€" showButton={false}/>
                <Cards name="Total Options" statistic={foods.length} unit="Dishes" showButton={true} handleButtonClick={toggleButton} />
                <Cards name="Most Ordered" statistic={findMostOrderedProduct(orders)} showButton={false}/>
            </div>
            <div className="charts-container">
                <div className="charts">
                    <canvas ref={chartRefOrders}></canvas>
                </div>
                <div className="charts">
                    <canvas ref={chartRefIncome}></canvas>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
