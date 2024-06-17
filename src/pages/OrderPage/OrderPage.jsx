import { Button, Checkbox, Form } from 'antd';
import React, { useEffect, useState } from 'react';
import {
    CustomCheckbox,
    WrapperCountOrder,
    WrapperInfo,
    WrapperItemOrder,
    WrapperLeft,
    WrapperListOrder,
    WrapperRight,
    WrapperStepHeader,
    WrapperStyleHeader,
    WrapperStyleHeaderDilivery,
    WrapperTotal,
} from './style';
import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { WrapperInputNumber } from '../../components/ProductDetailsComponent/style';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useDispatch, useSelector } from 'react-redux';
import {
    decreaseAmount,
    increaseAmount,
    removeAllOrderProduct,
    removeOrderProduct,
    selectedOrder,
} from '../../redux/slides/orderSlide';
import { convertPrice } from '../../utils';
import { useMemo } from 'react';
import ModalComponent from '../../components/ModalComponent/ModalComponent';
import InputComponent from '../../components/InputComponent/InputComponent';
import { useMutationHooks } from '../../hooks/useMutationHook';
import * as UserService from '../../services/UserService';
import Loading from '../../components/LoadingComponent/Loading';
import * as message from '../../components/Message/Message';
import { updateUser } from '../../redux/slides/userSlide';
import { useNavigate } from 'react-router-dom';
import Step from '../../components/StepsComponent/StepComponent';
import StepComponent from '../../components/StepsComponent/StepComponent';
// import StepComponent from '../../components/StepConponent/StepComponent';

