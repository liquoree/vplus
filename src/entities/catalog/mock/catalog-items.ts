import type { CatalogItem } from '../model/types';

const quadBikeImages = [
  {
    id: 'quad-bike-main',
    url: '/images/catalog/quad-bike.jpg',
    alt: 'Квадроцикл для аренды в Карелии',
    sortOrder: 0,
    isMain: true,
  },
  {
    id: 'quad-bike-main-2',
    url: '/images/catalog/quad-bike.jpg',
    alt: 'Квадроцикл для аренды в Карелии',
    sortOrder: 1,
    isMain: false,
  },
];

export const catalogItems: CatalogItem[] = [
  {
    id: 'quad-bike',
    slug: 'quad-bike',
    kind: 'vehicle',
    title: 'Квадроцикл длинное название',
    description:
      'Почувствуйте мощь бездорожья за рулём четырёхколёсного монстра.',
    price: 3500,
    oldPrice: 4200,
    priceUnit: 'hour',
    images: quadBikeImages,
    characteristics: [
      {
        name: 'Мест',
        value: '2',
      },
      {
        name: 'Мощность',
        value: '500 куб. см',
      },
      {
        name: 'Маршрут',
        value: 'лесные и смешанные трассы',
      },
    ],
    isAvailable: true,
    season: 'summer',
  },
  {
    id: 'snowmobile',
    slug: 'snowmobile',
    kind: 'vehicle',
    title: 'Снегоход',
    description:
      'Мощная техника для зимних маршрутов и активного отдыха.',
    price: 4500,
    oldPrice: null,
    priceUnit: 'hour',
    images: [
      {
        id: 'snowmobile-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Снегоход для аренды в Карелии',
        sortOrder: 0,
        isMain: true,
      },
      {
        id: 'snowmobile-main-2',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Снегоход для аренды в Карелии',
        sortOrder: 1,
        isMain: false,
      },
    ],
    characteristics: [
      {
        name: 'Мест',
        value: '2',
      },
      {
        name: 'Мощность',
        value: '600 куб. см',
      },
      {
        name: 'Маршрут',
        value: 'зимние лесные трассы',
      },
    ],
    isAvailable: true,
    season: 'winter',
  },
  {
    id: 'sup-board',
    slug: 'sup-board',
    kind: 'vehicle',
    title: 'SUP-борд',
    description:
      'Спокойные прогулки по воде и красивые маршруты Карелии.',
    price: 1200,
    oldPrice: null,
    priceUnit: 'hour',
    images: [
      {
        id: 'sup-board-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'SUP-борд для аренды в Карелии',
        sortOrder: 0,
        isMain: true,
      },
    ],
    characteristics: [
      {
        name: 'Мест',
        value: '1',
      },
      {
        name: 'Маршрут',
        value: 'водные прогулки',
      },
      {
        name: 'Сезон',
        value: 'лето',
      },
    ],
    isAvailable: true,
    season: 'summer',
  },
  {
    id: 'all-inclusive',
    slug: 'all-inclusive',
    kind: 'package',
    title: 'All-inclusive',
    description:
      'Готовая программа с техникой, маршрутом и сопровождением.',
    price: 12000,
    oldPrice: 15000,
    priceUnit: 'fixed',
    images: [
      {
        id: 'all-inclusive-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Программа All-inclusive в Карелии',
        sortOrder: 0,
        isMain: true,
      },
    ],
    characteristics: [
      {
        name: 'Формат',
        value: 'техника + маршрут + сопровождение',
      },
      {
        name: 'Группа',
        value: 'до 4 человек',
      },
      {
        name: 'Длительность',
        value: 'от 3 часов',
      },
    ],
    isAvailable: true,
    includedVehicleIds: [
      'quad-bike',
      'snowmobile',
    ],
    includedServiceIds: [
      'fishing',
      'quest',
    ],
  },
  {
    id: 'base-rent',
    slug: 'base-rent',
    kind: 'service',
    title: 'Базовый прокат',
    description:
      'Самостоятельная прогулка на выбранной технике по согласованному маршруту.',
    price: 1200,
    oldPrice: null,
    priceUnit: 'hour',
    images: [
      {
        id: 'base-rent-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Базовый прокат техники в Карелии',
        sortOrder: 0,
        isMain: true,
      },
    ],
    characteristics: [
      {
        name: 'Формат',
        value: 'самостоятельная прогулка',
      },
      {
        name: 'Сопровождение',
        value: 'инструктаж перед поездкой',
      },
    ],
    isAvailable: true,
  },
  {
    id: 'fishing',
    slug: 'fishing',
    kind: 'service',
    title: 'Рыбалка',
    description:
      'Выездная программа с техникой и маршрутом.',
    price: 9500,
    oldPrice: 11000,
    priceUnit: 'fixed',
    images: [
      {
        id: 'fishing-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Рыбалка с техникой в Карелии',
        sortOrder: 0,
        isMain: true,
      },
    ],
    characteristics: [
      {
        name: 'Формат',
        value: 'выездная программа',
      },
      {
        name: 'Сопровождение',
        value: 'по согласованию',
      },
    ],
    isAvailable: true,
  },
  {
    id: 'quest',
    slug: 'quest',
    kind: 'service',
    title: 'Квест',
    description:
      'Маршрут с заданиями, сопровождением и активной программой.',
    price: 8500,
    oldPrice: 10000,
    priceUnit: 'fixed',
    images: [
      {
        id: 'quest-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Квест на технике в Карелии',
        sortOrder: 0,
        isMain: true,
      },
    ],
    characteristics: [
      {
        name: 'Формат',
        value: 'маршрут с заданиями',
      },
      {
        name: 'Сопровождение',
        value: 'инструктор',
      },
    ],
    isAvailable: true,
  },
  {
    id: 'winter-route',
    slug: 'winter-route',
    kind: 'service',
    title: 'Зимний маршрут',
    description:
      'Зимняя прогулка на снегоходах по подготовленному маршруту.',
    price: 12500,
    oldPrice: null,
    priceUnit: 'fixed',
    images: [
      {
        id: 'winter-route-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Зимний маршрут на снегоходах',
        sortOrder: 0,
        isMain: true,
      },
    ],
    characteristics: [
      {
        name: 'Формат',
        value: 'зимняя прогулка',
      },
      {
        name: 'Техника',
        value: 'снегоход',
      },
    ],
    isAvailable: true,
  },
  {
    id: 'water-route',
    slug: 'water-route',
    kind: 'service',
    title: 'Водный маршрут',
    description:
      'Маршрут по воде на SUP-бордах с сопровождением.',
    price: 3200,
    oldPrice: null,
    priceUnit: 'fixed',
    images: [
      {
        id: 'water-route-main',
        url: '/images/catalog/quad-bike.jpg',
        alt: 'Водный маршрут на SUP-бордах',
        sortOrder: 0,
        isMain: true,
      },
    ],
    characteristics: [
      {
        name: 'Формат',
        value: 'водный маршрут',
      },
      {
        name: 'Техника',
        value: 'SUP-борд',
      },
    ],
    isAvailable: true,
  },
];