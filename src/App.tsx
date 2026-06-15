import { useState, useEffect } from "react";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import ActivitiesSearchPage from "./modules/activities/pages/ActivitiesSearchPage";
import ActivityFormPage from "./modules/activities/pages/ActivityFormPage";
import FavoritesPage from "./modules/favorites/pages/FavoritesPage";
import BackupPage from "./modules/backup/pages/BackupPage";
import ImportActivitiesPage from "./modules/import/pages/ImportActivitiesPage";
import SettingsPage from "./modules/settings/pages/SettingsPage";
import PlanningPage from "./modules/planning/pages/PlanningPage";
import SkillObjectiveBuilderPage from "./modules/planning/pages/SkillObjectiveBuilderPage";
import SkillObjectiveLibraryPage from "./modules/planning/pages/SkillObjectiveLibraryPage";
import SkillObjectiveDetailPage from "./modules/planning/pages/SkillObjectiveDetailPage";
import StorageSetupModal from "./modules/settings/components/StorageSetupModal";
import { getSetting } from "./database/metadataRepository";
import { initializePlanningModule } from "./modules/planning/services/planningRepository";
import "./shared/components/Shared.css";

type Page = "dashboard" | "search" | "new" | "import" | "favorites" | "planning" | "backups" | "settings";
type PlanningSubPage = "menu" | "builder" | "library" | "detail";

function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [showSetup, setShowSetup] = useState(false);
  const [setupChecked, setSetupChecked] = useState(false);
  const [planningSub, setPlanningSub] = useState<PlanningSubPage>("menu");
  const [planningSkillId, setPlanningSkillId] = useState<string | null>(null);
  const [planningEditId, setPlanningEditId] = useState<string | null>(null);

  useEffect(() => {
    async function check() {
      const completed = await getSetting("storage_setup_completed");
      if (completed !== "true") {
        setShowSetup(true);
      }
      setSetupChecked(true);
    }
    check();

    initializePlanningModule().catch(() => {});
  }, []);

  const handleNavigate = (page: string) => {
    setActivePage(page as Page);
    if (page === "planning") {
      setPlanningSub("menu");
      setPlanningSkillId(null);
      setPlanningEditId(null);
    }
  };

  const handleBack = () => {
    setActivePage("dashboard");
  };

  const handlePlanningNavigate = (page: string) => {
    switch (page) {
      case "planning_builder":
        setPlanningSub("builder");
        setPlanningEditId(null);
        break;
      case "planning_library":
        setPlanningSub("library");
        break;
    }
  };

  const handlePlanningBack = () => {
    setPlanningSub("menu");
    setPlanningSkillId(null);
    setPlanningEditId(null);
  };

  if (showSetup) {
    return <StorageSetupModal onComplete={() => setShowSetup(false)} />;
  }

  if (!setupChecked) return null;

  switch (activePage) {
    case "search":
      return <ActivitiesSearchPage onBack={handleBack} />;
    case "new":
      return <ActivityFormPage onBack={handleBack} />;
    case "favorites":
      return <FavoritesPage onBack={handleBack} />;
    case "import":
      return <ImportActivitiesPage onBack={handleBack} />;
    case "planning":
      if (planningSub === "builder") {
        return <SkillObjectiveBuilderPage onBack={handlePlanningBack} editId={planningEditId} />;
      }
      if (planningSub === "library") {
        return (
          <SkillObjectiveLibraryPage
            onBack={handlePlanningBack}
            onEditSkill={(id) => { setPlanningEditId(id); setPlanningSub("builder"); }}
            onViewSkill={(id) => { setPlanningSkillId(id); setPlanningSub("detail"); }}
          />
        );
      }
      if (planningSub === "detail" && planningSkillId) {
        return (
          <SkillObjectiveDetailPage
            onBack={handlePlanningBack}
            skillId={planningSkillId}
            onEdit={(id) => { setPlanningEditId(id); setPlanningSub("builder"); }}
          />
        );
      }
      return <PlanningPage onBack={handleBack} onNavigate={handlePlanningNavigate} />;
    case "backups":
      return <BackupPage onBack={handleBack} />;
    case "settings":
      return <SettingsPage onBack={handleBack} />;
    default:
      return <DashboardPage onNavigate={handleNavigate} />;
  }
}

export default App;
