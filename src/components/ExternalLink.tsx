interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Set for affiliate or vendor links so crawlers and readers both see it. */
  sponsored?: boolean;
  /** Overrides the appended "opens in a new tab" note for screen readers. */
  srHint?: string;
}

/**
 * Every outbound link goes through here so the security rel attributes and the
 * screen-reader note about opening a new tab are never forgotten. Links that
 * earn the site money additionally carry rel="sponsored".
 */
export default function ExternalLink({
  href,
  children,
  className = '',
  sponsored = false,
  srHint = 'opens in a new tab',
}: ExternalLinkProps) {
  const rel = ['noopener', 'noreferrer', sponsored ? 'sponsored' : null]
    .filter(Boolean)
    .join(' ');

  return (
    <a href={href} target="_blank" rel={rel} className={className}>
      {children}
      <span className="sr-only"> ({srHint})</span>
    </a>
  );
}
