  import React from 'react';
import './APropos.css';

const APropos = () => {
  return (
    <div className="a-propos-page-content">
      {/* Page Hero Section */}
      <section className="ve-page-hero" style={{backgroundImage: 'url(img/bg-img/13.jpg)'}}>
        <div className="ve-page-hero-overlay"></div>
        <div className="container ve-page-hero-content">
          <span className="ve-section-tag">Our Story</span>
          <h1>Building Trust Since <span>2012</span></h1>
          <nav aria-label="breadcrumb">
            <ol className="ve-breadcrumb">
              <li><a href="index.html">Home</a></li>
              <li className="active">About Us</li>
            </ol>
          </nav>
        </div>
      </section>

      {/* ABOUT SPLIT */}
      <section className="ve-section">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6">
              <div className="ve-about-img-stack">
                <div className="ve-about-img-1 bg-img" style={{backgroundImage: 'url(img/bg-img/14.jpg)'}}></div>
                <div className="ve-about-img-2 bg-img" style={{backgroundImage: 'url(img/bg-img/5.jpg)'}}></div>
                <div className="ve-about-ribbon"><strong>12+</strong><span>Years of Trust</span></div>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="ve-about-text">
                <span className="ve-section-tag">Who We Are</span>
                <h2>A Firm Built on <span>Integrity</span> &amp; Results</h2>
                <p className="ve-lead">We are a team of certified financial advisors and analysts dedicated to helping individuals and businesses achieve financial clarity and long-term prosperity.</p>
                <p>Founded in San Francisco in 2012, VaultEdge started with a single mission: make professional wealth management accessible to everyone. Today, we manage over $4.2 billion in assets across 30+ countries.</p>
                <div className="ve-about-features">
                  <div className="ve-af-item"><i className="fa fa-check"></i><span>Certified Financial Planners (CFP)</span></div>
                  <div className="ve-af-item"><i className="fa fa-check"></i><span>SEC Registered Investment Advisor</span></div>
                  <div className="ve-af-item"><i className="fa fa-check"></i><span>Fiduciary - we always act in your interest</span></div>
                  <div className="ve-af-item"><i className="fa fa-check"></i><span>No conflict-of-interest products</span></div>
                </div>
                <a href="services.html" className="ve-btn-primary mt-30">View Our Services</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISSION / VISION / VALUES */}
      <section className="ve-mvv-section">
        <div className="container">
          <div className="ve-section-header text-center">
            <span className="ve-section-tag">Our Foundation</span>
            <h2>Mission, Vision &amp; <span>Values</span></h2>
          </div>
          <div className="ve-mvv-grid">
            <div className="ve-mvv-card">
              <div className="ve-mvv-icon"><i className="fa fa-bullseye"></i></div>
              <h4>Our Mission</h4>
              <p>To democratise access to world-class financial planning, empowering every client to make smarter money decisions with confidence.</p>
            </div>
            <div className="ve-mvv-card">
              <div className="ve-mvv-icon"><i className="fa fa-eye"></i></div>
              <h4>Our Vision</h4>
              <p>To be the most trusted financial partner for the next generation of wealth builders - globally recognised for integrity and innovation.</p>
            </div>
            <div className="ve-mvv-card">
              <div className="ve-mvv-icon"><i className="fa fa-heart"></i></div>
              <h4>Our Values</h4>
              <p>Transparency, client-first thinking, continuous innovation, and an unwavering commitment to ethical financial practice.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TEAM */}
      <section className="ve-section ve-team-section">
        <div className="container">
          <div className="ve-section-header text-center">
            <span className="ve-section-tag">Meet the Experts</span>
            <h2>Our Leadership <span>Team</span></h2>
            <p>Seasoned professionals with decades of combined experience across global financial markets.</p>
          </div>
          <div className="row">
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="ve-team-card">
                <div className="ve-team-img bg-img" style={{backgroundImage: 'url(img/bg-img/15.jpg)'}}></div>
                <div className="ve-team-info">
                  <h5>Jordan Hayes</h5><span>Chief Executive Officer</span>
                  <div className="ve-team-social"><a href="#"><i className="fa fa-linkedin"></i></a><a href="#"><i className="fa fa-twitter"></i></a></div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="ve-team-card">
                <div className="ve-team-img bg-img" style={{backgroundImage: 'url(img/bg-img/16.jpg)'}}></div>
                <div className="ve-team-info">
                  <h5>Taylor Brooks</h5><span>Chief Investment Officer</span>
                  <div className="ve-team-social"><a href="#"><i className="fa fa-linkedin"></i></a><a href="#"><i className="fa fa-twitter"></i></a></div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="ve-team-card">
                <div className="ve-team-img bg-img" style={{backgroundImage: 'url(img/bg-img/17.jpg)'}}></div>
                <div className="ve-team-info">
                  <h5>Morgan Lane</h5><span>Head of Wealth Planning</span>
                  <div className="ve-team-social"><a href="#"><i className="fa fa-linkedin"></i></a><a href="#"><i className="fa fa-twitter"></i></a></div>
                </div>
              </div>
            </div>
            <div className="col-12 col-sm-6 col-lg-3">
              <div className="ve-team-card">
                <div className="ve-team-img bg-img" style={{backgroundImage: 'url(img/bg-img/18.jpg)'}}></div>
                <div className="ve-team-info">
                  <h5>Casey Rivera</h5><span>Head of Risk &amp; Compliance</span>
                  <div className="ve-team-social"><a href="#"><i className="fa fa-linkedin"></i></a><a href="#"><i className="fa fa-twitter"></i></a></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COUNTER SECTION */}
      <section className="ve-counter-section">
        <div className="container">
          <div className="ve-counter-grid">
            <div className="ve-counter-item">
              <i className="fa fa-users"></i>
              <strong className="counter" data-count="50000">0</strong><span>+</span>
              <p>Happy Clients</p>
            </div>
            <div className="ve-counter-item">
              <i className="fa fa-briefcase"></i>
              <strong className="counter" data-count="4200">0</strong><span>M+</span>
              <p>Assets Managed</p>
            </div>
            <div className="ve-counter-item">
              <i className="fa fa-globe"></i>
              <strong className="counter" data-count="30">0</strong><span>+</span>
              <p>Countries Served</p>
            </div>
            <div className="ve-counter-item">
              <i className="fa fa-trophy"></i>
              <strong className="counter" data-count="18">0</strong><span></span>
              <p>Industry Awards</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default APropos;