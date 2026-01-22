import "./Faq.css";

export default function Faq() {
    return (
        <section className="section-padding">
            <div id="faq" className="container">
                <h2 className="section-title text-center mb-4 fw-bold">
                    Frequently Asked Questions
                </h2>

                <div className="accordion" id="faqAccordion">

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="heading1">
                            <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq1"
                                aria-expanded="true"
                                aria-controls="faq1"
                            >
                                How do I download my vaccination certificate?
                            </button>
                        </h2>
                        <div
                            id="faq1"
                            className="accordion-collapse collapse show"
                            aria-labelledby="heading1"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                You can download your vaccination certificate from the official portal by logging in with your registered details. After verifying your information, you can save or print the certificate for official use.
                            </div>
                        </div>
                    </div>


                    <div className="accordion-item">
                        <h2 className="accordion-header" id="heading2">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq2"
                                aria-expanded="false"
                                aria-controls="faq2"
                            >
                                Can I update my personal details?
                            </button>
                        </h2>
                        <div
                            id="faq2"
                            className="accordion-collapse collapse"
                            aria-labelledby="heading2"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Yes, you can update your personal information such as name, date of birth, or contact details through your profile on the portal.
                            </div>
                        </div>
                    </div>


                    <div className="accordion-item">
                        <h2 className="accordion-header" id="heading3">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq3"
                                aria-expanded="false"
                                aria-controls="faq3"
                            >
                                How do I book a vaccination appointment?
                            </button>
                        </h2>
                        <div
                            id="faq3"
                            className="accordion-collapse collapse"
                            aria-labelledby="heading3"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Log in to the vaccination portal, search for available centers in your area, choose a preferred date and time, and confirm your appointment.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="heading4">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq4"
                                aria-expanded="false"
                                aria-controls="faq4"
                            >
                                What documents do I need for vaccination?
                            </button>
                        </h2>
                        <div
                            id="faq4"
                            className="accordion-collapse collapse"
                            aria-labelledby="heading4"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                You will need a government-issued ID, basic personal details, and any previously issued vaccination records if applicable. Photo ID proof may be requested at the vaccination center.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="heading5">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq5"
                                aria-expanded="false"
                                aria-controls="faq5"
                            >
                                Are vaccinations safe for children and adults?
                            </button>
                        </h2>
                        <div
                            id="faq5"
                            className="accordion-collapse collapse"
                            aria-labelledby="heading5"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Yes, all vaccines provided through the portal are government-approved and meet safety standards. Mild side effects like soreness or fever may occur, but serious reactions are extremely rare.
                            </div>
                        </div>
                    </div>

                    <div className="accordion-item">
                        <h2 className="accordion-header" id="heading6">
                            <button
                                className="accordion-button collapsed"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#faq6"
                                aria-expanded="false"
                                aria-controls="faq6"
                            >
                                How do I check my vaccination status?
                            </button>
                        </h2>
                        <div
                            id="faq6"
                            className="accordion-collapse collapse"
                            aria-labelledby="heading6"
                            data-bs-parent="#faqAccordion"
                        >
                            <div className="accordion-body">
                                Log in to the portal and navigate to "Vaccination History" or "Beneficiary Details" to view all your completed vaccinations and download certificates if needed.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
