import React, { useCallback, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

export interface RarogModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Текст для aria-label (если нет заголовка внутри) */
  ariaLabel?: string;
  /** Отключить закрытие по нажатию клавиши Escape */
  closeOnEsc?: boolean;
  /** Отключить закрытие по клику на backdrop */
  closeOnBackdrop?: boolean;
  /** Блокировать скролл страницы при открытом модале */
  preventScroll?: boolean;
  /** Портал: куда рендерить (по умолчанию document.body) */
  portalTarget?: Element | null;
  /** Дополнительный класс для контейнера модала */
  className?: string;
  /** Класс для backdrop */
  backdropClassName?: string;
  /** Класс для контента */
  contentClassName?: string;
  /** Ref элемента, которому вернуть фокус после закрытия (если не указан, возврат на document.activeElement до открытия) */
  returnFocusRef?: React.RefObject<HTMLElement> | null;
  /** initial focus element inside modal (selector or ref) */
  initialFocusRef?: React.RefObject<HTMLElement> | string | null;
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
}

function tabbableElements(container: HTMLElement): HTMLElement[] {
  const sel = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'button:not([disabled])',
    'iframe',
    '[contenteditable] :not([contenteditable="false"])',
    '[tabindex]:not([tabindex^="-"] )'
  ].join(',');
  try {
    return Array.from(container.querySelectorAll<HTMLElement>(sel)).filter(el => !el.hasAttribute('disabled') && el.tabIndex !== -1 && el.offsetParent !== null);
  } catch (e) {
    return [];
  }
}

export const Modal: React.FC<RarogModalProps> = ({
  isOpen,
  onClose,
  children,
  ariaLabel,
  closeOnEsc = true,
  closeOnBackdrop = true,
  preventScroll = true,
  portalTarget = isBrowser() ? document.body : null,
  className,
  backdropClassName = 'r-modal-backdrop',
  contentClassName = 'r-modal-content',
  returnFocusRef = null,
  initialFocusRef = null
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  // create container element for portal
  if (!containerRef.current && isBrowser()) {
    containerRef.current = document.createElement('div');
    containerRef.current.setAttribute('data-rarog-modal-root', '');
  }

  // attach/detach portal container
  useEffect(() => {
    if (!isBrowser() || !containerRef.current || !portalTarget) return;
    portalTarget.appendChild(containerRef.current);
    return () => {
      try {
        portalTarget.removeChild(containerRef.current as Element);
      } catch (e) {
        // ignore
      }
    };
  }, [portalTarget]);

  // manage scroll lock
  useEffect(() => {
    if (!isOpen || !preventScroll || !isBrowser()) return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    document.documentElement.style.top = `-${scrollY}px`;
    document.documentElement.style.position = 'fixed';
    document.documentElement.style.width = '100%';
    document.documentElement.setAttribute('data-rarog-scroll', String(scrollY));
    return () => {
      const val = document.documentElement.getAttribute('data-rarog-scroll');
      const y = val ? parseInt(val, 10) : 0;
      document.documentElement.style.position = '';
      document.documentElement.style.top = '';
      document.documentElement.style.width = '';
      document.documentElement.removeAttribute('data-rarog-scroll');
      window.scrollTo(0, y);
    };
  }, [isOpen, preventScroll]);

  // focus management: save previously focused and restore on close
  useEffect(() => {
    if (!isBrowser()) return;
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement | null;
    }
  }, [isOpen]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && closeOnEsc) {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === 'Tab') {
        const content = containerRef.current?.querySelector(`.${contentClassName}`) as HTMLElement | null;
        if (!content) return;
        const tabbables = tabbableElements(content);
        if (!tabbables.length) {
          e.preventDefault();
          return;
        }
        const first = tabbables[0];
        const last = tabbables[tabbables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey) {
          if (active === first || active === content) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    },
    [isOpen, closeOnEsc, onClose, contentClassName]
  );

  useEffect(() => {
    if (!isBrowser()) return;
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown, true);
      // set initial focus
      setTimeout(() => {
        const content = containerRef.current?.querySelector(`.${contentClassName}`) as HTMLElement | null;
        const findInitial = () => {
          if (!content) return null;
          if (initialFocusRef) {
            if (typeof initialFocusRef === 'string') {
              return content.querySelector<HTMLElement>(initialFocusRef);
            }
            if ('current' in initialFocusRef && initialFocusRef.current) return initialFocusRef.current;
          }
          const t = tabbableElements(content);
          return t.length ? t[0] : content;
        };
        const el = findInitial();
        if (el && el.focus) el.focus();
      }, 0);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, handleKeyDown, initialFocusRef, contentClassName]);

  // restore focus on close
  useEffect(() => {
    if (!isBrowser()) return;
    if (!isOpen) {
      // restore
      const target = returnFocusRef && 'current' in returnFocusRef ? returnFocusRef.current : previouslyFocusedRef.current;
      if (target && (target as HTMLElement).focus) {
        setTimeout(() => {
          try { (target as HTMLElement).focus(); } catch (e) { /* ignore */ }
        }, 0);
      }
    }
  }, [isOpen, returnFocusRef]);

  const onBackdropClick = (e: React.MouseEvent) => {
    if (!closeOnBackdrop) return;
    // click only if target is backdrop (not inside content)
    if (e.target === e.currentTarget) onClose();
  };

  const content = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      className={`r-modal ${className || ''}`.trim()}
    >
      <div
        className={`r-modal-backdrop ${backdropClassName || ''}`.trim()}
        onMouseDown={onBackdropClick}
        style={{ position: 'fixed', inset: 0, display: isOpen ? 'block' : 'none' }}
        data-rarog-backdrop
      >
        <div
          className={contentClassName}
          role="document"
          style={{ display: isOpen ? 'block' : 'none' }}
        >
          {children}
        </div>
      </div>
    </div>
  );

  if (!isBrowser() || !containerRef.current) return null;

  return ReactDOM.createPortal(content, containerRef.current);
};

export default Modal;
