import { ProfileUI } from '@ui-pages';
import { FC, SyntheticEvent, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { selectUser, updateUser } from '../../services/slices/userSlice';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });
  console.log(formValue.email);
  console.log(formValue.password);

  useEffect(() => {
    if (!user) return;

    setFormValue({
      name: user.name,
      email: user.email,
      password: ''
    });
  }, [user?.name, user?.email]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      const updateData: { name: string; email: string; password?: string } = {
        name: formValue.name,
        email: formValue.email
      };

      if (formValue.password) {
        updateData.password = formValue.password;
      }

      dispatch(updateUser(updateData)).unwrap();

      setFormValue((prevState) => ({
        ...prevState,
        password: ''
      }));
    } catch (error) {
      console.error('Ошибка при обновлении данных:', error);
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
    console.log(e.target.name);
    console.log(formValue.password);
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
