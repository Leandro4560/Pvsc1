package com.financeai.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(nullable = false)
    private String color;

    @Column(nullable = false)
    private Integer percentage; // Budget percentage

    @Column(nullable = false)
    private String icon;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Transaction> transactions;

    public enum CategoryName {
        VIVIENDA("Vivienda", "#1F77B4"),
        ALIMENTACION("Alimentación", "#2CA02C"),
        TRANSPORTE("Transporte", "#FF7F0E"),
        SERVICIOS("Servicios", "#D62728"),
        SALUD("Salud", "#9467BD"),
        ENTRETENIMIENTO("Entretenimiento", "#8C564B");

        private final String displayName;
        private final String color;

        CategoryName(String displayName, String color) {
            this.displayName = displayName;
            this.color = color;
        }

        public String getDisplayName() {
            return displayName;
        }

        public String getColor() {
            return color;
        }
    }
}
