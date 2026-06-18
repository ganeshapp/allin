import { useState, useEffect } from "react";
import type { CurriculumLevel } from "../types";
import { getCurriculum } from "../api/tauri";

export function useCurriculum() {
  const [levels, setLevels] = useState<CurriculumLevel[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurriculum()
      .then(setLevels)
      .finally(() => setLoading(false));
  }, []);

  return { levels, loading };
}
