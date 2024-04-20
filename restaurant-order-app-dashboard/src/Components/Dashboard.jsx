import "../Style/dashboard.css"
import Cards from "./Cards";

function Dashboard() {

    return(
        <div className="dashboard-container">
            <div className="top-container">
                <img src="../src/assets/logo.png" className="logo"/>
                <input className="search-bar" placeholder="Search..."/>
            </div>
            <div className="statistics-cards">
                <Cards name="Total Orders"/>
                <Cards name="Total Income"/>
                <Cards name="Total Options"/>
                <Cards name="Average Cost"/>
            </div>
            <div className="charts">

            </div>
        </div>
    );
}

export default Dashboard;