const OrderPage = () => {
    const order = useSelector((state) => state.order); // get order from store
    const user = useSelector((state) => state.user); // get user from store
    const [listChecked, setListChecked] = useState([]); // list product checked
    const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
    const [stateUserDetails, setStateUserDetails] = useState({
        name: '',
        phone: '',
        address: '',
        city: '',
    }); // state user details

    const navigate = useNavigate();
    const [form] = Form.useForm();

    const dispatch = useDispatch();
    const onChange = (e) => {
        if (listChecked.includes(e.target.value)) {
            const newListChecked = listChecked.filter(
                (item) => item !== e.target.value,
            );
            setListChecked(newListChecked);
        } else {
            setListChecked([...listChecked, e.target.value]);
        }
    }; // handle change checkbox

    const handleChangeCount = (type, idProduct, limited) => {
        if (type === 'increase') {
            if (!limited) {
                dispatch(increaseAmount({ idProduct }));
            }
        } else {
            if (!limited) {
                dispatch(decreaseAmount({ idProduct }));
            }
        }
    }; // handle change count product

    const handleDeleteOrder = (idProduct) => {
        dispatch(removeOrderProduct({ idProduct }));
    }; // handle delete product

    const handleOnchangeCheckAll = (e) => {
        if (e.target.checked) {
            const newListChecked = [];
            order?.orderItems?.forEach((item) => {
                newListChecked.push(item?.product);
            });
            setListChecked(newListChecked);
        } else {
            setListChecked([]);
        }
    }; // handle change check all

    useEffect(() => {
        dispatch(selectedOrder({ listChecked }));
    }, [listChecked]); // dispatch selected order

    useEffect(() => {
        form.setFieldsValue(stateUserDetails);
    }, [form, stateUserDetails]); // set value form

    useEffect(() => {
        if (isOpenModalUpdateInfo) {
            setStateUserDetails({
                city: user?.city,
                name: user?.name,
                address: user?.address,
                phone: user?.phone,
            });
        }
    }, [isOpenModalUpdateInfo]); // set value state user details

    const handleChangeAddress = () => {
        setIsOpenModalUpdateInfo(true);
    }; // handle change address

    const priceMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            return total + cur.price * cur.amount;
        }, 0);
        return result;
    }, [order]); // get price

    const priceDiscountMemo = useMemo(() => {
        const result = order?.orderItemsSlected?.reduce((total, cur) => {
            const totalDiscount = cur.discount ? cur.discount : 0;
            return total + (priceMemo * totalDiscount) / 100;
        }, 0);
        if (Number(result)) {
            return result;
        }
        return 0;
    }, [order]); // get price discount

    const diliveryPriceMemo = useMemo(() => {
        if (priceMemo >= 20000 && priceMemo < 500000) {
            return 10000;
        } else if (
            priceMemo >= 500000 ||
            order?.orderItemsSlected?.length === 0
        ) {
            return 0;
        } else {
            return 20000;
        }
    }, [priceMemo]); // get dilivery price

    const totalPriceMemo = useMemo(() => {
        return (
            Number(priceMemo) -
            Number(priceDiscountMemo) +
            Number(diliveryPriceMemo)
        );
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]); // get total price

    const handleRemoveAllOrder = () => {
        if (listChecked?.length > 1) {
            dispatch(removeAllOrderProduct({ listChecked }));
        }
    }; // handle remove all order

    const handleAddCard = () => {
        if (!order?.orderItemsSlected?.length) {
            message.error('Vui lòng chọn sản phẩm');
        } else if (!user?.phone || !user.address || !user.name || !user.city) {
            setIsOpenModalUpdateInfo(true);
        } else {
            navigate('/payment');
        }
    }; // handle add card

    const mutationUpdate = useMutationHooks((data) => {
        const { id, token, ...rests } = data;
        const res = UserService.updateUser(id, { ...rests }, token);
        return res;
    }); // mutation update user

    const { isLoading, data } = mutationUpdate;

    const handleCancleUpdate = () => {
        setStateUserDetails({
            name: '',
            email: '',
            phone: '',
            isAdmin: false,
        });
        form.resetFields();
        setIsOpenModalUpdateInfo(false);
    }; // handle cancle update

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
    }; // handle update infor user

    const handleOnchangeDetails = (e) => {
        setStateUserDetails({
            ...stateUserDetails,
            [e.target.name]: e.target.value,
        });
    }; // handle change details

    const itemsDelivery = [
        {
            title: '20.000 VND',
            description: 'Dưới 200.000 VND',
        },
        {
            title: '10.000 VND',
            description: 'Từ 200.000 VND đến dưới 500.000 VND',
        },
        {
            title: 'Free ship',
            description: 'Trên 500.000 VND',
        },
    ]; // items delivery
    const description = 'This is a description.';
    return (
        <div style={{ background: '#f5f5fa', with: '100%', height: '100vh' }}>
            <div style={{ height: '100%', width: '1270px', margin: '0 auto' }}>
                <h3 style={{ fontWeight: 'bold' }}>Giỏ hàng</h3>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <WrapperLeft>
                        {/* <WrapperStepHeader>
                            <StepComponent />
                        </WrapperStepHeader> */}
                        <h4>Phí giao hàng</h4>
                        <WrapperStyleHeaderDilivery>
                            {/* <StepComponent
                                items={itemsDelivery}
                                current={
                                    diliveryPriceMemo === 10000
                                        ? 2
                                        : diliveryPriceMemo === 20000
                                        ? 1
                                        : order.orderItemsSlected.length === 0
                                        ? 0
                                        : 3
                                }
                            /> */}
                        </WrapperStyleHeaderDilivery>
                        <WrapperStyleHeader>
                            <span
                                style={{
                                    display: 'inline-block',
                                    width: '390px',
                                }}
                            >
                                <CustomCheckbox
                                    onChange={handleOnchangeCheckAll}
                                    checked={
                                        listChecked?.length ===
                                        order?.orderItems?.length
                                    }
                                ></CustomCheckbox>
                                <span>
                                    {' '}
                                    Tất cả ({order?.orderItems?.length} sản
                                    phẩm)
                                </span>
                            </span>
                            <div
                                style={{
                                    flex: 1,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                }}
                            >
                                <span>Đơn giá</span>
                                <span>Số lượng</span>
                                <span>Thành tiền</span>
                                <DeleteOutlined
                                    style={{ cursor: 'pointer' }}
                                    onClick={handleRemoveAllOrder}
                                />
                            </div>
                        </WrapperStyleHeader>
                        <WrapperListOrder>
                            {order?.orderItems?.map((order) => {
                                return (
                                    <WrapperItemOrder key={order?.product}>
                                        <div
                                            style={{
                                                width: '390px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 4,
                                            }}
                                        >
                                            <CustomCheckbox
                                                onChange={onChange}
                                                value={order?.product}
                                                checked={listChecked.includes(
                                                    order?.product,
                                                )}
                                            ></CustomCheckbox>
                                            <img
                                                src={order?.image}
                                                style={{
                                                    width: '77px',
                                                    height: '79px',
                                                    objectFit: 'cover',
                                                }}
                                            />
                                            <div
                                                style={{
                                                    width: 260,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap',
                                                }}
                                            >
                                                {order?.name}
                                            </div>
                                        </div>
                                        <div
                                            style={{
                                                flex: 1,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between',
                                            }}
                                        >
                                            <span>
                                                <span
                                                    style={{
                                                        fontSize: '13px',
                                                        color: '#242424',
                                                    }}
                                                >
                                                    {convertPrice(order?.price)}
                                                </span>
                                            </span>
                                            <WrapperCountOrder>
                                                <button
                                                    style={{
                                                        border: 'none',
                                                        background:
                                                            'transparent',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        handleChangeCount(
                                                            'decrease',
                                                            order?.product,
                                                            order?.amount === 1,
                                                        )
                                                    }
                                                >
                                                    <MinusOutlined
                                                        style={{
                                                            color: '#000',
                                                            fontSize: '10px',
                                                        }}
                                                    />
                                                </button>
                                                <WrapperInputNumber
                                                    defaultValue={order?.amount}
                                                    value={order?.amount}
                                                    size="small"
                                                    min={1}
                                                    max={order?.countInstock}
                                                />
                                                <Button
                                                    style={{
                                                        border: 'none',
                                                        background:
                                                            'transparent',
                                                        cursor: 'pointer',
                                                    }}
                                                    onClick={() =>
                                                        handleChangeCount(
                                                            'increase',
                                                            order?.product,
                                                            order?.amount ===
                                                                order.countInstock,
                                                            order?.amount === 1,
                                                        )
                                                    }
                                                >
                                                    <PlusOutlined
                                                        style={{
                                                            color: '#000',
                                                            fontSize: '10px',
                                                        }}
                                                    />
                                                </Button>
                                            </WrapperCountOrder>
                                            <span
                                                style={{
                                                    color: 'rgb(255, 66, 78)',
                                                    fontSize: '13px',
                                                    fontWeight: 500,
                                                }}
                                            >
                                                {convertPrice(
                                                    order?.price *
                                                        order?.amount,
                                                )}
                                            </span>
                                            <DeleteOutlined
                                                style={{ cursor: 'pointer' }}
                                                onClick={() =>
                                                    handleDeleteOrder(
                                                        order?.product,
                                                    )
                                                }
                                            />
                                        </div>
                                    </WrapperItemOrder>
                                );
                            })}
                        </WrapperListOrder>
                    </WrapperLeft>
                    <WrapperRight>
                        <div style={{ width: '100%' }}>
                            <WrapperInfo>
                                <div>
                                    <span>Địa chỉ: </span>
                                    <span style={{ fontWeight: 'bold' }}>
                                        {`${user?.address}`}{' '}
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
                            onClick={() => handleAddCard()}
                            size={40}
                            styleButton={{
                                background: 'var(--primary-color)',
                                height: '48px',
                                width: '320px',
                                border: 'none',
                                borderRadius: '4px',
                            }}
                            textbutton={'Mua hàng'}
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
        </div>
    );
};

export default OrderPage;
