import { useState } from "react";
import Footer from "../components/Footer/Footer";

export default function RaiseIssue() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    // simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setTitle("");
      setDescription("");
      // In a real app, show toast or redirect
    }, 800);
  };

  return (
    <>
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-teal text-center mb-3">Raise Issue</h1>
              <p className="text-muted text-center mb-4">Describe the issue you're facing and our support team will get back to you.</p>

              <div className="bg-white p-4 rounded-3 shadow-sm">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="issueTitle" className="form-label fw-semibold">Issue Title</label>
                    <input
                      id="issueTitle"
                      type="text"
                      className="form-control"
                      placeholder="Brief title for the issue"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="issueDesc" className="form-label fw-semibold">Issue Description</label>
                    <textarea
                      id="issueDesc"
                      className="form-control"
                      rows={6}
                      placeholder="Provide details about the issue"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>

                  <div className="d-grid">
                    <button type="submit" className="btn btn-teal btn-lg" disabled={submitting}>
                      {submitting ? (
                        <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      ) : (
                        "Submit Issue"
                      )}
                    </button>
                  </div>
                </form>
              </div>

              <p className="small text-muted text-center mt-3 mb-0">For urgent matters, please call the support helpline listed on the Contact page.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
