import { useEffect, useState } from "react";
import InternalTransactions from "../InternalTransactions/InternalTransactions";
import AllTransactions from "../AllTransactions/AllTransactions";
import ExternalTransactions from "../ExternalTransactions/ExternalTransactions";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { MutatingDots } from "react-loader-spinner";
import './AddressTransactions.css'
import NftTransactions from "../NFTTransactions/NftTransactions";
import TokenSwapTransactions from "../TokenSwapTransactions/TokenSwapTransactions";
import ClipboardJS from "clipboard";
import axios from "axios";
import { Tooltip } from "react-bootstrap";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

new ClipboardJS('.clipboarded');

function AddressTransactions(props){
    const { alchemy, addressId } = props;
    const [viewDisplay, setViewDisplay] = useState("all");
    const [allTransfers, setAllTransfers] = useState([]);
    const [key, setKey] = useState('all');
    const [isLoading, setIsLoading] = useState(true);
    const [accountNonce, setAccountNonce] = useState(0);
    const [accountBalance, setAccountBalance] = useState(0);
    const [ethPrice, setEthPrice] = useState(1900);

    const renderNonceTip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      Number of transactions realized of the Address.
    </Tooltip>
    );

    let fetchETHPrice = async (e) =>{
            e.preventDefault();
            const ethInfo = await axios.get(`https://api.etherscan.io/api?module=stats&action=ethprice&apikey=${process.env.REACT_APP_ETHERSCAN_API}`);
            let ethPriceUSD = ethInfo.data.result.ethusd;
            console.log(ethInfo.data.result.ethusd);
            setEthPrice(ethPriceUSD);
        }

    useEffect(()=>{

        let fetchTxHistory = async () =>{
        const txHistory = await alchemy.core.getAssetTransfers({
            fromBlock: "0x0",
            toAddress: addressId,
            excludeZeroValue: true,
            category: ["external", "internal", "erc20", "erc721", "erc1155"],
            maxCount: "0x64"
        });
        txHistory.transfers.sort((a,b)=>{
           return parseInt(b.blockNum) - parseInt(a.blockNum)
        })
            setAllTransfers(txHistory.transfers);
            console.log(txHistory);
        }

        let fetchTxCount = async ()=>{
            let txCount = await alchemy.core.getTransactionCount(addressId);
            console.log("nonce:",txCount)
        }

        let fetchAccountBalance = async ()=>{
            let accountBalance = await alchemy.core.getBalance(addressId);
            console.log("balance:", accountBalance);
            let balance = parseInt(accountBalance)/(10**18);
            setAccountBalance(balance);
        }

        let fetchAccountNonce = async ()=>{
            let nonce = await alchemy.core.getTransactionCount(addressId);
            setAccountNonce(nonce);
        }

        fetchAccountNonce();
        fetchAccountBalance();
        fetchTxHistory();
        fetchTxCount();
        setTimeout(()=>{
            setIsLoading(false);
        },1000)
    }, [addressId])

    return(
        <div>
            
            {isLoading && <div className="centered"><MutatingDots 
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
            /></div>}
            {!isLoading && <div className="main">
            <div className="account-container">
                <div className="account-card">
                    <h5>Overview</h5>
                    <div className="small-divider"/>
                    <div className="flex-row-full">
                        <div className="flex-column">
                            <p className="label">Contract Address</p>
                            <div className="flex-row-alligned">
                            <p>{addressId}</p>
                            <i class="bi bi-clipboard-check clipboarded" data-clipboard-text={addressId}></i>
                            </div>
                            
                        </div>
                        <div className="flex-column">
                            <h6 className="label">ETH Balance</h6>
                            <p><span className="highlight">{accountBalance.toFixed(2)}</span> ETH </p>
                        </div>
                        <div className="flex-column">
                            <h6 className="label">ETH Value<i onClick={(e)=>fetchETHPrice(e)} class="bi bi-arrow-clockwise icon-margin-l"></i></h6>
                            <p> {"$"+" "+ (accountBalance*ethPrice).toLocaleString('en-US')}</p>
                        </div>
                        <div className="flex-column">
                        <div className="flex-row-alligned">
                            <h6 className="label">Account Nonce</h6>
                            <OverlayTrigger placement="top" delay={{ show: 250, hide: 400 }}overlay={renderNonceTip}>
                            <i class="bi bi-info-circle icon-margin-l"></i>
                            </OverlayTrigger>
                        </div>
                            <p>{accountNonce.toLocaleString('en-US')}</p>
                        </div>
                    </div>
                </div>
            </div>
            <h2 className="latest-tx">Latest Transactions</h2>
            <div className="tx-container-address">
            <div>
                <Tabs
                  id="uncontrolled-tab"
                  defaultActiveKey="all"
                  className="mb-3"
                >
                  <Tab eventKey="all" title="All">
                    <AllTransactions allTransfers={allTransfers} alchemy={alchemy}  addressId={addressId} />
                  </Tab>
                  <Tab eventKey="internal" title="Internal">
                    <InternalTransactions setAllTransfers={setAllTransfers} allTransfers={allTransfers} alchemy={alchemy} addressId={addressId} />
                  </Tab>
                  <Tab eventKey="external" title="External">
                    <ExternalTransactions allTransfers={allTransfers}  alchemy={alchemy}  addressId={addressId} />
                  </Tab>
                  <Tab eventKey="nft" title="NFTs">
                    <NftTransactions allTransfers={allTransfers}  alchemy={alchemy}  addressId={addressId} />
                  </Tab>
                   <Tab eventKey="swap" title="Token Swap">
                    <TokenSwapTransactions allTransfers={allTransfers}  alchemy={alchemy}  addressId={addressId} />
                  </Tab>
                  
                </Tabs>
            </div>
            </div>
            </div>}
        </div>
    )
}

export default AddressTransactions