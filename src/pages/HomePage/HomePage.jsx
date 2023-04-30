import LatestBlock from "../../components/LatestBlock/LatestBlock";

function HomePage(props){

    const {alchemy} = props;
    
    return(
        <div>
        <LatestBlock alchemy={alchemy}/>
        </div>
    )
}

export default HomePage;