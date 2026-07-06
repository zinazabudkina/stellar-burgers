import { useParams } from 'react-router-dom';
import { Modal } from '@components';
import { OrderInfo } from '@components';

export const OrderModal = ({ onClose }: { onClose: () => void }) => {
  const { number } = useParams<{ number: string }>();

  return (
    <Modal title={`#${number}`} onClose={onClose}>
      <OrderInfo />
    </Modal>
  );
};
