import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const TOTAL_CONTACTS = 36;
const outputPath = resolve(process.cwd(), 'src/assets/data/contacts.json');

const groups = [
  'Семья',
  'Альбанк',
  'Европлан Банк',
  'Русский Стандарт',
  'Школа 74',
  'Школа 213',
  'Школа 599',
  'Универ'
];

const cities = [
  'Москва',
  'Санкт-Петербург',
  'Казань',
  'Екатеринбург',
  'Новосибирск',
  'Краснодар',
  'Алматы',
  'Астана',
  'Самара',
  'Минск',
  'Ташкент',
  'Бишкек'
];

const organizations = {
  'Семья': [
    'Семейный совет',
    'Домашний архив',
    'Семейный бизнес',
    'Родительский комитет'
  ],
  'Альбанк': [
    'Альбанк',
    'Альбанк Digital',
    'Альбанк Premium',
    'Альбанк Data Office'
  ],
  'Европлан Банк': [
    'Европлан Банк',
    'Европлан Банк IT',
    'Европлан Лизинг',
    'Европлан Финанс'
  ],
  'Русский Стандарт': [
    'Русский Стандарт',
    'Русский Стандарт Страхование',
    'Русский Стандарт Технологии',
    'Русский Стандарт Премиум'
  ],
  'Школа 74': [
    'Школа 74',
    'Школьный театр 74',
    'Выпускники 74',
    'Спортклуб 74'
  ],
  'Школа 213': [
    'Школа 213',
    'Клуб выпускников 213',
    'Лицейское сообщество 213',
    'Техкружок 213'
  ],
  'Школа 599': [
    'Школа 599',
    'Медиацентр 599',
    'Школьная редакция 599',
    'Выпускной комитет 599'
  ],
  'Универ': [
    'Университет',
    'Студенческий совет',
    'Факультет экономики',
    'Кафедра информатики',
    'Ассоциация выпускников'
  ]
};

const tagsPool = [
  'VIP',
  'Срочно',
  'Семья',
  'Работа',
  'Партнер',
  'Подрядчик',
  'Коллега',
  'Школа',
  'Универ',
  'Одноклассник',
  'Одногруппник',
  'Путешествия',
  'Маркетинг',
  'Финансы',
  'IT',
  'HR',
  'Родословная',
  'Сосед',
  'Блогер',
  'Актер',
  'Музыкант',
  'Ментор',
  'Инвестор',
  'Проверить',
  'Неизвестный',
  'Premium'
];

const firstNames = [
  'Александр', 'Мария', 'София', 'Владислав', 'Анастасия', 'Лев', 'Милана', 'Арсений',
  'Екатерина', 'Дарья', 'Тимур', 'Ольга', 'Степан', 'Вероника', 'Илья', 'Арина',
  'Ярослав', 'Полина', 'Никита', 'Виктория', 'Матвей', 'Алёна', 'Михаил', 'Злата',
  'Богдан', 'Нина', 'Фёдор', 'Лидия', 'Кирилл', 'Элина', 'Глеб', 'Таисия',
  'Савелий', 'Ева', 'Павел', 'Диана', 'Руслан', 'Лилия', 'Роман', 'Надежда'
];

const lastNames = [
  'Иванов', 'Петрова', 'Соколова', 'Тимирязев', 'Громов', 'Белозёрова', 'Каримов', 'Шереметьева',
  'Лебедев', 'Черкасова', 'Воронцов', 'Беляев', 'Абдуллина', 'Николаев', 'Кузнецова', 'Мещерякова',
  'Давыдов', 'Сафарова', 'Новиков', 'Высоцкая', 'Тургенева', 'Рахманинов', 'Преображенский', 'Аксенова',
  'Голубев', 'Щербакова', 'Гончаренко', 'Звягинцев', 'Орлова', 'Воскресенская'
];

const middleNames = [
  'Александрович', 'Сергеевна', 'Ильич', 'Павловна', 'Маратович', 'Викторовна', 'Никитич', 'Дмитриевна',
  'Олегович', 'Владимировна', 'Тимофеевич', 'Андреевна', 'Романович', 'Егоровна'
];

const relationTags = ['Мама', 'Папа', 'Брат', 'Сестра', 'Дедушка', 'Бабушка', 'Сын', 'Дочь', 'Крестный', 'Тетя'];

