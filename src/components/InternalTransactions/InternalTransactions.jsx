import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";

function InternalTransactions(props){

    const {alchemy, allTransfers, addressId} = props;
    const [internalTransfers, setInternalTransfers] = useState([]);


    useEffect(()=>{
     let filteredTransfers = allTransfers.filter(transfer=>{
     if (transfer.category === 'internal'){
         return transfer;
     }
     })
     setInternalTransfers(filteredTransfers);
    }, [allTransfers]);
    

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
                {internalTransfers.map( (transfer,index)=>{
                    if (transfer.value === null){
                        transfer.value = "-"
                    }
                return (
                <tr key={index} className="table-row">
                    <td><Link to={`/tx/${transfer.hash}`}>{transfer.hash.slice(0,20)+"..."}</Link></td>
                    <td>{parseInt(transfer.blockNum).toLocaleString('en-US')}</td>
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

export default InternalTransactions;