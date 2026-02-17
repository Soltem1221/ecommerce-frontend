import { useState } from 'react';

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const faqs = [
    {
      question: 'How do I create an account?',
      answer: 'Click on "Sign Up" in the navigation bar, fill in your details, and choose whether you want to be a customer or seller.'
    },
    {
      question: 'How do I track my order?',
      answer: 'Go to "My Orders" in your account dashboard. You can see the status of all your orders and track them in real-time.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept Chapa payments, Mobile Money, Bank Transfer, and Cash on Delivery for eligible orders.'
    },
    {
      question: 'How do I become a seller?',
      answer: 'Register as a seller by selecting "Sell Products" during registration. Provide your business information and wait for admin approval.'
    },
    {
      question: 'What is your return policy?',
      answer: 'You can return products within 7 days of delivery if they are unused and in original packaging. Contact customer support to initiate a return.'
    },
    {
      question: 'How long does shipping take?',
      answer: 'Shipping typically takes 3-7 business days depending on your location. Express shipping options are available for faster delivery.'
    }
  ];

  return (
    <div className="container" style={{padding: '48px 20px', maxWidth: '900px'}}>
      <h1 style={{marginBottom: '24px', fontSize: '36px'}}>Frequently Asked Questions</h1>
      
      <div style={{marginBottom: '32px'}}>
        {faqs.map((faq, index) => (
          <div key={index} className="card" style={{padding: '24px', marginBottom: '16px', cursor: 'pointer'}} onClick={() => setOpenIndex(openIndex === index ? null : index)}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h3 style={{margin: 0}}>{faq.question}</h3>
              <span style={{fontSize: '24px'}}>{openIndex === index ? '−' : '+'}</span>
            </div>
            {openIndex === index && (
              <p style={{marginTop: '16px', color: 'var(--gray)', lineHeight: '1.8'}}>{faq.answer}</p>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{padding: '32px', background: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)', color: 'white', textAlign: 'center'}}>
        <h2 style={{marginBottom: '16px', color: 'white'}}>Still have questions?</h2>
        <p style={{marginBottom: '24px', opacity: 0.9}}>Our support team is here to help</p>
        <button className="btn" style={{background: 'white', color: 'var(--primary)'}}>Contact Support</button>
      </div>
    </div>
  );
};

export default FAQ;
