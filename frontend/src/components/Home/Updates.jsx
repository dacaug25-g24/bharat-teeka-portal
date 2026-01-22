import "./Updates.css";
export default function Updates() {

    const items = [
        {
            title: "New Vaccination Schedules Available",
            text: "Updated vaccination schedules are now available for different age groups and eligibility categories.",
            icon: "bi-calendar-check",
            tag: "Schedule Update",
        },
        {
            title: "More Vaccination Centers Added",
            text: "Additional vaccination centers have been onboarded to improve accessibility across regions.",
            icon: "bi-geo-alt-fill",
            tag: "Infrastructure",
        },
        {
            title: "Expanded Age Group Coverage",
            text: "Vaccination services have been expanded to cover more age groups as per updated guidelines.",
            icon: "bi-people-fill",
            tag: "Eligibility",
        },
    ];


    return (
        <div className="container my-5">

            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h3 className="fw-bold mb-1">What’s New</h3>
                    <p className="text-muted mb-0">
                        Latest platform and policy updates around vaccination.
                    </p>
                </div>
            </div>

            <div className="row g-3">
                {items.map((item, idx) => (
                    <div className="col-md-4" key={idx}>
                        <div className="update-card h-100 p-3 rounded-4">
                            <div className="d-flex align-items-center mb-2">
                                <div className="update-icon me-2">
                                    <i className={`bi ${item.icon}`}></i>
                                </div>
                                <span className="badge bg-update-tag text-teal fw-semibold">
                                    {item.tag}
                                </span>
                            </div>
                            <h5 className="fw-semibold mb-2">{item.title}</h5>
                            <p className="card-text text-muted mb-0">{item.text}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
