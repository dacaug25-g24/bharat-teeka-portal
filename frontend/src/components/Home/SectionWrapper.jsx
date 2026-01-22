import "./SectionWrapper.css";
export default function SectionWrapper({ children, bg = false }) {
    return (
        <section className={`${bg ? "section-bg" : ""} section-padding`}>
            <div className="container">
                <div className="row align-items-center">
                    {children}
                </div>
            </div>
        </section>
    );
}
