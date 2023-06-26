import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import { Path } from './constants/Path';
import Home from './components/home/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path={Path.TOP} element={<Home />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
