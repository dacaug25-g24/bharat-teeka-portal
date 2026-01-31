export default function Support() {
  return (
    <div className="container mt-5 support-page">
      <h1 className="text-center">Support</h1>
      <p className="text-center mt-2">
        Need help with vaccination booking or certificates? We’re here to help.
      </p>

      {/* Common Issues */}
      <div className="mt-4">
        <h4>Common Issues</h4>
        <ul>
          <li>Unable to book vaccination appointment</li>
          <li>Appointment not showing</li>
          <li>Vaccination certificate not downloaded</li>
          <li>Incorrect personal details</li>
        </ul>
      </div>

      {/* Support Form */}
      <div className="mt-4">
        <h4>Raise a Support Request</h4>
        <form>
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Registered Mobile Number</label>
            <input
              type="tel"
              className="form-control"
              placeholder="Enter mobile number"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Issue Type</label>
            <select className="form-select">
              <option>Select issue</option>
              <option>Appointment Booking</option>
              <option>Certificate Download</option>
              <option>Profile Details</option>
              <option>Other</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Describe Your Issue</label>
            <textarea
              className="form-control"
              rows="4"
              placeholder="Explain your problem clearly"
            ></textarea>
          </div>

          <button type="submit" className="btn btn-primary">
            Submit Request
          </button>
        </form>
      </div>

      {/* Contact Info */}
      <div className="mt-5 text-center">
        <h5>Contact Support</h5>
        <p>Email: support@bharatteeka.gov.in</p>
        <p>Helpline: 1075</p>
        <p>Available: 9 AM – 6 PM (Mon–Sat)</p>
      </div>
    </div>
  );
}
