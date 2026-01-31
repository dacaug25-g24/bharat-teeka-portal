import Footer from "./Footer";

export default function About() {
  return (
    <>
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10">
              <div className="text-center mb-4">
                <h1 className="display-6 fw-bold text-teal mb-2">About Us</h1>
                <p className="lead text-muted mb-0">
                  Bharat Teeka Portal connects citizens with vaccination services,
                  information, and support — making vaccination simple, secure and accessible.
                </p>
              </div>

              <div className="row g-4 mt-4">
                <div className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">Our Mission</h5>
                      <p className="card-text text-muted">
                        To strengthen public health by providing reliable vaccination
                        information, easy access to booking services, and secure
                        certificate management for all citizens.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title fw-bold">Our Vision</h5>
                      <p className="card-text text-muted">
                        A healthier Bharat where vaccines are accessible to everyone,
                        supported by transparent information and trusted digital services.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <h4 className="fw-bold mt-3 mb-3">Key Features</h4>
                  <div className="row row-cols-1 row-cols-md-3 g-3">
                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="me-3 text-teal fs-3">
                              <i className="bi bi-person-check-fill"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">Register & Manage</h6>
                              <p className="text-muted small mb-0">Create and manage your vaccination profile easily.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="me-3 text-teal fs-3">
                              <i className="bi bi-calendar-check-fill"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">Book Slots</h6>
                              <p className="text-muted small mb-0">Find centres and book vaccination slots near you.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="me-3 text-teal fs-3">
                              <i className="bi bi-file-earmark-medical-fill"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">Certificates</h6>
                              <p className="text-muted small mb-0">Download and verify vaccination certificates securely.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="me-3 text-teal fs-3">
                              <i className="bi bi-chat-dots-fill"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">Support & FAQ</h6>
                              <p className="text-muted small mb-0">Get answers to common questions and raise issues when needed.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="me-3 text-teal fs-3">
                              <i className="bi bi-shield-lock-fill"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">Privacy & Security</h6>
                              <p className="text-muted small mb-0">We prioritise user privacy and store data securely.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col">
                      <div className="card h-100 border-0 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex align-items-start">
                            <div className="me-3 text-teal fs-3">
                              <i className="bi bi-globe2"></i>
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">Accessible Service</h6>
                              <p className="text-muted small mb-0">Designed for accessibility and easy navigation on all devices.</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-12">
                  <div className="bg-white p-4 rounded-3 shadow-sm mt-4">
                    <h5 className="fw-bold">Why Bharat Teeka Portal?</h5>
                    <p className="text-muted mb-0">
                      We bring trusted government-backed vaccination services into a single,
                      easy-to-use portal. Our aim is to reduce friction for citizens seeking
                      vaccination information and services while maintaining the highest
                      standards of security and privacy.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
