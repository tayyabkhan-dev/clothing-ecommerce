import { Link } from "react-router-dom";

function FAQ() {
  const questions = [
    {
      question: "How can I place an order?",
      answer:
        "Browse our products, select the item you want, choose the available size or options, and add it to your cart. Continue to checkout and follow the instructions to place your order.",
    },
    {
      question: "How can I check my order status?",
      answer:
        "Sign in to your customer account and open My Orders to view the available details and status of your orders.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "Available payment methods will be displayed during checkout. Please check the options shown before confirming your order.",
    },
    {
      question: "How long does delivery take?",
      answer:
        "Delivery time depends on your location and the shipping option available for your order. Please review our Shipping & Delivery page for the store's current arrangements.",
    },
    {
      question: "Can I return or exchange an item?",
      answer:
        "Return and exchange requests depend on the store's confirmed policy and the item's condition. Please read our Returns & Refunds page and contact our support team before sending an item back.",
    },
    {
      question: "What should I do if I receive a damaged or incorrect item?",
      answer:
        "Contact our support team with your order number, a description of the issue, and clear photos of the item and packaging.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "Visit our Contact page to find the available contact options and send your question to our team.",
    },
  ];

  return (
    <main className="policy-page">
      <section className="policy-hero">
        <p className="policy-eyebrow">CUSTOMER CARE</p>
        <h1>Frequently Asked Questions</h1>
        <p>
          Find answers to common questions about shopping with us.
        </p>
      </section>

      <section className="policy-content">
        <p className="policy-intro">
          Have a question? Start with the answers below. If you need
          more help, our contact page is available for further
          assistance.
        </p>

        <div className="faq-list">
          {questions.map((item, index) => (
            <details className="faq-item" key={item.question}>
              <summary>
                <span>{item.question}</span>
                <span className="faq-icon" aria-hidden="true">
                  +
                </span>
              </summary>

              <p>{item.answer}</p>
            </details>
          ))}
        </div>

        <section className="policy-section">
          <h2>Still need help?</h2>
          <p>
            If your question is not answered here, please contact
            our support team.
          </p>

          <Link to="/contact" className="policy-button">
            Contact Support <span aria-hidden="true">→</span>
          </Link>
        </section>

        <p className="policy-note">
          Store setup required: confirm the payment methods, delivery
          timelines, return rules, and support contact details before
          publishing these answers to customers.
        </p>
      </section>
    </main>
  );
}

export default FAQ;