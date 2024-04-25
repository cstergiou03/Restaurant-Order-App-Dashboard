import "../Style/undoneOrders.css";
import { useState } from 'react';

function UndoneOrders({order, onDelete}) {
    const [isDeleted, setIsDeleted] = useState(false);

    function DoneOrder() {
        const formattedItems = order.items.map(item => ({
            name: item.name,
            quantity: item.quantity
        })); 
        const orderData = {
            items: formattedItems,
            total_price: order.total_price,
            address: order.address,
            order_date: new Date().toISOString().split('T')[0]
        };
    
        fetch('http://localhost:3000/api/orders', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(orderData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Order placed successfully with ID:', order._id);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
            
        fetch(`http://localhost:3000/api/undoneOrders/${order._id}`, {
            method: 'DELETE'
        })
        .then(deleteResponse => {
            if (!deleteResponse.ok) {
                throw new Error('Network response was not ok');
            }
            console.log('Order deleted successfully');
            onDelete();
            setIsDeleted(true);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });

    }

    if (isDeleted) {
        return null;
    }

    return(
        <div className="undone-orders">
            {order.items.map((item, index) => (
                <p key={index} className="order-items">{item.name}: {item.quantity}</p>
            ))}
            <button className="done-button" onClick={DoneOrder}>Done</button>
        </div>
    );
}

export default UndoneOrders;
