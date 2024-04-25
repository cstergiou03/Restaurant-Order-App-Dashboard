import "../Style/orders.css"
import React, { useState, useEffect } from "react"
import UndoneOrders from "./UndoneOrders";

function Orders(){

    const [undoneOrders, setUndoneOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/api/undoneOrders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setUndoneOrders(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }, []);

    function handleDeleteOrder() {
        fetch('http://localhost:3000/api/undoneOrders')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            setUndoneOrders(data);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    }


    return (
        <div className="order-summary">
            {undoneOrders.map(order => (
                <UndoneOrders 
                    key={order._id} 
                    order={order} 
                    onDelete={handleDeleteOrder}
                />
            ))}
        </div>
    );
}

export default Orders;
