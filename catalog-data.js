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
   img   — крупное фото для лайтбокса (до 1600 px)
   thumb — превью для сетки (до 700 px); если не задан, берётся img
   Категории без позиций рисуются текстурными заглушками. */
const CATALOG_ITEMS = [
  // Уличная мебель — снято раньше, отдельными кадрами
  { cat: 'outdoor',        name: 'Комплект для террасы',                              img: 'images/terrace-pool.jpg' },
  { cat: 'outdoor',        name: 'Комплект для беседки',                              img: 'images/gazebo-tent.jpg' },
  { cat: 'outdoor',        name: 'Уличный комплект на заказ',                         img: 'images/terrace-balcony.jpg' },

  // Уличная мебель — партия 2, реальные объекты заказчиков
  { cat: 'outdoor',       name: 'Угловой диван с журнальным столом',                              img: 'images/catalog/outdoor-01.jpg',         thumb: 'images/catalog/thumb/outdoor-01.jpg' },
  { cat: 'outdoor',       name: 'Комплект кресел со столом',                                      img: 'images/catalog/outdoor-02.jpg',         thumb: 'images/catalog/thumb/outdoor-02.jpg' },
  { cat: 'outdoor',       name: 'Обеденная группа с угловым диваном',                             img: 'images/catalog/outdoor-03.jpg',         thumb: 'images/catalog/thumb/outdoor-03.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-зона под перголой',                                        img: 'images/catalog/outdoor-04.jpg',         thumb: 'images/catalog/thumb/outdoor-04.jpg' },
  { cat: 'outdoor',       name: 'Модульный лаунж-комплект',                                       img: 'images/catalog/outdoor-05.jpg',         thumb: 'images/catalog/thumb/outdoor-05.jpg' },
  { cat: 'outdoor',       name: 'Диван с шезлонгом',                                              img: 'images/catalog/outdoor-06.jpg',         thumb: 'images/catalog/thumb/outdoor-06.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван для остеклённой веранды',                          img: 'images/catalog/outdoor-07.jpg',         thumb: 'images/catalog/thumb/outdoor-07.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект с видом на воду',                                 img: 'images/catalog/outdoor-08.jpg',         thumb: 'images/catalog/thumb/outdoor-08.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван для террасы',                                      img: 'images/catalog/outdoor-09.jpg',         thumb: 'images/catalog/thumb/outdoor-09.jpg' },
  { cat: 'outdoor',       name: 'Стол со скамьёй из массива',                                     img: 'images/catalog/outdoor-10.jpg',         thumb: 'images/catalog/thumb/outdoor-10.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван с шезлонгом',                                      img: 'images/catalog/outdoor-11.jpg',         thumb: 'images/catalog/thumb/outdoor-11.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван для сада',                                         img: 'images/catalog/outdoor-12.jpg',         thumb: 'images/catalog/thumb/outdoor-12.jpg' },
  { cat: 'outdoor',       name: 'Обеденная группа для веранды',                                   img: 'images/catalog/outdoor-13.jpg',         thumb: 'images/catalog/thumb/outdoor-13.jpg' },
  { cat: 'outdoor',       name: 'Обеденная группа с креслами',                                    img: 'images/catalog/outdoor-14.jpg',         thumb: 'images/catalog/thumb/outdoor-14.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван с обеденным столом',                               img: 'images/catalog/outdoor-15.jpg',         thumb: 'images/catalog/thumb/outdoor-15.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект под навесом',                                     img: 'images/catalog/outdoor-16.jpg',         thumb: 'images/catalog/thumb/outdoor-16.jpg' },
  { cat: 'outdoor',       name: 'Длинный диван со столом',                                        img: 'images/catalog/outdoor-17.jpg',         thumb: 'images/catalog/thumb/outdoor-17.jpg' },
  { cat: 'outdoor',       name: 'Скамья со столом для веранды',                                   img: 'images/catalog/outdoor-18.jpg',         thumb: 'images/catalog/thumb/outdoor-18.jpg' },
  { cat: 'outdoor',       name: 'Обеденная группа со скамьями',                                   img: 'images/catalog/outdoor-19.jpg',         thumb: 'images/catalog/thumb/outdoor-19.jpg' },
  { cat: 'outdoor',       name: 'Стол со скамьями',                                               img: 'images/catalog/outdoor-20.jpg',         thumb: 'images/catalog/thumb/outdoor-20.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван со столом',                                        img: 'images/catalog/outdoor-21.jpg',         thumb: 'images/catalog/thumb/outdoor-21.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект для террасы',                                     img: 'images/catalog/outdoor-22.jpg',         thumb: 'images/catalog/thumb/outdoor-22.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект в светлой отделке',                               img: 'images/catalog/outdoor-23.jpg',         thumb: 'images/catalog/thumb/outdoor-23.jpg' },
  { cat: 'outdoor',       name: 'Обеденная группа для террасы',                                   img: 'images/catalog/outdoor-24.jpg',         thumb: 'images/catalog/thumb/outdoor-24.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект с креслами',                                      img: 'images/catalog/outdoor-25.jpg',         thumb: 'images/catalog/thumb/outdoor-25.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект у барбекю',                                       img: 'images/catalog/outdoor-26.jpg',         thumb: 'images/catalog/thumb/outdoor-26.jpg' },
  { cat: 'outdoor',       name: 'Длинная скамья со столом',                                       img: 'images/catalog/outdoor-27.jpg',         thumb: 'images/catalog/thumb/outdoor-27.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван в тёмной отделке',                                 img: 'images/catalog/outdoor-28.jpg',         thumb: 'images/catalog/thumb/outdoor-28.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект для беседки',                                     img: 'images/catalog/outdoor-29.jpg',         thumb: 'images/catalog/thumb/outdoor-29.jpg' },
  { cat: 'outdoor',       name: 'Обеденная группа в беседке',                                     img: 'images/catalog/outdoor-30.jpg',         thumb: 'images/catalog/thumb/outdoor-30.jpg' },
  { cat: 'outdoor',       name: 'Садовый диван с креслами',                                       img: 'images/catalog/outdoor-31.jpg',         thumb: 'images/catalog/thumb/outdoor-31.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван со столиком',                                      img: 'images/catalog/outdoor-32.jpg',         thumb: 'images/catalog/thumb/outdoor-32.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект для веранды',                                     img: 'images/catalog/outdoor-33.jpg',         thumb: 'images/catalog/thumb/outdoor-33.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект на газоне',                                       img: 'images/catalog/outdoor-34.jpg',         thumb: 'images/catalog/thumb/outdoor-34.jpg' },
  { cat: 'outdoor',       name: 'Лаунж-комплект для крыльца',                                     img: 'images/catalog/outdoor-35.jpg',         thumb: 'images/catalog/thumb/outdoor-35.jpg' },
  { cat: 'outdoor',       name: 'Стол со скамьями для крыльца',                                   img: 'images/catalog/outdoor-36.jpg',         thumb: 'images/catalog/thumb/outdoor-36.jpg' },
  { cat: 'outdoor',       name: 'Садовый диван',                                                  img: 'images/catalog/outdoor-37.jpg',         thumb: 'images/catalog/thumb/outdoor-37.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван для веранды сруба',                                img: 'images/catalog/outdoor-38.jpg',         thumb: 'images/catalog/thumb/outdoor-38.jpg' },
  { cat: 'outdoor',       name: 'Угловой диван со скамьёй',                                       img: 'images/catalog/outdoor-39.jpg',         thumb: 'images/catalog/thumb/outdoor-39.jpg' },

  // coffee-tables
  { cat: 'coffee-tables', name: 'Журнальный стол на геометричном подстолье',               img: 'images/catalog/coffee-tables-01.jpg',     thumb: 'images/catalog/thumb/coffee-tables-01.jpg' },

  // wardrobes
  { cat: 'wardrobes',     name: 'Гардеробная вешалка лофт',                                img: 'images/catalog/wardrobes-01.jpg',         thumb: 'images/catalog/thumb/wardrobes-01.jpg' },
  { cat: 'wardrobes',     name: 'Гардеробная зона с полками',                              img: 'images/catalog/wardrobes-02.jpg',         thumb: 'images/catalog/thumb/wardrobes-02.jpg' },

  // tv-units
  { cat: 'tv-units',      name: 'Тумба под ТВ с деревянными полками',                      img: 'images/catalog/tv-units-01.jpg',          thumb: 'images/catalog/thumb/tv-units-01.jpg' },
  { cat: 'tv-units',      name: 'Тумба под ТВ, металл и массив',                           img: 'images/catalog/tv-units-02.jpg',          thumb: 'images/catalog/thumb/tv-units-02.jpg' },

  // shelving
  { cat: 'shelving',      name: 'Стеллаж из металла и массива',                            img: 'images/catalog/shelving-01.jpg',          thumb: 'images/catalog/thumb/shelving-01.jpg' },
  { cat: 'shelving',      name: 'Комплект стеллажей',                                      img: 'images/catalog/shelving-02.jpg',          thumb: 'images/catalog/thumb/shelving-02.jpg' },
  { cat: 'shelving',      name: 'Стеллаж комбинированный',                                 img: 'images/catalog/shelving-03.jpg',          thumb: 'images/catalog/thumb/shelving-03.jpg' },

  // office
  { cat: 'office',        name: 'Рабочий стол на металлокаркасе · Проект Алое Поле',       img: 'images/catalog/office-01.jpg',            thumb: 'images/catalog/thumb/office-01.jpg' },
  { cat: 'office',        name: 'Кабинет руководителя · Проект Алое Поле',                 img: 'images/catalog/office-02.jpg',            thumb: 'images/catalog/thumb/office-02.jpg' },
  { cat: 'office',        name: 'Переговорный стол · Проект Алое Поле',                    img: 'images/catalog/office-03.jpg',            thumb: 'images/catalog/thumb/office-03.jpg' },
  { cat: 'office',        name: 'Открытое пространство · Проект Алое Поле',                img: 'images/catalog/office-04.jpg',            thumb: 'images/catalog/thumb/office-04.jpg' },
  { cat: 'office',        name: 'Переговорная зона · Проект Алое Поле',                    img: 'images/catalog/office-05.jpg',            thumb: 'images/catalog/thumb/office-05.jpg' },
  { cat: 'office',        name: 'Рабочие места · Проект Алое Поле',                        img: 'images/catalog/office-06.jpg',            thumb: 'images/catalog/thumb/office-06.jpg' },
  { cat: 'office',        name: 'Ряд рабочих мест · Проект Алое Поле',                     img: 'images/catalog/office-07.jpg',            thumb: 'images/catalog/thumb/office-07.jpg' },
  { cat: 'office',        name: 'Стол у панорамного окна · Проект Алое Поле',              img: 'images/catalog/office-08.jpg',            thumb: 'images/catalog/thumb/office-08.jpg' },
  { cat: 'office',        name: 'Переговорная за стеклом · Проект Алое Поле',              img: 'images/catalog/office-09.jpg',            thumb: 'images/catalog/thumb/office-09.jpg' },
  { cat: 'office',        name: 'Переговорный стол на 6 мест · Проект Алое Поле',          img: 'images/catalog/office-10.jpg',            thumb: 'images/catalog/thumb/office-10.jpg' },
  { cat: 'office',        name: 'Офис в стекле и дереве · Проект Алое Поле',               img: 'images/catalog/office-11.jpg',            thumb: 'images/catalog/thumb/office-11.jpg' },
  { cat: 'office',        name: 'Рабочее место у окна · Проект Алое Поле',                 img: 'images/catalog/office-12.jpg',            thumb: 'images/catalog/thumb/office-12.jpg' },
  { cat: 'office',        name: 'Стол с металлическим подстольем · Проект ЖК Ньютон',      img: 'images/catalog/office-13.jpg',            thumb: 'images/catalog/thumb/office-13.jpg' },
  { cat: 'office',        name: 'Переговорный стол · Проект ЖК Ньютон',                    img: 'images/catalog/office-14.jpg',            thumb: 'images/catalog/thumb/office-14.jpg' },
  { cat: 'office',        name: 'Зона ресепшн с диваном · Проект ЖК Ньютон',               img: 'images/catalog/office-15.jpg',            thumb: 'images/catalog/thumb/office-15.jpg' },
  { cat: 'office',        name: 'Стол у окна · Проект ЖК Ньютон',                          img: 'images/catalog/office-16.jpg',            thumb: 'images/catalog/thumb/office-16.jpg' },
  { cat: 'office',        name: 'Ресепшн, массив и металл · Проект ЖК Ньютон',             img: 'images/catalog/office-17.jpg',            thumb: 'images/catalog/thumb/office-17.jpg' },
  { cat: 'office',        name: 'Рабочий стол руководителя · Проект ЖК Ньютон',            img: 'images/catalog/office-18.jpg',            thumb: 'images/catalog/thumb/office-18.jpg' },
  { cat: 'office',        name: 'Переговорный стол, вид сверху · Проект ЖК Ньютон',        img: 'images/catalog/office-19.jpg',            thumb: 'images/catalog/thumb/office-19.jpg' },
  { cat: 'office',        name: 'Стол на П-образном каркасе · Проект ЖК Ньютон',           img: 'images/catalog/office-20.jpg',            thumb: 'images/catalog/thumb/office-20.jpg' },
  { cat: 'office',        name: 'Стол с перфорированной царгой · Проект ЖК Ньютон',        img: 'images/catalog/office-21.jpg',            thumb: 'images/catalog/thumb/office-21.jpg' },
  { cat: 'office',        name: 'Стеллаж-перегородка · Проект ЖК Ньютон',                  img: 'images/catalog/office-22.jpg',            thumb: 'images/catalog/thumb/office-22.jpg' },
  { cat: 'office',        name: 'Рабочее место со стеллажом · Проект ЖК Ньютон',           img: 'images/catalog/office-23.jpg',            thumb: 'images/catalog/thumb/office-23.jpg' },
  { cat: 'office',        name: 'Кабинет на два места · Проект ЖК Ньютон',                 img: 'images/catalog/office-24.jpg',            thumb: 'images/catalog/thumb/office-24.jpg' },
  { cat: 'office',        name: 'Рабочая зона · Проект ЖК Ньютон',                         img: 'images/catalog/office-25.jpg',            thumb: 'images/catalog/thumb/office-25.jpg' },
  { cat: 'office',        name: 'Стол с тумбой · Проект ЖК Ньютон',                        img: 'images/catalog/office-26.jpg',            thumb: 'images/catalog/thumb/office-26.jpg' },
  { cat: 'office',        name: 'Переговорный стол, массив · Проект ЖК Ньютон',            img: 'images/catalog/office-27.jpg',            thumb: 'images/catalog/thumb/office-27.jpg' },
  { cat: 'office',        name: 'Рабочий стол, бетон и металл · Проект Яндекс Про',        img: 'images/catalog/office-28.jpg',            thumb: 'images/catalog/thumb/office-28.jpg' },
  { cat: 'office',        name: 'Переговорный стол · Проект Яндекс Про',                   img: 'images/catalog/office-29.jpg',            thumb: 'images/catalog/thumb/office-29.jpg' },
  { cat: 'office',        name: 'Угловой стол с тумбой · Проект Яндекс Про',               img: 'images/catalog/office-30.jpg',            thumb: 'images/catalog/thumb/office-30.jpg' },
  { cat: 'office',        name: 'Угловое рабочее место · Проект Яндекс Про',               img: 'images/catalog/office-31.jpg',            thumb: 'images/catalog/thumb/office-31.jpg' },
  { cat: 'office',        name: 'Два рабочих стола · Проект Яндекс Про',                   img: 'images/catalog/office-32.jpg',            thumb: 'images/catalog/thumb/office-32.jpg' },
  { cat: 'office',        name: 'Угловой стол руководителя · Проект Яндекс Про',           img: 'images/catalog/office-33.jpg',            thumb: 'images/catalog/thumb/office-33.jpg' },
  { cat: 'office',        name: 'Рабочее место у входа · Проект Яндекс Про',               img: 'images/catalog/office-34.jpg',            thumb: 'images/catalog/thumb/office-34.jpg' },
  { cat: 'office',        name: 'Стол с металлической царгой · Проект Яндекс Про',         img: 'images/catalog/office-35.jpg',            thumb: 'images/catalog/thumb/office-35.jpg' },
  { cat: 'office',        name: 'Кабинет руководителя · Проект Яндекс Про',                img: 'images/catalog/office-36.jpg',            thumb: 'images/catalog/thumb/office-36.jpg' },
  { cat: 'office',        name: 'Угловой стол с тумбами · Проект Яндекс Про',              img: 'images/catalog/office-37.jpg',            thumb: 'images/catalog/thumb/office-37.jpg' },
  { cat: 'office',        name: 'Длинный угловой стол · Проект Яндекс Про',                img: 'images/catalog/office-38.jpg',            thumb: 'images/catalog/thumb/office-38.jpg' },
  { cat: 'office',        name: 'Тумба вдоль стены · Проект Яндекс Про',                   img: 'images/catalog/office-39.jpg',            thumb: 'images/catalog/thumb/office-39.jpg' },
  { cat: 'office',        name: 'Стойка ресепшн · Проект Яндекс Про',                      img: 'images/catalog/office-40.jpg',            thumb: 'images/catalog/thumb/office-40.jpg' },
  { cat: 'office',        name: 'Ресепшн, фасад в бетоне · Проект Яндекс Про',             img: 'images/catalog/office-41.jpg',            thumb: 'images/catalog/thumb/office-41.jpg' },

  // coffee-tables
  { cat: 'coffee-tables', name: 'Приставной столик · Проект Яндекс Про',                   img: 'images/catalog/coffee-tables-02.jpg',     thumb: 'images/catalog/thumb/coffee-tables-02.jpg' },
  { cat: 'coffee-tables', name: 'Журнальный стол в зоне отдыха · Проект Яндекс Про',       img: 'images/catalog/coffee-tables-03.jpg',     thumb: 'images/catalog/thumb/coffee-tables-03.jpg' },
  { cat: 'coffee-tables', name: 'Приставной стол у дивана · Проект Яндекс Про',            img: 'images/catalog/coffee-tables-04.jpg',     thumb: 'images/catalog/thumb/coffee-tables-04.jpg' },
  { cat: 'coffee-tables', name: 'Журнальный стол, низкий · Проект Яндекс Про',             img: 'images/catalog/coffee-tables-05.jpg',     thumb: 'images/catalog/thumb/coffee-tables-05.jpg' },
  { cat: 'coffee-tables', name: 'Журнальный стол на тонком каркасе · Проект Яндекс Про',   img: 'images/catalog/coffee-tables-06.jpg',     thumb: 'images/catalog/thumb/coffee-tables-06.jpg' },
  { cat: 'coffee-tables', name: 'Журнальный стол с полкой · Проект Яндекс Про',            img: 'images/catalog/coffee-tables-07.jpg',     thumb: 'images/catalog/thumb/coffee-tables-07.jpg' },

  // partitions
  { cat: 'partitions',    name: 'Перегородка с геометричным рисунком · Проект Яндекс Про', img: 'images/catalog/partitions-01.jpg',        thumb: 'images/catalog/thumb/partitions-01.jpg' },
  { cat: 'partitions',    name: 'Зонирующая перегородка · Проект Яндекс Про',              img: 'images/catalog/partitions-02.jpg',        thumb: 'images/catalog/thumb/partitions-02.jpg' },

  // cabinets
  { cat: 'cabinets',      name: 'Шкаф с фасадами под бетон · Проект Яндекс Про',           img: 'images/catalog/cabinets-01.jpg',          thumb: 'images/catalog/thumb/cabinets-01.jpg' },
  { cat: 'cabinets',      name: 'Шкаф распашной · Проект Яндекс Про',                      img: 'images/catalog/cabinets-02.jpg',          thumb: 'images/catalog/thumb/cabinets-02.jpg' },
  { cat: 'cabinets',      name: 'Шкаф с распашными дверями · Проект Яндекс Про',           img: 'images/catalog/cabinets-03.jpg',          thumb: 'images/catalog/thumb/cabinets-03.jpg' },
  { cat: 'cabinets',      name: 'Шкаф-гардероб · Проект Яндекс Про',                       img: 'images/catalog/cabinets-04.jpg',          thumb: 'images/catalog/thumb/cabinets-04.jpg' },
];

/* Пока позиций нет — показываем по столько заглушек на категорию,
   чтобы каркас каталога был виден. Поставить 0, когда наполнится. */
const CATALOG_PLACEHOLDERS_PER_CATEGORY = 3;
