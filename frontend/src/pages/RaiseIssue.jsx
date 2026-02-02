import { useState } from "react";
import Footer from "../components/Footer/Footer";

export default function RaiseIssue() {
  const [formData, setFormData] = useState({
    title: "",
    description: ""
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

    try {
      const response = await fetch(
        "https://formsubmit.co/ajax/bharatteeka@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
          },
          body: JSON.stringify({
            issue_title: formData.title,
            issue_description: formData.description,
            type: "Raise Issue"
          })
        }
      );

      if (response.ok) {
        setSuccess(true);
        setFormData({ title: "", description: "" });
        setTimeout(() => setSuccess(false), 5000);
      } else {
        alert("Failed to submit issue. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Check your internet connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-teal text-center mb-3">
                Raise an Issue
              </h1>
              <p className="text-muted text-center mb-4">
                Facing a problem? Submit your issue and our support team will help you.
              </p>

              <div className="bg-white p-4 rounded-3 shadow-sm">
                
                {success && (
                  <div className="alert alert-success">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Issue submitted successfully. Our team will contact you soon.
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Issue Title
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Brief title of the issue"
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      Issue Description
                    </label>
                    <textarea
                      className="form-control"
                      name="description"
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the issue in detail"
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
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Submitting...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-exclamation-circle-fill me-2"></i>
                          Submit Issue
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <p className="small text-muted text-center mt-3">
                For urgent issues, please contact support via the Contact page.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}