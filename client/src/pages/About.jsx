import { Link } from "react-router-dom";

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="about-eyebrow">OUR STORY</p>

          <h1>
            Timeless Style.
            <br />
            Made for You.
          </h1>

          <p className="about-hero-description">
            We believe great style is not about following every trend.
            It is about choosing quality, comfort, and confidence that lasts.
          </p>

          <Link to="/products" className="about-button">
            Explore Our Collection <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="about-story">
        <div className="about-story-label">
          <p className="about-eyebrow">WHO WE ARE</p>
          <h2>More Than Just Clothing</h2>
        </div>

        <div className="about-story-content">
          <p>
            Our Store was created around a simple idea: everyday clothing
            should feel as good as it looks. We focus on timeless style,
            thoughtful details, and versatile pieces that fit naturally
            into your life.
          </p>

          <p>
            From your everyday essentials to outfits for special moments,
            our goal is to help you build a wardrobe that feels personal,
            effortless, and refined.
          </p>

          <p>
            We believe that true style is quiet, confident, and never
            needs to shout.
          </p>
        </div>
      </section>

      <section className="about-values">
        <div className="about-section-heading">
          <p className="about-eyebrow">WHAT MATTERS TO US</p>
          <h2>Our Philosophy</h2>
          <p>The principles behind every piece and every detail.</p>
        </div>

        <div className="about-values-grid">
          <article className="about-value-card">
            <span className="about-value-number">01</span>
            <h3>Timeless Design</h3>
            <p>
              We appreciate clean silhouettes and classic styles that
              remain relevant beyond changing trends.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-number">02</span>
            <h3>Everyday Comfort</h3>
            <p>
              Clothing should work with your lifestyle and make getting
              dressed feel simple and natural.
            </p>
          </article>

          <article className="about-value-card">
            <span className="about-value-number">03</span>
            <h3>Thoughtful Details</h3>
            <p>
              From the overall look to the finishing touches, we value
              the small details that complete an outfit.
            </p>
          </article>
        </div>
      </section>

      <section className="about-closing">
        <p className="about-eyebrow">FIND YOUR STYLE</p>

        <h2>Build a Wardrobe That Feels Like You.</h2>

        <p>
          Discover versatile pieces designed to become part of your
          everyday life.
        </p>

        <Link
          to="/products"
          className="about-button about-button-light"
        >
          Shop the Collection <span aria-hidden="true">→</span>
        </Link>
      </section>
    </main>
  );
}

export default About;