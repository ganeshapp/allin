import { useState } from "react";
import { useCurriculum } from "../hooks/useCurriculum";
import { LessonContent } from "../components/lesson/LessonContent";
import type { CurriculumModule } from "../types";

export function StudyTab() {
  const { levels, loading } = useCurriculum();
  const [activeModule, setActiveModule] = useState<CurriculumModule | null>(null);
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  if (loading) {
    return <div className="tab-loading">Loading curriculum…</div>;
  }

  const markComplete = (id: string) => {
    setCompleted((prev) => new Set(prev).add(id));
    setActiveModule(null);
  };

  return (
    <div className="study-tab">
      <header className="study-header">
        <h2>Study Path</h2>
        <p>Learn by doing — quizzes, visuals, and hands-on exercises.</p>
      </header>

      <div className="curriculum-path">
        {levels.map((level, levelIdx) => (
          <div
            key={level.id}
            className={`level-card ${level.unlocked ? "unlocked" : "locked"}`}
          >
            <div className="level-connector">
              {levelIdx > 0 && <div className="connector-line" />}
              <div className={`level-node ${level.unlocked ? "active" : ""}`}>
                {level.id}
              </div>
              {levelIdx < levels.length - 1 && <div className="connector-line down" />}
            </div>

            <div className="level-content">
              <div className="level-title-row">
                <h3>{level.title}</h3>
                {!level.unlocked && <span className="lock-badge">Locked</span>}
              </div>
              <p className="level-subtitle">{level.subtitle}</p>

              <div className="module-list">
                {level.modules.map((mod) => {
                  const isDone = completed.has(mod.id) || mod.completed;
                  return (
                    <button
                      key={mod.id}
                      type="button"
                      className={`module-card ${isDone ? "completed" : ""} ${!level.unlocked ? "disabled" : ""}`}
                      onClick={() => level.unlocked && setActiveModule(mod)}
                      disabled={!level.unlocked}
                    >
                      <span className="module-status">{isDone ? "✓" : "○"}</span>
                      <div>
                        <span className="module-title">{mod.title}</span>
                        <span className="module-desc">{mod.description}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ))}
      </div>

      {activeModule && (
        <div className="modal-overlay lesson-overlay">
          <div className="modal lesson-modal lesson-modal-wide">
            <div className="modal-header">
              <h3>{activeModule.title}</h3>
              <button
                type="button"
                className="modal-close"
                onClick={() => setActiveModule(null)}
              >
                ×
              </button>
            </div>
            <p className="lesson-description">{activeModule.description}</p>
            <LessonContent
              moduleId={activeModule.id}
              onComplete={() => markComplete(activeModule.id)}
            />
            <div className="lesson-footer">
              <p className="lesson-footer-hint">
                Practice as many quizzes as you like — mark the lesson complete when you feel ready.
              </p>
              <div className="lesson-footer-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModule(null)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={() => markComplete(activeModule.id)}>
                  Mark Lesson Complete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
