"use client"

import { useState, useEffect } from "react"
import { Menu, X, MapPin, Video, MessageSquare, ArrowRight, Phone, Clock, Shield } from "lucide-react"
import '../styles/LandingPage.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isEmergencyMode, setIsEmergencyMode] = useState(false)
  const [activeTestimonial, setActiveTestimonial] = useState(0)
  const [toasts, setToasts] = useState([])
  const [toastId, setToastId] = useState(0)

  // Custom toast implementation
  const toast = ({ title, description, variant }) => {
    const id = toastId
    setToastId((prev) => prev + 1)

    const newToast = {
      id,
      title,
      description,
      variant,
    }

    setToasts((prev) => [...prev, newToast])

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id))
    }, 5000)
  }

  // Handle smooth scrolling for navigation
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMenuOpen(false)
  }

  // Emergency mode activation
  const activateEmergencyMode = () => {
    setIsEmergencyMode(true)
    toast({
      title: "Emergency Mode Activated",
      description: "Connecting you with the nearest available doctor...",
      variant: "destructive",
    })

    // Simulate connection after 2 seconds
    setTimeout(() => {
      toast({
        title: "Doctor Found",
        description: "Dr. Sarah Johnson is ready to assist you.",
      })
    }, 2000)
  }

  // Deactivate emergency mode
  const deactivateEmergencyMode = () => {
    setIsEmergencyMode(false)
    toast({
      title: "Emergency Mode Deactivated",
      description: "We hope you're feeling better now.",
    })
  }

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  // Testimonials data
  const testimonials = [
    {
      name: "Prathmesh bansode",
      role: "Patient",
      content:
        "The ambulance tracking feature saved precious minutes during my father's heart attack. The doctors were prepared when we arrived.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Dr.  Bhushan Todkar",
      role: "Emergency Physician",
      content:
        "As a doctor, I can provide better care when I know what to expect before the patient arrives. This platform bridges that critical gap.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
    {
      name: "Avinash garkal",
      role: "Mother of two",
      content:
        "The first-aid chatbot walked me through what to do when my son had a severe allergic reaction. It kept me calm until help arrived.",
      avatar: "/placeholder.svg?height=60&width=60",
    },
  ]

  // FAQ data
  const faqs = [
    {
      question: "How quickly can I connect with a doctor?",
      answer:
        "Our system connects you with available emergency doctors typically within 60 seconds or less, depending on current demand.",
    },
    {
      question: "Is my medical data secure on the platform?",
      answer:
        "Yes, we use end-to-end encryption and comply with all HIPAA regulations to ensure your medical information remains private and secure.",
    },
    {
      question: "Can I use this service if I don't have insurance?",
      answer:
        "Absolutely. While insurance information can be added to your profile, our emergency services are available to everyone regardless of insurance status.",
    },
    {
      question: "How accurate is the ambulance tracking?",
      answer:
        "Our GPS tracking is accurate to within 5 meters and updates in real-time every 3 seconds to provide the most precise location information possible.",
    },
  ]

  // Custom accordion state
  const [openAccordion, setOpenAccordion] = useState(null)

  const toggleAccordion = (index) => {
    if (openAccordion === index) {
      setOpenAccordion(null)
    } else {
      setOpenAccordion(index)
    }
  }

  return (
    <div className="landing-page">
      {/* Toast notifications */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.variant}`}>
            <div className="toast-title">{toast.title}</div>
            <div className="toast-description">{toast.description}</div>
          </div>
        ))}
      </div>

      {/* Emergency Mode Overlay */}
      {isEmergencyMode && (
        <div className="emergency-overlay">
          <div className="emergency-pulse">
            <div className="emergency-icon">
              <Phone className="icon" />
            </div>
            <p className="emergency-text">Emergency Mode Active</p>
          </div>

          <div className="emergency-card">
            <h3 className="emergency-card-title">Connecting you with emergency services</h3>
            <div className="emergency-service">
              <div className="emergency-service-icon">
                <Video className="icon-small" />
              </div>
              <div>
                <p className="emergency-service-title">Video call initializing...</p>
                <p className="emergency-service-subtitle">Dr. Pranav BHatikare</p>
              </div>
            </div>
            <div className="emergency-service">
              <div className="emergency-service-icon">
                <MapPin className="icon-small" />
              </div>
              <div>
                <p className="emergency-service-title">Ambulance dispatched</p>
                <p className="emergency-service-subtitle">ETA: 7 minutes</p>
              </div>
            </div>
            <div className="emergency-service">
              <div className="emergency-service-icon">
                <Clock className="icon-small" />
              </div>
              <div>
                <p className="emergency-service-title">Emergency activated</p>
                <p className="emergency-service-subtitle">2 minutes ago</p>
              </div>
            </div>
          </div>

          <button className="cancel-emergency-btn" onClick={deactivateEmergencyMode}>
            Cancel Emergency
          </button>
        </div>
      )}

      {/* Navbar */}
      <header className="header">
        <h1 className="logo">PulseCare</h1>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X className="icon-small" /> : <Menu className="icon-small" />}
        </button>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          <button onClick={() => scrollToSection("about")} className="nav-link">
            About
          </button>
          <button onClick={() => scrollToSection("features")} className="nav-link">
            Features
          </button>
          <button onClick={() => scrollToSection("testimonials")} className="nav-link">
            Testimonials
          </button>
          <button onClick={() => scrollToSection("faq")} className="nav-link">
            FAQ
          </button>
          <button onClick={() => scrollToSection("roles")} className="nav-link">
            Login
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <nav className="mobile-nav">
            <button onClick={() => scrollToSection("about")} className="mobile-nav-link">
              About
            </button>
            <button onClick={() => scrollToSection("features")} className="mobile-nav-link">
              Features
            </button>
            <button onClick={() => scrollToSection("testimonials")} className="mobile-nav-link">
              Testimonials
            </button>
            <button onClick={() => scrollToSection("faq")} className="mobile-nav-link">
              FAQ
            </button>
            <button onClick={() => scrollToSection("roles")} className="mobile-nav-link">
              Login
            </button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <h2 className="hero-title">
            Emergency Health
            <br /> Assistance System
          </h2>
          <p className="hero-description">
            Instant help in medical emergencies. Connect with doctors, track ambulances, and get first-aid instructions.
          </p>
          <div className="emergency-btn-wrapper">
            <button onClick={activateEmergencyMode} className="emergency-btn">
              <span className="emergency-emoji">🚨</span> Get Emergency Help <ArrowRight className="icon-small" />
            </button>
          </div>
          <p className="hero-note">For life-threatening emergencies, please call 911</p>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about">
        <div className="container">
          <h3 className="section-title">About Us</h3>
          <p className="section-description">
            PulseCare is a rapid-response emergency platform. We provide seamless access to medical support, from
            first-aid guidance and live doctor consultation to real-time ambulance tracking. Our mission is to save
            time—and lives.
          </p>
          <div className="card-grid">
            <div className="card">
              <div className="card-content">
                <Clock className="feature-icon" />
                <h4 className="card-title">24/7 Availability</h4>
                <p className="card-text">
                  Medical emergencies don't follow a schedule. Our platform is available around the clock, every day of
                  the year.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <Shield className="feature-icon" />
                <h4 className="card-title">Verified Professionals</h4>
                <p className="card-text">
                  All medical professionals on our platform are verified and licensed, ensuring you receive qualified
                  care.
                </p>
              </div>
            </div>
            <div className="card">
              <div className="card-content">
                <MapPin className="feature-icon" />
                <h4 className="card-title">Global Coverage</h4>
                <p className="card-text">
                  With partners across multiple countries, we can provide assistance no matter where you are.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features">
        <div className="container">
          <h3 className="section-title">Features</h3>
          <div className="feature-cards">
            <div className="feature-card blue">
              <div className="feature-icon-wrapper blue">
                <MapPin className="icon-medium" />
              </div>
              <h4 className="feature-title blue">Real-Time Ambulance Tracking</h4>
              <p className="feature-description">
                Track ambulance location via integrated Google Maps for faster response.
              </p>
              <div className="feature-footer">
                <button className="learn-more-btn blue">
                  Learn more <ArrowRight className="icon-tiny" />
                </button>
              </div>
            </div>
            <div className="feature-card purple">
              <div className="feature-icon-wrapper purple">
                <MessageSquare className="icon-medium" />
              </div>
              <h4 className="feature-title purple">AI-Powered First-Aid Chatbot</h4>
              <p className="feature-description">
                Get instant first-aid instructions using our intelligent virtual assistant.
              </p>
              <div className="feature-footer">
                <button className="learn-more-btn purple">
                  Learn more <ArrowRight className="icon-tiny" />
                </button>
              </div>
            </div>
            <div className="feature-card green">
              <div className="feature-icon-wrapper green">
                <Video className="icon-medium" />
              </div>
              <h4 className="feature-title green">Video Consultation with Doctors</h4>
              <p className="feature-description">Secure, real-time video calls with verified emergency doctors.</p>
              <div className="feature-footer">
                <button className="learn-more-btn green">
                  Learn more <ArrowRight className="icon-tiny" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <h3 className="section-title">What People Say</h3>

          <div className="testimonial-carousel">
            <div className="testimonial-slider" style={{ transform: `translateX(-${activeTestimonial * 100}%)` }}>
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial-slide">
                  <div className="testimonial-card">
                    <div className="testimonial-header">
                      <img
                        src={testimonial.avatar || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="testimonial-avatar"
                      />
                      <div>
                        <h4 className="testimonial-name">{testimonial.name}</h4>
                        <p className="testimonial-role">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="testimonial-content">"{testimonial.content}"</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonial-dots">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTestimonial(index)}
                  className={`testimonial-dot ${activeTestimonial === index ? "active" : ""}`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="faq">
        <div className="container">
          <h3 className="section-title">Frequently Asked Questions</h3>

          <div className="accordion">
            {faqs.map((faq, index) => (
              <div key={index} className="accordion-item">
                <button
                  className={`accordion-trigger ${openAccordion === index ? "open" : ""}`}
                  onClick={() => toggleAccordion(index)}
                >
                  {faq.question}
                  <span className="accordion-icon">{openAccordion === index ? "-" : "+"}</span>
                </button>
                <div className={`accordion-content ${openAccordion === index ? "open" : ""}`}>{faq.answer}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role Selection */}
      <section id="roles" className="roles">
        <div className="container">
          <h3 className="section-title">Login As</h3>
          <div className="role-cards">
            <div className="role-card blue">
              <div className="role-icon blue">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-large"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h4 className="role-title">Patient</h4>
              <p className="role-description">Access emergency services and manage your health profile</p>
              <Link to="/patient-login" className="role-btn blue">
                Login as Patient
              </Link>
            </div>
            <div className="role-card green">
  <div className="role-icon green">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="icon-large"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  </div>
  <h4 className="role-title">Doctor</h4>
  <p className="role-description">Provide emergency consultations and medical advice</p>
  <Link to="/doctor-login" className="role-btn green">
    Login as Doctor
  </Link>
</div>
            <div className="role-card gray">
              <div className="role-icon gray">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon-large"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <h4 className="role-title">Admin</h4>
              <p className="role-description">Manage the platform and monitor emergency services</p>
              <Link to="/admin-login" className="role-btn gray">
    Login as admin
  </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h3 className="cta-title">Ready for Any Emergency</h3>
          <p className="cta-description">
            Download our mobile app now and be prepared for any medical situation. Your safety is just a tap away.
          </p>
          <div className="cta-buttons">
            <button className="cta-btn">
              <svg xmlns="http://www.w3.org/2000/svg" className="icon-small" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5 3v18l7-3 7 3V3H5zm12 13.82l-5-2.18-5 2.18V5h10v11.82z" />
              </svg>
              Download for Android
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <p>© {new Date().getFullYear()} Emergency Health Assistance</p>
            <div className="footer-links">
              <a href="#" className="footer-link">
                Terms
              </a>
              <a href="#" className="footer-link">
                Privacy
              </a>
              <a href="#" className="footer-link">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}