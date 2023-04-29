import { useState, useEffect } from "react";
import {Link} from "react-router-dom";
import "./LatestBlock.css";
import ProgressBar from 'react-bootstrap/ProgressBar';
import Spinner from 'react-bootstrap/Spinner';
import Table from 'react-bootstrap/Table';




function LatestBlock(props){
    const [blockNumber, setBlockNumber] = useState();
    const [blockTransactions, setBlockTransactions] = useState([]);
    const [gasUsed, setGasUsed] = useState(0);
    const [fillRate, setFillRate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [blockTime, setBlockTime] = useState('');
    const [burntFees, setBurntFees] = useState(0);
    const {alchemy} = props;

    const prevBlock = async () =>{
        const blockInfo = await alchemy.core.getBlock(blockNumber-1);
        console.log(blockInfo);
        setBlockTransactions(blockInfo.transactions);
        setBlockNumber(blockNumber-1);
        setGasUsed(parseInt(blockInfo.gasUsed._hex));
        let fillRate = parseInt(blockInfo.gasUsed._hex)/parseInt(blockInfo.gasLimit._hex)
        setFillRate(fillRate);
        let date = blockInfo.timestamp;
      let dateObject = new Date(date*1000);
      const format = {
        weekday: 'long',
        day: 'numeric', 
        month: "2-digit", 
        year: "numeric"
      }
      let blockDate = dateObject.toLocaleTimeString('en-US', format)
      let baseFeePerGas = blockInfo.baseFeePerGas._hex;
      let burntFees = (baseFeePerGas * parseInt(blockInfo.gasUsed._hex))/(10**18);
      setBurntFees(burntFees);
      setBlockTime(blockDate);
    }

    const nextBlock = async () =>{
        const blockInfo = await alchemy.core.getBlock(blockNumber+1);
        console.log(blockInfo);
        setBlockTransactions(blockInfo.transactions);
        setBlockNumber(blockNumber+1);
        setGasUsed(parseInt(blockInfo.gasUsed._hex));
        let fillRate = parseInt(blockInfo.gasUsed._hex)/parseInt(blockInfo.gasLimit._hex)
        setFillRate(fillRate);
        let date = blockInfo.timestamp;
      let dateObject = new Date(date*1000);
      const format = {
        weekday: 'long',
        day: 'numeric', 
        month: "2-digit", 
        year: "numeric"
      }
      let blockDate = dateObject.toLocaleTimeString('en-US', format);
      let baseFeePerGas = blockInfo.baseFeePerGas._hex;
      let burntFees = (baseFeePerGas * parseInt(blockInfo.gasUsed._hex))/(10**18);
      setBurntFees(burntFees);
      
      setBlockTime(blockDate);
    }

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
      const blockInfo = await alchemy.core.getBlock(blockNumber);
      console.log(blockInfo);
      setBlockTransactions(blockInfo.transactions);
      setGasUsed(parseInt(blockInfo.gasUsed._hex));
      let fillRate = parseInt(blockInfo.gasUsed._hex)/parseInt(blockInfo.gasLimit._hex)
      setFillRate(fillRate);
      
      let date = blockInfo.timestamp;
      let dateObject = new Date(date*1000);
      const format = {
        weekday: 'long',
        day: 'numeric', 
        month: "2-digit", 
        year: "numeric"
      }
      let blockDate = dateObject.toLocaleTimeString('en-US', format);
      let baseFeePerGas = blockInfo.baseFeePerGas._hex;
      let burntFees = (baseFeePerGas * parseInt(blockInfo.gasUsed._hex))/(10**18);
      setBurntFees(burntFees);
      
      setBlockTime(blockDate);
      setTimeout(()=>{
        setIsLoading(false);
      },1000)
    }
    getBlockNumber();
  }, []);

    return(
        <div>
        {isLoading && <Spinner animation="border" variant="primary" />}
        {!isLoading && <div><h2>Latest Mined Blocks</h2>
        <div className="flex-row-icons">
        <i onClick={prevBlock} className="bi bi-arrow-left-circle-fill"></i>
        <i onClick={nextBlock} className="bi bi-arrow-right-circle-fill"></i>
        </div>
       <div className="latest-block">
        <div>
            <h3>Block Number: {blockNumber.toLocaleString('en-US')}</h3>
            <p>{blockTime}</p>
        </div>
        <div>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Block Transactions ({blockTransactions.length})</th>
                    </tr>
                </thead>
                <tbody>
                    {blockTransactions.slice(0,5).map(tx=>{
                        return <tr>
                                <td>
                                <Link to={`/tx/${tx}`}>
                                {`${tx.slice(0,20)}.....`}
                                </Link>
                                </td>
                            </tr>
                    })}
                </tbody>
            </Table>
            </div>
            <div>
                    <h6>Fees Burnt: 🔥 {burntFees.toFixed(2)} ETH</h6>
                    <p>Gas used: {gasUsed.toLocaleString('en-US')} wei</p>
                    <p>Block Demand Fill Rate: {(fillRate*100).toFixed(2)} %</p>
                    {(fillRate >= 0.4 && fillRate <= 0.6)   &&  <ProgressBar className="bordered" variant="success" now={fillRate*100} />}

                    {fillRate >= 0.85  &&  <ProgressBar className="bordered" variant="danger" now={fillRate*100} />}
                    {fillRate <= 0.15  &&  <ProgressBar className="bordered" variant="danger" now={fillRate*100} />}

                    {(fillRate > 0.7 && fillRate <0.85)  &&  <ProgressBar className="bordered" variant="warning" now={fillRate*100} />}
                    {(fillRate >= 0.15 && fillRate <0.3)  &&  <ProgressBar className="bordered" variant="warning" now={fillRate*100} />}

                    {(fillRate > 0.6 && fillRate <= 0.7)  &&  <ProgressBar className="bordered" variant="info" now={fillRate*100} />}
                    {(fillRate < 0.4 && fillRate >= 0.3)  &&  <ProgressBar className="bordered" variant="info" now={fillRate*100} />}
            </div>

        </div>
</div>}
        </div>
    )
}

export default LatestBlock