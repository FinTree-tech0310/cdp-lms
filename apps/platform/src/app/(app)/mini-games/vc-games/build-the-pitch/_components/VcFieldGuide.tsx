"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { VC_GUIDE_FORMULAS, VC_GUIDE_SECTIONS } from "../_data/vc-field-guide";
import styles from "./vc-field-guide.module.css";

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), input:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function VcFieldGuide() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const launcherRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const closeGuide = useCallback(() => {
    setIsOpen(false);
    window.requestAnimationFrame(() => launcherRef.current?.focus());
  }, []);

  const openGuide = useCallback(() => {
    setIsOpen(true);
    window.requestAnimationFrame(() => searchRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        closeGuide();
        return;
      }

      if (event.key !== "Tab" || !drawerRef.current) return;

      const focusableElements = Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements.at(-1);

      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [closeGuide, isOpen]);

  const normalizedQuery = query.trim().toLocaleLowerCase();
  const filteredSections = useMemo(
    () =>
      VC_GUIDE_SECTIONS.map((section) => ({
        ...section,
        terms: section.terms.filter((item) =>
          [item.term, item.definition, item.vcLens].some((value) =>
            value.toLocaleLowerCase().includes(normalizedQuery),
          ),
        ),
      })).filter((section) => section.terms.length > 0),
    [normalizedQuery],
  );
  const filteredFormulas = useMemo(
    () =>
      VC_GUIDE_FORMULAS.filter((item) =>
        [item.name, item.formula, item.note].some((value) =>
          value.toLocaleLowerCase().includes(normalizedQuery),
        ),
      ),
    [normalizedQuery],
  );
  const resultCount =
    filteredSections.reduce((count, section) => count + section.terms.length, 0) +
    filteredFormulas.length;

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        className={styles.guideButton}
        aria-label="Open VC Field Guide"
        aria-expanded={isOpen}
        aria-controls="vc-field-guide"
        onClick={openGuide}
      >
        <svg
          className={styles.bookIcon}
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3.5 5.5A3.5 3.5 0 0 1 7 2h5v17H7a3.5 3.5 0 0 0-3.5 3.5z" />
          <path d="M20.5 5.5A3.5 3.5 0 0 0 17 2h-5v17h5a3.5 3.5 0 0 1 3.5 3.5z" />
        </svg>
        <small aria-hidden="true">Guide</small>
      </button>

      {isOpen ? (
        <div
          className={styles.backdrop}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeGuide();
          }}
        >
          <aside
            ref={drawerRef}
            id="vc-field-guide"
            className={styles.drawer}
            role="dialog"
            aria-modal="true"
            aria-labelledby="vc-field-guide-title"
          >
            <header className={styles.header}>
              <div>
                <p>Reference desk</p>
                <h2 id="vc-field-guide-title">VC Field Guide</h2>
              </div>
              <button type="button" className={styles.closeButton} onClick={closeGuide}>
                <span aria-hidden="true">×</span>
                <span className={styles.srOnly}>Close VC Field Guide</span>
              </button>
              <label className={styles.searchLabel} htmlFor="vc-guide-search">
                Search terms and formulas
              </label>
              <input
                ref={searchRef}
                id="vc-guide-search"
                className={styles.searchInput}
                type="search"
                value={query}
                placeholder="Try CAC, churn, dilution…"
                autoComplete="off"
                onChange={(event) => setQuery(event.target.value)}
              />
              <p className={styles.searchStatus} aria-live="polite">
                {normalizedQuery ? `${resultCount} matches` : "Core vocabulary for reading a startup"}
              </p>
            </header>

            <div className={styles.content}>
              {filteredSections.map((section) => (
                <section key={section.id} className={styles.guideSection}>
                  <div className={styles.sectionHeading}>
                    <h3>{section.title}</h3>
                    {!normalizedQuery ? <p>{section.description}</p> : null}
                  </div>
                  <dl className={styles.termList}>
                    {section.terms.map((item) => (
                      <div key={item.term} className={styles.termCard}>
                        <dt>{item.term}</dt>
                        <dd>{item.definition}</dd>
                        <dd className={styles.vcLens}>
                          <strong>VC lens</strong>
                          {item.vcLens}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              {filteredFormulas.length > 0 ? (
                <section className={styles.guideSection}>
                  <div className={styles.sectionHeading}>
                    <h3>Formula reference</h3>
                    {!normalizedQuery ? (
                      <p>Useful models, not universal rules. Context still matters.</p>
                    ) : null}
                  </div>
                  <dl className={styles.formulaList}>
                    {filteredFormulas.map((item) => (
                      <div key={item.name} className={styles.formulaCard}>
                        <dt>{item.name}</dt>
                        <dd className={styles.formula}>{item.formula}</dd>
                        <dd>{item.note}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ) : null}

              {resultCount === 0 ? (
                <div className={styles.emptyState}>
                  <strong>No matching term.</strong>
                  <p>Try a broader word such as revenue, growth, cash, or ownership.</p>
                </div>
              ) : null}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
