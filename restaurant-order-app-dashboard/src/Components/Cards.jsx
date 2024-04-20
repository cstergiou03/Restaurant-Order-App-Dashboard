import "../Style/cards.css"

function Cards(props){

    return(
        <div className="card-container">
            <h2>{props.name}</h2>
        </div>
    );
}

export default Cards;