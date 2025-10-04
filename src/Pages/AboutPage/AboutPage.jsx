import React from "react";
import SchoolDetails from "./Components/School-Details/SchoolDetails";
import Committee from "./Components/Committee/Committee";
import Gallery from "./Components/Gallery/Gallery";
import Footer from "../HomePage/Components/Footer/Footer";
import MemmorialPage from "./Components/MemmorialPage/MemmorialPage";
import Teachers from "./Components/Teachers/Teachers";

function AboutPage() {
  return (
    <div>
      <div className="min-h-screen">
        <SchoolDetails />
      </div>

      {/* Teachers and Committee Section */}
      <div className="flex flex-col md:flex-row gap-2 ">
        {/* Teachers Section */}
       <div className="md:w-1/2 w-full">
          <Teachers />
        </div>

        {/* Committee Section */}
        <div className="md:w-1/2 w-full">
          <Committee />
        </div>
      </div>

      <Gallery/>
      <MemmorialPage/>
      <Footer/>
    </div>
  );
}

export default AboutPage;
