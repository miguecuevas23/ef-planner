import { useState, useEffect } from "react";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import ActivitiesSearchPage from "./modules/activities/pages/ActivitiesSearchPage";
import ActivityFormPage from "./modules/activities/pages/ActivityFormPage";
import FavoritesPage from "./modules/favorites/pages/FavoritesPage";
import BackupPage from "./modules/backup/pages/BackupPage";
import ImportActivitiesPage from "./modules/import/pages/ImportActivitiesPage";
import SettingsPage from "./modules/settings/pages/SettingsPage";
import PlanningComingSoonPage from "./modules/planning/pages/PlanningComingSoonPage";
import StorageSetupModal from "./modules/settings/components/StorageSetupModal";
import { getSetting } from "./database/metadataRepository";
import { initializePlanningModule } from "./modules/planning/services/planningRepository";
import "./shared/components/Shared.css";

type Page = "dashboard" | "search" | "new" | "import" | "favorites" | "planning" | "backups" | "settings";

function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");
  const [showSetup, setShowSetup] = useState(false);
  const [setupChecked, setSetupChecked] = useState(false);

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
  };

  const handleBack = () => {
    setActivePage("dashboard");
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
      return <PlanningComingSoonPage onBack={handleBack} />;
    case "backups":
      return <BackupPage onBack={handleBack} />;
    case "settings":
      return <SettingsPage onBack={handleBack} />;
    default:
      return <DashboardPage onNavigate={handleNavigate} />;
  }
}

export default App;
