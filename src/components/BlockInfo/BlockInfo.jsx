import { useEffect, useState } from "react";
import { ProgressBar } from "react-bootstrap";
import { Link } from "react-router-dom";
import Table from "react-bootstrap";
import { toHex } from "alchemy-sdk";
import { MutatingDots } from "react-loader-spinner";
import Badge from "react-bootstrap/Badge";


function BlockInfo(props){
    const [blockTime, setBlockTime] = useState('');
    const [burntFees, setBurntFees] = useState(0);
    const [gasUsed, setGasUsed] = useState(0);
    const [fillRate, setFillRate] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [blockAge, setBlockAge] = useState(0);
    const [timeUnit, setTimeUnit] = useState('');
    const {block} = props;


    useEffect(()=>{

        const fetchBlockInfo = () =>{
            let dateToday =  new Date().getTime();
            setGasUsed(parseInt(block.gasUsed._hex));
            let fillRate = parseInt(block.gasUsed._hex)/parseInt(block.gasLimit._hex)
            setFillRate(fillRate);

            let date = (block.timestamp)*1000;
            let timeDifference = 0;
            let timeDifferenceTimestamp = ((dateToday - date)/1000);

            if (timeDifferenceTimestamp > 2629743 && timeDifferenceTimestamp < (31556926*2)){
                timeDifference = timeDifferenceTimestamp/2629743;
                setTimeUnit("months")
            }
            else if (timeDifferenceTimestamp < 86400){
                timeDifference = timeDifferenceTimestamp/3600;
                setTimeUnit("hours")
            }
            else if (timeDifferenceTimestamp > 86400 && timeDifferenceTimestamp < 2629743){
                timeDifference = timeDifferenceTimestamp/604800
                setTimeUnit('weeks')
            }
            else if (timeDifferenceTimestamp >= (31556926*2)){
                timeDifference = timeDifferenceTimestamp/31556926;
                setTimeUnit('years');
            }
            setBlockAge(timeDifference);
            let dateObject = new Date(date);
            const format = {
              weekday: 'long',
              day: 'numeric', 
              month: "2-digit", 
              year: "numeric"
            }
            let blockDate = dateObject.toLocaleTimeString('en-US', format);
            if (block.baseFeePerGas){
            let baseFeePerGas = block.baseFeePerGas._hex;
            let burntFees = (baseFeePerGas * parseInt(block.gasUsed._hex))/(10**18);
            setBurntFees(burntFees);
            }
            setBlockTime(blockDate);

            
            setIsLoading(false);
        }
        fetchBlockInfo();
      
    },[])

    return(
        <div className="margin-b">
        {isLoading && <div className="centered"><MutatingDots 
           height="100"
           width="100"
           color="#6d83ff"
           secondaryColor= '#0099ff'
           radius='12.5'
           ariaLabel="mutating-dots-loading"
           wrapperStyle={{}}
           wrapperClass=""
           visible={true}
        /></div>}
        {!isLoading && <div><h2>Block #{block.number.toLocaleString('en-US')}</h2>
       <div className="latest-block">
        <div>
            <div className="flex-row-alligned">
            <p>Mined on <span className="highlight">{blockTime}</span> </p>
           <Badge variant='info'><div className="badge-big"> Mined {blockAge.toFixed(2)} {timeUnit} ago</div></Badge> 
            </div>
            <p>Mined by Address <Link to={`/address/${block.miner}`}><code className="miner">{block.miner}</code></Link></p>
        </div>
           {block.baseFeePerGas ?  <div>
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
            </div> : <p> This block was mined using PoW mining method and was wined prior to the implementation of the EIP-1559 Upgrade which introduced the 'burning' 
                        feature of Ethereum as well as prior to the upgrade to PoS. </p>}

        </div>
</div>}
        </div>
    )
}

export default BlockInfo