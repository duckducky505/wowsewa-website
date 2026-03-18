import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import StatsBar from '../components/Statsbar'
import MainBanner from '../components/MainBanner'
import ServiceHighlights from '../components/ServiceHighlights'
import Book from '../components/Book'

const Home = () => {

        const faqData = [
        {
            question: "What is Wow Sewa?",
            answer: "Wow Sewa is a comprehensive repair and service company offering a wide range of services for both residential and commercial customers."
        },
        {
            question: "What services do we provide?",
            answer: "We provide services mostly related to electrical problems and installation, plumbing-related, computer/laptop repair and servicing, any kind of electrical services and general installation and maintainence of home appliances."
        },
        {
            question: "How can I book an appointment?",
            answer: "You can call us at 9762424318 or email us at wowsewa@gmail.com to book an appointment."
        }
    ];

    return(
        <>
            <MainBanner/>
            <ServiceHighlights/>
            <Testimonials/>
            <StatsBar/>
            <FAQ data={faqData} title="Frequently Asked Questions" />
            <Book/>
        </>
    )
} 

export default Home;