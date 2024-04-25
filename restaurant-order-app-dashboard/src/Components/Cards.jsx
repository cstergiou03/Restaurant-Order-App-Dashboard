import "../Style/cards.css"
import React, { useState } from 'react'
import Popup from 'reactjs-popup';

function Cards(props){

    const [foodName, setFoodName] = useState('');
    const [foodPrice, setFoodPrice] = useState('');
    const [foodImage, setFoodImage] = useState(null);
    const [allFieldsFilled, setAllFieldsFilled] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const openModal = () => setShowModal(true);
    const closeModal = () => setShowModal(false);

    const handleFoodNameChange = (e) => {
        setFoodName(e.target.value);
        checkFieldsFilled();
    };

    const handleFoodPriceChange = (e) => {
        setFoodPrice(e.target.value);
        checkFieldsFilled();
    };

    const handleFoodImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFoodImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            console.error('No file selected.');
        }
        checkFieldsFilled();
    };
    

    const checkFieldsFilled = () => {
        if (foodName.trim() && foodPrice && foodImage) {
            setAllFieldsFilled(true);
        } else {
            setAllFieldsFilled(false);
        }
    };

    const handleUpload = () => {
        if (!allFieldsFilled) {
            const formData = new FormData();
            formData.append('name', foodName);
            formData.append('price', foodPrice);
            formData.append('photo', foodImage);
    
            fetch('http://localhost:3000/api/foods', {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                console.log('Επιστραφέντα δεδομένα:', data);
            })
            .catch(error => {
                console.error('Σφάλμα κατά την αποστολή αίτησης:', error);
            });
            
            closeModal();
            clearFields();
        } else {
            alert("Please fill in all fields before uploading.");
        }
    };

    const clearFields = () => {
        setFoodName('');
        setFoodPrice('');
        setFoodImage(null);
        setAllFieldsFilled(false);
    };

    return(
        <div className="card-container">
            <h2>{props.name}</h2>
            <h2>{props.statistic} {props.unit}</h2>
            <Popup className="popup" trigger=
                    {props.showButton && <button className="add-button" onClick={openModal}>Add Dishes</button>} 
                    modal nested>
                    {
                        close => (
                            <div className='overlay'>
                                <div className='modal'>
                                    <h2 className='info-head'>Add Dish</h2>
                                    <div className="new-name">
                                        <h3>Food Name</h3>
                                        <input type="text" placeholder="Name..." value={foodName} onChange={handleFoodNameChange}/>
                                    </div>
                                    <div className="new-price">
                                        <h3>Food Price</h3>
                                        <input type="number" placeholder="Price..." value={foodPrice} onChange={handleFoodPriceChange}/>
                                    </div>
                                    <div className="new-photo">
                                        <h3>Food Image</h3>
                                        <input type="file" accept="image/png, image/jpeg" onChange={handleFoodImageChange} />
                                    </div>
                                    <div className="buttons-container">
                                        <button className='info-button' onClick={() => { handleUpload(); }}>Upload</button>
                                        <button className='info-button' onClick={() => {close(); clearFields();}}>Close</button>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                </Popup> 
        </div>
    );
}

export default Cards;
