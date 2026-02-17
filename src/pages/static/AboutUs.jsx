const AboutUs = () => {
  return (
    <div className="container" style={{padding: '48px 20px', maxWidth: '900px'}}>
      <h1 style={{marginBottom: '24px', fontSize: '36px'}}>About ShopHub Marketplace</h1>
      
      <div className="card" style={{padding: '32px', marginBottom: '24px'}}>
        <h2 style={{marginBottom: '16px'}}>Our Story</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)', marginBottom: '16px'}}>
          ShopHub is Ethiopia's premier multi-vendor e-commerce marketplace, connecting buyers with trusted sellers across the country. 
          We believe in empowering local businesses and providing customers with a seamless shopping experience.
        </p>
        <p style={{lineHeight: '1.8', color: 'var(--gray)'}}>
          Founded in 2024, we've grown to become one of the most trusted online marketplaces in Ethiopia, 
          with thousands of products and hundreds of verified sellers.
        </p>
      </div>

      <div className="grid grid-3" style={{marginBottom: '24px'}}>
        <div className="card" style={{padding: '24px', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '12px'}}>🛍️</div>
          <h3 style={{marginBottom: '8px'}}>Wide Selection</h3>
          <p style={{color: 'var(--gray)'}}>Thousands of products from verified sellers</p>
        </div>
        <div className="card" style={{padding: '24px', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '12px'}}>🔒</div>
          <h3 style={{marginBottom: '8px'}}>Secure Shopping</h3>
          <p style={{color: 'var(--gray)'}}>Safe and secure payment options</p>
        </div>
        <div className="card" style={{padding: '24px', textAlign: 'center'}}>
          <div style={{fontSize: '48px', marginBottom: '12px'}}>🚚</div>
          <h3 style={{marginBottom: '8px'}}>Fast Delivery</h3>
          <p style={{color: 'var(--gray)'}}>Quick and reliable shipping</p>
        </div>
      </div>

      <div className="card" style={{padding: '32px'}}>
        <h2 style={{marginBottom: '16px'}}>Our Mission</h2>
        <p style={{lineHeight: '1.8', color: 'var(--gray)'}}>
          To create a thriving digital marketplace that empowers Ethiopian entrepreneurs and provides customers 
          with access to quality products at competitive prices, while ensuring a secure and convenient shopping experience.
        </p>
      </div>
    </div>
  );
};

export default AboutUs;
