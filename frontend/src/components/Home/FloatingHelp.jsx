export default function FloatingHelp() {
    return (
        <a
            href="#"
            className="btn btn-success shadow-lg position-fixed d-flex align-items-center"
            style={{
                right: "20px",
                bottom: "20px",
                borderRadius: "30px",
                padding: "12px 20px",
                zIndex: 2000,
            }}
        >
            <i className="bi bi-telephone-fill me-2"></i>
            Support
        </a>
    );
}
