import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BlockTransactions from "../../components/BlockTransactions/BlockTransactions";
import './BlockPage.css'
import { Button } from "react-bootstrap";
import { MutatingDots } from "react-loader-spinner";
import BlockInfo from "../../components/BlockInfo/BlockInfo";


function BlockPage(props){
    const navigate = useNavigate();
    const { alchemy } = props;
    const {blockId} = useParams();
    const [block, setBlock] = useState({});
    const [blockTransactions, setBlockTransactions] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const fetchBlock = async () =>{
            const blockFetched = await alchemy.core.getBlockWithTransactions(blockId);
            console.log("block:", blockFetched)
            setBlock(blockFetched);
            setBlockTransactions(blockFetched.transactions);
            setTimeout(()=>{
                setIsLoading(false);
            }, 1000)
        }
        fetchBlock();
    }, [])

    return(
        <div>
        <Button variant='primary' className='go-back' onClick={()=>navigate(-1)}>Go Back</Button>
        <div className='divider'/>

        {isLoading ? <div className="centered"><MutatingDots 
    className="centered"
      height="100"
      width="100"
      color="black"
      secondaryColor= '#0099ff'
      radius='12.5'
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
     /></div> : 
    <div> 
        <BlockInfo block={block}/>
        {blockTransactions.length>1 &&
     <div className="block-tx-container">
        <h1 className="margin-b">Block Transactions</h1>
         <BlockTransactions blockTransactions={blockTransactions}/>
        </div>}
        </div>}
        
        </div>
    )


}

export default BlockPage