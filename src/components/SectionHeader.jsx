function SectionHeader({ eyebrow, title, description }) {
  return (
    <div>
      <p className="section-eyebrow">{eyebrow}</p>
      <h2 className="section-title">{title}</h2>
      <div className="divider" />
      <p className="section-desc">{description}</p>
    </div>
  )
}

export default SectionHeader
