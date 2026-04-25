import { languages } from '../services/translations'

export function TopBar({ labels, language, onLanguageChange, theme, onThemeChange }) {
  return (
    <header className="topbar">
      <div>
        <p>{labels.liveCall}</p>
        <h1>{labels.appName}</h1>
      </div>
      <div className="topbar-actions">
        <div className="operator-pill">
          <span className="status-dot" />
          <div>
            <strong>{labels.operator}</strong>
            <small>{labels.online}</small>
          </div>
        </div>
        <div className="segmented" aria-label="Language">
          {languages.map((item) => (
            <button className={language === item ? 'active' : ''} key={item} type="button" onClick={() => onLanguageChange(item)}>
              {item.toUpperCase()}
            </button>
          ))}
        </div>
        <button className="icon-button" type="button" onClick={onThemeChange} title={labels.theme} aria-label={labels.theme}>
          {theme === 'dark' ? '☀' : '☾'}
        </button>
      </div>
    </header>
  )
}
