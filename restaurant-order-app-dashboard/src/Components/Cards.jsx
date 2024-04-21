import "../Style/cards.css"

function Cards(props){

    function addDishes(){
        console.log("ok")
    }

    return(
        <div className="card-container">
            <h2>{props.name}</h2>
            <h2>{props.statistic} {props.unit}</h2>
            {props.showButton && <button className="add-button" onClick={addDishes}>Add Dishes</button>}
        </div>
    );
}

export default Cards;