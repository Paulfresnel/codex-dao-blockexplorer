import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { toHex } from 'alchemy-sdk';


import './SearchBar.css';

function SearchBar(){
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const reg = new RegExp('^[0-9]+$')

    let userQuery = async (e) =>{
        console.log(query)
        e.preventDefault();
        if (query.length === 42 && query[0] === "0" && query[1] === 'x'){
            console.log("address query");
            navigate(`/address/${query}`)

        }
        else if (query.length === 66 && query[0] === "0" && query[1] === 'x' ){
            console.log("tx query");
            navigate(`/tx/${query}`);
        }
        else if (reg.test(query)){
            console.log("block query");
            navigate((`/block/${toHex(query)}`));
        }
    }

    return(
        <div >
        <form className='form' onSubmit={(e)=>userQuery(e)}>
        
        <input onChange={(e)=>setQuery(e.target.value)} className="large-input" placeholder="Search by Address, Block Number or Transaction Hash"></input>
       <Button onClick={(e)=>userQuery(e)} className='search-btn' variant="primary"><i className="bi bi-search"></i> Search</Button>{' '}
        </form>
        </div>
    )
}
export default SearchBar