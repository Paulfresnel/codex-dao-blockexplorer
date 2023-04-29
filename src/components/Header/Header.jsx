import './Header.css'
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

function Header(){

    return(
        <div className="header">
        <div className='flex-row'>
        <Link to={"/"}>
        <img className='logo' src='/codex-logo.png'></img>
        </Link>
        <h1>CodeXplorer</h1>
        </div>
        <nav className='navigation'>
            <ul>
                <li><a className='website' href='https://codex-dao.vercel.app'>CodeX DAO Site</a></li>
            </ul>
        </nav>
        <SearchBar/>
        </div>
    )
}

export default Header