
import "./Services.css";

const Services = () => {
  const cardHover = {
    transform: "scale(1.05)",
    boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
  };

  return (
    <section className="container my-5">
      <h2 className="text-center fw-bold mb-4 display-6">Our Services</h2>

      <div className="row g-4">

        {[
          {
            title: "Register Patient",
            desc: "Register and manage vaccination records easily.",
          },
          {
            title: "Find Hospitals",
            desc: "Search nearby government & private hospitals.",
          },
          {
            title: "Download Certificate",
            desc: "Get a secure vaccination certificate instantly.",
          },
        ].map((service, index) => (
          <div className="col-md-4" key={index}>
            <div
              className="card shadow-sm p-4 rounded-4 text-center border-0"
              style={{ transition: "0.3s" }}
              onMouseEnter={(e) => Object.assign(e.currentTarget.style, cardHover)}
              onMouseLeave={(e) => Object.assign(e.currentTarget.style, { transform: "scale(1)" })}
            >
              <h4 className="fw-bold mb-2">{service.title}</h4>
              <p className="text-muted">{service.desc}</p>
            </div>
          </div>
        ))}

      </div>
    </section>
  );
};

export default Services;
