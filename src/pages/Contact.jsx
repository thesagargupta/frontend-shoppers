import "./Contact.css";
import { LuPhoneCall } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";

const Contact = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    alert("Message sent successfully!");
  };

  return (
    <div className="contact-container">
      <div className="contact-info">
        <div className="info-item">
          <i className="icon"><LuPhoneCall /></i>
          <h3>Call To Us</h3>
          <p>We are available 24/7, 7 days a week.</p>
          <p>Phone: +91 88091 97377</p>
        </div>
        <div className="info-item">
          <i className="icon"><TfiEmail /></i>
          <h3>Write To Us</h3>
          <p>Fill out our form, and we will contact you within 24 hours.</p>
          <p>Email: customer@shoper.com</p>
          <p>Email: support@shoper.com</p>
        </div>
      </div>

      <div className="contact-form">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="text" placeholder="Your Name *" required />
            <input type="email" placeholder="Your Email *" required />
            <input type="text" placeholder="Your Phone *" required />
          </div>
          <textarea placeholder="Your Message" rows="5" required></textarea>
          <button type="submit" className="btn-submit">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