const famousContacts = [
  makeFamous(1, 'Виктор', 'Цой', '', 28, 'Музыкант', 'Кино', 'Семья', ['Легенда', 'Музыкант'], 'Санкт-Петербург'),
  makeFamous(2, 'Юрий', 'Шевчук', '', 39, 'Музыкант', 'ДДТ', 'Альбанк', ['Музыкант', 'Рок'], 'Уфа'),
  makeFamous(3, 'Земфира', 'Рамазанова', '', 32, 'Музыкант', 'Zemfira Live', 'Русский Стандарт', ['Музыкант', 'Live'], 'Москва'),
  makeFamous(4, 'Баста', 'Вакуленко', '', 36, 'Музыкант', 'Gazgolder', 'Европлан Банк', ['Музыкант', 'Продюсер'], 'Ростов-на-Дону'),
  makeFamous(5, 'Miyagi', 'Кудзаев', '', 30, 'Музыкант', 'Hajime Records', 'Универ', ['Музыкант', 'Хип-хоп'], 'Владикавказ'),
  makeFamous(6, 'Элджей', 'Узенюк', '', 29, 'Музыкант', 'Sayonaraboy', 'Школа 74', ['Музыкант', 'Шоу'], 'Новосибирск'),
  makeFamous(7, 'Константин', 'Хабенский', '', 41, 'Киноактёр', 'МХТ им. Чехова', 'Школа 213', ['Актер', 'Театр'], 'Москва'),
  makeFamous(8, 'Александра', 'Бортич', '', 30, 'Киноактёр', 'Кинопроект', 'Школа 599', ['Актер', 'Кино'], 'Минск'),
  makeFamous(9, 'Райан', 'Гослинг', '', 43, 'Киноактёр', 'Hollywood Pictures', 'Альбанк', ['Актер', 'Hollywood'], 'Торонто'),
  makeFamous(10, 'Киану', 'Ривз', '', 59, 'Киноактёр', 'Arc Company', 'Европлан Банк', ['Актер', 'Легенда'], 'Лос-Анджелес'),
  makeFamous(11, 'MrBeast', 'Donaldson', '', 26, 'Блогер', 'Beast Media', 'Русский Стандарт', ['Блогер', 'YouTube'], 'Гринвилл'),
  makeFamous(12, 'Ида', 'Галич', '', 34, 'Блогер', 'Galich Media', 'Универ', ['Блогер', 'Интервью'], 'Москва'),
  makeFamous(13, 'Влад', 'Бумага', '', 28, 'Блогер', 'A4 Production', 'Школа 74', ['Блогер', 'YouTube'], 'Минск'),
  makeFamous(14, 'Настя', 'Ивлеева', '', 33, 'Блогер', 'Agentgirl', 'Школа 213', ['Блогер', 'Шоу'], 'Санкт-Петербург')
];

const contacts = [...famousContacts];

