package controllers

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

// Clave secreta para firmar el token
var jwtSecret = []byte("clave_super")

// Estructura para recibir datos del body en registro/login
type credenciales struct {
	Nombre   string `json:"Nombre"`
	Correo   string `json:"Correo"`
	Password string `json:"Password"`
	Rol      string `json:"Rol"`
}

// REGISTRO
func Registro(w http.ResponseWriter, r *http.Request) {
	var c credenciales
	if err := json.NewDecoder(r.Body).Decode(&c); err != nil {
		http.Error(w, "JSON inválido", http.StatusBadRequest)
		return
	}

	// Cifrar contraseña
	hash, err := bcrypt.GenerateFromPassword([]byte(c.Password), bcrypt.DefaultCost)
	if err != nil {
		http.Error(w, "No se pudo cifrar la contraseña", http.StatusInternalServerError)
		return
	}

	u := models.Usuario{
		Nombre:   c.Nombre,
		Correo:   c.Correo,
		Password: string(hash),
		Rol:      c.Rol,
	}

	// Guardar usuario
	if err := config.DB.Create(&u).Error; err != nil {
		log.Printf("Error al crear usuario en BD: %v", err)
		http.Error(w, "No se pudo crear el usuario (posible correo duplicado)", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(map[string]any{
		"mensaje": "Usuario creado",
		"usuario": map[string]any{
			"ID": u.ID, "Nombre": u.Nombre, "Correo": u.Correo, "Rol": u.Rol,
		},
	})
}

// LOGIN
func Login(w http.ResponseWriter, r *http.Request) {
	var c credenciales
	json.NewDecoder(r.Body).Decode(&c)

	var u models.Usuario

	if err := config.DB.Where("correo = ?", c.Correo).First(&u).Error; err != nil {
		http.Error(w, "Correo o contraseña inválidos", http.StatusUnauthorized)
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(u.Password), []byte(c.Password)); err != nil {
		http.Error(w, "Correo o contraseña inválidos", http.StatusUnauthorized)
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": u.ID,
		"rol":     u.Rol,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})

	tokenStr, err := token.SignedString(jwtSecret)
	if err != nil {
		http.Error(w, "No se pudo generar el token", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(map[string]string{
		"token": tokenStr,
	})
}
