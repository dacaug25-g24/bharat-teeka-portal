import React, { useEffect, useRef, useState } from "react";
import "./VaccineStats.css";
const statsData = [
    { value: 24000000, suffix: "+", label: "Vaccinations Done" },
    { value: 5000000, suffix: "+", label: "Registered Patients" },
    { value: 10000, suffix: "+", label: "Hospitals Onboarded" },
];

const Stats = () => {
    const [counts, setCounts] = useState(statsData.map(() => 0));
    const [hasAnimated, setHasAnimated] = useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        const node = containerRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const [entry] = entries;
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                }
            },
            {
                threshold: 0.3,
            }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [hasAnimated]);

    useEffect(() => {
        if (!hasAnimated) return;

        const duration = 1200;
        const frames = 45;
        const interval = duration / frames;

        let frame = 0;
        const timer = setInterval(() => {
            frame += 1;
            setCounts(
                statsData.map((item) =>
                    Math.round((item.value * frame) / frames)
                )
            );
            if (frame >= frames) clearInterval(timer);
        }, interval);

        return () => clearInterval(timer);
    }, [hasAnimated]);

    const formatNumber = (num) =>
        num >= 10000000
            ? (num / 10000000).toFixed(1) + " Cr"
            : num >= 100000
                ? (num / 100000).toFixed(1) + " L"
                : num.toLocaleString();

    return (
        <div className="container my-5" ref={containerRef}>
            <div className="text-center mb-4">
                <span className="badge rounded-pill bg-teal-subtle text-teal fw-semibold px-3 py-2">
                    Live Platform Stats
                </span>
                <h2 className="mt-3 mb-1 fw-bold">India’s Vaccination Progress</h2>
                <p className="text-muted mb-0">
                    Real‑time overview of doses delivered, people onboarded, and hospitals participating.
                </p>
            </div>

            <div className="row g-4 mt-2">
                {statsData.map((item, index) => (
                    <div className="col-md-4" key={index}>
                        <div className="stat-card h-100 p-4 rounded-4">
                            <div className="stat-icon mb-3">
                                {index === 0 && <i className="bi bi-shield-check"></i>}
                                {index === 1 && <i className="bi bi-people-fill"></i>}
                                {index === 2 && <i className="bi bi-hospital"></i>}
                            </div>
                            <h1 className="fw-bold mb-1 text-teal">
                                {formatNumber(counts[index])}
                                {item.suffix}
                            </h1>
                            <p className="mt-1 fs-6 text-muted">{item.label}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Stats;
