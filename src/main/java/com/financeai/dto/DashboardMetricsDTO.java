package com.financeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardMetricsDTO {
    private Double monthlyIncome;
    private Double monthlyExpenses;
    private Double estimatedBalance;
    private Integer debtPercentage;
    private Double monthlySavings;
    private Double emergencyFundMonths;
    private Integer financialHealthScore;
}
