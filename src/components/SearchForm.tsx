/**
 * Research search box.
 *
 * A plain GET form on purpose. No client JavaScript, no state, no fetch on
 * keypress. It works with JS disabled, the result is a real URL that can be
 * bookmarked or shared with a clinician, and the back button behaves. For a
 * search that hands off to two government registries, that is the right
 * amount of machinery.
 */
export default function SearchForm({
  defaultValue = '',
  size = 'md',
  autoFocus = false,
}: {
  defaultValue?: string;
  size?: 'sm' | 'md';
  autoFocus?: boolean;
}) {
  const input =
    size === 'sm' ? 'px-3 py-2 text-sm' : 'px-4 py-3 text-base';
  const button =
    size === 'sm' ? 'px-3.5 py-2 text-sm' : 'px-5 py-3 text-base';

  return (
    <form action="/search" method="get" role="search" className="flex gap-2">
      <label htmlFor="research-search" className="sr-only">
        Search clinical trials and published literature
      </label>
      <input
        id="research-search"
        type="search"
        name="q"
        defaultValue={defaultValue}
        autoFocus={autoFocus}
        maxLength={200}
        placeholder="Try a condition, a drug, or both"
        className={`w-full rounded-md border border-line-strong bg-surface text-ink placeholder:text-ink-subtle ${input}`}
      />
      <button
        type="submit"
        className={`shrink-0 rounded-md bg-primary font-semibold text-white transition-colors hover:bg-primary-hover ${button}`}
      >
        Search
      </button>
    </form>
  );
}
