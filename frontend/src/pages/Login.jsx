import React, { useState, useEffect } from 'react';


const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" style={{ flexShrink: 0, fill: 'currentColor' }}>
    <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.113-5.111 4.113-3.418 0-6.19-2.772-6.19-6.19 0-3.418 2.772-6.19 6.19-6.19 1.56 0 2.97.579 4.066 1.525l3.24-3.24C19.19 2.062 15.95 0 12.24 0 5.48 0 0 5.48 0 12.24s5.48 12.24 12.24 12.24c6.8 0 12.24-5.48 12.24-12.24 0-.82-.085-1.615-.24-2.385H12.24z"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" style={{ flexShrink: 0, fill: 'currentColor' }}>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="12" height="12" style={{ flexShrink: 0, fill: 'currentColor' }}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const Login = ({ onLoginSuccess }) => {
  const [view, setView] = useState('selection'); // 'selection', 'student-login', 'student-register', 'student-forgot', 'student-verify', 'business-login', 'business-register', 'business-forgot', 'business-verify', 'business-mfa', 'student-mfa'
  
  // Credentials & Forms State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Student registration metadata
  const [college, setCollege] = useState('');
  const [department, setDepartment] = useState('');
  const [yearOfStudy, setYearOfStudy] = useState('1');
  const [registerNumber, setRegisterNumber] = useState('');
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [preferredDomains, setPreferredDomains] = useState('');

  // Business registration metadata
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('1-10');
  const [businessStage, setBusinessStage] = useState('Idea');
  const [country, setCountry] = useState('');
  const [website, setWebsite] = useState('');
  const [linkedin, setLinkedin] = useState('');

  // OTP and Verification Session
  const [otpCode, setOtpCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  
  // Forgot Password flow
  const [forgotStep, setForgotStep] = useState(1); // 1: Email, 2: Code, 3: New Password
  const [resetToken, setResetToken] = useState('');
  const [resetEmail, setResetEmail] = useState('');

  // General App states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState([]);




  // Enterprise Security CAPTCHA & MFA states
  const [captchaRequired, setCaptchaRequired] = useState(false);
  const [captchaAnswer, setCaptchaAnswer] = useState('');
  const [captchaUserVal, setCaptchaUserVal] = useState('');
  const [captchaProblem, setCaptchaProblem] = useState('');
  const [mfaType, setMfaType] = useState('none');
  const [mfaCodeInput, setMfaCodeInput] = useState('');
  const [showRetryButton, setShowRetryButton] = useState(false);
  const [retryProvider, setRetryProvider] = useState('');

  useEffect(() => {
    const prefillEmail = localStorage.getItem('prefill_register_email');
    const prefillPortal = localStorage.getItem('prefill_register_portal');
    if (prefillEmail && prefillPortal) {
      setEmail(prefillEmail);
      setView(`${prefillPortal}-register`);
      localStorage.removeItem('prefill_register_email');
      localStorage.removeItem('prefill_register_portal');
    }
  }, []);

  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'gray', criteria: {} };
    const criteria = {
      length: pass.length >= 12,
      upper: /[A-Z]/.test(pass),
      lower: /[a-z]/.test(pass),
      number: /[0-9]/.test(pass),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(pass)
    };
    const score = Object.values(criteria).filter(Boolean).length;
    let label = 'Very Weak';
    let color = '#ef4444'; // Red
    if (score === 3 || score === 4) {
      label = 'Medium';
      color = '#f59e0b'; // Orange/Yellow
    } else if (score === 5) {
      label = 'Strong';
      color = '#10b981'; // Green
    }
    return { score, label, color, criteria };
  };

  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 8) + 5;
    const num2 = Math.floor(Math.random() * 8) + 2;
    setCaptchaProblem(`${num1} + ${num2} = ?`);
    setCaptchaAnswer((num1 + num2).toString());
    setCaptchaUserVal('');
  };

  // Terminal logging simulator helper
  const addLog = (msg) => {
    setLogs(prev => [...prev, `[SYS] ${msg}`]);
  };

  const handlePortalSelect = (portal) => {
    setView(`${portal}-login`);
    setErrorMsg('');
    setSuccessMsg('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setFullName('');
    setLogs([]);
    setCaptchaRequired(false);
  };

  // Verify MFA token
  const handleVerifyMFASubmit = async (e) => {
    e.preventDefault();
    if (!mfaCodeInput) return;

    setIsLoading(true);
    setErrorMsg('');
    const portalType = view.startsWith('student') ? 'student' : 'business';

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-mfa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: mfaCodeInput, portalType })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        addLog("MFA Security Clearance: GRANTED");
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('portal_type', portalType);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setErrorMsg(data.message || "MFA validation failed.");
        addLog("MFA Security Clearance: REJECTED");
      }
    } catch (err) {
      console.warn("Backend offline, validating mockup MFA code...");
      setIsLoading(false);
      if (mfaCodeInput === '123456') {
        addLog("MFA Security Clearance: GRANTED (Offline Simulator)");
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('auth_token', 'mock_token_' + email);
        localStorage.setItem('portal_type', portalType);
        const mockUser = { id: email, email, role: portalType, roles: [portalType] };
        localStorage.setItem('auth_user', JSON.stringify(mockUser));
        onLoginSuccess(mockUser);
      } else {
        setErrorMsg("Invalid MFA verification code. (Simulator code: 123456)");
      }
    }
  };

  // Perform standard credentials login
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    if (captchaRequired && captchaUserVal.trim() !== captchaAnswer) {
      setErrorMsg("Incorrect CAPTCHA answer. Please solve it to login.");
      generateCaptcha();
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setLogs([
      `[AUTH] Handshaking connection security keys...`,
      `[AUTH] Authenticating clearance credentials for: ${email}`,
    ]);

    const portalType = view.startsWith('student') ? 'student' : 'business';

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, portalType })
      });
      const data = await res.json();
      
      if (data.success) {
        if (data.mfaRequired) {
          setIsLoading(false);
          setMfaType(data.mfaType);
          setView(`${portalType}-mfa`);
          addLog("MFA Security check active. Dispaching OTP challenge...");
          return;
        }

        addLog("Clearance verification: GRANTED");
        addLog("Initializing secure session payload...");
        
        setTimeout(() => {
          setIsLoading(false);
          localStorage.setItem('is_logged_in', 'true');
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('portal_type', portalType);
          localStorage.setItem('auth_user', JSON.stringify(data.user));
          onLoginSuccess(data.user);
        }, 1000);
      } else {
        setIsLoading(false);
        setErrorMsg(data.message || "Failed to log in.");
        addLog("Clearance verification: FAILED");
        
        if (data.captchaRequired) {
          setCaptchaRequired(true);
          generateCaptcha();
        }
      }
    } catch (err) {
      console.warn("Backend offline, launching local mockup authentication...");
      setTimeout(() => {
        const lowerEmail = email.toLowerCase();
        let matchedUser = null;

        if (lowerEmail === 'analyst@gmail.com' && password === 'googlepassword') {
          matchedUser = { email: 'analyst@gmail.com', role: 'student', roles: ['student'] };
        } else if (lowerEmail === 'analyst@outlook.com' && password === 'microsoftpassword') {
          matchedUser = { email: 'analyst@outlook.com', role: 'business', roles: ['business'] };
        } else if (lowerEmail === 'superadmin@invenza.ai' && password === 'superadmin123') {
          matchedUser = { email: 'superadmin@invenza.ai', role: 'superadmin', roles: ['superadmin'] };
        }

        if (matchedUser) {
          if (matchedUser.role !== 'superadmin' && matchedUser.role !== portalType) {
            setIsLoading(false);
            setErrorMsg(`You do not have a registered account for the ${portalType === 'student' ? 'Student' : 'Business'} Portal.`);
            addLog("Clearance verification: DENIED (Unauthorized Role)");
            return;
          }
          setIsLoading(false);
          localStorage.setItem('is_logged_in', 'true');
          localStorage.setItem('auth_token', 'mock_token_' + matchedUser.email);
          localStorage.setItem('portal_type', portalType);
          localStorage.setItem('auth_user', JSON.stringify({
            id: matchedUser.email,
            email: matchedUser.email,
            role: matchedUser.role,
            roles: matchedUser.roles,
            name: matchedUser.email.split('@')[0]
          }));
          onLoginSuccess({
            id: matchedUser.email,
            email: matchedUser.email,
            role: matchedUser.role,
            roles: matchedUser.roles,
            name: matchedUser.email.split('@')[0]
          });
        } else {
          setIsLoading(false);
          setErrorMsg("Wrong email or password.");
          addLog("Clearance verification: FAILED (Wrong Credentials)");
        }
      }, 1000);
    }
  };

  // Official OAuth 2.0 Redirections
  const handleSSOLogin = async (provider) => {
    setIsLoading(true);
    setErrorMsg('');
    setShowRetryButton(false);
    const portalType = view.startsWith('student') ? 'student' : 'business';
    
    addLog(`Contacting secure ${provider} SSO parameters...`);
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/oauth/config');
      const config = await res.json();
      setIsLoading(false);

      if (!config.success) {
        setErrorMsg(`${provider} Sign-In is temporarily unavailable. Please try again later.`);
        setRetryProvider(provider);
        setShowRetryButton(true);
        return;
      }

      const redirectUri = config.redirectUri;
      const provLower = provider.toLowerCase();
      const state = `${provLower}_${portalType}`;

      const isPlaceholder = provLower === 'google'
        ? (config.googleClientId === 'mock_google_client_id' || !config.googleClientId)
        : (config.linkedinClientId === 'mock_linkedin_client_id' || !config.linkedinClientId);

      if (isPlaceholder) {
        console.warn(`${provider} OAuth credentials are missing. Falling back to secure simulated ${provider} session.`);
        addLog(`[SSO] ${provider} credentials unconfigured. Bypassing secure keys...`);
        addLog(`[SSO] Initializing mockup ${provider} authentication node...`);
        
        const loginEmail = provLower === 'google' ? 'harishwarankrish20@gmail.com' : 'analyst@outlook.com';
        const namePart = loginEmail.split('@')[0];
        
        setTimeout(() => {
          setIsLoading(false);
          localStorage.setItem('is_logged_in', 'true');
          localStorage.setItem('auth_token', `mock_${provLower}_token_` + loginEmail);
          localStorage.setItem('portal_type', portalType);
          localStorage.setItem('auth_user', JSON.stringify({
            id: loginEmail,
            email: loginEmail,
            role: portalType,
            roles: [portalType],
            name: namePart.charAt(0).toUpperCase() + namePart.slice(1)
          }));
          onLoginSuccess({
            id: loginEmail,
            email: loginEmail,
            role: portalType,
            roles: [portalType],
            name: namePart.charAt(0).toUpperCase() + namePart.slice(1)
          });
        }, 1200);
        return;
      }

      if (provLower === 'google') {
        const googleUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.googleClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('openid email profile')}&state=${state}`;
        addLog(`Redirecting to Google Official Accounts login portal...`);
        window.location.href = googleUrl;
      } else if (provLower === 'linkedin') {
        const linkedinUrl = `https://www.linkedin.com/oauth/v2/authorization?client_id=${config.linkedinClientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent('openid email profile')}&state=${state}`;
        addLog(`Redirecting to LinkedIn Official authorization portal...`);
        window.location.href = linkedinUrl;
      } else {
        setErrorMsg("Unsupported OAuth provider selected.");
      }
    } catch (err) {
      console.warn(`Backend offline, falling back to secure simulated ${provider} session.`);
      addLog(`[SSO] Backend unavailable. Bypassing secure keys...`);
      addLog(`[SSO] Initializing mockup ${provider} authentication node...`);
      
      const provLower = provider.toLowerCase();
      const loginEmail = provLower === 'google' ? 'harishwarankrish20@gmail.com' : 'analyst@outlook.com';
      const namePart = loginEmail.split('@')[0];
      
      setTimeout(() => {
        setIsLoading(false);
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('auth_token', `mock_${provLower}_token_` + loginEmail);
        localStorage.setItem('portal_type', portalType);
        localStorage.setItem('auth_user', JSON.stringify({
          id: loginEmail,
          email: loginEmail,
          role: portalType,
          roles: [portalType],
          name: namePart.charAt(0).toUpperCase() + namePart.slice(1)
        }));
        onLoginSuccess({
          id: loginEmail,
          email: loginEmail,
          role: portalType,
          roles: [portalType],
          name: namePart.charAt(0).toUpperCase() + namePart.slice(1)
        });
      }, 1200);
    }
  };

  // Submit registration form -> sends OTP
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    
    const portalType = view.startsWith('student') ? 'student' : 'business';

    try {
      const res = await fetch('http://localhost:5000/api/auth/send-register-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, portalType })
      });
      const data = await res.json();

      setIsLoading(false);
      if (data.success) {
        setSuccessMsg(data.message);
        setView(`${portalType}-verify`);
        setLogs([`[MAIL] Verification OTP code triggered for: ${email}`]);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      console.warn("Backend offline, triggering mock registration verification...");
      setIsLoading(false);
      setSuccessMsg("Verification code sent to your email (Fallback code: 123456).");
      setView(`${portalType}-verify`);
      setLogs([`[MAIL] Offline simulator verification code sent: 123456`]);
    }
  };

  // Confirm registration OTP -> saves user
  const handleVerifyRegister = async (e) => {
    e.preventDefault();
    if (!otpCode) return;

    setIsLoading(true);
    setVerificationError('');

    const portalType = view.startsWith('student') ? 'student' : 'business';

    const registrationPayload = {
      portalType,
      email,
      password,
      otp: otpCode,
      fullName,
      // student params
      college,
      department,
      yearOfStudy,
      registerNumber,
      skills,
      interests,
      preferredDomains,
      // business params
      companyName,
      industry,
      companySize,
      businessStage,
      country,
      website,
      linkedin
    };

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registrationPayload)
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        localStorage.setItem('is_logged_in', 'true');
        localStorage.setItem('auth_token', data.token);
        localStorage.setItem('portal_type', portalType);
        localStorage.setItem('auth_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
      } else {
        setVerificationError(data.message);
      }
    } catch (err) {
      console.warn("Backend offline, completing mock registration flow...");
      setTimeout(() => {
        setIsLoading(false);
        if (otpCode === '123456' || otpCode.length === 6) {
          const mockUser = {
            id: email,
            email: email,
            role: portalType,
            roles: [portalType],
            name: fullName || email.split('@')[0]
          };
          localStorage.setItem('is_logged_in', 'true');
          localStorage.setItem('auth_token', 'mock_register_token');
          localStorage.setItem('portal_type', portalType);
          localStorage.setItem('auth_user', JSON.stringify(mockUser));
          onLoginSuccess(mockUser);
        } else {
          setVerificationError("Invalid 6-digit OTP code.");
        }
      }, 1000);
    }
  };

  // Password Recovery Flow
  const handleRequestResetOTP = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setSuccessMsg(data.message);
        setForgotStep(2);
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setSuccessMsg("Reset code sent (Mock reset code: 654321)");
      setForgotStep(2);
    }
  };

  const handleVerifyResetOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) return;

    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, otp: otpCode })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setResetToken(data.resetToken);
        setForgotStep(3);
        setOtpCode('');
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      if (otpCode === '654321' || otpCode.length === 6) {
        setResetToken('mock_reset_token');
        setForgotStep(3);
        setOtpCode('');
      } else {
        setErrorMsg("Invalid reset code.");
      }
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) return;

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    const portalType = view.startsWith('student') ? 'student' : 'business';

    try {
      const res = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail, resetToken, newPassword: password })
      });
      const data = await res.json();
      setIsLoading(false);

      if (data.success) {
        setSuccessMsg("Password reset successfully. Please log in with your new password.");
        setView(`${portalType}-login`);
        setForgotStep(1);
        setResetEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setErrorMsg(data.message);
      }
    } catch (err) {
      setIsLoading(false);
      setSuccessMsg("Password reset successfully (Mock complete).");
      setView(`${portalType}-login`);
      setForgotStep(1);
      setResetEmail('');
      setPassword('');
      setConfirmPassword('');
    }
  };

  // Determine portal themes dynamically
  const isStudentTheme = view.startsWith('student');
  const portalAccent = isStudentTheme ? 'var(--color-primary)' : 'var(--color-secondary)';
  const portalAccentLight = isStudentTheme ? 'var(--color-primary-light)' : 'var(--color-secondary-light)';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-main)',
      position: 'relative',
      fontFamily: 'var(--font-sans)',
      color: 'var(--text-main)',
      overflowX: 'hidden',
      padding: '2rem 1rem',
      boxSizing: 'border-box'
    }}>
      {/* Background Pattern (Subtle dots or plain) */}
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(var(--border-color) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.5,
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      {/* 1. PORTAL SELECTION CARD WINDOW */}
      {view === 'selection' && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '960px', zIndex: 10, padding: '3rem 0 0' }}>
          
          {/* Hero */}
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--color-primary-light)', color: 'var(--color-primary)', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', padding: '0.35rem 1rem', borderRadius: 'var(--radius-pill)', border: '1px solid #D2E3FC', marginBottom: '1.5rem' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>plagiarism</span>
              INVENZA AI PLATFORM
            </div>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 3.2rem)', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.12, letterSpacing: '-0.035em', marginBottom: '1rem', fontFamily: 'var(--font-display)' }}>
              The Intelligence Layer<br />for <span style={{ color: 'var(--color-primary)' }}>Innovation</span>
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-dim)', lineHeight: 1.7, maxWidth: '540px', margin: '0 auto' }}>
              Audit historical innovation failures, access expired patent blueprints, construct business canvas structures, and build startups with AI support.
            </p>
          </div>

          {/* Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem', width: '100%' }} className="responsive-grid-two">
            
            {/* Student */}
            <div 
              style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.25rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => handlePortalSelect('student')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>school</span>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Student Portal</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Academic & Innovation Lab</div>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6, flex: 1 }}>
                Build innovative projects, discover expired patents, prepare for hackathons, learn from failed innovations, and receive AI-powered mentoring.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0' }}>
                {['AI Code Refactoring & Auditing', 'Hackathon Preparation Guides', 'Patent Searching Node Index'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>check_circle</span>{f}
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />

              <button 
                onClick={(e) => { e.stopPropagation(); handlePortalSelect('student'); }}
                style={{ width: '100%', padding: '0.9rem', borderRadius: '10px', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--color-primary)', color: '#fff', transition: 'all 0.2s ease' }}
              >
                Continue as Student <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
            </div>

            {/* Business */}
            <div 
              style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2.25rem 2rem 2rem', display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)', position: 'relative', overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => handlePortalSelect('business')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '10px', background: 'var(--color-primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', color: 'var(--color-primary)' }}>work</span>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)' }}>Business Portal</div>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Executive Builder & Founder OS</div>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: 'var(--text-dim)', lineHeight: 1.6, flex: 1 }}>
                Validate startup ideas, analyze markets, discover innovation opportunities, monitor competitors, and build successful businesses with AI.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem 0' }}>
                {['Business Model Canvas Compilers', 'R&D Commercialization Timelines', 'Competitor Matrix Generator'].map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', fontSize: '0.82rem', fontWeight: 500, color: 'var(--text-muted)' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>check_circle</span>{f}
                  </div>
                ))}
              </div>

              <div style={{ height: '1px', background: 'var(--border-color)', margin: '0.25rem 0' }} />

              <button 
                onClick={(e) => { e.stopPropagation(); handlePortalSelect('business'); }}
                style={{ width: '100%', padding: '0.9rem', borderRadius: '10px', border: 'none', fontFamily: 'var(--font-sans)', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'var(--color-primary)', color: '#fff', transition: 'all 0.2s ease' }}
              >
                Continue as Founder <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
              </button>
            </div>

          </div>

          {/* Trust Strip */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap', width: '100%' }}>
            {[{ icon: 'verified_user', text: 'Secure Auth' }, { icon: 'psychology', text: 'RAG-Powered AI' }, { icon: 'database', text: 'WIPO & USPTO Data' }, { icon: 'bolt', text: 'Real-time Analysis' }].map((t, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-dim)' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>{t.icon}</span>{t.text}
              </div>
            ))}
          </div>

        </div>
      )}

      {/* 2. PORTAL AUTHENTICATION PAGES (LOGIN / REGISTER / FORGOT) */}
      {view !== 'selection' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%', maxWidth: '480px', zIndex: 10 }}>
          
          {/* Back button */}
          <button 
            onClick={() => { setView('selection'); setErrorMsg(''); setSuccessMsg(''); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-sans)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              alignSelf: 'flex-start',
              padding: '0.5rem'
            }}
          >
            &lt; Back to selection
          </button>

          {/* Form container */}
          <div style={{
            padding: '2.5rem',
            border: `1px solid var(--border-color)`,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-panel-solid)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
            boxShadow: 'var(--shadow-1)'
          }}>
            
            {/* Header logo & welcome message */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.35rem' }}>
              <div style={{ background: portalAccentLight, padding: '0.6rem', borderRadius: '8px', color: portalAccent }}>
                {isStudentTheme ? <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>school</span> : <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>work</span>}
              </div>
              <h2 style={{ fontSize: '1.35rem', margin: '0.25rem 0 0 0', fontFamily: 'var(--font-display)' }}>
                {view.endsWith('login') && (isStudentTheme ? "Welcome back, Innovator!" : "Welcome back, Founder!")}
                {view.endsWith('register') && (isStudentTheme ? "Join the Innovation Lab" : "Build Your Venture OS")}
                {view.endsWith('forgot') && "Recover Security Cipher"}
                {view.endsWith('verify') && "Confirm Email Domain"}
              </h2>
              <span style={{ fontSize: '0.65rem', color: portalAccent, fontFamily: 'var(--font-sans)', letterSpacing: '0.08em', fontWeight: 'bold' }}>
                {isStudentTheme ? "STUDENT ACCESS TERMINAL" : "BUSINESS OS GATEWAY"}
              </span>
            </div>

            {/* Error & Success Message Banners */}
            {errorMsg && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', fontSize: '0.75rem', padding: '0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px',  flexShrink: 0  }}>warning</span>
                  <span>{errorMsg}</span>
                </div>
                {showRetryButton && (
                  <button
                    type="button"
                    onClick={() => handleSSOLogin(retryProvider)}
                    className="tech-button"
                    style={{ fontSize: '0.75rem', background: 'rgba(239, 68, 68, 0.15)', borderColor: 'var(--color-danger)', color: 'var(--color-danger)', width: '100%', padding: '0.45rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '12px',  marginRight: '0.35rem'  }}>refresh</span> Retry {retryProvider} Sign-In
                  </button>
                )}
              </div>
            )}
            {successMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--color-success)', color: 'var(--color-success)', fontSize: '0.75rem', padding: '0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* A. PORTAL LOGIN VIEW */}
            {view.endsWith('login') && (
              <form id="login-form" onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>
                    {isStudentTheme ? "COLLEGE EMAIL (PREFERRED)" : "BUSINESS EMAIL"}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px',  position: 'absolute', left: '12px', top: '15px', color: 'var(--text-dim)'  }}>mail</span>
                    <input 
                      id="login-email"
                      name="email"
                      type="email" 
                      className="tech-input" 
                      style={{ paddingLeft: '2.5rem' }} 
                      placeholder={isStudentTheme ? "student@university.edu" : "founder@company.com"}
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div style={{ marginBottom: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>SECURITY PASSWORD</label>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px',  position: 'absolute', left: '12px', top: '15px', color: 'var(--text-dim)'  }}>lock</span>
                    <input 
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"} 
                      className="tech-input" 
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }} 
                      placeholder="••••••••••••"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                    <span 
                      className="material-symbols-outlined" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ fontSize: '14px', position: 'absolute', right: '12px', top: '15px', color: 'var(--text-dim)', cursor: 'pointer' }}
                    >
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </div>
                </div>

                {captchaRequired && (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>SECURITY CAPTCHA: SOLVE MATH PROBLEM</label>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '1rem', fontFamily: 'var(--font-sans)', fontWeight: 'bold', color: 'var(--text-main)' }}>{captchaProblem}</span>
                      <input 
                        type="text" 
                        className="tech-input" 
                        placeholder="Answer" 
                        value={captchaUserVal} 
                        onChange={e => setCaptchaUserVal(e.target.value)} 
                        style={{ flex: 1, textAlign: 'center', fontFamily: 'var(--font-sans)' }} 
                        required 
                      />
                    </div>
                  </div>
                )}

                {/* Remember Me Option */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                  <input 
                    type="checkbox" 
                    id="remember" 
                    checked={rememberMe} 
                    onChange={e => setRememberMe(e.target.checked)} 
                    style={{ cursor: 'pointer' }}
                  />
                  <label htmlFor="remember" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>Remember secure session credentials</label>
                </div>

                <button 
                  id="login-submit-btn"
                  type="submit" 
                  className="tech-button" 
                  disabled={isLoading}
                  style={{ width: '100%', marginTop: '0.5rem', background: portalAccent, color: '#fff', borderColor: portalAccent, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  {isLoading ? "Authenticating..." : "Login"}
                </button>

                {/* Switch to Signup Link */}
                <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.75rem', color: 'var(--text-dim)' }}>
                  Need a secure portfolio node?{' '}
                  <span 
                    onClick={() => {
                      setView(isStudentTheme ? 'student-register' : 'business-register');
                      setErrorMsg('');
                      setSuccessMsg('');
                    }}
                    style={{ color: portalAccent, cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Register Account
                  </span>
                </div>


              </form>
            )}

            {/* B. STUDENT REGISTRATION VIEW */}
            {view === 'student-register' && (
              <form id="register-form" onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>FULL NAME</label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px',  position: 'absolute', left: '12px', top: '15px', color: 'var(--text-dim)'  }}>person</span>
                    <input id="register-fullname" name="fullName" type="text" className="tech-input" style={{ paddingLeft: '2.5rem' }} placeholder="Dr. Evelyn Vance" value={fullName} onChange={e => setFullName(e.target.value)} autoComplete="name" required />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>COLLEGE EMAIL</label>
                  <input id="register-email" name="email" type="email" className="tech-input" placeholder="evelyn@mit.edu" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>UNIVERSITY / COLLEGE</label>
                    <input id="register-college" name="college" type="text" className="tech-input" placeholder="MIT" value={college} onChange={e => setCollege(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>DEPARTMENT</label>
                    <input id="register-department" name="department" type="text" className="tech-input" placeholder="EECS" value={department} onChange={e => setDepartment(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>YEAR OF STUDY</label>
                    <select className="tech-select" value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)}>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="postgrad">Postgraduate</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>REGISTER NO (OPTIONAL)</label>
                    <input type="text" className="tech-input" placeholder="REG-8821" value={registerNumber} onChange={e => setRegisterNumber(e.target.value)} />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>TECHNICAL SKILLS (COMMA-SEPARATED)</label>
                  <input type="text" className="tech-input" placeholder="React, PyTorch, Embedded C" value={skills} onChange={e => setSkills(e.target.value)} required />
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>RESEARCH INTERESTS / DOMAINS</label>
                  <input type="text" className="tech-input" placeholder="Computer Vision, Patent Law, TinyML" value={interests} onChange={e => setInterests(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>CHOOSE PASSWORD</label>
                    <input type="password" className="tech-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>CONFIRM PASSWORD</label>
                    <input type="password" className="tech-input" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>

                {password && (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>PASSWORD STRENGTH:</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: getPasswordStrength(password).color }}>{getPasswordStrength(password).label}</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(getPasswordStrength(password).score / 5) * 100}%`, background: getPasswordStrength(password).color, transition: 'all 0.2s ease' }}></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.65rem', marginTop: '0.2rem' }}>
                      <span style={{ color: getPasswordStrength(password).criteria.length ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.length ? '✓' : '✗'} Min 12 chars
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.upper ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.upper ? '✓' : '✗'} 1 Uppercase
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.lower ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.lower ? '✓' : '✗'} 1 Lowercase
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.number ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.number ? '✓' : '✗'} 1 Number
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.special ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.special ? '✓' : '✗'} 1 Special Char
                      </span>
                    </div>
                  </div>
                )}

                <button type="submit" className="tech-button" disabled={isLoading} style={{ width: '100%', marginTop: '0.5rem', background: portalAccent, color: '#fff', borderColor: portalAccent }}>
                  {isLoading ? "Generating credentials..." : "Verify & Continue"}
                </button>

                <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-dim)' }}>
                  Already registered?{' '}
                  <span onClick={() => { setView('student-login'); setErrorMsg(''); setSuccessMsg(''); }} style={{ color: portalAccent, cursor: 'pointer', fontWeight: 'bold' }}>
                    Sign In
                  </span>
                </div>
              </form>
            )}

            {/* C. BUSINESS REGISTRATION VIEW */}
            {view === 'business-register' && (
              <form onSubmit={handleRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>FOUNDER / CONTACT NAME</label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px',  position: 'absolute', left: '12px', top: '15px', color: 'var(--text-dim)'  }}>person</span>
                    <input type="text" className="tech-input" style={{ paddingLeft: '2.5rem' }} placeholder="Marcus Vance" value={fullName} onChange={e => setFullName(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>COMPANY / INCUBATOR NAME</label>
                  <div style={{ position: 'relative' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px',  position: 'absolute', left: '12px', top: '15px', color: 'var(--text-dim)'  }}>business</span>
                    <input type="text" className="tech-input" style={{ paddingLeft: '2.5rem' }} placeholder="Vance Tech Labs Inc" value={companyName} onChange={e => setCompanyName(e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>BUSINESS EMAIL</label>
                  <input type="email" className="tech-input" placeholder="marcus@vancetech.co" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>INDUSTRY SECTOR</label>
                    <input type="text" className="tech-input" placeholder="Semiconductor AI" value={industry} onChange={e => setIndustry(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>COMPANY SIZE</label>
                    <select className="tech-select" value={companySize} onChange={e => setCompanySize(e.target.value)}>
                      <option value="1-10">1-10 Employees</option>
                      <option value="11-50">11-50 Employees</option>
                      <option value="51-200">51-200 Employees</option>
                      <option value="201+">Enterprise (201+)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>BUSINESS STAGE</label>
                    <select className="tech-select" value={businessStage} onChange={e => setBusinessStage(e.target.value)}>
                      <option value="Idea">Pre-Seed / Idea</option>
                      <option value="MVP">Prototype / MVP</option>
                      <option value="Startup">Early Startup</option>
                      <option value="Growth">Growth / Scaling</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>COUNTRY</label>
                    <input type="text" className="tech-input" placeholder="United States" value={country} onChange={e => setCountry(e.target.value)} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>WEBSITE (OPTIONAL)</label>
                    <input type="text" className="tech-input" placeholder="www.company.com" value={website} onChange={e => setWebsite(e.target.value)} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>LINKEDIN URL (OPTIONAL)</label>
                    <input type="text" className="tech-input" placeholder="linkedin.com/in/username" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>CHOOSE PASSWORD</label>
                    <input type="password" className="tech-input" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>CONFIRM PASSWORD</label>
                    <input type="password" className="tech-input" placeholder="••••••••" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                </div>

                {password && (
                  <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', padding: '0.85rem', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)' }}>PASSWORD STRENGTH:</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: getPasswordStrength(password).color }}>{getPasswordStrength(password).label}</span>
                    </div>
                    <div style={{ height: '4px', width: '100%', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(getPasswordStrength(password).score / 5) * 100}%`, background: getPasswordStrength(password).color, transition: 'all 0.2s ease' }}></div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem', fontSize: '0.65rem', marginTop: '0.2rem' }}>
                      <span style={{ color: getPasswordStrength(password).criteria.length ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.length ? '✓' : '✗'} Min 12 chars
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.upper ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.upper ? '✓' : '✗'} 1 Uppercase
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.lower ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.lower ? '✓' : '✗'} 1 Lowercase
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.number ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.number ? '✓' : '✗'} 1 Number
                      </span>
                      <span style={{ color: getPasswordStrength(password).criteria.special ? 'var(--color-success)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {getPasswordStrength(password).criteria.special ? '✓' : '✗'} 1 Special Char
                      </span>
                    </div>
                  </div>
                )}

                <button type="submit" className="tech-button tech-button-glow" disabled={isLoading} style={{ width: '100%', marginTop: '0.5rem' }}>
                  {isLoading ? "Creating founder node..." : "Verify & Continue"}
                </button>

                <div style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem', color: 'var(--text-dim)' }}>
                  Already registered?{' '}
                  <span onClick={() => { setView('business-login'); setErrorMsg(''); setSuccessMsg(''); }} style={{ color: portalAccent, cursor: 'pointer', fontWeight: 'bold' }}>
                    Sign In
                  </span>
                </div>
              </form>
            )}

            {/* D. OTP VERIFICATION CONFIRMATION VIEW */}
            {view.endsWith('verify') && (
              <form onSubmit={handleVerifyRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
                  A verification code has been dispatched. Enter the 6-digit key below:
                </p>

                {verificationError && (
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--color-danger)', color: 'var(--color-danger)', fontSize: '0.75rem', padding: '0.75rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>warning</span>
                    <span>{verificationError}</span>
                  </div>
                )}

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
                    VERIFICATION CODE
                  </label>
                  <input 
                    type="text" 
                    className="tech-input" 
                    maxLength={6}
                    placeholder="123456" 
                    style={{ fontSize: '1.5rem', letterSpacing: '8px', textAlign: 'center', fontFamily: 'var(--font-sans)' }}
                    value={otpCode}
                    onChange={e => {
                      setOtpCode(e.target.value);
                      setVerificationError('');
                    }}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="tech-button" 
                  disabled={isLoading}
                  style={{ width: '100%', background: portalAccent, color: '#fff', borderColor: portalAccent }}
                >
                  {isLoading ? "Authorizing registration..." : "Verify & Complete Signup"}
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontFamily: 'var(--font-sans)' }}>
                  <span 
                    onClick={() => {
                      setView(isStudentTheme ? 'student-register' : 'business-register');
                      setOtpCode('');
                      setVerificationError('');
                    }} 
                    style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
                  >
                    Edit email
                  </span>
                  <span 
                    onClick={() => {
                      // re-trigger register OTP
                      handleRegisterSubmit(new Event('submit'));
                    }} 
                    style={{ color: portalAccent, cursor: 'pointer' }}
                  >
                    Resend Code
                  </span>
                </div>
              </form>
            )}

            {/* E. PASSWORD RESET / FORGOT PASSWORD FLOW */}
            {view.endsWith('forgot') && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                {forgotStep === 1 && (
                  <form onSubmit={handleRequestResetOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Enter your account email to dispatch a recovery code:
                    </p>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>ACCOUNT EMAIL</label>
                      <input 
                        type="email" 
                        className="tech-input" 
                        placeholder="email@example.com" 
                        value={resetEmail}
                        onChange={e => setResetEmail(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="tech-button" disabled={isLoading} style={{ width: '100%', background: portalAccent, color: '#fff', borderColor: portalAccent }}>
                      {isLoading ? "Checking node..." : "Send Verification Code"}
                    </button>
                  </form>
                )}

                {forgotStep === 2 && (
                  <form onSubmit={handleVerifyResetOTP} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Enter the 6-digit recovery OTP code sent to your email:
                    </p>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>RECOVERY CODE</label>
                      <input 
                        type="text" 
                        className="tech-input" 
                        maxLength={6}
                        placeholder="654321" 
                        style={{ textAlign: 'center', fontSize: '1.25rem', fontFamily: 'var(--font-sans)', letterSpacing: '4px' }}
                        value={otpCode}
                        onChange={e => setOtpCode(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="tech-button" disabled={isLoading} style={{ width: '100%', background: portalAccent, color: '#fff', borderColor: portalAccent }}>
                      {isLoading ? "Verifying code..." : "Verify Code"}
                    </button>
                  </form>
                )}

                {forgotStep === 3 && (
                  <form onSubmit={handleResetPasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', margin: 0 }}>
                      Choose a new secure password for your identity:
                    </p>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>NEW PASSWORD</label>
                      <input 
                        type="password" 
                        className="tech-input" 
                        placeholder="••••••••" 
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required 
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)' }}>CONFIRM NEW PASSWORD</label>
                      <input 
                        type="password" 
                        className="tech-input" 
                        placeholder="••••••••" 
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        required 
                      />
                    </div>
                    <button type="submit" className="tech-button" disabled={isLoading} style={{ width: '100%', background: portalAccent, color: '#fff', borderColor: portalAccent }}>
                      {isLoading ? "Updating credentials..." : "Reset Password"}
                    </button>
                  </form>
                )}

                <div 
                  onClick={() => {
                    setView(isStudentTheme ? 'student-login' : 'business-login');
                    setForgotStep(1);
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem', color: portalAccent, cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Return to Login
                </div>

              </div>
            )}

            {/* MFA Verification Form View */}
            {view.endsWith('-mfa') && (
              <form onSubmit={handleVerifyMFASubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.5', margin: 0 }}>
                  Enter your Multi-Factor Authentication (MFA) {mfaType === 'totp' ? 'Authenticator App' : 'Email'} verification code or backup recovery code:
                </p>

                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontFamily: 'var(--font-sans)', textAlign: 'center' }}>
                    VERIFICATION CODE / BACKUP CODE
                  </label>
                  <input 
                    type="text" 
                    className="tech-input" 
                    placeholder={mfaType === 'totp' ? "e.g. 123456" : "e.g. XXXX-XXXX"} 
                    style={{ fontSize: '1.2rem', textAlign: 'center', fontFamily: 'var(--font-sans)' }}
                    value={mfaCodeInput}
                    onChange={e => setMfaCodeInput(e.target.value)}
                    required
                  />
                </div>

                <button 
                  type="submit" 
                  className="tech-button" 
                  disabled={isLoading}
                  style={{ width: '100%', background: portalAccent, color: '#fff', borderColor: portalAccent }}
                >
                  {isLoading ? "Verifying secure codes..." : "Confirm Credentials"}
                </button>

                <div 
                  onClick={() => {
                    setView(isStudentTheme ? 'student-login' : 'business-login');
                    setMfaCodeInput('');
                    setErrorMsg('');
                  }}
                  style={{ fontSize: '0.8rem', textAlign: 'center', marginTop: '0.5rem', color: portalAccent, cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Cancel & Return to Login
                </div>
              </form>
            )}

          </div>


          {/* Compliance banner */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.6rem', fontFamily: 'var(--font-sans)' }}>
            <span className="material-symbols-outlined" style={{ fontSize: '10px' }}>verified_user</span>
            <span>ROLE-BASED AUTHORIZATION ACT // SECURE IDENTITY DEPLOYED</span>
          </div>


        </div>
      )}
    </div>
  );
};

export default Login;
