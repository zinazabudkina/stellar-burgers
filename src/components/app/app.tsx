import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404,
  IngredientDetailsPage,
  OrderInfoPage
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import { OrderModal } from '../modal/order-modal';
import '../../index.css';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import styles from './app.module.css';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import {
  getIngredients,
  getIngredientsError,
  getIngredientsLoading,
  fetchIngredients
} from '../../services/slices/ingredientsSlice';
import {
  fetchUser,
  selectIsAuth,
  selectAuthChecked
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

type PrivateRouteProps = {
  children: React.ReactElement;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const isAuth = useSelector(selectIsAuth);
  console.log(isAuth);
  const isAuthChecked = useSelector(selectAuthChecked);
  console.log(isAuthChecked);

  if (!isAuthChecked) return <Preloader />;
  return isAuth ? children : <Navigate to='/login' replace />;
};

type PublicRouteProps = {
  children: React.ReactElement;
};

const PublicRoute = ({ children }: PublicRouteProps) => {
  const isAuth = useSelector(selectIsAuth);
  const isAuthChecked = useSelector(selectAuthChecked);

  if (!isAuthChecked) return <Preloader />;

  return !isAuth ? children : <Navigate to='/' replace />;
};

const App = () => {
  const isIngredientsLoading = useSelector(getIngredientsLoading);
  const ingredients = useSelector(getIngredients);
  const error = useSelector(getIngredientsError);
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, []);

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <Routes location={backgroundLocation || location}>
            <Route
              path='/'
              element={
                ingredients.length > 0 ? (
                  <ConstructorPage />
                ) : (
                  <div
                    className={`${styles.title} text text_type_main-medium pt-4`}
                  >
                    Нет ингредиентов
                  </div>
                )
              }
            />

            <Route path='/feed' element={<Feed />} />
            <Route path='/feed/:number' element={<OrderInfoPage />} />
            <Route path='/profile/orders/:number' element={<OrderInfoPage />} />
            <Route
              path='/ingredients/:id'
              element={<IngredientDetailsPage />}
            />
            <Route
              path='/login'
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />

            <Route
              path='/register'
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              }
            />

            <Route
              path='/forgot-password'
              element={
                <PublicRoute>
                  <ForgotPassword />
                </PublicRoute>
              }
            />

            <Route
              path='/reset-password'
              element={
                <PublicRoute>
                  <ResetPassword />
                </PublicRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <PrivateRoute>
                  <Profile />
                </PrivateRoute>
              }
            />

            <Route
              path='/profile/orders'
              element={
                <PrivateRoute>
                  <ProfileOrders />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='/feed/:number'
                element={<OrderModal onClose={handleClose} />}
              />

              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />

              <Route
                path='/profile/orders/:number'
                element={
                  <PrivateRoute>
                    <OrderModal onClose={handleClose} />
                  </PrivateRoute>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
