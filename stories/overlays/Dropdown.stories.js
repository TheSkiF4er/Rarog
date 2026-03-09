const meta = {
  title: 'Overlays/Dropdown',
  tags: ['autodocs'],
  argTypes: {
    align: { control: 'select', options: ['start', 'end'] }
  },
  args: {
    align: 'start'
  }
};

export default meta;

export const Default = {
  render: ({ align }) => `
    <div class="p-6">
      <div class="dropdown">
        <button class="btn btn-secondary" data-rg-toggle="dropdown" aria-label="Открыть меню">Действия</button>
        <div class="dropdown-menu dropdown-menu-${align}">
          <a href="#" class="dropdown-item">Редактировать</a>
          <a href="#" class="dropdown-item">Дублировать</a>
          <button class="dropdown-item">Архивировать</button>
        </div>
      </div>
    </div>
  `
};
