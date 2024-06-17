import { Form, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    Lable,
    WrapperInfo,
    WrapperLeft,
    WrapperRadio,
    WrapperRight,
    WrapperTotal,
} from './style';

import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import * as OrderService from '../../services/OrderService';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import { removeAllOrderProduct } from '../../redux/slides/orderSlide';
// import { PayPalButton } from 'react-paypal-button-v3';
import * as PaymentService from '../../services/PaymentService';

const PaymentPage = () => {
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);

    const [delivery, setDelivery] = useState('fast');
    const [payment, setPayment] = useState('later_money');
    const navigate = useNavigate();
    const [sdkReady, setSdkReady] = useState(false);

    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    });
    const [form] = Form.useForm();

    const dispatch = useDispatch();

    // Mutation
    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    });

    const mutationAddOrder = useMutationHooks((data) => {
        const { token, ...rests } = data;
        const res = OrderService.createOrder({ ...rests }, token);
        return res;
    });

    //  Mutation

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]);

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            });
        }
    }, [isOpenModalUpdateInfo]);

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    };

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + cur.price * cur.amount;
        }, 0);
        return result;
    }, [order]);

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0;
            return total + (priceMemo * totalDiscount) / 100;
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [order]);

    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo > 200000) {
            return 10000;
        } else if (priceMemo === 0) {
            return 0;
        } else {
            return 20000;
        }
    }, [priceMemo]);

    const totalPriceMemo = useMemo(() => {
        return (
            Number(priceMemo) -
            Number(priceDiscountMemo) +
            Number(diliveryPriceMemo)
        );
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

    const handleAddOrder = () => {
        if (
            user?.access_token &&
            order?.orderItemsSlected &&
            user?.name &&
            user?.phone &&
            user?.address &&
            user?.city &&
            priceMemo &&
            user?.id
        ) {
            mutationAddOrder.mutate({
                token: user?.access_token,
                orderItems: order?.orderItemsSlected,
                fullName: user?.name,
                address: user?.address,
                phone: user?.phone,
                city: user?.city,
                paymentMethod: payment,
                itemsPrice: priceMemo,
                shippingPrice: diliveryPriceMemo,
                totalPrice: totalPriceMemo,
                user: user?.id,
                onSuccess: () => {
                    message.success('Đặt hàng thành công');
                },
            });
        }
    };

    const { isLoading, data } = mutationUpdate;
    const {
        data: dataAdd,
        isLoading: isLoadingAddOrder,
        isSuccess,
        isError,
    } = mutationAddOrder;

    useEffect(() => {
        if (isSuccess && dataAdd?.status === 'OK') {
            const arrayOrdered = [];
            order?.orderItemsSlected?.forEach((element) => {
                arrayOrdered.push(element.product);
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
            message.success('Đặt hàng thành công');
            navigate('/orderSuccess');
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    const handleCancleUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    };

    const handleUpdateInforUser = () => {
        const { name, address, city, phone } = stateUserDetails;
        if (name && address && city && phone) {
            mutationUpdate.mutate(
                {
                    id: user?.id,
                    token: user?.access_token,
                    ...stateUserDetails,
                },
                {
                    onSuccess: () => {
                        dispatch(updateUser({ name, address, city, phone }));
                        setIsOpenModalUpdateInfo(false);
                    },
                },
            );
        }
    };

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    };
    const handleDilivery = (e) => {
        setDelivery(e.target.value);
    };

    const handlePayment = (e) => {
        setPayment(e.target.value);
    };

    return (
        <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
            <Loading isLoading={isLoadingAddOrder}>
                <div
                    style={{
                        height: '100%',
                        width: '1270px',
                        margin: '0 auto',
                    }}
                >
                    <h3>Thanh toán</h3>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <WrapperLeft>
                            {/* <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức giao hàng</Lable>
                                    <WrapperRadio
                                        onChange={handleDilivery}
                                        value={delivery}
                                    >
                                        <Radio value="fast">
                                            <span
                                                style={{
                                                    color: '#ea8500',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                FAST
                                            </span>{' '}
                                            Giao hàng tiết kiệm
                                        </Radio>
                                        <Radio value="gojek">
                                            <span
                                                style={{
                                                    color: '#ea8500',
                                                    fontWeight: 'bold',
                                                }}
                                            >
                                                GO_JEK
                                            </span>{' '}
                                            Giao hàng tiết kiệm
                                        </Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo> */}
                            <WrapperInfo>
                                <div>
                                    <Lable>Chọn phương thức thanh toán</Lable>
                                    <WrapperRadio
                                        onChange={handlePayment}
                                        value={payment}
                                    >
                                        <Radio value="later_money">
                                            {' '}
                                            Thanh toán tiền mặt
                                        </Radio>

                                        <Radio value="momo">
                                            {' '}
                                            Thanh toán tiền bằng MOMO
                                        </Radio>
                                        <Radio value="atm">
                                            {' '}
                                            Thanh toán tiền bằng ngân hàng
                                            MBBANK, ACB, ...
                                        </Radio>
                                    </WrapperRadio>
                                </div>
                            </WrapperInfo>

                            <WrapperInfo>
                                <div>
                                    <span
                                        style={{
                                            color: 'red',
                                            fontWeight: 'bold',
                                            fontSize: '20px',
                                        }}
                                    >
                                        LƯU Ý
                                    </span>
                                    <p
                                        style={{
                                            fontSize: '14px',
                                        }}
                                    >
                                        - Nếu quý khách chọn thanh toán bằng
                                        tiền mặt, quý khách vui lòng đến trực
                                        tiếp cơ sở để thanh toán và kích hoạt
                                        gói cước.
                                        <br />
                                        <br />- Đối với các phương thức thanh
                                        toán khác, nếu đơn hàng thanh toán thành
                                        công. Gói cước sẽ được tự động kích hoạt
                                    </p>
                                </div>
                            </WrapperInfo>
                        </WrapperLeft>
                        <WrapperRight>
                            <div style={{ width: '100%' }}>
                                <WrapperInfo>
                                    <div>
                                        <span>Địa chỉ: </span>
                                        <span style={{ fontWeight: 'bold' }}>
                                            {`${user?.address} ${user?.city}`}{' '}
                                        </span>
                                        <span
                                            onClick={handleChangeAddress}
                                            style={{
                                                color: '#9255FD',
                                                cursor: 'pointer',
                                            }}
                                        >
                                            Thay đổi
                                        </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperInfo>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>Tạm tính</span>
                                        <span
                                            style={{
                                                color: '#000',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {convertPrice(priceMemo)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>Giảm giá</span>
                                        <span
                                            style={{
                                                color: '#000',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {convertPrice(priceDiscountMemo)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>Phí giao hàng</span>
                                        <span
                                            style={{
                                                color: '#000',
                                                fontSize: '14px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {convertPrice(diliveryPriceMemo)}
                                        </span>
                                    </div>
                                </WrapperInfo>
                                <WrapperTotal>
                                    <span>Tổng tiền</span>
                                    <span
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                        }}
                                    >
                                        <span
                                            style={{
                                                color: 'rgb(254, 56, 52)',
                                                fontSize: '24px',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            {convertPrice(totalPriceMemo)}
                                        </span>
                                        <span
                                            style={{
                                                color: '#000',
                                                fontSize: '11px',
                                            }}
                                        >
                                            (Đã bao gồm VAT nếu có)
                                        </span>
                                    </span>
                                </WrapperTotal>
                            </div>
                            <ButtonComponent
                                onClick={() => handleAddOrder()}
                                size={40}
                                styleButton={{
                                    background: 'var(--primary-color)',
                                    height: '48px',
                                    width: '320px',
                                    border: 'none',
                                    borderRadius: '4px',
                                }}
                                textbutton={'Đặt hàng'}
                                styleTextButton={{
                                    color: '#fff',
                                    fontSize: '15px',
                                    fontWeight: '700',
                                }}
                            ></ButtonComponent>
                        </WrapperRight>
                    </div>
                </div>
                <ModalComponent
                    title="Cập nhật thông tin giao hàng"
                    open={isOpenModalUpdateInfo}
                    onCancel={handleCancleUpdate}
                    onOk={handleUpdateInforUser}
                >
                    <Loading isLoading={isLoading}>
                        <Form
                            name="basic"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            // onFinish={onUpdateUser}
                            autoComplete="on"
                            form={form}
                        >
                            <Form.Item
                                label="Name"
                                name="name"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your name!',
                                    },
                                ]}
                            >
                                <InputComponent
                                    value={stateUserDetails['name']}
                                    onChange={handleOnchangeDetails}
                                    name="name"
                                />
                            </Form.Item>
                            <Form.Item
                                label="City"
                                name="city"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your city!',
                                    },
                                ]}
                            >
                                <InputComponent
                                    value={stateUserDetails['city']}
                                    onChange={handleOnchangeDetails}
                                    name="city"
                                />
                            </Form.Item>
                            <Form.Item
                                label="Phone"
                                name="phone"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your  phone!',
                                    },
                                ]}
                            >
                                <InputComponent
                                    value={stateUserDetails.phone}
                                    onChange={handleOnchangeDetails}
                                    name="phone"
                                />
                            </Form.Item>

                            <Form.Item
                                label="Adress"
                                name="address"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your  address!',
                                    },
                                ]}
                            >
                                <InputComponent
                                    value={stateUserDetails.address}
                                    onChange={handleOnchangeDetails}
                                    name="address"
                                />
                            </Form.Item>
                        </Form>
                    </Loading>
                </ModalComponent>
            </Loading>
        </div>
    );
};

export default PaymentPage;
