import React, { useEffect, useState } from 'react'
import { Route, Routes } from "react-router-dom";
import { Button, message, Space } from 'antd';
import { useDispatch } from 'react-redux';

import WithServer from './pages/WithServer';
import WithoutServer from './pages/WithoutServer';
import Play from './pages/Play';
import Home from './pages/Home';
import "./hooks/useWebrtc"
import { setMessageApi } from './store/action';


const App = () => {
  const dispatch = useDispatch();


  const [messageApi, contextHolder] = message.useMessage();
  dispatch(setMessageApi(messageApi));




  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ws" element={<WithServer />} />
        <Route path="/wos" element={<WithoutServer />} />
        <Route path="/play" element={<Play />} />
      </Routes>
      {contextHolder}
    </>
  )
}

export default App;