for (let id = famousContacts.length + 1; id <= TOTAL_CONTACTS; id += 1) {
  const group = groups[(id - 1) % groups.length];
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[(id * 3) % lastNames.length];
  const middleName = id % 5 === 0 ? middleNames[(id * 7) % middleNames.length] : '';
  const age = 17 + (id % 53);
  const city = cities[(id * 5) % cities.length];
  const organizationList = organizations[group];
  const organization = organizationList[id % organizationList.length];
  const online = id % 4 !== 0;
  const callTypes = ['incoming', 'outgoing', 'missed'];
  const callType = callTypes[id % callTypes.length];
  const duration = callType === 'missed'
    ? '00:00'
    : `${String((id * 7) % 23).padStart(2, '0')}:${String((id * 11) % 60).padStart(2, '0')}`;
  const tagCount = 2 + (id % 3);
  const tags = [];

  for (let i = 0; i < tagCount; i += 1) {
    const tag = tagsPool[(id + (i * 7)) % tagsPool.length];
    if (!tags.includes(tag)) {
      tags.push(tag);
    }
  }

  if (group === 'Семья') {
    tags.push(relationTags[id % relationTags.length]);
  }

  if (id % 19 === 0) {
    tags.push('Неизвестный');
  }

  const baseSlug = slugify(`${firstName}-${lastName}-${middleName || age}-${id}`);

  contacts.push({
    id,
    firstName,
    lastName,
    middleName,
    fullName: [lastName, firstName, middleName].filter(Boolean).join(' '),
    age,
    group,
    tags: unique(tags),
    organization,
    occupation: inferOccupation(group, id),
    city,
    online,
    callType,
    duration,
    note: makeNote(group, organization, city, id),
    socials: {
      instagram: `https://instagram.com/${baseSlug}`,
      twitter: `https://twitter.com/${baseSlug}`,
      vk: `https://vk.com/${baseSlug}`,
      appleMusic: `https://music.apple.com/profile/${baseSlug}`,
      youtube: `https://youtube.com/@${baseSlug}`,
      tiktok: `https://www.tiktok.com/@${baseSlug}`
    }
  });
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(contacts, null, 2)}\n`, 'utf8');

console.log(`Generated ${contacts.length} contacts at ${outputPath}`);

function makeFamous(id, firstName, lastName, middleName, age, occupation, organization, group, tags, city) {
  const slug = slugify(`${firstName}-${lastName}`);
  return {
    id,
    firstName,
    lastName,
    middleName,
    fullName: [lastName, firstName, middleName].filter(Boolean).join(' '),
    age,
    group,
    tags,
    organization,
    occupation,
    city,
    online: id % 2 === 0,
    callType: id % 3 === 0 ? 'missed' : id % 2 === 0 ? 'outgoing' : 'incoming',
    duration: id % 3 === 0 ? '00:00' : `${String(8 + id).padStart(2, '0')}:${String((id * 9) % 60).padStart(2, '0')}`,
    note: `${occupation} из ${organization}, добавлен в подборку известных контактов`,
    socials: {
      instagram: `https://instagram.com/${slug}`,
      twitter: `https://twitter.com/${slug}`,
      vk: `https://vk.com/${slug}`,
      appleMusic: `https://music.apple.com/profile/${slug}`,
      youtube: `https://youtube.com/@${slug}`,
      tiktok: `https://www.tiktok.com/@${slug}`
    }
  };
}

function inferOccupation(group, id) {
  const map = {
    'Семья': ['Семейный куратор', 'Архивариус семьи', 'Частный предприниматель', 'Домашний финансист'],
    'Альбанк': ['Финансовый аналитик', 'Product Manager', 'Backend Engineer', 'Руководитель офиса'],
    'Европлан Банк': ['Менеджер по лизингу', 'Credit Analyst', 'Data Scientist', 'Операционный директор'],
    'Русский Стандарт': ['Риск-менеджер', 'Frontend Engineer', 'HR BP', 'Специалист по взысканию'],
    'Школа 74': ['Выпускник', 'Учитель математики', 'Классный руководитель', 'Тренер секции'],
    'Школа 213': ['Выпускник', 'Педагог-организатор', 'Завуч', 'Куратор олимпиад'],
    'Школа 599': ['Выпускник', 'Редактор медиацентра', 'Преподаватель информатики', 'Староста класса'],
    'Универ': ['Студент', 'Доцент', 'Научный сотрудник', 'Выпускник']
  };

  const variants = map[group];
  return variants[id % variants.length];
}

function makeNote(group, organization, city, id) {
  const notes = [
    `Работает в "${organization}", часто бывает в ${city}`,
    `Контакт из группы "${group}", есть история звонков и связи для родословной`,
    `Добавлен для суперприложения: фильтры, карта, новости и карточка соцсетей`,
    `Полезен для быстрых маршрутов, совместных поездок и группового выбора контактов`
  ];
  return notes[id % notes.length];
}

function slugify(value) {
  const translitMap = new Map([
    ['а', 'a'], ['б', 'b'], ['в', 'v'], ['г', 'g'], ['д', 'd'], ['е', 'e'], ['ё', 'e'],
    ['ж', 'zh'], ['з', 'z'], ['и', 'i'], ['й', 'y'], ['к', 'k'], ['л', 'l'], ['м', 'm'],
    ['н', 'n'], ['о', 'o'], ['п', 'p'], ['р', 'r'], ['с', 's'], ['т', 't'], ['у', 'u'],
    ['ф', 'f'], ['х', 'h'], ['ц', 'ts'], ['ч', 'ch'], ['ш', 'sh'], ['щ', 'sch'], ['ъ', ''],
    ['ы', 'y'], ['ь', ''], ['э', 'e'], ['ю', 'yu'], ['я', 'ya']
  ]);

  return value
    .toLowerCase()
    .split('')
    .map((char) => translitMap.get(char) ?? char)
    .join('')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function unique(items) {
  return [...new Set(items)];
}
