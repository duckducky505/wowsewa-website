import { useState } from 'react';
import "./FAQ.css"

const FAQ = () => {
    // track the index of the open FAQ. null means all are closed.
    const [activeIndex, setActiveIndex] = useState(null);

    const toggleFAQ = (index) => {
        // If the clicked one is already open, close it (set to null)
        // Otherwise, open the new one
        setActiveIndex(activeIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "What is Wow Sewa?",
            answer: "Wow Sewa is a comprehensive repair and service company offering a wide range of services for both residential and commercial customers."
        },
        {
            question: "What services do we provide?",
            answer: "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad culpa enim blanditiis rem ipsum aliquam."
        },
        {
            question: "How can I book an appointment?",
            answer: "You can call or email us to book an appointment."
        }
    ];

    return (
        <section className="faq bg-light">
            <div className="container-sm">
                <h3 className="text-xl text-center">Frequently Asked Questions</h3>
                
                <div className="faq-content">
                    {faqData.map((item, index) => (
                        <div key={index} className="faq-group">
                            <div 
                                className="faq-group-header" 
                                onClick={() => toggleFAQ(index)}
                                style={{ cursor: 'pointer' }}
                            >
                                <h4 className="text-md">{item.question}</h4>
                                <i className={`fas ${activeIndex === index ? 'fa-minus' : 'fa-plus'}`}></i>
                            </div>
                            
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