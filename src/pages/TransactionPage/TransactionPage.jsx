import { useEffect } from 'react';
import { useParams} from 'react-router-dom'

function TransactionPage(props){
    const {alchemy} = props;
    const {txId} = useParams();
    console.log(txId)
    useEffect(()=>{

    }, [])

    return (
        <div>
    <h1>Transaction</h1>
        </div>
    )
}

export default TransactionPage