const meta = {
  title: 'Overlays/Modal',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  },
  argTypes: {
    title: { control: 'text' },
    body: { control: 'text' }
  },
  args: {
    title: 'Командный центр',
    body: 'Используйте эту историю, чтобы проверить lifecycle, focus trapping и dismiss-кнопки.'
  }
};

export default meta;

export const Default = {
  render: ({ title, body }) => `
    <div class="p-6">
      <button class="btn btn-primary" data-rg-toggle="modal" data-rg-target="#storybookModal">Открыть модалку</button>
      <div class="modal" id="storybookModal" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-header">
            <h2 class="modal-title">${title}</h2>
            <button class="btn btn-ghost" data-rg-dismiss="modal" aria-label="Закрыть">✕</button>
          </div>
          <div class="modal-body">
            <p>${body}</p>
            <input class="input" type="email" placeholder="team@rarog.dev" data-rg-autofocus />
          </div>
          <div class="modal-footer d-flex gap-2 justify-content-end">
            <button class="btn btn-secondary" data-rg-dismiss="modal">Отмена</button>
            <button class="btn btn-primary">Сохранить</button>
          </div>
        </div>
      </div>
    </div>
  `
};
