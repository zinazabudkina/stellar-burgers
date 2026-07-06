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
  selectUser,
  selectAuthChecked
} from '../../services/slices/userSlice';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(selectAuthChecked);
  const user = useSelector(selectUser);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const from = location.state?.from || { pathname: '/' };

    return <Navigate to={from} replace />;
  }

  return children;
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
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path='/ingredients/:id'
              element={<IngredientDetailsPage />}
            />
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />

            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />

            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
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
                  <ProtectedRoute>
                    <OrderModal onClose={handleClose} />
                  </ProtectedRoute>
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
