import { useState } from 'react';
import "./FAQ.css";

// Destructure 'data' and 'title' from props
const FAQ = ({ data = [], title = "Frequently Asked Questions" }) => {
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="faq bg-light">
            <div className="container-sm">
                <h3 className="text-xl text-center">{title}</h3>
                
                <div className="faq-content">
                    {data.map((item, index) => (
                        <div key={index} className="faq-group">
                            <div 
                                className="faq-group-header" 
                                onClick={() => toggleFAQ(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h4 className="text-md">{item.question}</h4>
                                <i className={`fas ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                            </div>
                            
                            {/* The active class handles the visibility via CSS */}
                            <div className={`faq-group-body ${activeIndex === index ? 'open' : ''}`}>
                                <p>{item.answer}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default FAQ;