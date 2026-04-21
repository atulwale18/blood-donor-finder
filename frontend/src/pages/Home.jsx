import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      {/* ================= HEADER ================= */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>
            <span style={styles.logoIcon}>🩸</span>
            <span style={styles.logoText}>Blood Donor Finder</span>
          </div>
          <div style={styles.headerButtons}>
            <button
              style={styles.headerLoginBtn}
              onClick={() => navigate("/login")}
            >
              Login
            </button>
            <button
              style={styles.headerSignupBtn}
              onClick={() => navigate("/register")}
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* ================= HERO SECTION ================= */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>
            Be a <span style={styles.heroHighlight}>Hero</span>
          </h1>
          <h2 style={styles.heroSubtitle}>Donate Blood, Save Lives</h2>
          <p style={styles.heroDesc}>
            Connect with verified donors, find blood in emergencies, and be the reason someone smiles today.
          </p>

          <div style={styles.heroButtons}>
            <button
              style={styles.btnPrimary}
              onClick={() => navigate("/register")}
            >
              ❤️ Become a Donor
            </button>
            <button
              style={styles.btnSecondary}
              onClick={() => navigate("/login")}
            >
              🔍 Find Blood
            </button>
          </div>
        </div>

        <div style={styles.heroImage}>
          <img 
            src="https://images.unsplash.com/photo-1615461066841-6116e61058f4?q=80&w=1500&auto=format&fit=crop" 
            alt="Blood Donation Hero" 
            style={{ width: "100%", maxWidth: "450px", borderRadius: "30px", boxShadow: "0 25px 50px rgba(244, 66, 54, 0.25)" }} 
          />
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section style={styles.features}>
        <h2 style={styles.featuresTitle}>Why Choose Us?</h2>
        <div style={styles.featureGrid}>
          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>🚑</div>
            <h3 style={styles.featureCardTitle}>Emergency Response</h3>
            <p style={styles.featureCardDesc}>
              Real-time notifications to nearby donors for critical emergencies
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>📍</div>
            <h3 style={styles.featureCardTitle}>Smart Matching</h3>
            <p style={styles.featureCardDesc}>
              AI-powered donor matching based on location and blood group
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>💬</div>
            <h3 style={styles.featureCardTitle}>Multi-Channel Alerts</h3>
            <p style={styles.featureCardDesc}>
              Email, WhatsApp, and push notifications for immediate action
            </p>
          </div>

          <div style={styles.featureCard}>
            <div style={styles.featureIcon}>✅</div>
            <h3 style={styles.featureCardTitle}>Verified Donors</h3>
            <p style={styles.featureCardDesc}>
              All donors are verified and screened for safety
            </p>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section style={styles.stats}>
        <div style={styles.stat}>
          <div style={styles.statNumber}>10K+</div>
          <div style={styles.statLabel}>Active Donors</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNumber}>500+</div>
          <div style={styles.statLabel}>Lives Saved</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNumber}>24/7</div>
          <div style={styles.statLabel}>Emergency Service</div>
        </div>
        <div style={styles.stat}>
          <div style={styles.statNumber}>5 mins</div>
          <div style={styles.statLabel}>Avg Response Time</div>
        </div>
      </section>

      {/* ================= CTA SECTION ================= */}
      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to Make a Difference?</h2>
        <p style={styles.ctaDesc}>
          Join thousands of donors who are saving lives every day
        </p>
        <button style={styles.ctaButton} onClick={() => navigate("/register")}>
          Get Started Today →
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer style={styles.footer}>
        <p>© 2026 Blood Donor Finder. Saving lives, one donation at a time.</p>
      </footer>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "#fff",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },

  /* ================= HEADER ================= */
  header: {
    background: "linear-gradient(135deg, #f44236 0%, #e53935 100%)",
    padding: "16px 24px",
    boxShadow: "0 4px 12px rgba(244, 66, 54, 0.15)",
    position: "sticky",
    top: 0,
    zIndex: 100,
  },

  headerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    cursor: "pointer",
    fontSize: "1.3rem",
    fontWeight: "800",
    color: "#fff",
  },

  logoIcon: {
    fontSize: "2rem",
  },

  logoText: {
    letterSpacing: "0.5px",
  },

  headerButtons: {
    display: "flex",
    gap: "12px",
  },

  headerLoginBtn: {
    background: "transparent",
    border: "2px solid #fff",
    color: "#fff",
    padding: "10px 24px",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },

  headerSignupBtn: {
    background: "#fff",
    border: "none",
    color: "#f44236",
    padding: "10px 24px",
    borderRadius: "25px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "0.95rem",
    transition: "all 0.3s ease",
  },

  /* ================= HERO ================= */
  hero: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "80px 24px",
    display: "flex",
    alignItems: "center",
    gap: "60px",
    flexWrap: "wrap",
  },

  heroContent: {
    flex: 1,
    minWidth: "300px",
  },

  heroTitle: {
    fontSize: "4rem",
    fontWeight: "900",
    lineHeight: "1.1",
    color: "#1a1a1a",
    margin: "0 0 16px 0",
  },

  heroHighlight: {
    color: "#f44236",
  },

  heroSubtitle: {
    fontSize: "1.8rem",
    fontWeight: "700",
    color: "#4caf50",
    margin: "0 0 24px 0",
  },

  heroDesc: {
    fontSize: "1.1rem",
    color: "#666",
    lineHeight: "1.8",
    margin: "0 0 40px 0",
  },

  heroButtons: {
    display: "flex",
    gap: "16px",
    flexWrap: "wrap",
  },

  btnPrimary: {
    background: "linear-gradient(135deg, #f44236, #d32f2f)",
    color: "#fff",
    border: "none",
    padding: "16px 32px",
    fontSize: "1.1rem",
    fontWeight: "700",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 8px 24px rgba(244, 66, 54, 0.3)",
    transition: "all 0.3s ease",
  },

  btnSecondary: {
    background: "#fff",
    color: "#f44236",
    border: "2px solid #f44236",
    padding: "14px 32px",
    fontSize: "1.1rem",
    fontWeight: "700",
    borderRadius: "50px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },

  heroImage: {
    flex: 1,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minWidth: "300px",
  },

  bloodDrop: {
    width: "280px",
    height: "280px",
    animation: "float 3s ease-in-out infinite",
  },

  /* ================= FEATURES ================= */
  features: {
    background: "#f5f5f5",
    padding: "80px 24px",
  },

  featuresTitle: {
    textAlign: "center",
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "60px",
  },

  featureGrid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },

  featureCard: {
    background: "#fff",
    padding: "32px 24px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    textAlign: "center",
    transition: "transform 0.3s ease, box-shadow 0.3s ease",
  },

  featureIcon: {
    fontSize: "3rem",
    marginBottom: "16px",
  },

  featureCardTitle: {
    fontSize: "1.3rem",
    fontWeight: "700",
    color: "#1a1a1a",
    margin: "0 0 12px 0",
  },

  featureCardDesc: {
    fontSize: "0.95rem",
    color: "#777",
    lineHeight: "1.6",
    margin: "0",
  },

  /* ================= STATS ================= */
  stats: {
    background: "linear-gradient(135deg, #f44236 0%, #e53935 100%)",
    padding: "60px 24px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },

  stat: {
    textAlign: "center",
    color: "#fff",
  },

  statNumber: {
    fontSize: "2.8rem",
    fontWeight: "900",
    marginBottom: "8px",
  },

  statLabel: {
    fontSize: "1rem",
    opacity: "0.9",
  },

  /* ================= CTA ================= */
  cta: {
    background: "#fff",
    padding: "80px 24px",
    textAlign: "center",
  },

  ctaTitle: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#1a1a1a",
    marginBottom: "16px",
  },

  ctaDesc: {
    fontSize: "1.1rem",
    color: "#666",
    marginBottom: "32px",
  },

  ctaButton: {
    background: "linear-gradient(135deg, #f44236, #d32f2f)",
    color: "#fff",
    border: "none",
    padding: "18px 48px",
    fontSize: "1.1rem",
    fontWeight: "700",
    borderRadius: "50px",
    cursor: "pointer",
    boxShadow: "0 12px 32px rgba(244, 66, 54, 0.3)",
    transition: "all 0.3s ease",
  },

  /* ================= FOOTER ================= */
  footer: {
    background: "#1a1a1a",
    color: "#fff",
    padding: "24px",
    textAlign: "center",
    fontSize: "0.95rem",
  },
};

export default Home;
