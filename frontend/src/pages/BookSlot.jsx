import Footer from "../components/Footer/Footer";
import ChildrenVaccination from "../components/Home/ChildrenVaccination";
import PrecautionDose from "../components/Home/PrecautionDose";

export default function BookSlot() {
  return (
    <>
      <div className="container mt-4">
        <PrecautionDose />
        <ChildrenVaccination />
      </div>

      <Footer />
    </>
  );
}
