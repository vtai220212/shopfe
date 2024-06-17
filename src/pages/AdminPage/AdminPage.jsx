import React from 'react';
import { getItem } from '../../utils';
import { Menu } from 'antd';
import {
    UserOutlined,
    ProductOutlined,
    SettingOutlined,
} from '@ant-design/icons';
import { Header } from 'antd/lib/layout/layout';
import HeaderComponent from '../../components/HeaderCompoent/HeaderComponent';
import AdminUser from '../../components/AdminUser/AdminUser';
import AdminProduct from '../../components/AdminProduct/AdminProduct';
import AdminOrder from '../../components/AdminOrder/AdminOrder';

const AdminPage = () => {
    const items = [
        getItem('Người dùng', 'user', <UserOutlined />),
        getItem('Sản phẩm', 'product', <ProductOutlined />),
        getItem('Đơn hàng', 'order', <SettingOutlined />),
    ];

    const [keySelected, setKeySelected] = React.useState('');

    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AdminUser />;
            case 'product':
                return <AdminProduct />;
            case 'order':
                return <AdminOrder />;
            default:
                return <></>;
        }
    };
    const handleOnclick = ({ key }) => {
        setKeySelected(key);
    };

    console.log(keySelected);
    return (
        <>
            <HeaderComponent isHiddenCart isHiddenSearch />
            <div
                style={{
                    display: 'flex',
                }}
            >
                <Menu
                    mode="inline"
                    onClick={handleOnclick}
                    style={{
                        height: '100vh',
                        width: 256,
                    }}
                    items={items}
                />
                <div
                    style={{
                        flex: 1,
                        padding: '10px',
                    }}
                >
                    {keySelected === '6' && <span>Key la 6</span>}
                    {renderPage(keySelected)}
                </div>
            </div>
        </>
    );
};

export default AdminPage;
