import React, { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import cn from 'classnames';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
  /** Визуальный вариант кнопки */
  variant?: ButtonVariant;
  /** Размер кнопки */
  size?: ButtonSize;
  /** Показывает, что кнопка в состоянии загрузки */
  loading?: boolean;
  /** Переключает поведение: рендерить как <a> (anchor) вместо <button> */
  asAnchor?: boolean;
  /** Дополнительный класс */
  className?: string;
  /** Идентификатор для тестов */
  'data-testid'?: string;
}

/**
 * Rarog Button — доступная, стилизуемая React-кнопка.
 *
 * Особенности:
 * - forwardRef для совместимости с формами и фокус-менеджерами
 * - aria-атрибуты для состояния загрузки
 * - лёгкая стилизация через классы Rarog (shape-round-md, react-press, skin-glow и т.д.)
 * - доступность: поддержка disabled, aria-busy, восстановление фокуса и т.п.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      asAnchor = false,
      className,
      disabled = false,
      type = 'button',
      ...rest
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled) || loading;

    const base = 'el-core core-align-mid flux-row react-press';
    const shape = 'shape-round-md';
    const skin = 'skin-glow';

    const variantClass = `btn-${variant}`; // consumer CSS should map this to rarog tokens
    const sizeClass = `btn-size-${size}`;
    const density = 'dens-2';

    const classes = cn(base, shape, skin, variantClass, sizeClass, density, className, {
      'is-loading': loading,
      'is-disabled': isDisabled
    });

    const content = (
      <>
        {loading && (
          <span aria-hidden className="btn-spinner" style={{ marginRight: 8 }}>
            {/* минимальный SVG-индикатор */}
            <svg width="16" height="16" viewBox="0 0 50 50" aria-hidden focusable="false">
              <circle cx="25" cy="25" r="20" fill="none" strokeWidth="4" stroke="currentColor" strokeOpacity="0.2" />
              <path d="M45 25a20 20 0 0 0-20-20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
            </svg>
          </span>
        )}
        <span className="btn-content">{children}</span>
      </>
    );

    // Рендер как <a> — аккуратно прокидываем href если есть
    if (asAnchor) {
      const anchorProps = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { href?: string };
      const { href, ...anchorRest } = anchorProps;
      return (
        <a
          ref={ref as any}
          className={classes}
          href={isDisabled ? undefined : href}
          aria-disabled={isDisabled || undefined}
          onClick={(e) => {
            if (isDisabled) {
              e.preventDefault();
            }
            if ((rest as any).onClick && !isDisabled) (rest as any).onClick(e as any);
          }}
          {...(anchorRest as any)}
        >
          {content}
        </a>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        className={classes}
        disabled={isDisabled}
        aria-busy={loading || undefined}
        aria-disabled={isDisabled || undefined}
        {...(rest as any)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'RarogButton';

export default Button;
