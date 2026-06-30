import Testimonials from '../components/Testimonials/Testimonials'
import FAQ from '../components/FAQ/FAQ'
import StatsBar from '../components/Statsbar/Statsbar'
import MainBanner from '../components/MainBanner/MainBanner'
import ServiceHighlights from '../components/ServiceHighlights/ServiceHighlights'
import HowItWorks from '../components/HowItWorks/HowItWorks'
import PopularPackages from '../components/PopularPackages/PopularPackages'
import Book from '../components/Book'

const Home = () => {

    const faqData = [
        {
            question: "What is Wow Sewa?",
            answer: "Wow Sewa is a comprehensive repair and service company offering a wide range of services for both residential and commercial customers."
        },
        {
            question: "What services do we provide?",
            answer: "We provide services mostly related to electrical problems and installation, plumbing, computer/laptop repair and servicing, and general installation and maintenance of home appliances."
        },
        {
            question: "How can I book an appointment?",
            answer: "You can call us at 9762424318 or email us at wowsewaa@gmail.com to book an appointment."
        }
    ];

    const homeStats = [
        { number: '1000+', label: 'Jobs Completed' },
        { number: '15+', label: 'Expert Technicians' },
        { number: '4.9', label: 'Customer Rating' },
        { number: '30m', label: 'Avg. Response' },
    ];

    return (
        <>
            <MainBanner />
            <ServiceHighlights />
            <StatsBar stats={homeStats} />
            <HowItWorks />
            <PopularPackages />
            <Testimonials />
            <FAQ data={faqData} title="Frequently Asked Questions" />
            <Book />
        </>
    )
}

export default Home;
