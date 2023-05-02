import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AddressTransactions from "../../components/AddressTransactions/AddressTransactions";
import { Button } from "react-bootstrap";



function AddressPage(props){
    const navigate = useNavigate()
    const { addressId } = useParams();

    const {alchemy} = props;

    useEffect(()=>{

    }, [])

    return(
        <div>
        <Button variant='primary' className='go-back' onClick={()=>navigate(-1)}>Go Back</Button>
        <div className='divider'/>
    <AddressTransactions alchemy={alchemy} addressId={addressId}/>
        </div>
    )
}

export default AddressPage;