import React from 'react';
import SliderComponent from '../../components/SliderComponent/SliderComponent';
import TypeProduct from '../../components/TypeProduct/TypeProduct';
import {
    WrapperButtonMore,
    WrapperProducts,
    WrapperTypeProduct,
} from './style';
import slider1 from '../../assets/images/slide1.png';
import slider2 from '../../assets/images/slide2.png';
import slider3 from '../../assets/images/slide3.png';

import CardComponent from '../../components/CardComponent/CardComponent';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/ProductService';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import Loading from '../../components/LoadingComponent/Loading';
import { useDebounce } from '../../hooks/useDebounce';
import { useEffect } from 'react';

const HomePage = () => {
    const searchProduct = useSelector((state) => state?.product?.search);
    const searchDebounce = useDebounce(searchProduct, 500);
    const [loading, setLoading] = useState(false);
    const [limit, setLimit] = useState(6);
    const [typeProducts, setTypeProducts] = useState([]);

    const fetchProductAll = async (context) => {
        const limit = context?.queryKey && context?.queryKey[1];
        const search = context?.queryKey && context?.queryKey[2];
        const res = await ProductService.getAllProduct(search, limit);

        return res;
    };

    const fetchAllTypeProduct = async () => {
        const res = await ProductService.getAllTypeProduct();
        if (res?.status === 'OK') {
            setTypeProducts(res?.data);
        }
    };
    useEffect(() => {
        fetchAllTypeProduct();
    }, []);

    const {
        isLoading,
        data: products,
        isPreviousData,
    } = useQuery(['products', limit, searchDebounce], fetchProductAll, {
        retry: 3,
        retryDelay: 1000,
        keepPreviousData: true,
    });

    return (
        <Loading isLoading={isLoading || loading}>
            <div style={{ width: '1270px', margin: '0 auto' }}>
                <WrapperTypeProduct>
                    {typeProducts.map((item) => {
                        return <TypeProduct name={item} key={item} />;
                    })}
                </WrapperTypeProduct>
            </div>
            <div
                className="body"
                style={{
                    width: '100%',
                    backgroundColor: 'var(--background-color)',
                }}
            >
                <div
                    id="container"
                    style={{
                        height: '1000px',
                        width: '1270px',
                        margin: '0 auto',
                    }}
                >
                    <SliderComponent arrImages={[slider1, slider2, slider3]} />
                    <WrapperProducts>
                        {products?.data?.map((product) => {
                            return (
                                <CardComponent
                                    key={product._id}
                                    countInStock={product.countInStock}
                                    description={product.description}
                                    image={product.image}
                                    name={product.name}
                                    price={product.price}
                                    rating={product.rating}
                                    type={product.type}
                                    selled={product.selled}
                                    discount={product.discount}
                                    id={product._id}
                                />
                            );
                        })}
                    </WrapperProducts>
                    <div
                        style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            marginTop: '10px',
                        }}
                    >
                        <WrapperButtonMore
                            textbutton={
                                isPreviousData ? 'Load more' : 'Xem thêm'
                            }
                            type="outline"
                            styleButton={{
                                border: `1px solid ${
                                    products?.total === products?.data?.length
                                        ? '#f5f5f5'
                                        : '#9255FD'
                                }`,
                                color: `${
                                    products?.total === products?.data?.length
                                        ? '#f5f5f5'
                                        : '#9255FD'
                                }`,
                                width: '240px',
                                height: '38px',
                                borderRadius: '4px',
                            }}
                            disabled={
                                products?.total === products?.data?.length ||
                                products?.totalPage === 1
                            }
                            styleTextButton={{
                                fontWeight: 500,
                                color:
                                    products?.total ===
                                        products?.data?.length && '#fff',
                            }}
                            onClick={() => setLimit((prev) => prev + 6)}
                        />
                    </div>
                </div>
            </div>
        </Loading>
    );
};

export default HomePage;
