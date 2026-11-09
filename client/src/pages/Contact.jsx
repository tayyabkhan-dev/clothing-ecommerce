import { Link } from "react-router-dom";

function Contact() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="contact-eyebrow">WE ARE HERE TO HELP</p>

        <h1>Let’s Talk.</h1>

        <p>
          Have a question about our collection or your order?
          We would love to hear from you.
        </p>
      </section>

      <section className="contact-content">
        <div className="contact-info">
          <p className="contact-eyebrow">GET IN TOUCH</p>

          <h2>We’re happy to help.</h2>

          <p>
            Whether you need help choosing a product or have a question
            about an order, feel free to contact our team.
          </p>

          <div className="contact-detail">
            <h3>Email</h3>
            <p>support@example.com</p>
            <span>
              Replace this example email with your store’s real email.
            </span>
          </div>

          <div className="contact-detail">
            <h3>Customer Support</h3>
            <p>Order and product enquiries</p>
          </div>

          <Link to="/products" className="contact-button">
            Explore Our Collection <span aria-hidden="true">→</span>
          </Link>
        </div>

        <form
          className="contact-form"
          onSubmit={(event) => {
            event.preventDefault();
            window.alert(
              "This contact form is not connected yet. Please contact the store by email."
            );
          }}
        >
          <h2>Send Us a Message</h2>

          <label htmlFor="contact-name">Your Name</label>
          <input
            id="contact-name"
            name="name"
            type="text"
            placeholder="Enter your name"
            required
          />

          <label htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            name="subject"
            type="text"
            placeholder="How can we help?"
            required
          />

          <label htmlFor="contact-message">Message</label>
          <textarea
            id="contact-message"
            name="message"
            rows="5"
            placeholder="Write your message here..."
            required
          />

          <button type="submit" className="contact-button">
            Send Message <span aria-hidden="true">→</span>
          </button>

          <p className="contact-form-note">
            This form is a design preview and does not send messages yet.
          </p>
        </form>
      </section>
    </main>
  );
}

export default Contact;