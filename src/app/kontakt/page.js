'use client'
import {React, useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

// Main Contact Page Component
export default function ContactPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    category: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [emailError, setEmailError] = useState('');

  // URL Parameter Handling
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const kategorie = urlParams.get('kategorie');
    const demo = urlParams.get('demo');
    
    if (kategorie) {
      let categoryValue = '';
      let messagePrefix = '';
      
      switch(kategorie) {
        case 'ki-agenten':
          categoryValue = 'ki-automatisierung';
          messagePrefix = demo === 'true' 
            ? 'Ich interessiere mich für eine Live-Demo Ihrer KI-Agenten. ' 
            : 'Ich interessiere mich für KI-Agenten und Automatisierung. ';
          break;
        case 'webdesign':
          categoryValue = 'webdesign';
          messagePrefix = 'Ich interessiere mich für Webdesign und Webentwicklung. ';
          break;
        case 'it-support':
          categoryValue = 'it-support';
          messagePrefix = 'Ich benötige IT-Support und professionelle IT-Betreuung. ';
          break;
        default:
          categoryValue = 'beratung';
          messagePrefix = 'Ich interessiere mich für Ihre IT-Dienstleistungen. ';
      }
      
      setFormData(prev => ({
        ...prev,
        category: categoryValue,
        message: messagePrefix
      }));
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      return 'E-Mail ist erforderlich';
    }
    
    if (!emailRegex.test(email)) {
      return 'Bitte geben Sie eine gültige E-Mail-Adresse ein';
    }
    
    if (email.length > 254) {
      return 'E-Mail-Adresse ist zu lang';
    }
    
    return '';
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmailBlur = () => {
    const error = validateEmail(formData.email);
    setEmailError(error);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Finale Validierung vor dem Senden
    const emailValidationError = validateEmail(formData.email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    // Prüfe ob alle Pflichtfelder ausgefüllt sind
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.category || !formData.message) {
      setSubmitStatus('validation');
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      setSubmitStatus('success');
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        company: '',
        category: '',
        message: ''
      });
      setEmailError('');

    } catch (error) {
      console.error('Fehler beim Senden der Email:', error);
      setSubmitStatus('error');
    }

    setIsSubmitting(false);
  };

  const serviceCategories = [
    { value: '', label: 'Kategorie auswählen' },
    { value: 'ki-automatisierung', label: 'KI & Automatisierung' },
    { value: 'webdesign', label: 'Webdesign & Entwicklung' },
    { value: 'it-support', label: 'IT-Support & Cloud' },
    { value: 'beratung', label: 'Kostenlose Beratung' },
    { value: 'sonstiges', label: 'Sonstiges' }
  ];

  return (
    <>
      {/* Header Component - Always visible */}
      <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

      {/* Main Content */}
      <main className="min-h-screen bg-black text-white">
        
        {/* Hero Section - Container korrigiert */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
          </div>

          <div className="max-w-6xl mx-auto text-center relative z-10">
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-8 leading-tight">
              <span className="text-white">Lassen Sie uns</span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                sprechen
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl mb-12 max-w-4xl mx-auto text-gray-300 leading-relaxed">
              Erzählen Sie uns von Ihrem Projekt und lassen Sie uns gemeinsam die 
              <span className="text-blue-400 font-semibold"> perfekte IT-Lösung</span> für Sie entwickeln.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 max-w-lg mx-auto">
              <a 
                href="https://wa.me/491741928943?text=Hallo,%20ich%20interessiere%20mich%20für%20Ihre%20IT-Services"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center bg-green-600 hover:bg-green-700 px-6 lg:px-8 py-3 lg:py-4 rounded-lg text-base lg:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:scale-105"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                WhatsApp schreiben
              </a>
              
              <a 
                href="tel:+491741928943"
                className="flex items-center justify-center border-2 border-blue-400 hover:bg-blue-400 hover:text-black px-6 lg:px-8 py-3 lg:py-4 rounded-lg text-base lg:text-lg font-semibold transition-all duration-300"
              >
                <svg className="w-5 h-5 lg:w-6 lg:h-6 mr-2 lg:mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Jetzt anrufen
              </a>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-4 lg:gap-6 text-gray-400 text-sm lg:text-base">
              <div className="flex items-center">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Kostenlose Erstberatung
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Antwort in 24h
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                100% unverbindlich
              </div>
            </div>
          </div>
        </section>

        {/* Main Content - Container korrigiert */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
              
              {/* Contact Form */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 lg:p-8 hover:border-gray-600 transition-all duration-300">
                <div className="mb-8">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
                    Projektanfrage senden
                  </h2>
                  <p className="text-gray-300 text-sm lg:text-base">
                    Füllen Sie das Formular aus und wir melden uns innerhalb von 24 Stunden bei Ihnen zurück.
                  </p>
                </div>

                <div className="space-y-6">
                  
                  {/* Name Fields */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">
                        Vorname *
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="Max"
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">
                        Nachname *
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                        placeholder="Mustermann"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      E-Mail Adresse *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onBlur={handleEmailBlur}
                        required
                        className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                          emailError 
                            ? 'border-red-500 focus:border-red-500' 
                            : formData.email && !emailError 
                              ? 'border-green-500 focus:border-green-500' 
                              : 'border-gray-700 focus:border-blue-500'
                        }`}
                        placeholder="max@beispiel.de"
                      />
                      {formData.email && !emailError && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {emailError && (
                      <p className="mt-2 text-sm text-red-400 flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {emailError}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                      Telefonnummer
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="+49 123 456789"
                    />
                  </div>

                  {/* Company */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Unternehmen
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                      placeholder="Beispiel GmbH (optional)"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-2">
                      Kategorie *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors"
                    >
                      {serviceCategories.map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Nachricht *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-colors resize-vertical"
                      placeholder="Beschreiben Sie Ihr Projekt oder Ihre Anfrage..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || emailError}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/25 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Wird gesendet...
                      </div>
                    ) : (
                      'Projektanfrage senden'
                    )}
                  </button>

                  {/* Status Messages */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-green-900/50 border border-green-500/50 rounded-lg text-green-400">
                      Vielen Dank! Ihre Nachricht wurde erfolgreich gesendet. Wir melden uns innerhalb von 24 Stunden bei Ihnen.
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="p-4 bg-red-900/50 border border-red-500/50 rounded-lg text-red-400">
                      Es gab einen Fehler beim Senden. Bitte versuchen Sie es erneut oder kontaktieren Sie uns direkt.
                    </div>
                  )}

                  {submitStatus === 'validation' && (
                    <div className="p-4 bg-yellow-900/50 border border-yellow-500/50 rounded-lg text-yellow-400">
                      Bitte füllen Sie alle Pflichtfelder (*) korrekt aus.
                    </div>
                  )}

                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6 lg:space-y-8">
                
                {/* Contact Details */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 lg:p-8 hover:border-gray-600 transition-all duration-300">
                  <h2 className="text-2xl lg:text-3xl font-bold text-white mb-6">
                    Kontakt
                  </h2>
                  
                  <div className="space-y-6">
                    
                    {/* Phone */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">Telefon</h3>
                        <a href="tel:+491741928943" className="text-gray-300 hover:text-blue-400 transition-colors">
                          +49 174 1928943
                        </a>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">E-Mail</h3>
                        <a href="mailto:sefkansaka@sakaits.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                          sefkansaka@sakaits.com
                        </a>
                      </div>
                    </div>

                    {/* WhatsApp */}
                    <div className="flex items-start">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-green-600 to-green-500 rounded-lg flex items-center justify-center mr-4">
                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-semibold text-white mb-1">WhatsApp</h3>
                        <a 
                          href="https://wa.me/491741928943?text=Hallo,%20ich%20interessiere%20mich%20für%20Ihre%20IT-Services"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-300 hover:text-green-400 transition-colors"
                        >
                          Direkt schreiben
                        </a>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Service Areas */}
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 lg:p-8 hover:border-gray-600 transition-all duration-300">
                  <h2 className="text-xl lg:text-2xl font-bold text-white mb-6">
                    Servicegebiet
                  </h2>
                  
                  <div className="space-y-6">
                    
                    {/* Local Service */}
                    <div>
                      <h3 className="text-base lg:text-lg font-semibold text-blue-400 mb-3">
                        Vor-Ort Service
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {['Goch', 'Kleve', 'Geldern', 'Kamp-Lintfort', 'Moers'].map((city) => (
                          <span key={city} className="px-3 py-1 bg-blue-600/20 border border-blue-600/50 rounded-full text-blue-400 text-sm">
                            {city}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        IT-Support, Hardware-Service und persönliche Beratung
                      </p>
                    </div>

                    {/* Remote Service */}
                    <div>
                      <h3 className="text-base lg:text-lg font-semibold text-purple-400 mb-3">
                        Remote Service
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-purple-600/20 border border-purple-600/50 rounded-full text-purple-400 text-sm">
                          Deutschlandweit
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        KI-Agenten, Webdesign, Cloud-Services und Online-Beratung
                      </p>
                    </div>

                  </div>
                </div>

                {/* Availability */}
                <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-500/20 rounded-2xl p-6 lg:p-8">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                    <h2 className="text-xl lg:text-2xl font-bold text-white">
                      Verfügbar für neue Projekte
                    </h2>
                  </div>
                  <p className="text-gray-300 mb-6 text-sm lg:text-base">
                    Wir haben aktuell freie Kapazitäten und können Ihr Projekt kurzfristig starten.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-300">
                      <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Schneller Start
                    </div>
                    <div className="flex items-center text-gray-300">
                      <svg className="w-4 h-4 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Flexible Termine
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

      </main>

      {/* Footer Component */}
      <Footer />

      {/* WhatsApp Button Component */}
      <WhatsAppButton />
    </>
  );
}