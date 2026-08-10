package com.financeai.controller;

import com.financeai.entity.Usuario;
import com.financeai.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:4200", "http://localhost:5173"})
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody Usuario user) {
        try {
            if (user.getEmail() == null || user.getEmail().isEmpty()) {
                return ResponseEntity.badRequest().body("El email es requerido");
            }
            if (user.getPassword() == null || user.getPassword().isEmpty()) {
                return ResponseEntity.badRequest().body("La contraseña es requerida");
            }
            if (user.getFirstName() == null || user.getFirstName().isEmpty()) {
                return ResponseEntity.badRequest().body("El nombre es requerido");
            }
            if (user.getLastName() == null || user.getLastName().isEmpty()) {
                return ResponseEntity.badRequest().body("El apellido es requerido");
            }
            
            Usuario created = userService.createUser(
                user.getEmail(),
                user.getPassword(),
                user.getFirstName(),
                user.getLastName()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al crear usuario: " + e.getMessage());
        }
    }

    @GetMapping("/{userId}")
    public ResponseEntity<Usuario> getUser(@PathVariable Long userId) {
        try {
            Optional<Usuario> user = userService.getUserById(userId);
            return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> getUserByEmail(@PathVariable String email) {
        try {
            Optional<Usuario> user = userService.getUserByEmail(email);
            return user.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{userId}")
    public ResponseEntity<Usuario> updateUser(
            @PathVariable Long userId,
            @Valid @RequestBody Usuario user) {
        try {
            Usuario updated = userService.updateUser(userId, user);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{userId}/financial")
    public ResponseEntity<Usuario> updateFinancialData(
            @PathVariable Long userId,
            @RequestParam(required = false) Double income,
            @RequestParam(required = false) Double expenses,
            @RequestParam(required = false) Double emergencyFund,
            @RequestParam(required = false) Double debt) {
        try {
            Usuario updated = userService.updateFinancialData(userId, income, expenses, emergencyFund, debt);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
