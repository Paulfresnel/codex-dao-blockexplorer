import { Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import './BlockTransactions.css'

function BlockTransactions(props){

    const {blockTransactions} = props;



    return(
        <div className="block-tx-container">
    <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Tx Hash</th>
                    <th>Type</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Value</th>
                    <th>Nonce</th>
                </tr>
            </thead>
            <tbody>
                {blockTransactions.map( (transfer,index)=>{
                    
                return <tr key={transfer.hash} className="table-row">
                    <td><Link to={`/tx/${transfer.hash}`}>{transfer.hash.slice(0,20)+"..."}</Link></td>
                    <td>{transfer.data === '0x0' ? "Transfer" : "Smart Contract Call"}</td>
                    <td><Link to={`/address/${transfer.from}`}>{transfer.from.slice(0,20)+"..."}</Link></td>
                    <td><Link to={`/address/${transfer.to}`}>{transfer.to.slice(0,20)+"..."}</Link></td>
                    <td>{parseInt(transfer.value._hex).toLocaleString("en-US")}</td>
                    <td>{transfer.nonce.toLocaleString('en-US')}</td>
                </tr>
            })}
            </tbody>
        </Table>
        </div>
    )
}

export default BlockTransactions