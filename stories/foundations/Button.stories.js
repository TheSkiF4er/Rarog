const meta = {
  title: 'Foundations/Button',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger']
    },
    disabled: { control: 'boolean' }
  },
  args: {
    label: 'Запустить действие',
    variant: 'primary',
    disabled: false
  }
};

export default meta;

export const Playground = {
  render: ({ label, variant, disabled }) => `
    <div class="d-flex gap-3 align-items-center flex-wrap">
      <button class="btn btn-${variant}" ${disabled ? 'disabled' : ''}>${label}</button>
      <button class="btn btn-secondary">Вторичная кнопка</button>
      <button class="btn btn-ghost">Ghost</button>
    </div>
  `
};
