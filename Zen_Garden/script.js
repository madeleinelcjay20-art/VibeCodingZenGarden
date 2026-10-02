/*
 * CSS Zen Garden: quiet, optional interaction
 * -------------------------------------------
 * This file adds a gentle reveal as existing content enters view. It does
 * not create or rewrite page content, and the design is complete without it.
 */

(() => {
  "use strict";

  /**
   * Initialize once the document can be queried.
   *
   * `defer` normally means the markup is already parsed before this runs.
   * The readyState check also makes the file safe if it is included without
   * `defer` or dynamically loaded after the DOMContentLoaded event.
   */
  const initializeGarden = () => {
    // DOM selection gathers only existing sections; no decorative nodes are
    // added, so CSS remains responsible for the actual visual presentation.
    const revealTargets = document.querySelectorAll(
      ".intro .summary, .intro .preamble, .supporting > div, .sidebar .wrapper > div"
    );

    // Guard for browsers without the APIs needed for this optional effect.
    // Without support, all content remains visible and fully usable.
    if (!("IntersectionObserver" in window) || revealTargets.length === 0) {
      return;
    }

    // Reduced-motion is a user preference, not merely an animation setting.
    // Respect it by avoiding the reveal altogether and keeping content visible.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      return;
    }

    // This class opts into hidden-before-reveal styling. It is added only after
    // confirming a working observer and a motion preference that allows motion.
    document.body.classList.add("has-js");

    /**
     * IntersectionObserver lets the browser efficiently report when an
     * element approaches the viewport. It is preferable to a scroll handler
     * that repeatedly measures every element on every scroll event: the
     * browser can batch visibility work, reducing main-thread layout work.
     */
    const observer = new IntersectionObserver(
      (entries, activeObserver) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          // A single class toggles the CSS opacity/transform transition.
          // Stop watching an item once it has appeared; it need not be tracked
          // again because the reveal is intentionally one-way.
          entry.target.classList.add("is-visible");
          activeObserver.unobserve(entry.target);
        });
      },
      {
        // Start the transition just before an item reaches the visible screen.
        rootMargin: "0px 0px -8% 0px",
        threshold: 0.08,
      }
    );

    revealTargets.forEach((target) => observer.observe(target));
  };

  // Event listeners keep initialization explicit and avoid inline handlers.
  // Once the DOM is ready, the script only queries and observes existing nodes.
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initializeGarden, { once: true });
  } else {
    initializeGarden();
  }
})();
