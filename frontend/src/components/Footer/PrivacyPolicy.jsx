import Footer from "./Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <div className="bg-light py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <h1 className="display-6 fw-bold text-teal text-center mb-3">Privacy Policy</h1>
              <p className="text-muted text-center mb-4">
                We respect your privacy and are committed to protecting your personal information.
              </p>

              <div className="bg-white p-4 rounded-3 shadow-sm">
                <section className="mb-3">
                  <h5 className="fw-semibold">Data We Collect</h5>
                  <p className="text-muted mb-0">
                    We collect only the information necessary to provide services — such as
                    registration details, booking information, and certificate data when you
                    voluntarily provide them. We do not collect sensitive data unless explicitly required.
                  </p>
                </section>

                <section className="mb-3">
                  <h5 className="fw-semibold">How We Use Data</h5>
                  <p className="text-muted mb-0">
                    Data is used to enable portal features (registration, booking, certificates),
                    to communicate important updates, and to improve the service. We do not sell
                    personal data to third parties.
                  </p>
                </section>

                <section>
                  <h5 className="fw-semibold">Data Protection</h5>
                  <p className="text-muted mb-0">
                    We implement reasonable technical and organizational measures to protect
                    data. Access is limited to authorised personnel and partners required to
                    operate the service. For specific inquiries, please use the Contact page.
                  </p>
                </section>
              </div>

              <p className="small text-muted text-center mt-3 mb-0">
                By using this portal you agree to the collection and use of information
                in accordance with this policy.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
