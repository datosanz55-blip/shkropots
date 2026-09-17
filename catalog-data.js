/* Данные каталога ShkrobotS.
   Единственное место, где меняется наполнение: добавил объект в items —
   карточка появилась и в каталоге, и в фильтре. Трогать catalog.html не нужно.

   Категория: { id, name }         id — часть адреса: catalog.html#beds
   Позиция:   { cat, name, img }   img — путь к фото; без него карточка
                                   рисуется текстурной заглушкой.        */

const CATALOG_CATEGORIES = [
  { id: 'dining-tables',  name: 'Столы обеденные' },
  { id: 'coffee-tables',  name: 'Столы журнальные' },
  { id: 'computer-desks', name: 'Компьютерные столы' },
  { id: 'table-bases',    name: 'Подстолья лофт' },
  { id: 'beds',           name: 'Кровати лофт' },
  { id: 'cabinets',       name: 'Шкафы лофт' },
  { id: 'wardrobes',      name: 'Гардеробные лофт' },
  { id: 'shelving',       name: 'Стеллажи' },
  { id: 'consoles',       name: 'Консоли' },
  { id: 'tv-units',       name: 'Тумбы под ТВ' },
  { id: 'hallway',        name: 'Прихожие лофт' },
  { id: 'shoe-racks',     name: 'Обувницы' },
  { id: 'kitchens',       name: 'Кухни встроенные' },
  { id: 'bathroom',       name: 'Тумбы под раковину и стиральную машину' },
  { id: 'kids',           name: 'Мебель для детской' },
  { id: 'office',         name: 'Мебель для офиса' },
  { id: 'horeca',         name: 'Мебель для кафе, баров и ресторанов' },
  { id: 'beauty',         name: 'Мебель для салонов красоты' },
  { id: 'retail',         name: 'Торговое оборудование' },
  { id: 'partitions',     name: 'Перегородки и рейки' },
  { id: 'outdoor',        name: 'Уличная мебель' }
];

/* Позиции каталога.
   ЗАГЛУШКИ: реальных фото пока нет — карточки без img рисуются текстурой.
   Когда фото придут: положить в images/catalog/ и проставить img. */
const CATALOG_ITEMS = [
  // Уличная мебель — единственные реальные фото, что у нас есть
  { cat: 'outdoor', name: 'Комплект для террасы',        img: 'images/terrace-pool.jpg' },
  { cat: 'outdoor', name: 'Комплект для беседки',        img: 'images/gazebo-tent.jpg' },
  { cat: 'outdoor', name: 'Уличный комплект на заказ',   img: 'images/terrace-balcony.jpg' }
];

/* Пока позиций нет — показываем по столько заглушек на категорию,
   чтобы каркас каталога был виден. Поставить 0, когда наполнится. */
const CATALOG_PLACEHOLDERS_PER_CATEGORY = 3;
