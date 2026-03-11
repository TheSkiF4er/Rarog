"use client";

import { useState } from "react";
import {
  RarogAlert,
  RarogBadge,
  RarogButton,
  RarogCard,
  RarogInput,
  RarogModal,
  RarogProvider,
  RarogTabs
} from "@rarog/react";

export default function Page() {
  const [query, setQuery] = useState("");

  return (
    <RarogProvider className="rg-container-lg py-10">
      <div className="rg-row rg-gap-y-6">
        <div className="rg-col-12 rg-col-lg-8">
          <RarogCard
            title="Next.js + Rarog"
            subtitle="React adapter v1 with SSR-safe activation"
            footer={<RarogBadge>App Router</RarogBadge>}
            bodyClassName="p-8"
          >
            <div className="d-flex flex-column gap-4">
              <RarogAlert tone="info" title="Stable React starter">
                Controlled inputs, composable tabs and wrapped overlays are ready to use.
              </RarogAlert>
              <RarogInput value={query} onChange={event => setQuery(event.target.value)} placeholder="Search tokens or components" />
              <RarogTabs
                defaultValue="ssr"
                items={[
                  { value: "ssr", label: "SSR", content: <p>Markup renders on the server and JS activates on the client.</p> },
                  { value: "api", label: "API", content: <p>Use wrapped components for the common path and hooks when you need lower-level control.</p> }
                ]}
              />
              <div className="d-flex gap-2">
                <RarogButton>Primary action</RarogButton>
                <RarogButton variant="outline" data-rg-toggle="modal" data-rg-target="#nextModal">Open modal</RarogButton>
              </div>
            </div>
          </RarogCard>
        </div>
      </div>

      <RarogModal id="nextModal" title="Rarog modal in Next.js">
        <p>Query: {query || "empty"}</p>
      </RarogModal>
    </RarogProvider>
  );
}
