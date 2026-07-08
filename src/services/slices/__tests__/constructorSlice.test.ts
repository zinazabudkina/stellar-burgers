import reducer, {
  addBun,
  addIngredient,
  moveIngredient,
  removeIngredient,
  clearConstructor
} from '../constructorSlice';

import { TIngredient, TConstructorIngredient } from '@utils-types';

const bun: TIngredient = {
  _id: 'bun-1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: '',
  image_mobile: '',
  image_large: ''
};

const ingredient: TIngredient = {
  _id: 'ingredient-1',
  name: 'Биокотлета',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: '',
  image_mobile: '',
  image_large: ''
};

const initialState = {
  bun: null,
  ingredients: []
};

describe('test constructorSlice reducer', () => {
  test('возвращает начальное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, {
      type: 'UNKNOWN'
    });

    expect(state).toEqual(initialState);
  });

  test('добавляет булку через addBun', () => {
    const state = reducer(initialState, addBun(bun));

    expect(state.bun).toEqual(bun);
  });

  test('добавляет ингредиент через addIngredient', () => {
    const state = reducer(initialState, addIngredient(ingredient));

    expect(state.ingredients).toHaveLength(1);

    expect(state.ingredients[0]).toMatchObject({
      _id: ingredient._id,
      name: ingredient.name,
      type: ingredient.type
    });

    expect(state.ingredients[0].id).toBeDefined();
  });

  test('перемещает ингредиент через moveIngredient', () => {
    const initialState = {
      bun: null,
      ingredients: [
        {
          ...ingredient,
          id: '1',
          name: 'Первый'
        },
        {
          ...ingredient,
          id: '2',
          name: 'Второй'
        }
      ]
    };

    const state = reducer(
      initialState,
      moveIngredient({
        fromIndex: 0,
        toIndex: 1
      })
    );

    expect(state.ingredients[0].id).toBe('2');
    expect(state.ingredients[1].id).toBe('1');
  });

  test('удаляет ингредиент через removeIngredient', () => {
    const testInitialState = {
      bun: null,
      ingredients: [
        {
          ...ingredient,
          id: '123'
        }
      ]
    };

    const state = reducer(testInitialState, removeIngredient('123'));

    expect(state.ingredients).toHaveLength(0);
  });

  test('очищает конструктор через clearConstructor', () => {
    const testInitialState = {
      bun: null,
      ingredients: [
        {
          ...ingredient,
          id: '123'
        }
      ]
    };

    const state = reducer(testInitialState, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
