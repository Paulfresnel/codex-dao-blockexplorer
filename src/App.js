import { Alchemy, Network } from 'alchemy-sdk';
import { Routes, Route} from "react-router-dom";
import Header from './components/Header/Header';
import LatestBlock from './components/LatestBlock/LatestBlock';
import TransactionPage from './pages/TransactionPage/TransactionPage';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import BlockPage from './pages/BlockPage/BlockPage';

import './App.css';
import HomePage from './pages/HomePage/HomePage';
import AddressPage from './pages/AddressPage/AddressPage';


const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {


  return (

  <div className="App">
 
  <Header/>
    <div className='margined-t'>
  <Routes>
  <Route path={"*"} element={<ErrorPage/>}/>
  <Route path={"/"} element={<HomePage alchemy={alchemy}/>}/>
  <Route path={"/block/:blockId"} element={<BlockPage alchemy={alchemy}/>}/>
  <Route path={"/address/:addressId"} element={<AddressPage alchemy={alchemy}/>}/>
  <Route path={"/tx/:txId"} element={<TransactionPage alchemy={alchemy}/>}/>
  </Routes>
  </div>
  </div>
  
  );
}

export default App;
