import { useState } from "react";
import { 
  User, Mail, Phone, Briefcase, ArrowLeft, 
  FileText, Calendar, Award, Building, MapPin 
} from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { submitDoctorApplication } from "../../firebase";
import "../styles/DoctorApplication.css";

export default function DoctorApplication() {
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Professional Information
    specialization: "",
    qualification: "",
    medicalSchool: "",
    graduationYear: "",
    licenseNumber: "",
    licenseState: "",
    experienceYears: "",
    currentHospital: "",
    
    // Additional Information
    boardCertified: false,
    additionalCertifications: "",
    researchExperience: "",
    message: ""
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Required field validation
    const requiredFields = [
      'firstName', 'lastName', 'email', 'phone',
      'specialization', 'qualification', 'licenseNumber'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      setError(`Missing required fields: ${missingFields.join(', ')}`);
      setIsLoading(false);
      return;
    }

    try {
      // Submit to Firestore
      await submitDoctorApplication("current-user-id", formData);
      setIsSubmitted(true);
    } catch (err) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="doctor-application-page">
        <div className="doctor-application-container">
          <div className="doctor-application-header">
            <button 
              onClick={() => navigate("/")} 
              className="doctor-back-button"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="doctor-application-logo">
              <div className="doctor-icon-wrapper success-icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
              </div>
              <h1>Application Submitted</h1>
            </div>
            <p className="doctor-application-subtitle">
              Thank you for applying to join our medical network
            </p>
          </div>

          <div className="success-container">
            <p className="success-message">
              We've received your application and will review your credentials shortly.
              You'll receive an email notification once your application is processed.
            </p>
            <button
              onClick={() => navigate("/")}
              className="doctor-application-button"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="doctor-application-page">
      <div className="doctor-application-container">
        <div className="doctor-application-header">
          <button 
            onClick={() => navigate(-1)} 
            className="doctor-back-button"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="doctor-application-logo">
            <div className="doctor-icon-wrapper">
              <FileText className="doctor-icon" />
            </div>
            <h1>Doctor Application</h1>
          </div>
          <p className="doctor-application-subtitle">
            Complete this form to join our medical platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="doctor-application-form">
          {error && (
            <div className="doctor-application-error">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 8v4m0 4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Personal Information Section */}
          <h2 className="doctor-section-divider">Personal Information</h2>
          
          <div className="doctor-row">
            <div className="doctor-input-group">
              <label htmlFor="firstName">First Name *</label>
              <div className="doctor-input-wrapper">
                <User className="doctor-input-icon" size={18} />
                <input
                  id="firstName"
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="doctor-input-group">
              <label htmlFor="lastName">Last Name *</label>
              <div className="doctor-input-wrapper">
                <User className="doctor-input-icon" size={18} />
                <input
                  id="lastName"
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

           {/* Fixed Gender Radio Buttons */}
        <div className="doctor-input-group">
          <label>Gender *</label>
          <div className="doctor-radio-group">
            {['Male', 'Female', 'Other'].map(gender => (
              <div className="radio-option" key={gender}>
                <input
                  type="radio"
                  id={`gender-${gender}`}
                  name="gender"
                  value={gender.toLowerCase()}
                  checked={formData.gender === gender.toLowerCase()}
                  onChange={() => setFormData(prev => ({
                    ...prev,
                    gender: gender.toLowerCase()
                  }))}
                />
                <label htmlFor={`gender-${gender}`} className="doctor-checkbox-label">
                  {gender}
                </label>
              </div>
            ))}
          </div>
        </div>

          <div className="doctor-input-group">
            <label htmlFor="dateOfBirth">Date of Birth</label>
            <div className="doctor-input-wrapper">
              <Calendar className="doctor-input-icon" size={18} />
              <input
                id="dateOfBirth"
                type="date"
                max={new Date().toISOString().split('T')[0]}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="doctor-row">
            <div className="doctor-input-group">
              <label htmlFor="email">Email *</label>
              <div className="doctor-input-wrapper">
                <Mail className="doctor-input-icon" size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="doctor-input-group">
              <label htmlFor="phone">Phone *</label>
              <div className="doctor-input-wrapper">
                <Phone className="doctor-input-icon" size={18} />
                <input
                  id="phone"
                  type="tel"
                  placeholder="(123) 456-7890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="doctor-input-group">
            <label htmlFor="address">Address</label>
            <div className="doctor-input-wrapper">
              <MapPin className="doctor-input-icon" size={18} />
              <input
                id="address"
                type="text"
                placeholder="Street Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="doctor-row">
            <div className="doctor-input-group">
              <label htmlFor="city">City</label>
              <div className="doctor-input-wrapper">
                <input
                  id="city"
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="doctor-input-group">
              <label htmlFor="state">State</label>
              <div className="doctor-input-wrapper">
                <input
                  id="state"
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="doctor-input-group">
              <label htmlFor="zipCode">ZIP Code</label>
              <div className="doctor-input-wrapper">
                <input
                  id="zipCode"
                  type="text"
                  placeholder="ZIP"
                  value={formData.zipCode}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* Professional Information Section */}
          <h2 className="doctor-section-divider">Professional Information</h2>
          
          <div className="doctor-row">
            <div className="doctor-input-group">
              <label htmlFor="qualification">Qualification *</label>
              <div className="doctor-input-wrapper">
                <Award className="doctor-input-icon" size={18} />
                <select
                  id="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select qualification</option>
                  <option value="MD">MD - Doctor of Medicine</option>
                  <option value="DO">DO - Doctor of Osteopathic Medicine</option>
                  <option value="MBBS">MBBS - Bachelor of Medicine</option>
                  <option value="DMD">DMD - Doctor of Dental Medicine</option>
                  <option value="DPT">DPT - Doctor of Physical Therapy</option>
                  <option value="NP">NP - Nurse Practitioner</option>
                  <option value="PA">PA - Physician Assistant</option>
                </select>
              </div>
            </div>

            <div className="doctor-input-group">
              <label htmlFor="specialization">Specialization *</label>
              <div className="doctor-input-wrapper">
                <Briefcase className="doctor-input-icon" size={18} />
                <select
                  id="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select specialization</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Gastroenterology">Gastroenterology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="Obstetrics/Gynecology">Obstetrics & Gynecology</option>
                  <option value="Oncology">Oncology</option>
                  <option value="Ophthalmology">Ophthalmology</option>
                  <option value="Orthopedics">Orthopedics</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Surgery">Surgery</option>
                  <option value="Urology">Urology</option>
                </select>
              </div>
            </div>
          </div>

          <div className="doctor-input-group">
            <label htmlFor="experienceYears">Years of Experience *</label>
            <div className="doctor-input-wrapper">
              <Calendar className="doctor-input-icon" size={18} />
              <select
                id="experienceYears"
                value={formData.experienceYears}
                onChange={handleChange}
                required
              >
                <option value="">Select experience</option>
                <option value="0-2">0-2 years</option>
                <option value="3-5">3-5 years</option>
                <option value="6-10">6-10 years</option>
                <option value="11-15">11-15 years</option>
                <option value="16-20">16-20 years</option>
                <option value="20+">20+ years</option>
              </select>
            </div>
          </div>

          <div className="doctor-row">
            <div className="doctor-input-group">
              <label htmlFor="medicalSchool">Medical School</label>
              <div className="doctor-input-wrapper">
                <Building className="doctor-input-icon" size={18} />
                <input
                  id="medicalSchool"
                  type="text"
                  placeholder="University/Institution Name"
                  value={formData.medicalSchool}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="doctor-input-group">
              <label htmlFor="graduationYear">Graduation Year</label>
              <div className="doctor-input-wrapper">
                <Calendar className="doctor-input-icon" size={18} />
                <input
                  id="graduationYear"
                  type="number"
                  min="1950"
                  max={new Date().getFullYear()}
                  placeholder="YYYY"
                  value={formData.graduationYear}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="doctor-row">
            <div className="doctor-input-group">
              <label htmlFor="licenseNumber">Medical License Number *</label>
              <div className="doctor-input-wrapper">
                <FileText className="doctor-input-icon" size={18} />
                <input
                  id="licenseNumber"
                  type="text"
                  placeholder="License ID"
                  value={formData.licenseNumber}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="doctor-input-group">
              <label htmlFor="licenseState">License State/Region</label>
              <div className="doctor-input-wrapper">
                <MapPin className="doctor-input-icon" size={18} />
                <input
                  id="licenseState"
                  type="text"
                  placeholder="State/Region"
                  value={formData.licenseState}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="doctor-input-group">
            <label htmlFor="currentHospital">Current Hospital/Clinic</label>
            <div className="doctor-input-wrapper">
              <Building className="doctor-input-icon" size={18} />
              <input
                id="currentHospital"
                type="text"
                placeholder="Hospital/Clinic Name"
                value={formData.currentHospital}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <h2 className="doctor-section-divider">Additional Information</h2>

          <div className="doctor-input-group">
            <div className="doctor-checkbox-group">
              <input
                type="checkbox"
                id="boardCertified"
                checked={formData.boardCertified}
                onChange={handleChange}
              />
              <label htmlFor="boardCertified" className="doctor-checkbox-label">
                I am board certified in my specialty
              </label>
            </div>
          </div>

          <div className="doctor-input-group">
            <label htmlFor="additionalCertifications">Additional Certifications</label>
            <textarea
              id="additionalCertifications"
              placeholder="List any additional certifications or special training"
              value={formData.additionalCertifications}
              onChange={handleChange}
              className="doctor-textarea"
              rows="3"
            />
          </div>

          <div className="doctor-input-group">
            <label htmlFor="researchExperience">Research Experience</label>
            <textarea
              id="researchExperience"
              placeholder="Describe any research experience or publications"
              value={formData.researchExperience}
              onChange={handleChange}
              className="doctor-textarea"
              rows="3"
            />
          </div>

          <div className="doctor-input-group">
            <label htmlFor="message">Why do you want to join our platform?</label>
            <textarea
              id="message"
              placeholder="Tell us about your practice and motivation for joining"
              value={formData.message}
              onChange={handleChange}
              className="doctor-textarea"
              rows="4"
            />
          </div>

          <button
            type="submit"
            className="doctor-application-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="doctor-spinner"></div>
            ) : (
              "Submit Application"
            )}
          </button>

          <div className="doctor-application-footer">
            <p>
              Already have an account? <Link to="/doctor-login">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}