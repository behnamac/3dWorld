"use client";

import Planet3D from "@/components/3D/planet";

export default function Home() {
  return (
    <div className="page">
      <section className="hero_main">
        <div className="content">
          <h1>Welcome To The New World</h1>

          <p>
            AI agents that actually bring value to businesses and elevate
            workers productivity.
          </p>

          <button className="cta_btn">Get started.</button>
        </div>
        <Planet3D />
      </section>
    </div>
  );
}
