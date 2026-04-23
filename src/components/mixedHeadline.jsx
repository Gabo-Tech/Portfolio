/**
 * Splits a string on a single `|` to render two typographic roles:
 * display (Plus Jakarta) + editorial serif (Source Serif), with luminance contrast only.
 *
 * @param {Object} props
 * @param {string} props.line e.g. "ABOUT|ME"
 * @param {keyof import("react").JSX.IntrinsicElements} [props.as="h1"]
 * @param {string} [props.className]
 */
export default function MixedHeadline({
  line,
  as: Comp = "h1",
  className = "",
}) {
  if (!line?.includes?.("|")) {
    return (
      <Comp
        className={`font-display font-semibold text-stone-100 tracking-tight ${className}`.trim()}
      >
        {line}
      </Comp>
    );
  }
  const [main, accent] = line.split("|", 2).map((s) => s.trim());
  return (
    <Comp
      className={`font-display font-semibold tracking-tight text-stone-100 ${className}`.trim()}
    >
      <span>{main}</span>
      {accent != null && accent !== "" && (
        <>
          <span className="mx-1 sm:mx-1.5" aria-hidden>
            {" "}
          </span>
          <span className="font-editorial font-normal italic text-stone-400/95 text-[1.12em] leading-tight">
            {accent}
          </span>
        </>
      )}
    </Comp>
  );
}
