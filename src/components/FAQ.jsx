import { useState } from 'react';
import { FaPlus, FaMinus } from 'react-icons/fa6'; 
import "./FAQ.css";

const FAQ = ({ data = [], title = "Frequently Asked Questions" }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq">
            <div className="container-sm">
                <h3 className="text-xl text-center">{title}</h3>
                
                <div className="faq-content">
                    {data.map((item, index) => (
                        <div key={index} className="faq-group">
                            <div 
                                className="faq-group-header" 
                                onClick={() => toggleFAQ(index)}
                                role="button"
                                aria-expanded={activeIndex === index}
                            >
                                <h4 className="text-md">{item.question}</h4>
                                <div className={`faq-icon ${activeIndex === index ? 'active' : ''}`}>
                                    {activeIndex === index ? <FaMinus /> : <FaPlus />}
                                </div>
                            </div>
                            
                            <div className={`faq-group-body ${activeIndex === index ? 'open' : ''}`}>
                                <div className="faq-answer-inner">
                                    <p>{item.answer}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;