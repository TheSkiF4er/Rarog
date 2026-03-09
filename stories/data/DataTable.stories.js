const rows = [
  ['Orion', 'Active', 'EU'],
  ['Vega', 'Paused', 'US'],
  ['Nova', 'Active', 'APAC'],
  ['Atlas', 'Draft', 'EU']
];

const meta = {
  title: 'Data/DataTable',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

export const Default = {
  render: () => `
    <div class="p-6">
      <table class="table" data-rg-table>
        <thead>
          <tr>
            <th data-rg-sort="string">Проект</th>
            <th data-rg-sort="string">Статус</th>
            <th data-rg-sort="string">Регион</th>
          </tr>
        </thead>
        <tbody>
          ${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join('')}
        </tbody>
      </table>
    </div>
  `
};
