const PrivacyPolicy = () => {
  return (
    <div className="container" style={{padding: '48px 20px', maxWidth: '900px'}}>
      <h1 style={{marginBottom: '24px', fontSize: '36px'}}>Privacy Policy</h1>
      
      <div className="card" style={{padding: '32px'}}>
        <p style={{color: 'var(--gray)', marginBottom: '24px'}}>Last updated: February 13, 2026</p>

        <h2 style={{marginBottom: '16px'}}>1. Information We Collect</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          We collect information you provide directly to us, including your name, email address, phone number, 
          shipping address, and payment information when you create an account or make a purchase.
        </p>

        <h2 style={{marginBottom: '16px'}}>2. How We Use Your Information</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          We use the information we collect to process your orders, communicate with you, improve our services, 
          and provide customer support. We never sell your personal information to third parties.
        </p>

        <h2 style={{marginBottom: '16px'}}>3. Data Security</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          We implement appropriate security measures to protect your personal information. All payment transactions 
          are encrypted and processed through secure payment gateways.
        </p>

        <h2 style={{marginBottom: '16px'}}>4. Cookies</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          We use cookies to enhance your browsing experience, analyze site traffic, and personalize content. 
          You can control cookie settings through your browser.
        </p>

        <h2 style={{marginBottom: '16px'}}>5. Your Rights</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          You have the right to access, update, or delete your personal information at any time. 
          Contact us at privacy@shophub.com for any privacy-related requests.
        </p>

        <h2 style={{marginBottom: '16px'}}>6. Contact Us</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)'}}>
          If you have any questions about this Privacy Policy, please contact us at support@shophub.com
        </p>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
