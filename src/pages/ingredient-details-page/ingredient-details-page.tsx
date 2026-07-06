import styles from './ingredient-details-page.module.css';
import { IngredientDetails } from '@components';

export const IngredientDetailsPage = () => (
  <div className={styles.container}>
    <p className='text text_type_main-large mt-10'>Детали ингредиента</p>

    <IngredientDetails />
  </div>
);
