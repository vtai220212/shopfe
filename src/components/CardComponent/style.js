import { Card } from 'antd';
import styled from 'styled-components';

export const WrapperCardStyle = styled(Card)`
    width: 200px;
    & img {
        height: 200px;
        width: 200px;
    },
    position: relative;
    background-color: ${(props) => (props.disabled ? '#ccc' : '#fff')};
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')}
`;

export const StyleNameProduct = styled.div`
    font-weight: bold;
    font-size: 18px;
    line-height: 16px;
    color: rgb(56, 56, 61);
    font-weight: 400;
    display: flex;
    margin: 10px 0px;
    align-items: center;
    justify-content: center;
`;

export const WrapperDescription = styled.p`
    font-size: 14px;
    color: rgb(128, 128, 137);
    margin: 10px 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const WrapperReportText = styled.div`
    font-size: 11px;
    color: rgb(128, 128, 137);
    display: flex;
    align-items: center;
    margin: 10px 0px;
    justify-content: space-between;
`;

export const WrapperPriceText = styled.div`
    color: rgb(255, 66, 78);
    font-size: 14px;
    font-weight: 500;
    display: flex;
    justify-content: space-between;
`;

export const WrapperDiscountText = styled.span`
    color: rgb(255, 66, 78);
    font-size: 15px;
    font-weight: 500;
    display: flex;
    justify-content: center;
`;

export const WrapperStyleTextSell = styled.span`
    font-size: 15px;
    line-height: 24px;
    color: rgb(120, 120, 120);
    display: flex;
    justify-content: center;
`;
