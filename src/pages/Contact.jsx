import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { LuPhoneCall } from "react-icons/lu";
import { TfiEmail } from "react-icons/tfi";
import "./Contact.css";
import { backendUrl } from "../../../admin/src/components/Config";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true); // Start loading
    const toastId = toast.loading("Sending message..."); // Show loader toast

    try {
      const response = await fetch(backendUrl + "/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(data.message, { id: toastId });
        setFormData({ name: "", email: "", phone: "", message: "" }); // Reset form
      } else {
        toast.error(data.message, { id: toastId });
      }
    } catch (error) {
      toast.error("Failed to send message. Try again.", { id: toastId });
      console.error("Error:", error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="contact-container">
      <Toaster position="top-center" reverseOrder={false} />
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
            <input type="text" name="name" placeholder="Your Name *" value={formData.name} onChange={handleChange} required />
            <input type="email" name="email" placeholder="Your Email *" value={formData.email} onChange={handleChange} required />
            <input type="text" name="phone" placeholder="Your Phone *" value={formData.phone} onChange={handleChange} required />
          </div>
          <textarea name="message" placeholder="Your Message" rows="5" value={formData.message} onChange={handleChange} required></textarea>
          <button type="submit" className="btn-submit" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
