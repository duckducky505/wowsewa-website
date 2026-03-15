import Testimonials from '../components/Testimonials'
import FAQ from '../components/FAQ'
import StatsBar from '../components/Statsbar'
import MainBanner from '../components/MainBanner'
import ServiceHighlights from '../components/ServiceHighlights'

const Home = () => {
    return(
        <>
            <MainBanner/>
            <ServiceHighlights/>
            <Testimonials/>
            <StatsBar/>
            <FAQ/>
        </>
    )
} 

export default Home;