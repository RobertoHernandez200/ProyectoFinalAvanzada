package controllers

import (
	"backend/config"
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
)

// Listar todas las transmutaciones
func ObtenerTransmutaciones(w http.ResponseWriter, r *http.Request) {
	var trans []models.Transmutacion
	if err := config.DB.Find(&trans).Error; err != nil {
		http.Error(w, "Error al obtener transmutaciones", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(trans)
}

// rear una transmutación
func CrearTransmutacion(w http.ResponseWriter, r *http.Request) {
	var t models.Transmutacion
	json.NewDecoder(r.Body).Decode(&t)

	if err := config.DB.Create(&t).Error; err != nil {
		http.Error(w, "No se pudo crear la transmutación", http.StatusInternalServerError)
		return
	}

	fmt.Println("Transmutación creada")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(t)
}

// Actualizar una transmutación
func ActualizarTransmutacion(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, _ := strconv.Atoi(idStr)

	var t models.Transmutacion
	if err := config.DB.First(&t, id).Error; err != nil {
		http.Error(w, "Transmutación no encontrada", http.StatusNotFound)
		return
	}

	json.NewDecoder(r.Body).Decode(&t)
	config.DB.Save(&t)

	fmt.Println("Transmutación actualizada")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(t)
}

// Eliminar una transmutación
func EliminarTransmutacion(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, _ := strconv.Atoi(idStr)

	tx := config.DB.Delete(&models.Transmutacion{}, id)
	if tx.RowsAffected == 0 {
		http.Error(w, "Transmutación no encontrada", http.StatusNotFound)
		return
	}

	fmt.Println("Transmutación eliminada")
	w.Write([]byte("Transmutación eliminada correctamente"))
}
