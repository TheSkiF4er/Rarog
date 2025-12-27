export default function Page() {
  return (
    <main className="rg-container-lg py-10">
      <div className="rg-row rg-gap-y-6">
        <div className="rg-col-12 rg-col-lg-8">
          <div className="card p-8">
            <h1 className="text-3xl font-semibold mb-4">Next.js + Rarog</h1>
            <p className="text-muted mb-4">
              JS‑ядро Rarog работает в SPA/SSR‑режиме, а React‑обёртки упрощают работу с модалками и offcanvas.
            </p>

            <button
              type="button"
              className="btn btn-primary me-3"
              data-rg-toggle="modal"
              data-rg-target="#demoModal"
            >
              Открыть модалку
            </button>

            <button
              type="button"
              className="btn btn-outline-secondary"
              data-rg-toggle="offcanvas"
              data-rg-target="#mainOffcanvas"
            >
              Меню
            </button>
          </div>
        </div>

        <div className="rg-col-12 rg-col-lg-4">
          <div className="alert alert-info">
            <strong>JIT‑режим:</strong> не забудьте прописать пути к `app/**/*.tsx` в <code>rarog.config.*</code>.
          </div>
        </div>
      </div>

      {/* Modal */}
      <div className="modal fade" id="demoModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Rarog Modal</h5>
              <button type="button" className="btn-close" data-rg-dismiss="modal" aria-label="Close" />
            </div>
            <div className="modal-body">
              Это модальное окно, управляемое Rarog JS Core.
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-rg-dismiss="modal">
                Закрыть
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas */}
      <div
        className="offcanvas offcanvas-start"
        id="mainOffcanvas"
        aria-labelledby="mainOffcanvasLabel"
        tabIndex={-1}
      >
        <div className="offcanvas-header">
          <h5 id="mainOffcanvasLabel" className="offcanvas-title">
            Навигация
          </h5>
          <button type="button" className="btn-close" data-rg-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body">
          <ul className="list-group mb-4">
            <li className="list-group-item">Dashboard</li>
            <li className="list-group-item">Projects</li>
            <li className="list-group-item">Settings</li>
          </ul>
          <button className="btn btn-primary w-full">CTA</button>
        </div>
      </div>
    </main>
  );
}
