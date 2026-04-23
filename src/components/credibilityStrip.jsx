/**
 * Proof line + optional metric chips for hero sections.
 *
 * @param {Object} props
 * @param {string} props.proofLine
 * @param {string[]} props.chips
 * @param {string} [props.className]
 * @param {string} [props.chipsAriaLabel] accessible name for the chip list
 * @param {boolean} [props.centered] if true, keep text and chips centered at all breakpoints
 */
export default function CredibilityStrip({
  proofLine,
  chips = [],
  className = "",
  chipsAriaLabel,
  centered = false,
}) {
  if (!proofLine && (!chips || chips.length === 0)) return null;
  const align = centered
    ? "items-center"
    : "items-center lg:items-start";
  const textAlign = centered
    ? "text-center"
    : "text-center lg:text-left";
  const chipsJustify = centered
    ? "justify-center"
    : "justify-center lg:justify-start";
  const chipsWidth = centered ? "w-full" : "";

  return (
    <div
      className={`flex w-full max-w-2xl flex-col gap-4 ${align} ${centered ? "mx-auto" : ""} ${className}`.trim()}
    >
      {proofLine ? (
        <p
          className={`w-full text-base leading-relaxed text-stone-300 [text-wrap:balance] sm:text-lg ${textAlign}`}
        >
          {proofLine}
        </p>
      ) : null}
      {chips.length > 0 ? (
        <ul
          className={`flex flex-wrap gap-2 ${chipsJustify} ${chipsWidth}`.trim()}
          {...(chipsAriaLabel ? { "aria-label": chipsAriaLabel } : {})}
        >
          {chips.map((label) => (
            <li key={label}>
              <span className="inline-flex rounded-full border border-stone-600/60 bg-stone-900/50 px-3 py-1.5 text-xs font-medium text-stone-200 sm:text-sm">
                {label}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
