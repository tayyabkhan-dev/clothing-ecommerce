import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">YOUR PRIVACY</p>
        <h1>Privacy Policy</h1>
        <p>
          Information about how this store may collect and use
          your information.
        </p>
      </section>

      <section className="policy-content">
        <p className="policy-intro">
          We respect your privacy. This page explains the types of
          information that may be needed to operate your account,
          process orders, and provide customer support.
        </p>

        <article className="policy-section">
          <h2>01. Information We Collect</h2>
          <p>
            When you use this store, information may include your
            name, email address, phone number, delivery address,
            account details, order history, and information you
            provide when contacting customer support.
          </p>
        </article>

        <article className="policy-section">
          <h2>02. How We Use Your Information</h2>
          <p>
            Information may be used to manage your account, process
            and deliver orders, communicate about purchases, respond
            to support requests, maintain store security, and improve
            the shopping experience.
          </p>
        </article>

        <article className="policy-section">
          <h2>03. Payments</h2>
          <p>
            Payment information is handled according to the payment
            method and provider used by the store. Do not assume that
            card or payment details are stored by this website unless
            the actual payment integration and storage practices
            have been verified.
          </p>
        </article>

        <article className="policy-section">
          <h2>04. Sharing of Information</h2>
          <p>
            Information may need to be shared with service providers
            involved in fulfilling orders, such as delivery or payment
            providers, where applicable. The store's actual sharing
            practices must be confirmed before this policy is
            published.
          </p>
        </article>

        <article className="policy-section">
          <h2>05. Cookies and Website Data</h2>
          <p>
            This website may use browser storage, cookies, or similar
            technologies to support essential functionality. The
            technologies actually used by this store should be
            reviewed and described accurately.
          </p>
        </article>

        <article className="policy-section">
          <h2>06. Data Security and Retention</h2>
          <p>
            Appropriate safeguards should be used to protect customer
            information. Information should only be retained for as
            long as necessary for legitimate business, operational,
            and legal purposes, subject to applicable requirements.
          </p>
        </article>

        <article className="policy-section">
          <h2>07. Your Questions and Requests</h2>
          <p>
            If you have a question about your personal information,
            or want to ask about access, correction, or deletion,
            contact the store team. Requests may be subject to
            applicable legal and operational requirements.
          </p>

          <Link to="/contact" className="policy-button">
            Contact Support <span aria-hidden="true">→</span>
          </Link>
        </article>

        <p className="policy-note">
          Important: this is a starter template, not a legally
          reviewed privacy policy. Before launch, update it to match
          the actual database, hosting, analytics, cookies, payment
          provider, delivery partners, data-retention practices,
          contact details, and applicable privacy laws.
        </p>
      </section>
    </main>
  );
}

export default PrivacyPolicy;