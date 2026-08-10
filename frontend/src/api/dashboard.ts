import { env } from "./env";
import { dashboardMock, type DashboardData } from "../features/dashboard/components/dashboardMocks";
import type { FinancialStatus } from "../types/financial-analysis";

interface DashboardMetricsDTO {
  monthlyIncome?: number;
  monthlyExpenses?: number;
  estimatedBalance?: number;
  debtPercentage?: number;
  monthlySavings?: number;
  emergencyFundMonths?: number;
  financialHealthScore?: number;
}

interface ExpenseByCategoryDTO {
  categoryName?: string;
  amount?: number;
  percentage?: number;
}

interface MonthlyEvolutionDTO {
  month?: string;
  income?: number;
  expenses?: number;
}

interface TransactionDTO {
  id?: number | string;
  description?: string;
  amount?: number;
  category?: string;
  confidence?: number;
}

interface AlertDTO {
  id?: number | string;
  title?: string;
  message?: string;
  type?: string;
}

interface RecommendationDTO {
  id?: number | string;
  title?: string;
  description?: string;
  priority?: string;
}

interface DashboardDTO {
  metrics?: DashboardMetricsDTO;
  expensesByCategory?: ExpenseByCategoryDTO[];
  monthlyEvolution?: MonthlyEvolutionDTO[];
  recentTransactions?: TransactionDTO[];
  alerts?: AlertDTO[];
  recommendations?: RecommendationDTO[];
}

function mapFinancialProfile(score?: number): FinancialStatus {
  if (score == null) {
    return "OBSERVATION";
  }

  if (score >= 80) {
    return "HEALTHY";
  }

  if (score >= 50) {
    return "OBSERVATION";
  }

  return "RISK";
}

function normalizeConfidence(confidence?: number): number | undefined {
  if (confidence == null) {
    return undefined;
  }

  if (confidence > 1) {
    return Math.min(Math.max(confidence / 100, 0), 1);
  }

  return Math.min(Math.max(confidence, 0), 1);
}

function getAlertSeverity(alertType?: string) {
  switch (alertType?.toUpperCase()) {
    case "CRITICAL":
      return "CRITICAL";
    case "WARNING":
      return "WARNING";
    default:
      return "INFO";
  }
}

function mapDashboard(dto: DashboardDTO): DashboardData {
  const metrics = dto.metrics ?? {};
  const totalExpenses = metrics.monthlyExpenses ?? 0;
  const monthlyIncome = metrics.monthlyIncome ?? 0;
  const percentageOfIncome = monthlyIncome > 0 ? totalExpenses / monthlyIncome : 0;
  const score = metrics.financialHealthScore ?? 0;

  const indicators = {
    monthlyIncome,
    totalExpenses,
    estimatedBalance: metrics.estimatedBalance ?? 0,
    monthlySavings: metrics.monthlySavings ?? 0,
    debtRatio: (metrics.debtPercentage ?? 0) / 100,
    emergencyFundMonths: metrics.emergencyFundMonths ?? 0,
  };

  return {
    financialProfile: mapFinancialProfile(score),
    score,
    lastAnalysisDate: new Date().toLocaleDateString("es-AR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    indicators,
    expensesByCategory:
      dto.expensesByCategory?.map((item) => ({
        category: item.categoryName ?? "Otros",
        amount: item.amount ?? 0,
        percentage: item.percentage != null ? (item.percentage > 1 ? item.percentage / 100 : item.percentage) : 0,
      })) ?? [],
    monthlyEvolution:
      dto.monthlyEvolution?.map((item) => ({
        month: item.month ?? "",
        income: item.income ?? 0,
        expenses: item.expenses ?? 0,
      })) ?? [],
    classifiedTransactions:
      dto.recentTransactions?.map((transaction) => ({
        id: String(transaction.id ?? ""),
        description: transaction.description ?? "",
        amount: transaction.amount ?? 0,
        mainCategory: transaction.category ?? "Otros",
        confidence: normalizeConfidence(transaction.confidence),
      })) ?? [],
    recommendations:
      dto.recommendations?.map((recommendation) => ({
        id: String(recommendation.id ?? ""),
        priority: (recommendation.priority as "LOW" | "MEDIUM" | "HIGH") ?? "LOW",
        message: recommendation.description ?? recommendation.title ?? "",
      })) ?? [],
    alerts:
      dto.alerts?.map((alert) => ({
        id: String(alert.id ?? ""),
        severity: getAlertSeverity(alert.type),
        message: alert.title ? `${alert.title}: ${alert.message ?? ""}` : alert.message ?? "",
      })) ?? [],
    keyFactors: [
      `Tus gastos representan el ${Math.round(percentageOfIncome * 100)}% de tus ingresos`,
      `Tu deuda mensual es de ${metrics.debtPercentage ?? 0}%`,
      `Tu fondo de emergencia cubre ${indicators.emergencyFundMonths.toLocaleString("es-AR", {
        maximumFractionDigits: 1,
      })} meses`,
    ],
  };
}

export async function fetchDashboardData(userId = "1"): Promise<DashboardData> {
  const url = `${env.apiBaseUrl}/dashboard/${userId}`;
  console.info(`[Dashboard] Fetching: ${url}`);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`[Dashboard] Error del backend: ${response.status} ${response.statusText}`, body);
      throw new Error(`Error del backend: ${response.status}`);
    }

    const dto = (await response.json()) as DashboardDTO;
    console.info("[Dashboard] Datos cargados desde el backend correctamente:", dto);
    return mapDashboard(dto);
  } catch (error) {
    console.error("[Dashboard] No se pudo cargar el dashboard desde el backend. Usando datos mock.", error);
    return dashboardMock;
  }
}
