package com.financeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseByCategoryDTO {
    private String categoryName;
    private Double amount;
    private Integer percentage;
    private String color;
    private String icon;
}
