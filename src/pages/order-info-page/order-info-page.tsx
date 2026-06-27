import styles from './order-info-page.module.css';
import { OrderInfo } from '@components';
import { useParams } from 'react-router-dom';

export const OrderInfoPage = () => {
  const { number } = useParams<{ number: string }>();

  return (
    <div className={styles.container}>
      <p className='text text_type_digits-default mt-10'>#{number}</p>

      <OrderInfo />
    </div>
  );
};
