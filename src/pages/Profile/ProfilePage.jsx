import React, { useEffect } from 'react';
import {
    WrapperHeaderProfile,
    WrapperContentProfile,
    WrapperLabel,
    WrapperInput,
    WrapperUploadFile,
} from './style';
import InputForm from '../../components/InputForm/InputForm';
import { useState } from 'react';
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent';
import { useSelector } from 'react-redux';
import * as UserService from '../../services/UserService';
import { useMutationHooks } from '../../hooks/useMutationHook';
import Loading from '../../components/LoadingComponent/Loading';
import { updateUser } from '../../services/UserService';
import * as message from '../../components/Message/Message';
import { useDispatch } from 'react-redux';
import { Button, Upload } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { getBase64 } from '../../utils';
function ProfilePage() {
    const user = useSelector((state) => state.user);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [avatar, setAvatar] = useState('');
    const [address, setAddress] = useState('');
    const mutation = useMutationHooks((data) => {
        const { id, access_token, ...rests } = data;
        UserService.updateUser(id, rests, access_token);
    });
    const { data, isLoading, isSuccess, isError } = mutation;
    const dispatch = useDispatch();

    const handleOnchangeAvatar = async ({ fileList }) => {
        const file = fileList[0];
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setAvatar(file.preview);
    };

    const handleOnchangeEmail = (value) => {
        setEmail(value);
    };
    const handleOnchangeName = (value) => {
        setName(value);
    };
    const handleOnchangePhone = (value) => {
        setPhone(value);
    };

    const handleOnchangeAddress = (value) => {
        setAddress(value);
    };

    useEffect(() => {
        setEmail(user?.email);
        setName(user?.name);
        setPhone(user?.phone);
        setAvatar(user?.avatar);
        setAddress(user?.address);
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            message.success();
            handleGetDetailsUser(user?.id, user?.access_token);
        } else if (isError) {
            message.error();
        }
    }, [isSuccess, isError]);

    const handleGetDetailsUser = (id, token) => {
        return async (dispatch) => {
            try {
                const res = await UserService.getDetailsUser(id, token); // giả sử UserService.getDetailsUser() trả về một Promise
                dispatch({
                    type: 'UPDATE_USER',
                    payload: {
                        ...res?.data,
                        access_token: token,
                    },
                });
            } catch (error) {
                // handle error
            }
        };
    };

    const handleUpdate = () => {
        mutation.mutate({
            id: user.id,
            email,
            name,
            phone,
            avatar,
            address,
            access_token: user?.access_token,
        });
    };

    return (
        <div
            style={{
                width: '1270px',
                margin: '0 auto',
            }}
        >
            <WrapperHeaderProfile>Thông tin người dùng</WrapperHeaderProfile>
            <Loading isLoading={isLoading}>
                <WrapperContentProfile>
                    <WrapperInput
                        style={{
                            width: '680px',
                            border: 'none',
                            outline: 'none',
                            height: '50px',
                        }}
                    >
                        <WrapperLabel htmlFor="avatar">
                            Ảnh đại diện
                        </WrapperLabel>
                        <WrapperUploadFile
                            onChange={handleOnchangeAvatar}
                            maxCount={1}
                        >
                            <Button icon={<UploadOutlined />}>Upload</Button>
                        </WrapperUploadFile>
                        {avatar && (
                            <img
                                src={avatar}
                                style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                }}
                                alt="avatar"
                            />
                        )}
                    </WrapperInput>

                    <WrapperInput
                        style={{
                            width: '680px',
                            border: 'none',
                            outline: 'none',
                            height: '50px',
                        }}
                    >
                        <WrapperLabel htmlFor="name">
                            Tên người dùng
                        </WrapperLabel>
                        <InputForm
                            value={name}
                            id="name"
                            onChange={handleOnchangeName}
                        />
                    </WrapperInput>

                    <WrapperInput
                        style={{
                            width: '680px',
                            border: 'none',
                            outline: 'none',
                            height: '50px',
                        }}
                    >
                        <WrapperLabel htmlFor="email">Email</WrapperLabel>
                        <InputForm
                            value={email}
                            id="email"
                            onChange={handleOnchangeEmail}
                        />
                    </WrapperInput>

                    <WrapperInput
                        style={{
                            width: '680px',
                            border: 'none',
                            outline: 'none',
                            height: '50px',
                        }}
                    >
                        <WrapperLabel htmlFor="phone">
                            Số điện thoại
                        </WrapperLabel>
                        <InputForm
                            value={phone}
                            id="phone"
                            onChange={handleOnchangePhone}
                        />
                    </WrapperInput>

                    <WrapperInput
                        style={{
                            width: '680px',
                            border: 'none',
                            outline: 'none',
                            height: '50px',
                        }}
                    >
                        <WrapperLabel htmlFor="address">Địa chỉ</WrapperLabel>
                        <InputForm
                            value={address}
                            id="address"
                            onChange={handleOnchangeAddress}
                        />
                    </WrapperInput>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '20px',
                        }}
                    >
                        <ButtonComponent
                            onClick={handleUpdate}
                            size={40}
                            styleButton={{
                                height: '30px',
                                width: 'fit-content',
                                border: 'none',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                borderRadius: '4px',
                                border: '1px solid #824D74',
                            }}
                            textbutton={'Cập nhật'}
                            styleTextButton={{
                                color: '#000',
                                fontSize: '15px',
                                fontWeight: '700',
                            }}
                        ></ButtonComponent>
                    </div>
                </WrapperContentProfile>
            </Loading>
        </div>
    );
}

export default ProfilePage;
