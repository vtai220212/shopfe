import { Form, Radio } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    Lable,
    WrapperInfo,
    WrapperContainer,
    WrapperRadio,
    WrapperRight,
    WrapperTotal,
    WrapperSpan,
    WrapperButtonHome,
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

const OrderSuccess = () => {
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
    const { isLoading: isLoadingAddOrder } = mutationAddOrder;

    // useEffect(() => {
    //     if (isSuccess && dataAdd?.status === 'OK') {
    //         const arrayOrdered = [];
    //         order?.orderItemsSlected?.forEach((element) => {
    //             arrayOrdered.push(element.product);
    //         });
    //         dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
    //         message.success('Đặt hàng thành công');
    //         navigate('/orderSuccess', {
    //             state: {
    //                 delivery,
    //                 payment,
    //                 orders: order?.orderItemsSlected,
    //                 totalPriceMemo: totalPriceMemo,
    //             },
    //         });
    //     } else if (isError) {
    //         message.error();
    //     }
    // }, [isSuccess, isError]);

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
        <div
            style={{
                background: '#fff',
                with: '100%',
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Loading isLoading={isLoadingAddOrder}>
                <div
                    style={{
                        height: '100%',
                        width: '1270px',
                        margin: '0 auto',
                    }}
                >
                    <div>
                        <WrapperContainer>
                            <WrapperInfo>
                                <h2
                                    style={{
                                        padding: '30px 0',
                                        fontSize: '30px',
                                        alignItems: 'center',
                                        display: 'flex',
                                        justifyContent: 'center',
                                    }}
                                >
                                    CẢM ƠN BẠN VÌ ĐÃ MUA HÀNG
                                </h2>
                                <div>
                                    <WrapperSpan>
                                        Đơn hàng của bạn đã được đặt thành công
                                    </WrapperSpan>

                                    <div
                                        style={{
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <button
                                            onClick={() => navigate('/')}
                                            style={{
                                                background: 'rgb(13, 92, 182)',
                                                color: '#fff',
                                                padding: '10px 20px',
                                                border: 'none',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                marginTop: '20px',
                                            }}
                                        >
                                            Quay về trang chủ
                                        </button>
                                    </div>
                                </div>
                            </WrapperInfo>
                        </WrapperContainer>
                    </div>
                </div>
            </Loading>
        </div>
    );
};

export default OrderSuccess;
