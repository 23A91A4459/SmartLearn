
import { useState } from "react";

const API_URL = "http://localhost:5000";

function ResetPassword({ onBackToLogin }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const token = new URLSearchParams(window.location.search).get("token");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!token) {
      setError("This reset link is missing or invalid. Please request a new link.");
      return;
    }

    if (password.length < 8 || password.length > 72) {
      setError("Your password must contain between 8 and 72 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Your passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset your password. Request a new link."
        );
      }

      setSuccess(true);
      window.history.replaceState({}, "", "/reset-password");
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to SmartLearn. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="reset-title">
        <h1 className="logo">
          SmartLearn<span>.</span>
        </h1>

        <p className="eyebrow">ACCOUNT SECURITY</p>

        {success ? (
          <>
            <div className="auth-success-icon" aria-hidden="true">
              ✓
            </div>
            <h2 id="reset-title">Password updated</h2>
            <p className="auth-description">
              Your password has been changed successfully. You can now sign
              in using your new password.
            </p>
            <button
              type="button"
              className="primary-button auth-submit"
              onClick={onBackToLogin}
            >
              Continue to Login
            </button>
          </>
        ) : (
          <>
            <h2 id="reset-title">Create a new password</h2>
            <p className="auth-description">
              Choose a strong password you haven't used for this account before.
            </p>

            {error && (
              <p className="auth-error" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit}>
              <label className="auth-field">
                New password
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your new password"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                />
              </label>

              <label className="auth-field">
                Confirm new password
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Enter your new password again"
                  minLength={8}
                  maxLength={72}
                  autoComplete="new-password"
                  required
                />
              </label>

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

              <p className="auth-password-hint">
                Use 8–72 characters.
              </p>

              <button
                type="submit"
                className="primary-button auth-submit"
                disabled={loading || !token}
              >
                {loading ? "Updating password..." : "Update Password"}
              </button>
            </form>

            {!token && (
              <p className="auth-switch">
                Need a new link?{" "}
                <button
                  type="button"
                  className="auth-link"
                  onClick={onBackToLogin}
                >
                  Return to Login
                </button>
              </p>
            )}
          </>
        )}
      </section>
    </main>
  );
}

export default ResetPassword;
