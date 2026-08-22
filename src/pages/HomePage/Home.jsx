import Navbar from "../../components/Navbar/Navbar";
import Hero from '../../components/Hero/Hero';
import Testimonials from '../../components/Testimonials/Testimonials';
import Pricing from '../..//components/Pricing/Pricing';
import Faq from '../..//components/FAQ/Faq';
import Footer from '../..//components/Footer/Footer';
import Services from '../..//components/Services/Services';
import Working from '../../components/Working/Working';
import StatsBar from "../../components/Statsbar/Statsbar";
import Booking from "../../components/Booking/Booking";

export const Home = () => {
    return(
    <>
        <Navbar/>
        <Hero />
        <Services/>
        <Working/>
        <Pricing />
        <Testimonials />
        <StatsBar/>
        <Faq />
        <Booking/>
        <Footer />
    </>
    )
}