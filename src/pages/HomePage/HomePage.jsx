import LatestBlock from "../../components/LatestBlock/LatestBlock";
import "./HomePage.css";
import { Button } from "react-bootstrap";

function HomePage(props){

    const {alchemy} = props;
    
    return(
        <div>
        <h1 className="intro">Welcome to the <span className="branded">CodeX DAO</span> Ethereum Explorer built for everyone</h1>
        <div className="small-divider"/>
        <p className="italic">An Easy to Navigate UI for an optimal UX</p>
        <p>Get Started now by searching an <span className="highlight">Address, Transaction Hash or a Block Number</span> to get more information about the state of Ethereum in that time</p>
        <div className="divider"/>
        <h2>Use the Arrows below to navigate between the latest mined blocks</h2>
        <p>Refresh this page to fetch the latest block on the Ethereum Chain</p>
        <LatestBlock alchemy={alchemy}/>
        </div>
    )
}

export default HomePage;