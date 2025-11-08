import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import SignInPage from './Components/Signin';
import SignUp from './Components/SignUp';
import MainPage from './Components/MainPage';
import Homepage from './Components/HomePage';
import Checkout from './Components/Checkout'; 
import OrderHistory from './Components/OrderHistory'; 
import './App.css';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path='/signinpage' element={<SignInPage/>}/>
      <Route path='/signuppage' element={<SignUp/>}/>
      <Route path='/mainpage' element={<MainPage/>}/>
      <Route path='/homepage' element={<Homepage/>}/>
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/orders" element={<OrderHistory />} />
    </Routes>
  );
}

export default App;
