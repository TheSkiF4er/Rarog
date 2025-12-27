import React from 'react'

export default function App() {
  return (
    <div className="rg-container-lg py-6">
      <div className="rg-row rg-gap-y-4">
        <div className="rg-col-12 rg-col-md-8">
          <div className="card">
            <div className="card-header">
              Rarog + Vite + React
            </div>
            <div className="card-body">
              <p className="text-muted mb-3">
                Это стартовый шаблон для быстрого прототипирования интерфейсов на React с использованием Rarog.
              </p>
              <button className="btn btn-primary">
                Кнопка Rarog
              </button>
            </div>
          </div>
        </div>
        <div className="rg-col-12 rg-col-md-4">
          <div className="alert alert-success">
            <strong>Готово к работе:</strong> просто запустите <code>npm run dev</code>.
          </div>
        </div>
      </div>
    </div>
  )
}
