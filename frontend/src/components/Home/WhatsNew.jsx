import "./WhatsNew.css";
import whatnew from "../../assets/what's_new_on_cowin.svg";

export default function WhatsNew() {
    const items = [
        {
            text: 'Easily view and download your vaccination certificates for all registered vaccines.',
        },
        {
            text: 'Receive reminders for upcoming vaccination doses to stay up-to-date.',
        },
        {
            text: 'New age groups and vaccines added to the portal for broader coverage.',
        },
        {
            text: 'Improved user interface for faster appointment booking and search for vaccination centers.',
        },
    ];

    return (
        <section className="section-padding bg-light py-5">
            <div className="container">
                <h2 className="section-title text-center mb-4 fw-bold text-teal">
                    What’s New On Bharat Teeka Portal?
                </h2>
                <div className="row gy-4 align-items-center">
                    <div className="col-md-7">
                        <div className="row g-4">
                            {items.map((item, i) => (
                                <div className="col-12" key={i}>
                                    <div className="whatsnew-card card shadow-sm h-100 p-3 flex-row align-items-center">
                                        <div
                                            className="rounded-circle whatsnew-number d-flex flex-column justify-content-center align-items-center me-3"
                                        >
                                            {String(i + 1).padStart(2, "0")}
                                        </div>
                                        <div>
                                            <p className="card-text mb-0 fw-medium">{item.text}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-5 d-none d-md-flex align-items-center justify-content-center">
                        <img src={whatnew} alt="New Features" style={{ maxWidth: 300, borderRadius: 24 }} />
                    </div>
                </div>
            </div>
        </section>
    );
}
