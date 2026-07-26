package com.financeai.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RecommendationDTO {
    private Integer id;
    private String title;
    private String description;
    private String priority; // HIGH, MEDIUM, LOW
}
