// Rarog — mock-data.ts
// Путь: packages/react/stories/utils/mock-data.ts
// Назначение: готовые мок‑данные для Storybook/сторис компонентов (@rarog/react)
// Автор: TheSkiF4er
// Язык: TypeScript (типизированные данные + генераторы)
// Лицензия: Apache-2.0

/**
 * Файл содержит набор удобных mock‑данных и утилит для сторис:
 * - пользователей / авторов
 * - карточек (card)
 * - dropdown / menu items
 * - forms (sample options)
 * - генераторы случайных строк/идентификаторов
 *
 * Использование: импортируйте необходимые наборы данных в stories и переопределяйте поля по необходимости.
 */

export type User = {
  id: string;
  name: string;
  username?: string;
  avatar?: string; // URL
  title?: string;
  bio?: string;
};

export type CardItem = {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  image?: string;
  tags?: string[];
  actions?: { label: string; actionId?: string }[];
};

export type DropdownItem = {
  id: string;
  label: string;
  icon?: string; // optional icon name or emoji
  disabled?: boolean;
  danger?: boolean;
};

// =====================
// Простые генераторы
// =====================
export const uid = (prefix = 'id') => `${prefix}-${Math.random().toString(36).slice(2, 9)}`;

export const nowIso = () => new Date().toISOString();

export function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Небольшой lorem generator (deterministic-ish)
const LOREM = [
  'Короткое описание элемента интерфейса. Подходит для превью и списков.',
  'Это пример прокомментированного текста — подставьте реальный контент по необходимости.',
  'Многофункциональная карточка с заголовком, мета и действиями. Используется в сторис.',
  'Текст-заполнитель для демонстрации переносов и высот блока в сетке.'
];
export const lorem = (lines = 1) => new Array(lines).fill(0).map((_, i) => LOREM[(i + Math.floor(Math.random() * LOREM.length)) % LOREM.length]).join(' ');

// =====================
// Мок‑пользователи
// =====================
export const MOCK_USERS: User[] = [
  {
    id: 'u-arya',
    name: 'Арья Новикова',
    username: 'arya.n',
    avatar: 'https://i.pravatar.cc/120?img=12',
    title: 'Product Designer',
    bio: 'Любит минимализм и хорошие micro-interactions.'
  },
  {
    id: 'u-dmitry',
    name: 'Дмитрий Ефимов',
    username: 'd.efimov',
    avatar: 'https://i.pravatar.cc/120?img=5',
    title: 'Frontend Engineer',
    bio: 'Специалист по производительности и анимациям.'
  },
  {
    id: 'u-olga',
    name: 'Ольга Соколова',
    username: 'olga',
    avatar: 'https://i.pravatar.cc/120?img=47',
    title: 'Content Writer',
    bio: 'Пишет понятную документацию и гайды.'
  }
];

export function makeUser(overrides: Partial<User> = {}): User {
  const base = pick(MOCK_USERS);
  return { ...base, id: overrides.id ?? uid('u'), ...overrides };
}

// =====================
// Мок‑карточки
// =====================
export const MOCK_CARDS: CardItem[] = [
  {
    id: 'card-1',
    title: 'Короткий заголовок карточки',
    description: 'Карточка демонстрирует содержание — заголовок, описание и действия. Используйте для preview.',
    meta: '2 минуты назад',
    image: 'https://picsum.photos/640/360?random=12',
    tags: ['новое', 'рекомендация'],
    actions: [{ label: 'Открыть', actionId: 'open' }, { label: 'Поделиться', actionId: 'share' }]
  },
  {
    id: 'card-2',
    title: 'Длинный заголовок карточки — пример обтекания текста в сетке',
    description: 'Этот пример показывает, как карточка ведёт себя при длинном описании. Можно использовать для проверки линий и высоты.',
    meta: 'Вчера',
    image: 'https://picsum.photos/640/360?random=34',
    tags: ['тест', 'ui'],
    actions: [{ label: 'Подробнее', actionId: 'more' }]
  },
  {
    id: 'card-3',
    title: 'Карточка без изображения',
    description: 'Иногда карточка не имеет медиа — стилевой шаблон должен это корректно обрабатывать.',
    meta: '3 часа назад',
    tags: ['без-медиа'],
    actions: [{ label: 'Действие', actionId: 'act' }]
  }
];

export function makeCard(overrides: Partial<CardItem> = {}): CardItem {
  const base = pick(MOCK_CARDS);
  return { ...base, id: overrides.id ?? uid('card'), ...overrides };
}

export function makeCardList(count = 6): CardItem[] {
  return new Array(count).fill(0).map((_, i) =>
    makeCard({ id: `card-${i + 1}`, title: `${pick(["Пост", "Объявление", "Заметка"]) } ${i + 1}`, description: lorem(1) })
  );
}

// =====================
// Мок‑пункты меню / dropdown
// =====================
export const MOCK_DROPDOWN_ITEMS: DropdownItem[] = [
  { id: 'd-1', label: 'Открыть', icon: '▶️' },
  { id: 'd-2', label: 'Переместить', icon: '📁' },
  { id: 'd-3', label: 'Переименовать', icon: '✏️' },
  { id: 'd-4', label: 'Удалить', icon: '🗑️', danger: true },
  { id: 'd-5', label: 'Свойства', icon: '⚙️', disabled: true }
];

export function makeDropdownItems(count = 5): DropdownItem[] {
  const labels = ['Открыть', 'Копировать ссылку', 'Переместить', 'Удалить', 'Переименовать', 'Снять отметку'];
  return new Array(count).fill(0).map((_, i) => ({ id: uid('d'), label: labels[i % labels.length], icon: undefined }));
}

// =====================
// Набор опций для форм / select
// =====================
export const SAMPLE_SELECT_OPTIONS = [
  { value: 'auto', label: 'Авто' },
  { value: 'manual', label: 'Вручную' },
  { value: 'disabled', label: 'Отключено' }
];

// =====================
// Helper: delayable promise (useful in stories for loading states)
// =====================
export function wait(ms = 600) {
  return new Promise((res) => setTimeout(res, ms));
}

export async function fakeApiFetch<T>(payload: T, ms = 800): Promise<T> {
  await wait(ms);
  return JSON.parse(JSON.stringify(payload)) as T;
}

// =====================
// Экспорт по умолчанию (комфортный набор)
// =====================
export default {
  uid,
  nowIso,
  lorem,
  MOCK_USERS,
  makeUser,
  MOCK_CARDS,
  makeCard,
  makeCardList,
  MOCK_DROPDOWN_ITEMS,
  makeDropdownItems,
  SAMPLE_SELECT_OPTIONS,
  wait,
  fakeApiFetch
};
