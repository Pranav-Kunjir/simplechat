import { useAuthActions } from "@convex-dev/auth/react";
import "./index.css";
import "./signin.css"
import signInimg from "./img/signin.png";
import { FaGithub, FaGoogle } from 'react-icons/fa';

export function SignIn() {
  const { signIn } = useAuthActions();
  return (
    <div className="container login-page">
      <div className="login-image-container">
        <img src={signInimg} alt="Person using laptop" className="login-image" />
      </div>
      <div className="login-content">
        <h1 className="login-title">Welcome Back</h1>
        <p className="login-subtitle">Sign in to continue to your account</p>
        
        <div className="login-handle">
          <button 
            className="auth-btn github-btn" 
            onClick={() => void signIn("github")}
          >
            <FaGithub className="auth-icon" />
            Sign in with GitHub
          </button>
          
          <div className="login-divider">
            <span className="divider-line"></span>
            <span className="divider-text">or</span>
            <span className="divider-line"></span>
          </div>
          
          <button 
            className="auth-btn google-btn" 
            onClick={() => void signIn("google")}
          >
            <FaGoogle className="auth-icon" />
            Sign in with Google
          </button>
        </div>
        
        <p className="login-footer">
          By continuing, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
        </p>
      </div>
    </div>
  );
}