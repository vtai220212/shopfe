import { Upload } from 'antd';
import styled from 'styled-components';

export const WrapperHeaderProfile = styled.h1`
    font-size: 24px;
    color: #000;
`;

export const WrapperContentProfile = styled.div`
    display: flex;
    flex-direction: column;
    border: 1px solid #ccc;
    width: 700px;
    margin: 0 auto;
    padding: 10px;
`;
export const WrapperLabel = styled.label`
    font-size: 13px;
    width: 150px;
    font-weight: bold;
    color: #000;
    display: flex;
    margin: 0 5px;
    align-items: center;
`;
export const WrapperInput = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
`;
export const WrapperUploadFile = styled(Upload)`
    & .ant-upload.ant-upload-select.ant-upload-select-picture-card {
        width: 60px;
        height: 60px;
        border-radius: 50%;
    }
    & .ant-upload-list-item-info {
        display: none;
    }
`;
