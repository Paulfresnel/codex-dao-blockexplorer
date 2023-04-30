import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState } from "react";
import './AllTransactions.css'

function AllTransactions(props){
    const {alchemy, allTransfers, addressId} = props;
    const [ethPrice, setEthPrice] = useState(1900);
    return(
        <div>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Tx Hash</th>
                    <th>Block Number</th>
                    <th>Category</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value</th>
                    <th>Asset</th>
                </tr>
            </thead>
            <tbody>
                {allTransfers.map( (transfer,index)=>{
                    if (transfer.value === null){
                        transfer.value = "-"
                    }
                    if (transfer.category === "erc721" || transfer.category === "erc1155"){
                        transfer.category = "NFT" 
                    }
                    if (transfer.category === "erc20"){
                        transfer.category = "Token Swap"
                    }
                    if (parseInt(transfer.value).toString().includes('e')){
                        transfer.value.toFixed(20);
                    }
                return <tr key={transfer.hash} className="table-row">
                    <td><Link to={`/tx/${transfer.hash}`}>{transfer.hash.slice(0,20)+"..."}</Link></td>
                    <td>{parseInt(transfer.blockNum).toLocaleString('en-US')}</td>
                    <td>{transfer.category}</td>
                    <td><Link to={`/address/${transfer.from}`}>{transfer.from.slice(0,20)+"..."}</Link></td>
                    <td><Link to={`/address/${transfer.to}`}>{transfer.to.slice(0,20)+"..."}</Link></td>
                    <td>{transfer.value}</td>
                    <td>{transfer.asset}</td>
                </tr>
            })}
            </tbody>
        </Table>
            
        </div>
    )
}

export default AllTransactions