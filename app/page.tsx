"use client";

import { useState, useEffect, useRef } from "react";

function useAnimatedNumber(target: number) {
  const [displayed, setDisplayed] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    const duration = 420;
    const startTime = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(start + (end - start) * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
    prevRef.current = target;
  }, [target]);

  return displayed;
}

function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`;
  return `$${n}`;
}

function Stepper({
  value,
  min,
  max,
  step = 1,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="quantity-control">
      <button
        className="qty-btn"
        onClick={() => onChange(Math.max(min, value - step))}
        disabled={value <= min}
      >
        −
      </button>
      <span className="qty-value">{value.toLocaleString()}</span>
      <button
        className="qty-btn"
        onClick={() => onChange(Math.min(max, value + step))}
        disabled={value >= max}
      >
        +
      </button>
    </div>
  );
}

export default function Home() {
  const [contentPieces, setContentPieces] = useState(40);
  const [teamSize, setTeamSize] = useState(5);
  const [avgCustomerValue, setAvgCustomerValue] = useState(5000);
  const [monthlyTraffic, setMonthlyTraffic] = useState(50000);

  // ROI calculations
  const hoursSaved = Math.round(contentPieces * 4.5 * 0.6);
  const trafficLift = Math.round(monthlyTraffic * 0.18);
  const newCustomersPerYear = Math.round(trafficLift * 0.015 * 12);
  const revenueImpact = newCustomersPerYear * avgCustomerValue;

  const airopsAnnualCost =
    (teamSize <= 3 ? 15 : teamSize <= 10 ? 39 : 79) * teamSize * 12;

  const roi = Math.round(
    ((revenueImpact - airopsAnnualCost) / airopsAnnualCost) * 100
  );

  const animatedRoi = useAnimatedNumber(roi);
  const animatedRevenue = useAnimatedNumber(revenueImpact);

  return (
    <div className="calculator-bg">
      <div className="bg-accent" />

      <div className="calculator-card">
        {/* Header — AirOps logo SVG + pill badge */}
        <div className="calc-header">
          <div className="calc-logo">
            <svg
              width="88"
              height="28"
              viewBox="0 0 784 252"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="AirOps"
            >
              <path d="M111.828 65.6415V88.4663C101.564 72.0112 85.627 61.9258 65.9084 61.9258C23.7703 61.9258 0 92.9782 0 134.647C0 176.581 24.0404 208.695 66.4487 208.695C86.1672 208.695 101.834 198.609 111.828 182.154V204.979H144.782V65.6415H111.828ZM72.9315 181.093C48.8911 181.093 35.1152 159.064 35.1152 134.647C35.1152 110.76 48.621 89.7933 73.4717 89.7933C94.0006 89.7933 111.558 104.391 111.558 134.116C111.558 163.31 94.8109 181.093 72.9315 181.093Z" fill="#001408"/>
              <path d="M173.137 65.6494V204.987H208.252V65.6494H173.137Z" fill="#001408"/>
              <path d="M272.998 100.141V65.6386H237.883V204.976H272.998V125.355C272.998 104.919 287.314 96.691 300.82 96.691C308.653 96.691 316.757 98.8143 321.079 100.407V63.25C298.119 63.25 279.211 76.7856 272.998 100.141Z" fill="#001408"/>
              <path d="M329.629 108.115C329.629 151.377 359.882 182.163 403.371 182.163C447.13 182.163 477.115 151.377 477.115 108.115C477.115 65.6507 447.13 35.3945 403.371 35.3945C359.882 35.3945 329.629 65.6507 329.629 108.115ZM441.997 108.115C441.997 135.187 427.141 154.561 403.371 154.561C379.33 154.561 364.744 135.187 364.744 108.115C364.744 82.1058 379.33 63.2621 403.371 63.2621C427.141 63.2621 441.997 82.1058 441.997 108.115Z" fill="#001408"/>
              <path d="M575.086 61.9258C554.557 61.9258 537.81 73.869 528.896 92.9782V65.6415H493.781V251.425H528.896V180.031C538.891 197.282 557.529 208.695 577.247 208.695C615.604 208.695 642.345 179.235 642.345 137.035C642.345 92.7128 614.523 61.9258 575.086 61.9258ZM568.874 182.685C545.374 182.685 528.896 163.31 528.896 135.708C528.896 107.31 545.374 87.4047 568.874 87.4047C591.293 87.4047 607.23 107.841 607.23 136.77C607.23 163.841 591.293 182.685 568.874 182.685Z" fill="#001408"/>
              <path d="M653.555 156.675C653.555 181.889 676.244 208.695 721.624 208.695C767.274 208.695 783.751 182.42 783.751 161.983C783.751 130.666 746.205 125.092 721.084 120.315C704.066 117.395 693.262 115.007 693.262 105.452C693.262 94.5706 705.417 87.6701 718.383 87.6701C735.94 87.6701 742.693 99.6133 743.233 112.353H778.349C778.349 91.6511 763.492 61.9258 717.572 61.9258C677.865 61.9258 658.147 83.9544 658.147 107.575C658.147 141.282 696.233 144.732 721.354 149.509C735.94 152.163 748.636 155.348 748.636 165.699C748.636 176.05 736.21 182.95 722.975 182.95C710.549 182.95 688.67 176.05 688.67 156.675H653.555Z" fill="#001408"/>
              <path d="M191.339 48.6576C176.921 48.6576 166.578 38.4949 166.578 24.6368C166.578 10.7786 176.921 0 191.339 0C205.13 0 216.1 10.7786 216.1 24.6368C216.1 38.4949 205.13 48.6576 191.339 48.6576Z" fill="#001408"/>
            </svg>
            <span className="calc-logo-badge">ROI Calculator</span>
          </div>
          <p className="calc-tagline">See what AirOps returns.</p>
        </div>

        {/* Inputs */}
        <div className="input-section">
          <div className="input-row">
            <div className="input-label-wrap">
              <span className="input-label">Content pieces / month</span>
              <span className="input-hint">Pages, articles, landing pages</span>
            </div>
            <Stepper
              value={contentPieces}
              min={5}
              max={500}
              step={5}
              onChange={setContentPieces}
            />
          </div>

          <div className="input-row">
            <div className="input-label-wrap">
              <span className="input-label">Content team size</span>
              <span className="input-hint">Writers, SEOs, strategists</span>
            </div>
            <Stepper
              value={teamSize}
              min={1}
              max={100}
              step={1}
              onChange={setTeamSize}
            />
          </div>

          <div className="input-row">
            <div className="input-label-wrap">
              <span className="input-label">Avg customer value / yr</span>
              <span className="input-hint">Annual revenue per customer</span>
            </div>
            <div className="currency-input-wrap">
              <span className="currency-symbol">$</span>
              <input
                type="number"
                className="currency-input"
                value={avgCustomerValue}
                min={100}
                step={500}
                onChange={(e) =>
                  setAvgCustomerValue(Math.max(100, Number(e.target.value)))
                }
              />
            </div>
          </div>

          <div className="input-row">
            <div className="input-label-wrap">
              <span className="input-label">Monthly organic sessions</span>
              <span className="input-hint">Current baseline traffic</span>
            </div>
            <div className="currency-input-wrap">
              <input
                type="number"
                className="currency-input"
                value={monthlyTraffic}
                min={1000}
                step={5000}
                onChange={(e) =>
                  setMonthlyTraffic(Math.max(1000, Number(e.target.value)))
                }
              />
            </div>
          </div>
        </div>

        {/* ROI Display */}
        <div className="roi-display">
          <div className="roi-label">Estimated annual ROI</div>
          <div className="roi-number-wrap">
            <span className="roi-number">
              {animatedRoi > 0 ? "+" : ""}
              {animatedRoi.toLocaleString()}%
            </span>
          </div>
          <div className="roi-sublabel">
            {formatMoney(animatedRevenue)} projected revenue impact
          </div>
        </div>

        {/* Stat breakdown */}
        <div className="stat-grid">
          <div className="stat-card">
            <div className="stat-value">{hoursSaved}</div>
            <div className="stat-label">Hours saved / mo</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">+18%</div>
            <div className="stat-label">Traffic lift</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{newCustomersPerYear}</div>
            <div className="stat-label">New customers / yr</div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="breakdown">
          <div className="breakdown-row">
            <span>Revenue impact</span>
            <span>{formatMoney(revenueImpact)}</span>
          </div>
          <div className="breakdown-row breakdown-savings">
            <span>AirOps annual cost</span>
            <span>−{formatMoney(airopsAnnualCost)}</span>
          </div>
          <div className="breakdown-divider" />
          <div className="breakdown-row breakdown-total">
            <span>Net return</span>
            <span>{formatMoney(Math.max(0, revenueImpact - airopsAnnualCost))}</span>
          </div>
        </div>

        {/* CTA */}
        <button className="cta-btn">
          Get a demo
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <p className="cta-sub">See results in 30 days · No credit card required</p>
      </div>
    </div>
  );
}
