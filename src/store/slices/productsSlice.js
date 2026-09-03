import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  products: [
    // readyToUse - Зареждай от нас
    {
      id: 1,
      name: 'Розов Домат - Пинк Рок',
      price: 1.99,
      oldPrice: 2.49,
      discountPercent: 20,
      category: 'readyToUse',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?q=80&w=800'
    },
    {
      id: 2,
      name: 'Краставица - Гергана',
      price: 1.99,
      oldPrice: 2.35,
      discountPercent: 15,
      category: 'readyToUse',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?q=80&w=800'
    },
    {
      id: 3,
      name: 'Магданоз',
      price: 1.49,
      oldPrice: 1.65,
      discountPercent: 10,
      category: 'readyToUse',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://kaufland.media.schwarz/is/image/schwarz/vegetables-herbs-spices-parsley-detail-1?JGstbGVnYWN5LW9uc2l0ZS00JA=='
    },
    {
      id: 4,
      name: 'Босилек - Лилав',
      price: 2.20,
      category: 'readyToUse',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://gardentime-bg.decorexpro.com/wp-content/uploads/2018/11/6-25-360x480.jpg'
    },
    {
      id: 5,
      name: 'Чушка - Капия',
      price: 2.50,
      category: 'readyToUse',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=800'
    },
    {
      id: 6,
      name: 'Ягода - Албион',
      price: 2.80,
      category: 'readyToUse',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800'
    },
    {
      id: 7,
      name: 'Спанак - Матадор',
      price: 1.60,
      category: 'readyToUse',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800'
    },
    {
      id: 8,
      name: 'Рукола',
      price: 1.80,
      oldPrice: 2.00,
      discountPercent: 10,
      category: 'readyToUse',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1518843875459-f738682238a6?q=80&w=800'
    },
    {
      id: 9,
      name: 'Тиквичка - Златиста',
      price: 2.10,
      category: 'readyToUse',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=800'
    },
    {
      id: 10,
      name: 'Патладжан - Черен Красавец',
      price: 2.40,
      price: 2.40,
      oldPrice: 2.90,
      discountPercent: 17,
      category: 'readyToUse',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1613881553903-4543d4c2d30d?q=80&w=800'
    },
    {
      id: 11,
      name: 'Мента - Мароканска',
      price: 1.90,
      category: 'readyToUse',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1628558436375-a9d5e3d8d5cd?q=80&w=800'
    },
    {
      id: 12,
      name: 'Копър - Грибовски',
      price: 1.30,
      category: 'readyToUse',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1506368083636-6defb67639a7?q=80&w=800'
    },

    // seeds - Семена
    {
      id: 13,
      name: 'Семена - Домат Розов Гигант',
      price: 1.20,
      oldPrice: 1.50,
      discountPercent: 20,
      category: 'seeds',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?q=80&w=800'
    },
    {
      id: 14,
      name: 'Семена - Краставица Корнишон',
      price: 0.99,
      category: 'seeds',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1589621316382-008455b857cd?q=80&w=800'
    },
    {
      id: 15,
      name: 'Семена - Пипер Шипка',
      price: 1.10,
      category: 'seeds',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=800'
    },
    {
      id: 16,
      name: 'Семена - Морков Нантски',
      price: 0.89,
      category: 'seeds',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1447175008436-054170c2e979?q=80&w=800'
    },
    {
      id: 17,
      name: 'Семена - Маруля Батавия',
      price: 0.95,
      oldPrice: 1.20,
      discountPercent: 21,
      category: 'seeds',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1556801714-2d5c86f2a85b?q=80&w=800'
    },
    {
      id: 18,
      name: 'Семена - Тиква Цигулка',
      price: 1.50,
      category: 'seeds',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1506917728037-b6af01a7d403?q=80&w=800'
    },
    {
      id: 19,
      name: 'Семена - Босилек Дженовезе',
      price: 0.99,
      category: 'seeds',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1618164435735-413d3abaf39d?q=80&w=800'
    },
    {
      id: 20,
      name: 'Семена - Ягода Месечна',
      price: 1.80,
      category: 'seeds',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800'
    },
    {
      id: 21,
      name: 'Семена - Диня Кримсон Суит',
      price: 1.40,
      oldPrice: 1.80,
      discountPercent: 22,
      category: 'seeds',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=800'
    },
    {
      id: 22,
      name: 'Семена - Копър',
      price: 0.79,
      category: 'seeds',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1518568403628-df60788f2c2f?q=80&w=800'
    },

    // seedlings - Разсад
    {
      id: 23,
      name: 'Разсад - Домат Биволско Сърце',
      price: 1.20,
      category: 'seedlings',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1592845266293-67a79fb6a05d?q=80&w=800'
    },
    {
      id: 24,
      name: 'Разсад - Краставица Дълга',
      price: 1.10,
      category: 'seedlings',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1604977042946-1eecc30f269e?q=80&w=800'
    },
    {
      id: 25,
      name: 'Разсад - Пипер Капия',
      price: 1.25,
      oldPrice: 1.50,
      discountPercent: 17,
      category: 'seedlings',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?q=80&w=800'
    },
    {
      id: 26,
      name: 'Разсад - Тиквичка',
      price: 1.00,
      category: 'seedlings',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1597362925123-77861d3fbac7?q=80&w=800'
    },
    {
      id: 27,
      name: 'Разсад - Ягода Албион',
      price: 1.80,
      category: 'seedlings',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?q=80&w=800'
    },
    {
      id: 28,
      name: 'Разсад - Босилек',
      price: 1.15,
      category: 'seedlings',
      newProduct: 'no',
      discount: 'no',
      image: 'https://gardentime-bg.decorexpro.com/wp-content/uploads/2018/11/6-25-360x480.jpg'
    },
    {
      id: 29,
      name: 'Разсад - Диня',
      price: 1.30,
      oldPrice: 1.60,
      discountPercent: 19,
      category: 'seedlings',
      newProduct: 'no',
      discount: 'yes',
      image: 'https://images.unsplash.com/photo-1589984662646-e7b2e4962f18?q=80&w=800'
    },
    {
      id: 30,
      name: 'Разсад - Пъпеш Медена Роса',
      price: 1.30,
      category: 'seedlings',
      newProduct: 'yes',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?q=80&w=800'
    },
    {
      id: 31,
      name: 'Разсад - Патладжан',
      price: 1.20,
      category: 'seedlings',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1613881553903-4543d4c2d30d?q=80&w=800'
    },
    {
      id: 32,
      name: 'Разсад - Спанак',
      price: 0.90,
      category: 'seedlings',
      newProduct: 'no',
      discount: 'no',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?q=80&w=800'
    },
]
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {}
})

export default productsSlice.reducer