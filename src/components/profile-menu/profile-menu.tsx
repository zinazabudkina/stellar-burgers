import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store'; // путь к вашему хуку
import { logout } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => navigate('/', { replace: true }))
      .catch(() => navigate('/', { replace: true }));
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
