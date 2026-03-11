import { useState } from 'react'
import {
  RarogProvider,
  RarogButton,
  RarogCard,
  RarogAlert,
  RarogBadge,
  RarogInput,
  RarogSwitch,
  RarogTabs,
  RarogModal,
  RarogTooltip,
} from '@rarog/react'

export default function App() {
  const [enabled, setEnabled] = useState(true)

  return (
    <RarogProvider className="rg-container-lg py-6">
      <div className="rg-row rg-gap-y-4">
        <div className="rg-col-12 rg-col-lg-8">
          <RarogCard
            title="Rarog + Vite + React"
            subtitle="React adapter v1 starter"
            footer={<RarogBadge>Stable starter</RarogBadge>}
            bodyClassName="p-6"
          >
            <div className="d-flex flex-column gap-3">
              <RarogAlert tone="success" title="Готово к работе">
                Typed props, controlled patterns и overlay wrappers уже подключены.
              </RarogAlert>
              <RarogInput placeholder="Search utilities or components" />
              <div className="d-flex align-items-center gap-3">
                <RarogSwitch checked={enabled} onCheckedChange={setEnabled} label={enabled ? 'Enabled' : 'Disabled'} />
                <RarogTooltip title="SSR-safe wrapper around @rarog/js">Hover me</RarogTooltip>
              </div>
              <RarogTabs
                items={[
                  { value: 'components', label: 'Components', content: <p>Use wrapped components for the common UI path.</p> },
                  { value: 'overlays', label: 'Overlays', content: <p>Modal, dropdown and tooltip are adapter-aware.</p> },
                ]}
                defaultValue="components"
              />
              <div className="d-flex gap-2">
                <RarogButton>Primary action</RarogButton>
                <RarogButton variant="outline" data-rg-toggle="modal" data-rg-target="#viteReactModal">Open modal</RarogButton>
              </div>
            </div>
          </RarogCard>
        </div>
      </div>

      <RarogModal id="viteReactModal" title="React adapter modal">
        <p>Use the wrapped modal directly inside Vite or Next.js apps.</p>
      </RarogModal>
    </RarogProvider>
  )
}
