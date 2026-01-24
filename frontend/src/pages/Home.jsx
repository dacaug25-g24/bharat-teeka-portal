import HeroSection from "../components/Home/HeroSection";
import HeroSearch from "../components/Home/HeroSearch";
import StepsSection from "../components/Home/StepsSection";
import VaccineStats from "../components/Home/VaccineStats";
import Updates from "../components/Home/Updates";
import FloatingHelp from "../components/Home/FloatingHelp";

import PrecautionDose from "../components/Home/PrecautionDose";
import ReportSideEffect from "../components/Home/ReportSideEffect";
import ChildrenVaccination from "../components/Home/ChildrenVaccination";
import Faq from "../components/Home/Faq";
import WhatsNew from "../components/Home/WhatsNew";
import Footer from "../components/Footer/Footer";
import DownloadCertificate from "../components/Home/DownloadCertificate";


export default function Home() {
  return (
    <>
      <HeroSection />
      <HeroSearch />
      <StepsSection />
      <VaccineStats />
      <Updates />
      <PrecautionDose />
      <ReportSideEffect />
      <ChildrenVaccination />
      <DownloadCertificate/>
      <Faq />
      <WhatsNew />
      {/* <Footer /> */}
      <FloatingHelp />
    </>
  );
}
