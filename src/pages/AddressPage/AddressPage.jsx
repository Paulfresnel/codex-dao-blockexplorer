import { useEffect } from "react";
import { useParams } from "react-router-dom";
import AddressTransactions from "../../components/AddressTransactions/AddressTransactions";


function AddressPage(props){

    const { addressId } = useParams();

    const {alchemy} = props;

    useEffect(()=>{

    }, [])

    return(
        <div>
    <AddressTransactions alchemy={alchemy} addressId={addressId}/>
        </div>
    )
}

export default AddressPage;