import { useEffect, useState } from "react";
import InternalTransactions from "../InternalTransactions/InternalTransactions";
import AllTransactions from "../AllTransactions/AllTransactions";
import ExternalTransactions from "../ExternalTransactions/ExternalTransactions";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import { MutatingDots } from "react-loader-spinner";
import './AddressTransactions.css'


function AddressTransactions(props){
    const { alchemy, addressId } = props;
    const [viewDisplay, setViewDisplay] = useState("all");
    const [allTransfers, setAllTransfers] = useState([]);
    const [key, setKey] = useState('all');
    const [isLoading, setIsLoading] = useState(true);

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
        fetchTxHistory();
        setTimeout(()=>{
            setIsLoading(false);
        },1000)
    }, [])

    return(
        <div>
            <h2>Latest Transactions</h2>
            {isLoading && <MutatingDots 
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
            />}
            {!isLoading && <div className="tx-container-address">
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
                  
                </Tabs>
            </div>
            </div>}
        </div>
    )
}

export default AddressTransactions