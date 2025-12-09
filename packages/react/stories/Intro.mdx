import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import Button from '../src/Button';
import ThemeProvider, { withThemeProvider } from './utils/withThemeProvider';
import mock from './utils/mock-data';

export default {
  title: 'Компоненты/Button',
  component: Button,
  decorators: [withThemeProvider],
  parameters: {
    docs: {
      description: {
        component: 'Rarog Button — доступная, стилизуемая кнопка с вариантами, размерами и состоянием загрузки.'
      }
    }
  },
  tags: ['autodocs']
} as Meta<typeof Button>;

const Template: StoryFn<typeof Button> = (args) => <Button {...args}>{args.children}</Button>;

export const Primary = Template.bind({});
Primary.args = {
  variant: 'primary',
  size: 'md',
  children: 'Primary',
  loading: false
};
Primary.parameters = { docs: { description: { story: 'Акцентная кнопка для основных действий.' } } };

export const Secondary = Template.bind({});
Secondary.args = {
  variant: 'secondary',
  size: 'md',
  children: 'Secondary'
};

export const Ghost = Template.bind({});
Ghost.args = {
  variant: 'ghost',
  size: 'md',
  children: 'Ghost'
};

export const Danger = Template.bind({});
Danger.args = {
  variant: 'danger',
  size: 'md',
  children: 'Удалить'
};

export const Loading = Template.bind({});
Loading.args = {
  variant: 'primary',
  size: 'md',
  loading: true,
  children: 'Сохранение...'
};

export const Sizes: StoryFn = () => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button variant="primary" size="xs">XS</Button>
    <Button variant="primary" size="sm">SM</Button>
    <Button variant="primary" size="md">MD</Button>
    <Button variant="primary" size="lg">LG</Button>
  </div>
);

export const AsAnchor = Template.bind({});
AsAnchor.args = {
  asAnchor: true,
  href: '#',
  variant: 'primary',
  children: 'Ссылка'
};

export const WithIcon = Template.bind({});
WithIcon.args = {
  variant: 'primary',
  size: 'md',
  children: (
    <>
      <span className="btn-icon btn-icon--left" aria-hidden>🔥</span>
      <span>С иконкой</span>
    </>
  )
};

// Композиция: кнопка в карточке (демо использования mock-data)
export const InCard: StoryFn = () => {
  const card = mock.makeCard();
  return (
    <div style={{ maxWidth: 420, border: '1px solid rgba(0,0,0,0.04)', padding: 16, borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>{card.title}</h3>
      <p style={{ color: 'rgba(0,0,0,0.7)' }}>{card.description}</p>
      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <Button variant="primary">Открыть</Button>
        <Button variant="secondary">Подробнее</Button>
      </div>
    </div>
  );
};

// Storybook metadata for controls
Primary.argTypes = {
  variant: { control: { type: 'select', options: ['primary', 'secondary', 'ghost', 'danger', 'link'] } },
  size: { control: { type: 'select', options: ['xs', 'sm', 'md', 'lg'] } },
  loading: { control: 'boolean' }
};
