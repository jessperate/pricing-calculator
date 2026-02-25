"use client";

import { useState, useEffect, useRef } from "react";

type Stage = "input" | "loading" | "results";

const SCAN_STEPS = [
  "Crawling pages…",
  "Checking AI answer coverage…",
  "Identifying content gaps…",
  "Mapping competitor citations…",
];

const EXAMPLE_URLS = ["airops.com", "hubspot.com", "salesforce.com"];

function parseDomain(url: string): string {
  try {
    const withProtocol = url.startsWith("http") ? url : `https://${url}`;
    return new URL(withProtocol).hostname.replace(/^www\./, "");
  } catch {
    return url.replace(/^https?:\/\//, "").replace(/^www\./, "").split("/")[0];
  }
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = Math.imul(31, h) + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function getReport(domain: string) {
  const h = hashStr(domain);
  const pages = 180 + (h % 820);
  const missingAI = Math.round(pages * (0.55 + ((h >> 4) % 30) / 100));
  const gaps = 14 + (h % 48);
  const trafficLost = 7000 + (h % 43000);
  const citationRate = 6 + (h % 18);

  const opportunityItems = [
    {
      label: "Pages not cited in AI answers",
      count: missingAI,
      tag: "HIGH",
      tagStyle: "tag-high",
    },
    {
      label: "Questions competitors answer, you don't",
      count: 10 + ((h >> 2) % 38),
      tag: "HIGH",
      tagStyle: "tag-high",
    },
    {
      label: "Top-of-funnel content gaps",
      count: 8 + ((h >> 6) % 28),
      tag: "MED",
      tagStyle: "tag-med",
    },
    {
      label: "Product comparison pages needed",
      count: 4 + ((h >> 8) % 14),
      tag: "MED",
      tagStyle: "tag-med",
    },
    {
      label: "How-to guides for your category",
      count: 5 + ((h >> 10) % 18),
      tag: "LOW",
      tagStyle: "tag-low",
    },
  ];

  return { pages, missingAI, gaps, trafficLost, citationRate, opportunityItems };
}

function useAnimatedNumber(target: number) {
  const [displayed, setDisplayed] = useState(0);
  const prevRef = useRef(0);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    const duration = 600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    prevRef.current = end;
  }, [target]);

  return displayed;
}

