"use client";

import Planet3D from "@/components/3D/planet";

export default function Home() {
  return (
    <div className="page">
      <section className="hero_main">
        <div className="content">
          <h1>Welcome To The Future</h1>

          <p>
            Intelligent AI agents that transform how businesses operate and
            amplify human productivity.
          </p>

          <button className="cta_btn">Get started.</button>
        </div>
        <Planet3D />
      </section>
    </div>
  );
}
