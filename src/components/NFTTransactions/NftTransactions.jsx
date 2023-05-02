import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

function NftTransactions(props){

    const {allTransfers} = props;

    const [nftTransactions, setNftsTransactions] = useState([]);

    useEffect(()=>{
        let filteredTransactions = allTransfers.filter(transfer=>{
            if (transfer.category === 'NFT'){
                return transfer;
            }
        })
        setNftsTransactions(filteredTransactions);
        console.log("nfts:", nftTransactions);
    }, [])
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
                {nftTransactions.map( (transfer,index)=>{
                    if (transfer.value === null){
                        transfer.value = "-"
                    }
                return (
                <tr key={"0x"+index} className="table-row">
                    <td><Link to={`/tx/${transfer.hash}`}>{transfer.hash.slice(0,20)+"..."}</Link></td>
                    <td><Link to={`/block/${transfer.blockNum}`}>{parseInt(transfer.blockNum).toLocaleString('en-US')}</Link></td>
                    <td>{transfer.category}</td>
                    <td><Link to={`/address/${transfer.from}`}>{transfer.from.slice(0,20)+"..."}</Link></td>
                    <td><Link to={`/address/${transfer.to}`}>{transfer.to.slice(0,20)+"..."}</Link></td>
                    <td>{transfer.value}</td>
                    <td>{transfer.asset}</td>
                </tr> )
            })}
            </tbody>
        </Table>
        </div>
    )
}
export default NftTransactions;