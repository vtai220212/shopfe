import { Button, Form, Space } from 'antd';
import React from 'react';
import { WrapperHeader } from './style';
import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../InputComponent/InputComponent';

import { useSelector } from 'react-redux';
import { useRef } from 'react';
import * as OrderService from '../../services/OrderService';
import { useQuery } from '@tanstack/react-query';
import {
    SearchOutlined,
    DeleteOutlined,
    EditOutlined,
} from '@ant-design/icons';
import { orderContant } from '../../contant';
import PieChartComponent from './PieChart';
import { convertPrice } from '../../utils';

const AdminOrder = () => {
    const user = useSelector((state) => state?.user);
    const searchInput = useRef(null);

    const getAllOrder = async () => {
        const res = await OrderService.getAllOrder(user?.access_token);
        console.log('res', res);
        return res;
    };

    const queryOrder = useQuery({ queryKey: ['order'], queryFn: getAllOrder });
    const { isLoading: isLoadingOrders, data: orders } = queryOrder;

    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined
                    style={{
                        color: 'red',
                        fontSize: '30px',
                        cursor: 'pointer',
                    }}
                    // onClick={() => setIsModalOpenDelete(true)}
                />
                <EditOutlined
                    style={{
                        color: 'orange',
                        fontSize: '30px',
                        cursor: 'pointer',
                    }}
                    // onClick={handleDetailsProduct}
                />
            </div>
        );
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({
            setSelectedKeys,
            selectedKeys,
            confirm,
            clearFilters,
        }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <InputComponent
                    // ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) =>
                        setSelectedKeys(e.target.value ? [e.target.value] : [])
                    }
                    // onPressEnter={() =>
                    //     handleSearch(selectedKeys, confirm, dataIndex)
                    // }
                    style={{
                        marginBottom: 8,
                        display: 'block',
                    }}
                />
                {/* <Space>
                    <Button
                        type="primary"
                        // onClick={() =>
                        //     handleSearch(selectedKeys, confirm, dataIndex)
                        // }
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        // onClick={() =>
                        //     clearFilters && handleReset(clearFilters)
                        // }
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                </Space> */}
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? '#1890ff' : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex]
                .toString()
                .toLowerCase()
                .includes(value.toLowerCase()),
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        // render: (text) =>
        //   searchedColumn === dataIndex ? (
        //     // <Highlighter
        //     //   highlightStyle={{
        //     //     backgroundColor: '#ffc069',
        //     //     padding: 0,
        //     //   }}
        //     //   searchWords={[searchText]}
        //     //   autoEscape
        //     //   textToHighlight={text ? text.toString() : ''}
        //     // />
        //   ) : (
        //     text
        //   ),
    });

    const columns = [
        {
            title: 'Name',
            dataIndex: 'userName',
            sorter: (a, b) => a.name.length - b.name.length,
            ...getColumnSearchProps('userName'),
        },

        {
            title: 'Phone',
            dataIndex: 'phone',
            sorter: (a, b) => a.phone - b.phone,
            ...getColumnSearchProps('phone'),
        },
        {
            title: 'Address',
            dataIndex: 'address',
            sorter: (a, b) => a.address.length - b.address.length,
            ...getColumnSearchProps('address'),
        },
        {
            title: 'Name Order Items',
            dataIndex: 'orderItem',
            sorter: (a, b) => a.orderItem.length - b.orderItem.length,
            ...getColumnSearchProps('orderItem'),
        },
        // {
        //     title: 'Shipping Price',
        //     dataIndex: 'shippingPrice',
        //     sorter: (a, b) => a.shippingPrice.length - b.shippingPrice.length,
        //     ...getColumnSearchProps('shippingPrice'),
        // },
        {
            title: 'Total Price',
            dataIndex: 'totalPrice',
            sorter: (a, b) => a.totalPrice - b.totalPrice,
            ...getColumnSearchProps('totalPrice'),
        },
        {
            title: 'isPaid',
            dataIndex: 'isPaid',
            sorter: (a, b) => a.isPaid.length - b.isPaid.length,
            ...getColumnSearchProps('isPaid'),
        },
        {
            title: 'Payment Method',
            dataIndex: 'paymentMethod',
            sorter: (a, b) => a.paymentMethod.length - b.paymentMethod.length,
            ...getColumnSearchProps('paymentMethod'),
        },
        {
            title: 'Action',
            dataIndex: 'action',
            render: renderAction,
        },
    ];

    const dataTable =
        orders?.data?.length &&
        orders?.data?.map((order) => {
            return {
                ...order,
                key: order._id,
                orderItem: order?.orderItems
                    ?.map((item) => item?.name)
                    .join(', '),
                totalPrice: convertPrice(order?.totalPrice),
                itemsPrice: order?.itemsPrice,
                // shippingPrice: order?.shippingPrice,
                userName: order?.shippingAddress?.fullName,
                phone: order?.shippingAddress?.phone,
                address: order?.shippingAddress?.address,
                paymentMethod: orderContant.payment[order?.paymentMethod],
                isPaid: order?.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán',
            };
        });

    return (
        <div>
            <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
            <div style={{ height: 200, width: 200 }}>
                <PieChartComponent data={orders?.data} />
            </div>
            <div style={{ marginTop: '20px' }}>
                <TableComponent
                    columns={columns}
                    isLoading={isLoadingOrders}
                    data={dataTable}
                />
            </div>
        </div>
    );
};

export default AdminOrder;
