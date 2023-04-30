import { useEffect, useState } from 'react';
import { useParams, Link} from 'react-router-dom'
import { MutatingDots } from 'react-loader-spinner';
import "./TransactionPage.css"
import ClipboardJS from 'clipboard';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Badge from 'react-bootstrap/Badge';
import axios from 'axios';


new ClipboardJS(".clipboarded");

function TransactionPage(props){
    const [isLoading, setIsLoading] = useState(true);
    const [tx, setTx] = useState({});
    const [latestBlock, setLatestBlock] = useState(0);
    const [txDate, setTxDate] = useState('');
    const [txBlockNumber, setTxBlockNumber] = useState(0);
    const [txValue, setTxValue] = useState(0);
    const [ethPrice, setEthPrice] = useState(1900);
    const [txStatus, setTxStatus] = useState(0);
    const [txCost, setTxCost] = useState(0);
    const {alchemy} = props;
    const {txId} = useParams();

    const renderToTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The receiving party of the transaction (could be a contract address).
    </Tooltip>);

    const renderTxStatusTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The status of the transaction.
    </Tooltip>);

    const renderTxTypeTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
       Indicates if the transaction if a simple Transfer between Accounts or if it's a smart contract call.
    </Tooltip>);

    const renderTxFeeTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        Amount paid to the block producer for processing the transaction.
    </Tooltip>);

    const renderFromTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The sending party of the transaction.
    </Tooltip>);

    const renderBlockTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Number of the block in which the transaction is recorded. Block confirmations indicate how many blocks have been added since the transaction was produced.
    </Tooltip>
    );
    
    const renderTxHashTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        A TxHash or transaction hash is a unique 66-character identifier that is generated whenever a transaction is executed.   
    </Tooltip>
    );
    const renderTimestampTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      The date and time at which a transaction is produced.
    </Tooltip>
    );

    let fetchETHPrice = async () =>{
            const ethInfo = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API}`);
            let ethPriceUSD = ethInfo.data.result.ethusd;
            console.log(ethInfo.data.result.ethusd);
            setEthPrice(ethPriceUSD);
        }


    useEffect(()=>{

        let fetchTxReceipt = async (txId) =>{
            const txReceipt = await alchemy.core.getTransactionReceipt(txId);
            console.log("tx receipt:",txReceipt)
            setTxStatus(txReceipt.status);
            let gasUsed = parseInt(txReceipt.gasUsed._hex);
            let gasPrice = parseInt(txReceipt.effectiveGasPrice._hex);
            let txCostWei = gasUsed * gasPrice;
            let txCostETH = txCostWei/(10**18);
            console.log("txCost:", txCost);
            setTxCost(txCostETH);
        }

        let fetchTx = async (txId) =>{
            const txResponse = await alchemy.transact.getTransaction(txId);
            const txBlock = await alchemy.core.getBlock(txResponse.blockNumber);
            setTxBlockNumber(txBlock.number);
            let date = txBlock.timestamp;
            let dateObject = new Date(date*1000);
            const format = {
              weekday: 'long',
              day: 'numeric', 
              month: "2-digit", 
              year: "numeric"
            }
            let blockDate = dateObject.toLocaleTimeString('en-US', format);
            setTxDate(blockDate);
            let transactionValue = parseInt(txResponse.value._hex);
            setTxValue(transactionValue);
            console.log(txResponse);
            setTx(txResponse);
            setTimeout(()=>{
                setIsLoading(false);
            }, 1000)
            
        }

        let fetchLatestBlock = async () =>{
            const block = await alchemy.core.getBlock();
            setLatestBlock(block.number);
        }

        fetchLatestBlock();
        fetchTxReceipt(txId);
        fetchTx(txId);
    }, [])

    return (
        <div>
    <h1 className='main'>Transaction Details</h1>
    {isLoading && <div className='centered'>
    <MutatingDots 
    className="centered"
      height="100"
      width="100"
      color="#6d83ff"
      secondaryColor= '#0099ff'
      radius='12.5'
      ariaLabel="mutating-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
      visible={true}
     />
     </div>}
     {!isLoading && 
     <div className='tx-container'>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderTxHashTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>Transaction Hash: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{tx.hash}</p>
                <i class="bi bi-clipboard-check clipboarded" data-clipboard-text={tx.hash}></i>
            </div>
        </div>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderTxStatusTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>Transaction Status: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{txStatus === 1 ? <Badge className='badge' bg="success"> <i class="bi bi-check"></i>Success </Badge> : <Badge className='badge' bg="danger"> Failure </Badge>}</p>
            </div>
        </div>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderBlockTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>Block: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{tx.blockNumber.toLocaleString("en-US")}</p>
                <i class="bi bi-clipboard-check clipboarded" data-clipboard-text={tx.blockNumber}></i>
            </div>
        </div>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderTimestampTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>Timestamp: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{txDate}</p>
                <Badge className='badge' bg="info"><span className='highlight'>{(latestBlock-txBlockNumber).toLocaleString("en-US")} blocks ago </span></Badge>{' '}
            </div>
        </div>
        <div className='divider'/>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderTxTypeTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>Type: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{tx.data === '0x0' ? "Transfer" : "Smart Contract Call"}</p>
            </div>
        </div>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderFromTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>From: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p><Link to={`/address/${tx.from}`}>{tx.from}</Link></p>
                <i class="bi bi-clipboard-check clipboarded" data-clipboard-text={tx.from}></i>
            </div>
        </div>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderToTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>To: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p><Link to={`/address/${tx.to}`}>{tx.to}</Link></p>
                <i class="bi bi-clipboard-check clipboarded" data-clipboard-text={tx.to}></i>
            </div>
        </div>
        <div className='divider'/>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderToTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>Value: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{txValue/(10**18)} ETH</p>
                <Badge bg="success"><span className='money-value'> $ {((txValue/(10**18))*ethPrice).toFixed(2)} </span></Badge>
                <i onClick={()=>fetchETHPrice()} class="bi bi-arrow-clockwise icon-m-l"></i>
            </div>
        </div>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderTxFeeTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>Transaction Fee: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{txCost} ETH</p>
                <Badge className='fee-box' bg="secondary"><span className='money-value-fee'> $ {(txCost * ethPrice).toFixed(2)} </span></Badge>
            </div>
        </div>
     </div>}
        </div>
    )
}

export default TransactionPage