export default function Home() {
  const [stage, setStage] = useState<Stage>("input");
  const [urlInput, setUrlInput] = useState("");
  const [domain, setDomain] = useState("");
  const [scanStep, setScanStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const report = domain ? getReport(domain) : null;
  const animatedGaps = useAnimatedNumber(stage === "results" && report ? report.gaps : 0);
  const animatedTraffic = useAnimatedNumber(stage === "results" && report ? report.trafficLost : 0);

  function startAnalysis(url: string) {
    const d = parseDomain(url || urlInput);
    if (!d) return;
    setDomain(d);
    setStage("loading");
    setScanStep(0);
    setProgress(0);

    const totalDuration = 2600;
    const stepInterval = totalDuration / SCAN_STEPS.length;

    SCAN_STEPS.forEach((_, i) => {
      setTimeout(() => setScanStep(i), i * stepInterval);
    });

    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) { clearInterval(progressInterval); return 100; }
        return p + 2;
      });
    }, totalDuration / 50);

    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);
      setTimeout(() => setStage("results"), 200);
    }, totalDuration);
  }

  function reset() {
    setStage("input");
    setUrlInput("");
    setDomain("");
    setProgress(0);
    setScanStep(0);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  return (
    <div className="calculator-bg">
      <div className="bg-accent" />

      <div className="calculator-card">
        {/* Header */}
        <div className="calc-header">
          <div className="calc-logo">
            <svg width="88" height="28" viewBox="0 0 784 252" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="AirOps">
              <path d="M111.828 65.6415V88.4663C101.564 72.0112 85.627 61.9258 65.9084 61.9258C23.7703 61.9258 0 92.9782 0 134.647C0 176.581 24.0404 208.695 66.4487 208.695C86.1672 208.695 101.834 198.609 111.828 182.154V204.979H144.782V65.6415H111.828ZM72.9315 181.093C48.8911 181.093 35.1152 159.064 35.1152 134.647C35.1152 110.76 48.621 89.7933 73.4717 89.7933C94.0006 89.7933 111.558 104.391 111.558 134.116C111.558 163.31 94.8109 181.093 72.9315 181.093Z" fill="#001408"/>
              <path d="M173.137 65.6494V204.987H208.252V65.6494H173.137Z" fill="#001408"/>
              <path d="M272.998 100.141V65.6386H237.883V204.976H272.998V125.355C272.998 104.919 287.314 96.691 300.82 96.691C308.653 96.691 316.757 98.8143 321.079 100.407V63.25C298.119 63.25 279.211 76.7856 272.998 100.141Z" fill="#001408"/>
              <path d="M329.629 108.115C329.629 151.377 359.882 182.163 403.371 182.163C447.13 182.163 477.115 151.377 477.115 108.115C477.115 65.6507 447.13 35.3945 403.371 35.3945C359.882 35.3945 329.629 65.6507 329.629 108.115ZM441.997 108.115C441.997 135.187 427.141 154.561 403.371 154.561C379.33 154.561 364.744 135.187 364.744 108.115C364.744 82.1058 379.33 63.2621 403.371 63.2621C427.141 63.2621 441.997 82.1058 441.997 108.115Z" fill="#001408"/>
              <path d="M575.086 61.9258C554.557 61.9258 537.81 73.869 528.896 92.9782V65.6415H493.781V251.425H528.896V180.031C538.891 197.282 557.529 208.695 577.247 208.695C615.604 208.695 642.345 179.235 642.345 137.035C642.345 92.7128 614.523 61.9258 575.086 61.9258ZM568.874 182.685C545.374 182.685 528.896 163.31 528.896 135.708C528.896 107.31 545.374 87.4047 568.874 87.4047C591.293 87.4047 607.23 107.841 607.23 136.77C607.23 163.841 591.293 182.685 568.874 182.685Z" fill="#001408"/>
              <path d="M653.555 156.675C653.555 181.889 676.244 208.695 721.624 208.695C767.274 208.695 783.751 182.42 783.751 161.983C783.751 130.666 746.205 125.092 721.084 120.315C704.066 117.395 693.262 115.007 693.262 105.452C693.262 94.5706 705.417 87.6701 718.383 87.6701C735.94 87.6701 742.693 99.6133 743.233 112.353H778.349C778.349 91.6511 763.492 61.9258 717.572 61.9258C677.865 61.9258 658.147 83.9544 658.147 107.575C658.147 141.282 696.233 144.732 721.354 149.509C735.94 152.163 748.636 155.348 748.636 165.699C748.636 176.05 736.21 182.95 722.975 182.95C710.549 182.95 688.67 176.05 688.67 156.675H653.555Z" fill="#001408"/>
              <path d="M191.339 48.6576C176.921 48.6576 166.578 38.4949 166.578 24.6368C166.578 10.7786 176.921 0 191.339 0C205.13 0 216.1 10.7786 216.1 24.6368C216.1 38.4949 205.13 48.6576 191.339 48.6576Z" fill="#001408"/>
            </svg>
            <span className="calc-logo-badge">Content Opportunities</span>
          </div>
          <p className="calc-tagline">
            {stage === "input" && "See what you're missing in AI search."}
            {stage === "loading" && `Scanning ${domain}…`}
            {stage === "results" && `${domain} — here's your gap.`}
          </p>
        </div>

        {/* ── Stage: Input ── */}
        {stage === "input" && (
          <div className="input-stage">
            <div className="url-input-row">
              <span className="url-prefix">https://</span>
              <input
                ref={inputRef}
                type="text"
                className="url-input"
                placeholder="yoursite.com"
                value={urlInput}
                autoFocus
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && startAnalysis("")}
              />
              <button
                className="analyze-btn"
                onClick={() => startAnalysis("")}
                disabled={!urlInput.trim()}
              >
                Analyze
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="example-urls">
              <span className="example-label">Try:</span>
              {EXAMPLE_URLS.map((u) => (
                <button key={u} className="example-chip" onClick={() => { setUrlInput(u); startAnalysis(u); }}>
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── Stage: Loading ── */}
        {stage === "loading" && (
          <div className="loading-stage">
            <div className="scan-step">{SCAN_STEPS[scanStep]}</div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-pct">{progress}%</div>
          </div>
        )}

        {/* ── Stage: Results ── */}
        {stage === "results" && report && (
          <div className="results-stage">
            {/* Big number */}
            <div className="opportunities-hero">
              <div className="opp-number">{report.gaps + report.opportunityItems.length * 2}</div>
              <div className="opp-label">content opportunities found</div>
            </div>

            {/* Stat grid */}
            <div className="stat-grid">
              <div className="stat-card">
                <div className="stat-value">{report.pages}</div>
                <div className="stat-label">Pages scanned</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{report.citationRate}%</div>
                <div className="stat-label">AI citation rate</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">{animatedTraffic.toLocaleString()}</div>
                <div className="stat-label">Sessions / mo at risk</div>
              </div>
            </div>

            {/* Opportunity list */}
            <div className="opp-list">
              {report.opportunityItems.map((item, i) => (
                <div key={i} className="opp-item">
                  <div className="opp-item-left">
                    <span className={`opp-tag ${item.tagStyle}`}>{item.tag}</span>
                    <span className="opp-item-label">{item.label}</span>
                  </div>
                  <span className="opp-item-count">{item.count}</span>
                </div>
              ))}
            </div>

            <button className="cta-btn">
              Get the full report
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            <button className="reset-btn" onClick={reset}>
              ← Try another URL
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
