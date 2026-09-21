interface CalloutProps {
  /**
   * `notice` for things a reader must not miss (unreviewed copy, placeholder
   * pricing), `neutral` for framing and context.
   */
  tone?: 'notice' | 'neutral';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A labelled panel for context the reader needs before trusting what is around
 * it. Rendered as an `aside` with an accessible name so it is reachable by
 * landmark navigation rather than being visual-only.
 */
export default function Callout({
  tone = 'neutral',
  title,
  children,
  className = '',
}: CalloutProps) {
  const tones = {
    notice: 'bg-notice-soft border-notice-line text-notice-ink',
    neutral: 'bg-surface-sunken border-line text-ink-muted',
  } as const;

  return (
    <aside
      aria-label={title ?? 'Important context'}
      className={`rounded-lg border px-4 py-3.5 text-sm leading-relaxed ${tones[tone]} ${className}`}
    >
      {title && <p className="mb-1 font-semibold">{title}</p>}
      <div className="[&_a]:underline [&_a]:underline-offset-2">{children}</div>
    </aside>
  );
}
