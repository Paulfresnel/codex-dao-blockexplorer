import { useEffect, useState } from 'react';
import { useParams} from 'react-router-dom'
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
    const {alchemy} = props;
    const {txId} = useParams();

    const renderToTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
        The receiving party of the transaction (could be a contract address).
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
        fetchTx(txId);
    }, [])

    return (
        <div>
    <h1>Transaction Details</h1>
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
            <p>Tx Hash: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{tx.hash}</p>
                <i class="bi bi-clipboard-check clipboarded" data-clipboard-text={tx.hash}></i>
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
                <Badge className='badge' bg="info"><span className='highlight'>{(latestBlock-txBlockNumber).toLocaleString("en-US")} </span>blocks ago</Badge>{' '}
            </div>
        </div>
        <div className='divider'/>
        <div className='tx-flex-row'>
            <div className='tx-flex-row-internal'>
                <OverlayTrigger placement="right" delay={{ show: 250, hide: 400 }}overlay={renderFromTip}>
                    <i class="bi bi-info-circle icon-m-r"></i>
                </OverlayTrigger>
            <p>From: </p>
            </div>
            <div className='tx-flex-row-internal'>
                <p>{tx.from}</p>
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
                <p>{tx.to}</p>
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
                <Badge bg="success"><span className='money-value'>($ {((txValue/(10**18))*ethPrice).toFixed(2)})</span></Badge>
                <i onClick={()=>fetchETHPrice()} class="bi bi-arrow-clockwise icon-m-l"></i>
            </div>
        </div>
     </div>}
        </div>
    )
}

export default TransactionPage