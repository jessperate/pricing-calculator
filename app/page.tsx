"use client";

import { useState, useEffect, useRef } from "react";

type Plan = "starter" | "pro" | "business";
type Billing = "monthly" | "annual";

const PLANS: Record<Plan, { name: string; price: number; description: string }> = {
  starter: {
    name: "Starter",
    price: 15,
    description: "Individuals & small teams",
  },
  pro: {
    name: "Pro",
    price: 39,
    description: "For growing businesses",
  },
  business: {
    name: "Business",
    price: 79,
    description: "For scaling enterprises",
  },
};

function useAnimatedNumber(target: number) {
  const [displayed, setDisplayed] = useState(target);
  const prevRef = useRef(target);

  useEffect(() => {
    const start = prevRef.current;
    const end = target;
    const duration = 380;
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

export default function Home() {
  const [plan, setPlan] = useState<Plan>("pro");
  const [billing, setBilling] = useState<Billing>("monthly");
  const [seats, setSeats] = useState(5);

  const basePrice = PLANS[plan].price;
  const discountRate = billing === "annual" ? 0.2 : 0;
  const pricePerSeat = basePrice * (1 - discountRate);
  const subtotal = pricePerSeat * seats;
  const savings = billing === "annual" ? basePrice * seats * discountRate : 0;
  const displayTotal = billing === "annual" ? subtotal * 12 : subtotal;

  const animatedTotal = useAnimatedNumber(Math.round(displayTotal));
  const animatedMonthly = useAnimatedNumber(Math.round(subtotal));

  const adjustSeats = (delta: number) => {
    setSeats((prev) => Math.max(1, Math.min(999, prev + delta)));
  };

  return (
    <div className="calculator-bg">
      <div className="bg-accent" />

      <div className="calculator-card">
        {/* Header */}
        <div className="calc-header">
          <div className="calc-logo">
            <span className="calc-logo-wordmark">
              air<span>O</span>ps
            </span>
            <span className="calc-logo-badge">Pricing</span>
          </div>
          <p className="calc-tagline">Simple, transparent pricing.</p>
        </div>

        {/* Billing Toggle */}
        <div className="billing-toggle-wrap">
          <div className="billing-toggle">
            <button
              className={`toggle-btn ${billing === "monthly" ? "active" : ""}`}
              onClick={() => setBilling("monthly")}
            >
              Monthly
            </button>
            <button
              className={`toggle-btn ${billing === "annual" ? "active" : ""}`}
              onClick={() => setBilling("annual")}
            >
              Annual
              <span className="toggle-badge">−20%</span>
            </button>
          </div>
        </div>

        {/* Plan Selector */}
        <div className="plan-grid">
          {(Object.entries(PLANS) as [Plan, (typeof PLANS)[Plan]][]).map(
            ([key, p]) => (
              <button
                key={key}
                className={`plan-card ${plan === key ? "plan-card--active" : ""}`}
                onClick={() => setPlan(key)}
              >
                <div className="plan-name">{p.name}</div>
                <div className="plan-price">
                  ${billing === "annual" ? Math.round(p.price * 0.8) : p.price}
                  <span className="plan-period">/mo</span>
                </div>
                <div className="plan-desc">{p.description}</div>
              </button>
            )
          )}
        </div>

        {/* Quantity */}
        <div className="quantity-row">
          <span className="quantity-label">Team members</span>
          <div className="quantity-control">
            <button
              className="qty-btn"
              onClick={() => adjustSeats(-1)}
              disabled={seats <= 1}
            >
              −
            </button>
            <span className="qty-value">{seats}</span>
            <button className="qty-btn" onClick={() => adjustSeats(1)}>
              +
            </button>
          </div>
        </div>

        {/* Price Display */}
        <div className="price-display">
          <div className="price-main">
            <span className="price-currency">$</span>
            <span className="price-number">{animatedTotal}</span>
          </div>
          <div className="price-period">
            {billing === "annual" ? "per year" : "per month"}
          </div>
          {billing === "annual" && (
            <div className="price-monthly-equiv">
              ${animatedMonthly}
              <span> /mo · billed annually</span>
            </div>
          )}
        </div>

        {/* Breakdown */}
        <div className="breakdown">
          <div className="breakdown-row">
            <span>
              {PLANS[plan].name} × {seats} {seats === 1 ? "seat" : "seats"}
            </span>
            <span>${(basePrice * seats).toFixed(2)}</span>
          </div>
          {savings > 0 && (
            <div className="breakdown-row breakdown-savings">
              <span>Annual discount (20%)</span>
              <span>−${savings.toFixed(2)}/mo</span>
            </div>
          )}
          <div className="breakdown-divider" />
          <div className="breakdown-row breakdown-total">
            <span>Total</span>
            <span>${displayTotal.toFixed(2)}</span>
          </div>
        </div>

        {/* CTA */}
        <button className="cta-btn">
          Get started
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
        <p className="cta-sub">No credit card required · Cancel anytime</p>
      </div>
    </div>
  );
}
