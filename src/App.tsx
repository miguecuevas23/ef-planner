import { useState } from "react";
import DashboardPage from "./modules/dashboard/pages/DashboardPage";
import ActivitiesSearchPage from "./modules/activities/pages/ActivitiesSearchPage";
import ActivityFormPage from "./modules/activities/pages/ActivityFormPage";
import FavoritesPage from "./modules/favorites/pages/FavoritesPage";
import BackupPage from "./modules/backup/pages/BackupPage";
import SettingsPage from "./modules/settings/pages/SettingsPage";
import "./shared/components/Shared.css";

type Page = "dashboard" | "search" | "new" | "favorites" | "backups" | "settings";

function App() {
  const [activePage, setActivePage] = useState<Page>("dashboard");

  const handleNavigate = (page: string) => {
    setActivePage(page as Page);
  };

  const handleBack = () => {
    setActivePage("dashboard");
  };

  switch (activePage) {
    case "search":
      return <ActivitiesSearchPage onBack={handleBack} />;
    case "new":
      return <ActivityFormPage onBack={handleBack} />;
    case "favorites":
      return <FavoritesPage onBack={handleBack} />;
    case "backups":
      return <BackupPage onBack={handleBack} />;
    case "settings":
      return <SettingsPage onBack={handleBack} />;
    default:
      return <DashboardPage onNavigate={handleNavigate} />;
  }
}

export default App;
