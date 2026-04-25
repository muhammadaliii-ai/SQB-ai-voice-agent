export function Sidebar({ labels, active = 'Live Call' }) {
  const icons = ['◉', '◇', '▣', '✓']

  return (
    <aside className="sidebar">
      <div className="brand-mark">
        <span>SQB</span>
        <strong>Bank AI</strong>
      </div>
      <nav>
        {labels.nav.map((item, index) => (
          <button className={item === active ? 'active' : ''} key={item} type="button">
            <span>{icons[index]}</span>
            {item}
          </button>
        ))}
      </nav>
    </aside>
  )
}
