import React from 'react'
import { Tooltip } from 'antd';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    return (
        <>
            <div className='home_div'>
                <h1>Welcome to webRTC project</h1>
                <p>Please select the connection method</p>
                <div className='home_btn_div'>
                    <Tooltip title="You have to manually set local-description and remote-description to establish a connection." color="#383838">
                        <div onClick={() => navigate("/wos")} className='btn_manual home_btn'>Manual signaling</div>
                    </Tooltip>
                    <Tooltip title="You have enter a connection code to establish a connection." color="#383838">
                        <div onClick={() => navigate("/ws")} className='btn_manual home_btn'>Auto signaling</div>
                    </Tooltip>
                </div>
            </div>
        </>
    )
}

export default Home