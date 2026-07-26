package com.financeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardDTO {
    private DashboardMetricsDTO metrics;
    private List<ExpenseByCategoryDTO> expensesByCategory;
    private List<MonthlyEvolutionDTO> monthlyEvolution;
    private List<TransactionDTO> recentTransactions;
    private List<AlertDTO> alerts;
    private List<RecommendationDTO> recommendations;
}
