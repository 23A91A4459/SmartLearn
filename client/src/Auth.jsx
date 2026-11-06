
import { useState } from "react";

const API_URL = "https://smartlearn-yz6s.onrender.com";
function Auth({ onLogin }) {
  const [page, setPage] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function changePage(nextPage) {
    setPage(nextPage);
    setError("");
    setMessage("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (page === "signup" && password !== confirmPassword) {
      setError("Your passwords do not match. Please try again.");
      return;
    }

    if (page === "forgot") {
      setLoading(true);

      try {
        const response = await fetch(`${API_URL}/api/auth/forgot`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "We couldn't process your request. Please try again."
          );
        }

        setMessage(
          "If an account exists for that email, we've sent password-reset instructions. Please check your inbox and spam folder."
        );
      } catch (err) {
        setError(
          err.message ||
            "Unable to connect to SmartLearn. Please try again."
        );
      } finally {
        setLoading(false);
      }

      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/${page}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          page === "signup"
            ? { name: name.trim(), email: email.trim(), password }
            : { email: email.trim(), password }
        ),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong.");
      }

      if (page === "login") {
        onLogin(data);
      } else {
        setPassword("");
        setConfirmPassword("");
        setPage("login");
        setMessage("Your account has been created. Please log in.");
      }
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect. Please check that the backend is running."
      );
    } finally {
      setLoading(false);
    }
  }

  const isLogin = page === "login";
  const isSignup = page === "signup";
  const isForgot = page === "forgot";

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="auth-title">
        <h1 className="logo">
          SmartLearn<span>.</span>
        </h1>

        <p className="eyebrow">YOUR PERSONAL LEARNING SPACE</p>

        <h2 id="auth-title">
          {isLogin
            ? "Welcome back"
            : isSignup
              ? "Create your account"
              : "Forgot your password?"}
        </h2>

        <p className="auth-description">
          {isLogin
            ? "Log in to continue your learning journey."
            : isSignup
              ? "Create your account and start learning at your own pace."
              : "Enter the email address associated with your SmartLearn account. We'll email you instructions to reset your password."}
        </p>

        {error && (
          <p className="auth-error" role="alert">
            {error}
          </p>
        )}

        {message && (
          <div className="auth-message" role="status">
            <p>{message}</p>
            {isForgot && (
              <button
                type="button"
                className="auth-link"
                onClick={() => changePage("login")}
              >
                Return to Login
              </button>
            )}
          </div>
        )}

        {!message || !isForgot ? (
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <label className="auth-field">
                Full name
                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Enter your full name"
                  minLength={2}
                  maxLength={80}
                  autoComplete="name"
                  required
                />
              </label>
            )}

            <label className="auth-field">
              Email address
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your registered email"
                autoComplete="email"
                maxLength={254}
                required
              />
            </label>

            {!isForgot && (
              <>
                <label className="auth-field">
                  Password
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    minLength={8}
                    maxLength={72}
                    autoComplete={
                      isLogin ? "current-password" : "new-password"
                    }
                    required
                  />
                </label>

                {isSignup && (
                  <label className="auth-field">
                    Confirm password
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your password"
                      minLength={8}
                      maxLength={72}
                      autoComplete="new-password"
                      required
                    />
                  </label>
                )}

                <label className="auth-show-password">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(event) =>
                      setShowPassword(event.target.checked)
                    }
                  />
                  Show password
                </label>
              </>
            )}

            {isLogin && (
              <div className="auth-forgot-row">
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => changePage("forgot")}
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : isLogin
                  ? "Log In"
                  : isSignup
                    ? "Create Account"
                    : "Send Reset Link"}
            </button>
          </form>
        ) : null}

        {!isForgot && (
          <p className="auth-switch">
            {isLogin
              ? "Don't have an account?"
              : "Already have an account?"}{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => changePage(isLogin ? "signup" : "login")}
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        )}

        {isForgot && !message && (
          <p className="auth-switch">
            Remembered your password?{" "}
            <button
              type="button"
              className="auth-link"
              onClick={() => changePage("login")}
            >
              Return to Login
            </button>
          </p>
        )}
      </section>
    </main>
  );
}

export default Auth;
