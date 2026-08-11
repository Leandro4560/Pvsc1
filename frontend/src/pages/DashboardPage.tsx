import { useEffect, useState } from "react";
import AlertsCard from "../features/dashboard/components/AlertsCard";
import { dashboardMock, type DashboardData } from "../features/dashboard/components/dashboardMocks";
import DashboardLayout from "../features/dashboard/components/DashboardLayout";
import ExpensesByCategoryCard from "../features/dashboard/components/ExpensesByCategoryCard";
import KeyFactorsCard from "../features/dashboard/components/KeyFactorsCard";
import MonthlyEvolutionCard from "../features/dashboard/components/MonthlyEvolutionCard";
import RecommendationsCard from "../features/dashboard/components/RecommendationsCard";
import ScoreCard from "../features/dashboard/components/ScoreCard";
import StatsGrid from "../features/dashboard/components/StatsGrid";
import TransactionsTable from "../features/dashboard/components/TransactionsTable";
import { fetchDashboardData } from "../api/dashboard";
import "./DashboardPage.css";

function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData>(dashboardMock);

  useEffect(() => {
    async function loadDashboard() {
      const data = await fetchDashboardData("1");
      setDashboardData(data);
    }

    loadDashboard();
  }, []);

  return (
    <DashboardLayout lastAnalysisDate={dashboardData.lastAnalysisDate} hasNotifications>
      <div className="dashboard-page__grid">
        <div className="dashboard-page__main">
          <ScoreCard
            status={dashboardData.financialProfile}
            score={dashboardData.score ?? 0}
            monthlyIncome={dashboardData.indicators.monthlyIncome}
            totalExpenses={dashboardData.indicators.totalExpenses}
          />

          <StatsGrid indicators={dashboardData.indicators} />

          <div className="dashboard-page__charts-row">
            <ExpensesByCategoryCard
              categories={dashboardData.expensesByCategory}
              total={dashboardData.expensesByCategory.reduce((sum, cat) => sum + cat.amount, 0)}
            />
            <MonthlyEvolutionCard data={dashboardData.monthlyEvolution} />
          </div>

          <TransactionsTable transactions={dashboardData.classifiedTransactions} />
        </div>

        <div className="dashboard-page__side">
          <KeyFactorsCard factors={dashboardData.keyFactors} />
          <RecommendationsCard recommendations={dashboardData.recommendations} />
          <AlertsCard alerts={dashboardData.alerts} />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPage;
