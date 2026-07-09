import reducer, { fetchIngredients } from '../ingredientsSlice';

describe('test ingredientsSlice reducer', () => {
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  test('должен вернуть initialState при неизвестном action', () => {
    expect(
      reducer(undefined, {
        type: 'UNKNOWN'
      })
    ).toEqual(initialState);
  });

  test('должен обработать fetchIngredients.pending', () => {
    expect(
      reducer(initialState, {
        type: fetchIngredients.pending.type
      })
    ).toEqual({
      items: [],
      loading: true,
      error: null
    });
  });

  test('должен обработать fetchIngredients.fulfilled', () => {
    const ingredients = [
      {
        _id: '1',
        name: 'Краторная булка',
        type: 'bun',
        proteins: 10,
        fat: 5,
        carbohydrates: 20,
        calories: 100,
        price: 100,
        image: '',
        image_mobile: '',
        image_large: ''
      }
    ];

    expect(
      reducer(initialState, {
        type: fetchIngredients.fulfilled.type,
        payload: ingredients
      })
    ).toEqual({
      items: ingredients,
      loading: false,
      error: null
    });
  });

  test('должен обработать fetchIngredients.rejected', () => {
    expect(
      reducer(initialState, {
        type: fetchIngredients.rejected.type,
        error: {
          message: 'Ошибка загрузки'
        }
      })
    ).toEqual({
      items: [],
      loading: false,
      error: 'Ошибка загрузки'
    });
  });
});
