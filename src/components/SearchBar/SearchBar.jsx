import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';


import './SearchBar.css';

function SearchBar(){
    const navigate = useNavigate();
    const [query, setQuery] = useState('');

    let userQuery = async (e) =>{
        e.preventDefault();
        if (query.length === 40){
            console.log("address query");

        }
        else if (query.length === 66){
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
        
        <input onChange={(e)=>setQuery(e.target.value)} className="large-input" placeholder="type here an Address / Block Number or Transaction Hash"></input>
       <Button className='search-btn' variant="primary"><i className="bi bi-search"></i> Search</Button>{' '}
        </form>
        </div>
    )
}
export default SearchBar