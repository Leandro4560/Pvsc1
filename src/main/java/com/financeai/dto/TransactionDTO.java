package com.financeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TransactionDTO {
    private Long id;
    private String description;
    private Double amount;
    private String category;
    private Integer confidence;
    private LocalDateTime transactionDate;
    private String type; // INCOME, EXPENSE
}
