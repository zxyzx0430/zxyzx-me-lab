/** Independent SVG orbit paths measured on the verified 1672×941 poster.
 * The darker trajectory crosses the ink in difference blend mode.
 * Older mobile-sized curves remain as their own responsive layer.
 */
export function TrackLines() {
  return <>
    <svg className="master-orbits" viewBox="0 0 1672 941" aria-hidden="true" preserveAspectRatio="none">
      <path className="track-primary" d="M -89 695 C 78 518 314 365 503 275 C 609 224 657 213 626 256 C 595 300 556 339 523 391"/>
      <path className="track-secondary" d="M 521 424 C 622 287 650 272 724 347 C 788 411 855 463 916 487"/>
      <path className="track-primary" d="M 496 806 C 558 712 619 614 678 545"/>
      <path className="track-fine" d="M 453 830 C 571 798 747 754 916 704"/>
      <path className="track-fine" d="M -66 675 L 270 418"/>
      <path className="track-fine" d="M 62 686 L 62 525"/>
      <path className="track-fine" d="M 85 687 L 85 524"/>
    </svg>
    <svg className="poster-ink-orbits" viewBox="0 0 930 910" aria-hidden="true" preserveAspectRatio="xMinYMin meet">
      <path className="major" d="M -100 444 C 96 416 125 292 306 266 C 494 239 751 302 803 383 C 878 501 659 553 447 518 C 234 484 91 522 108 623 C 135 771 533 776 873 662"/>
      <path className="subtle" d="M -86 743 C 185 680 358 515 532 390 C 725 254 660 172 493 161 C 339 146 160 230 86 370 C -1 529 221 605 455 568 C 643 540 754 601 850 746"/>
      <path className="hairline" d="M -66 575 C 122 538 203 472 343 426 C 527 365 709 340 899 409"/>
    </svg>
  </>;
}
