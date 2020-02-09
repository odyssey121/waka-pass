import React, { useState, useEffect } from 'react';
import { Divider, Icon, Typography, Avatar } from 'antd';
import './Header.css';
const { Text } = Typography;

const Header = () => {
    return (
        <header id="header">
            <div className="header-row">
                <div className='header-row-container'>
                    <div className='item-cell'>
                        <a href="#">
                            <Icon type="experiment" />
                            <span>
                                <Text strong code>Waka-Prime</Text>

                            </span>
                        </a>

                    </div>
                    <Divider type="vertical" />
                    <div className='item-cell info-cell'>

                            <Icon type="bell" />


                    </div>


                    <Divider type="vertical" />
                    <div className='item-cell'>
                        <div className="user-area">
                            <Avatar icon={<Icon type="user" />} />
                            <Text type="secondary">Ширнин</Text>

                                <Icon type="logout" />





                        </div>






                    </div>

                </div>
            </div>
        </header>
    )
}

export default Header;