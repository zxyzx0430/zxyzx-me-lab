/** Layer-pinned SVG paths. Tracks are independent and can be animated or adjusted without rasterizing the poster. */
export function TrackLines() {
  return <svg className="poster-ink-orbits" viewBox="0 0 930 910" aria-hidden="true" preserveAspectRatio="xMinYMin meet">
    <path className="major" d="M -100 444 C 96 416 125 292 306 266 C 494 239 751 302 803 383 C 878 501 659 553 447 518 C 234 484 91 522 108 623 C 135 771 533 776 873 662"/>
    <path className="subtle" d="M -86 743 C 185 680 358 515 532 390 C 725 254 660 172 493 161 C 339 146 160 230 86 370 C -1 529 221 605 455 568 C 643 540 754 601 850 746"/>
    <path className="hairline" d="M -66 575 C 122 538 203 472 343 426 C 527 365 709 340 899 409"/>
  </svg>;
}
