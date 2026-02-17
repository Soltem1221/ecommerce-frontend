const Terms = () => {
  return (
    <div className="container" style={{padding: '48px 20px', maxWidth: '900px'}}>
      <h1 style={{marginBottom: '24px', fontSize: '36px'}}>Terms & Conditions</h1>
      
      <div className="card" style={{padding: '32px'}}>
        <p style={{color: 'var(--gray)', marginBottom: '24px'}}>Last updated: February 13, 2026</p>

        <h2 style={{marginBottom: '16px'}}>1. Acceptance of Terms</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          By accessing and using ShopHub Marketplace, you accept and agree to be bound by these Terms and Conditions.
        </p>

        <h2 style={{marginBottom: '16px'}}>2. User Accounts</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          You are responsible for maintaining the confidentiality of your account credentials and for all activities 
          that occur under your account.
        </p>

        <h2 style={{marginBottom: '16px'}}>3. Seller Obligations</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          Sellers must provide accurate product descriptions, honor their listed prices, and fulfill orders in a timely manner. 
          Sellers are responsible for the quality and legality of their products.
        </p>

        <h2 style={{marginBottom: '16px'}}>4. Buyer Obligations</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          Buyers agree to provide accurate shipping information and make timely payments for their purchases.
        </p>

        <h2 style={{marginBottom: '16px'}}>5. Prohibited Activities</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          Users may not engage in fraudulent activities, sell counterfeit goods, or violate any applicable laws.
        </p>

        <h2 style={{marginBottom: '16px'}}>6. Limitation of Liability</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '24px'}}>
          ShopHub acts as a marketplace platform and is not responsible for disputes between buyers and sellers.
        </p>

        <h2 style={{marginBottom: '16px'}}>7. Changes to Terms</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)'}}>
          We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of updated terms.
        </p>
      </div>
    </div>
  );
};

export default Terms;
