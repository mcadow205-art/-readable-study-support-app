<div className="template-workspace-card">
  <div className="template-header">
    <div>
      <span className="eyebrow">Work type template</span>
      <h2>{getTemplateInfo(activeStudyFile.type).label}</h2>
      <p>{getTemplateInfo(activeStudyFile.type).description}</p>
    </div>
  </div>

  <div className="template-layout">
    <div className="template-section-list">
      {activeStudyFile.templateSections.map((section) => (
        <button
          key={section.id}
          className={
            activeStudyFile.activeTemplateSectionId === section.id
              ? "template-section-button active"
              : "template-section-button"
          }
          onClick={() =>
            setActiveTemplateSection(activeStudyFile.id, section.id)
          }
        >
          <strong>{section.title}</strong>
          <span>
            {section.content.trim()
              ? "Started"
              : "Empty"}
          </span>
        </button>
      ))}
    </div>

    <div className="template-editor">
      {(() => {
        const section =
          activeStudyFile.templateSections.find(
            (item) => item.id === activeStudyFile.activeTemplateSectionId
          ) || activeStudyFile.templateSections[0];

        if (!section) {
          return <p>No template section found.</p>;
        }

        return (
          <>
            <span className="eyebrow">Current section</span>
            <h3>{section.title}</h3>
            <p>{section.prompt}</p>

            <textarea
              value={section.content}
              onChange={(event) =>
                updateTemplateSection(
                  activeStudyFile.id,
                  section.id,
                  event.target.value
                )
              }
              placeholder="Write here..."
            />

            <div className="button-row">
              <button
                onClick={() =>
                  startFocusOnTemplateSection(activeStudyFile, section)
                }
              >
                Focus on this section
              </button>

              <button
                className="secondary-button"
                onClick={() =>
                  sendTemplateSectionToPlanner(activeStudyFile, section)
                }
              >
                Send to Planner
              </button>
            </div>
          </>
        );
      })()}
    </div>
  </div>
</div>