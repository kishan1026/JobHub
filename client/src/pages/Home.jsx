import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import FeaturedJobs from "../components/FeaturedJobs";
import About from "../components/About";
import Footer from "../components/Footer";

const Home = () => {
    return (
        <div className="min-h-screen bg-[#EFEFF0]">
            <Navbar />

            <Hero />

            <FeaturedJobs />

            <About />

            <Footer />
        </div>
    );
};

export default Home;