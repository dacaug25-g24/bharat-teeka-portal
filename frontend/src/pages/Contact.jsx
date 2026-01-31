import { useState } from "react";
import Footer from "../components/Footer/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <>
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="text-center mb-5">
                <h1 className="display-5 fw-bold text-teal mb-3">Contact Us</h1>
                <p className="lead text-muted">
                  Have questions about vaccination or need assistance? We're here to help.
                  Reach out to us and we'll get back to you as soon as possible.
                </p>
              </div>
            </div>
          </div>

          <div className="row g-5">
            {/* Contact Information */}
            <div className="col-lg-5">
              <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                <h3 className="h4 fw-bold text-teal mb-4">Get in Touch</h3>

                <div className="d-flex mb-3">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-geo-alt-fill text-teal fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Address</h6>
                    <p className="text-muted mb-0 small">
                      Ministry of Health & Family Welfare<br />
                      Government of India<br />
                      New Delhi, India
                    </p>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-telephone-fill text-teal fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Phone</h6>
                    <p className="text-muted mb-0 small">
                      Toll Free: 1800-XXX-XXXX<br />
                      Emergency: 112
                    </p>
                  </div>
                </div>

                <div className="d-flex mb-3">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-envelope-fill text-teal fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Email</h6>
                    <p className="text-muted mb-0 small">
                      support@cowin.gov.in<br />
                      info@bharatteeka.gov.in
                    </p>
                  </div>
                </div>

                <div className="d-flex">
                  <div className="flex-shrink-0 me-3">
                    <i className="bi bi-clock-fill text-teal fs-4"></i>
                  </div>
                  <div>
                    <h6 className="fw-semibold mb-1">Support Hours</h6>
                    <p className="text-muted mb-0 small">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 9:00 AM - 1:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="col-lg-7">
              <div className="bg-white p-4 rounded-3 shadow-sm">
                <h3 className="h4 fw-bold text-teal mb-4">Send us a Message</h3>

                {success && (
                  <div className="alert alert-success alert-dismissible fade show" role="alert">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Thank you for your message! We'll get back to you soon.
                    <button type="button" className="btn-close" onClick={() => setSuccess(false)}></button>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label htmlFor="name" className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label htmlFor="email" className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="subject" className="form-label fw-semibold">Subject</label>
                    <input
                      type="text"
                      className="form-control"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is this regarding?"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="message" className="form-label fw-semibold">Message</label>
                    <textarea
                      className="form-control"
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Please describe your question or concern in detail"
                      required
                    ></textarea>
                  </div>

                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-teal btn-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-send-fill me-2"></i>
                          Send Message
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
