// import AdminPage from '../pages/AdminPage/AdminPage';
// import DetailsOrderPage from '../pages/DetailsOrderPage/DetailsOrderPage';
import HomePage from '../pages/HomePage/HomePage';
import MyOrderPage from '../pages/MyOrder/MyOrder';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import AdminPage from '../pages/AdminPage/AdminPage';
import ProductDetailsPage from '../pages/ProductDetailsPage/ProductDetailsPage';
import ProductsPage from '../pages/ProductsPage/ProductsPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SignInPage from '../pages/SignInPage/SignInPage';
import SignUpPage from '../pages/SignUpPage/SignUpPage';
import TypeProductPage from '../pages/TypeProductPage/TypeProductPage';
import OrderPage from '../pages/OrderPage/OrderPage';
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess';
import DetailsOrderPage from '../pages/DetailsOrderPage/DetailsOrderPage';

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true,
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true,
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
    },
    {
        path: '/orderSuccess',
        page: OrderSuccess,
        isShowHeader: true,
    },
    {
        path: '/products',
        page: ProductsPage,
        isShowHeader: true,
    },
    {
        path: '/product/:type',
        page: TypeProductPage,
        isShowHeader: true,
    },
    {
        path: '/sign-in',
        page: SignInPage,
        isShowHeader: false,
    },
    {
        path: '/sign-up',
        page: SignUpPage,
        isShowHeader: false,
    },
    {
        path: '/product-details/:id',
        page: ProductDetailsPage,
        isShowHeader: true,
    },
    {
        path: '/profile-user',
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isPrivated: true,
    },
    {
        path: '*',
        page: NotFoundPage,
    },
];
