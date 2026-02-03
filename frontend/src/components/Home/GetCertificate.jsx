import Footer from "../Footer/Footer";

export default function GetCertificate({ showFooter = true }) {
    return (
        <>
            <div className="col-12 text-center py-5">
                <h2 className="fw-bold mb-3">Download Certificate</h2>
                <p className="text-muted">
                    This is the download certificate component.
                </p>
            </div>

            <Footer />
        </>
    );
}
