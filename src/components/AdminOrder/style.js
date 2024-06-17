import styled from 'styled-components';
import { Upload } from 'antd';

export const WrapperHeader = styled.h1`
    font-size: 17px;
    color: #000;
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
