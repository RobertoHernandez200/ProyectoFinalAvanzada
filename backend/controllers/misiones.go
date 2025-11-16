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

// mostrar todas las misiones
func ObtenerMisiones(w http.ResponseWriter, r *http.Request) {
	var misiones []models.Mision
	result := config.DB.Find(&misiones)

	if result.Error != nil {
		http.Error(w, "Error al obtener las misiones", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(misiones)
}

// Crear una nueva misión
func CrearMision(w http.ResponseWriter, r *http.Request) {
	var mision models.Mision
	json.NewDecoder(r.Body).Decode(&mision)

	result := config.DB.Create(&mision)
	if result.Error != nil {
		http.Error(w, "Error al crear la misión", http.StatusInternalServerError)
		return
	}

	fmt.Println("Misión creada correctamente")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(mision)
}

// Actualizar una misión
func ActualizarMision(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var mision models.Mision
	if err := config.DB.First(&mision, id).Error; err != nil {
		http.Error(w, "Misión no encontrada", http.StatusNotFound)
		return
	}

	json.NewDecoder(r.Body).Decode(&mision)
	config.DB.Save(&mision)

	fmt.Println("Misión actualizada correctamente")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(mision)
}

// Eliminar una misión
func EliminarMision(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	result := config.DB.Delete(&models.Mision{}, id)
	if result.RowsAffected == 0 {
		http.Error(w, "Misión no encontrada", http.StatusNotFound)
		return
	}

	fmt.Println("Misión eliminada correctamente")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Misión eliminada correctamente"))
}
