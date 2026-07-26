package com.financeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyEvolutionDTO {
    private String month;
    private Double income;
    private Double expenses;
}
