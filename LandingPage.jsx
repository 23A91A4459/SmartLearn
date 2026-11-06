
import "./LandingPage.css";

const features = [
  {
    icon: "✦",
    title: "AI Doubt Solver",
    description:
      "Get clear explanations for difficult concepts and understand topics at your own pace.",
  },
  {
    icon: "⌁",
    title: "Personalized Roadmap",
    description:
      "Follow a learning path designed around your subjects, goals, and progress.",
  },
  {
    icon: "✓",
    title: "Practice Quizzes",
    description:
      "Test your understanding with subject-based quizzes and instant feedback.",
  },
  {
    icon: "▥",
    title: "Progress Tracking",
    description:
      "See your scores, identify weak areas, and understand how you are improving.",
  },
  {
    icon: "▤",
    title: "Subject Organization",
    description:
      "Keep your subjects and learning resources organized in one convenient place.",
  },
  {
    icon: "◷",
    title: "Learning History",
    description:
      "Review previous quiz attempts and revisit your learning journey anytime.",
  },
];

const steps = [
  {
    number: "01",
    title: "Create your account",
    description: "Join SmartLearn and start your learning journey.",
  },
  {
    number: "02",
    title: "Set up your profile",
    description: "Tell us about your academic goals and subjects.",
  },
  {
    number: "03",
    title: "Learn and practice",
    description: "Explore concepts, solve doubts, and take quizzes.",
  },
  {
    number: "04",
    title: "Track your progress",
    description: "Review your results and keep improving.",
  },
];

