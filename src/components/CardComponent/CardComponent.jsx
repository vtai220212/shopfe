import React from 'react';
import {
    StyleNameProduct,
    WrapperCardStyle,
    WrapperDescription,
    WrapperDiscountText,
    WrapperPriceText,
    WrapperReportText,
    WrapperStyleTextSell,
} from './style';
import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { convertPrice } from '../../utils';

const CardComponent = (props) => {
    const {
        countInStock,
        description,
        image,
        name,
        price,
        rating,
        type,
        discount,
        selled,
        id,
    } = props;
    const navigate = useNavigate();
    const handleDetailsProduct = (id) => {
        navigate(`/product-details/${id}`);
    };
    return (
        <WrapperCardStyle
            hoverable
            headStyle={{ width: '200px', height: '200px' }}
            style={{ width: 200 }}
            bodyStyle={{ padding: '10px' }}
            cover={<img alt="example" src={image} />}
            onClick={() => handleDetailsProduct(id)}
        >
            {/* <img
                // src={logo}
                style={{
                    width: '68px',
                    height: '14px',
                    position: 'absolute',
                    top: -1,
                    left: -1,
                    borderTopLeftRadius: '3px',
                }}
            /> */}
            <StyleNameProduct>{name}</StyleNameProduct>
            <WrapperDescription>{description}</WrapperDescription>
            <WrapperReportText>
                <span style={{ marginRight: '4px' }}>
                    <span>{rating} </span>{' '}
                    <StarFilled
                        style={{ fontSize: '15px', color: 'rgb(253, 216, 54)' }}
                    />
                </span>
                <WrapperStyleTextSell>
                    {' '}
                    Đã bán {selled || 1000}+
                </WrapperStyleTextSell>
            </WrapperReportText>
            <WrapperPriceText>
                <span style={{ marginRight: '8px' }}>
                    {convertPrice(price)}
                </span>
                <WrapperDiscountText>- {discount || 5} %</WrapperDiscountText>
            </WrapperPriceText>
        </WrapperCardStyle>
    );
};

export default CardComponent;
