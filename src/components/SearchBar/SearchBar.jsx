import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


import './SearchBar.css';

function SearchBar(){
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    let userQuery = async (e) =>{
        console.log(query.length)
        e.preventDefault();
        if (query.length === 42 && query[0] === "0" && query[1] === 'x'){
            console.log("address query");
            navigate(`/address/${query}`)

        }
        else if (query.length === 66 && query[0] === "0" && query[1] === 'x' ){
            console.log("tx query");
            navigate(`/tx/${query}`);
        }
        else if (!query.includes([0-9])){
            console.log('invalid query')
        }
        else {
            console.log("block query")
        }
    }

    return(
        <div >
        <form className='form' onSubmit={(e)=>userQuery(e)}>
        
        <input onChange={(e)=>setQuery(e.target.value)} className="large-input" placeholder="Search by Addres,  Block Number or Transaction Hash"></input>
       <Button className='search-btn' variant="primary"><i className="bi bi-search"></i> Search</Button>{' '}
        </form>
        </div>
    )
}
export default SearchBar