function LandingPage() {
  return (
    <main className="landing-page" id="home">
      <header className="landing-nav">
        <a className="landing-logo" href="/" aria-label="SmartLearn home">
          <span className="logo-mark">S</span>
          SmartLearn<span className="logo-dot">.</span>
        </a>

        <nav className="landing-links" aria-label="Main navigation">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <div className="landing-nav-actions">
          <a className="nav-login" href="/login">
            Log In
          </a>
          <a className="landing-button landing-button-small" href="/signup">
            Sign Up <span>↗</span>
          </a>
        </div>
      </header>

      <section className="landing-hero">
        <div className="hero-copy">
          <div className="hero-badge">
            <span className="status-dot" />
            YOUR PERSONAL AI LEARNING SPACE
          </div>

          <h1>
            Learn Smarter.
            <br />
            Achieve <span>More.</span>
          </h1>

          <p className="hero-description">
            Your learning journey, made simpler. Understand difficult
            concepts, practice with confidence, and track your academic
            progress — all in one place.
          </p>

          <div className="hero-actions">
            <a className="landing-button" href="/signup">
              Get Started <span>↗</span>
            </a>
            <a className="landing-button landing-button-outline" href="#features">
              Explore Features <span>↓</span>
            </a>
          </div>

          <div className="hero-note">
            <span className="note-check">✓</span>
            Built for your learning journey
            <span className="note-separator">·</span>
            Learn at your own pace
          </div>
        </div>

        <div className="hero-visual" aria-label="SmartLearn dashboard preview">
          <div className="visual-glow" />

          <div className="preview-window">
            <div className="preview-topbar">
              <div className="window-dots">
                <span />
                <span />
                <span />
              </div>
              <span className="preview-title">SMARTLEARN / OVERVIEW</span>
              <span className="preview-status">● LIVE</span>
            </div>

            <div className="preview-content">
              <div className="preview-sidebar">
                <div className="mini-brand">S.</div>
                <span className="mini-nav active">▦</span>
                <span className="mini-nav">◈</span>
                <span className="mini-nav">✓</span>
                <span className="mini-nav">▥</span>
              </div>

              <div className="preview-main">
                <p className="preview-eyebrow">YOUR LEARNING SPACE</p>
                <h3>Welcome back, Learner <span>✦</span></h3>
                <p className="preview-subtitle">
                  Ready to make progress today?
                </p>

                <div className="preview-stats">
                  <div className="preview-stat">
                    <span>Learning streak</span>
                    <strong>7 <small>days</small></strong>
                    <div className="stat-bars">
                      {[40, 65, 48, 82, 58, 95, 72].map((height, index) => (
                        <i key={index} style={{ height: `${height}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="preview-stat">
                    <span>Quiz performance</span>
                    <strong>86<small>%</small></strong>
                    <div className="mini-progress">
                      <span />
                    </div>
                    <small className="positive-note">Keep it up!</small>
                  </div>
                </div>

                <div className="preview-section-title">
                  <strong>Your learning path</strong>
                  <span>View all ↗</span>
                </div>

                <div className="preview-course">
                  <div className="course-icon purple-icon">✦</div>
                  <div className="course-copy">
                    <strong>Artificial Intelligence</strong>
                    <span>Module 03 · Practice</span>
                    <div className="course-progress"><span /></div>
                  </div>
                  <span className="course-percent">72%</span>
                </div>

                <div className="preview-course">
                  <div className="course-icon cyan-icon">⌘</div>
                  <div className="course-copy">
                    <strong>Database Management</strong>
                    <span>Module 02 · In progress</span>
                    <div className="course-progress cyan-progress"><span /></div>
                  </div>
                  <span className="course-percent">48%</span>
                </div>
              </div>
            </div>
          </div>

          <div className="floating-card floating-ai">
            <span className="floating-icon">✦</span>
            <div>
              <strong>AI Study Assistant</strong>
              <small>Ready to help you learn</small>
            </div>
            <span className="floating-online" />
          </div>

          <div className="floating-card floating-score">
            <span className="score-icon">↗</span>
            <div>
              <strong>You're improving!</strong>
              <small>Keep your momentum going</small>
            </div>
          </div>
        </div>

        <div className="hero-bottom-label">
          <span>01</span> / A BETTER WAY TO LEARN
        </div>
      </section>

      <section className="landing-features" id="features">
        <div className="section-heading">
          <span className="section-eyebrow">EVERYTHING IN ONE PLACE</span>
          <h2>
            Your learning toolkit.
            <br />
            <span>One smart platform.</span>
          </h2>
          <p>
            Spend less time feeling stuck and more time understanding,
            practicing, and growing.
          </p>
        </div>

        <div className="feature-grid">
          {features.map((feature, index) => (
            <article className="feature-card" key={feature.title}>
              <div className={`feature-icon feature-icon-${index + 1}`}>
                {feature.icon}
              </div>
              <span className="feature-number">
                0{index + 1} / FEATURE
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <a href="/signup" aria-label={`Explore ${feature.title}`}>
                Explore <span>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-process" id="how-it-works">
        <div className="section-heading">
          <span className="section-eyebrow">YOUR JOURNEY STARTS HERE</span>
          <h2>
            Four steps.
            <br />
            <span>Real progress.</span>
          </h2>
          <p>
            Getting started is simple. Build good learning habits one step
            at a time.
          </p>
        </div>

        <div className="steps-grid">
          {steps.map((step, index) => (
            <article className="step-card" key={step.number}>
              <div className="step-top">
                <span>{step.number}</span>
                <span className="step-arrow">{index === 3 ? "✓" : "↗"}</span>
              </div>
              <div className="step-line" />
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="landing-cta">
        <div className="cta-glow" />
        <span className="section-eyebrow">YOUR NEXT CHAPTER STARTS NOW</span>
        <h2>
          Ready to learn
          <br />
          <span>on your terms?</span>
        </h2>
        <p>
          Make every study session count. Your smarter learning journey
          starts with one small step.
        </p>
        <a className="landing-button" href="/signup">
          Start Learning Today <span>↗</span>
        </a>
        <div className="cta-decoration">S.</div>
      </section>

      <footer className="landing-footer">
        <a className="landing-logo" href="#home">
          <span className="logo-mark">S</span>
          SmartLearn<span className="logo-dot">.</span>
        </a>

        <p>Learn with purpose. Grow with confidence.</p>

        <div className="footer-links">
          <a href="#home">Home</a>
          <a href="#features">Features</a>
          <a href="#how-it-works">How It Works</a>
          <a href="/login">Log In</a>
        </div>

        <span className="footer-copyright">
          © {new Date().getFullYear()} SmartLearn. Built for learners.
        </span>
      </footer>
    </main>
  );
}

export default LandingPage;
