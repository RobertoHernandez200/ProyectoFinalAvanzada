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

// Obtener todos los materiales
func ObtenerMateriales(w http.ResponseWriter, r *http.Request) {
	var materiales []models.Material
	if err := config.DB.Find(&materiales).Error; err != nil {
		http.Error(w, "Error al obtener materiales", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(materiales)
}

// Crear un nuevo material
func CrearMaterial(w http.ResponseWriter, r *http.Request) {
	var material models.Material
	json.NewDecoder(r.Body).Decode(&material)

	if err := config.DB.Create(&material).Error; err != nil {
		http.Error(w, "No se pudo crear el material", http.StatusInternalServerError)
		return
	}

	fmt.Println("Material creado correctamente")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(material)
}

// Actualizar un material existente
func ActualizarMaterial(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	var material models.Material
	if err := config.DB.First(&material, id).Error; err != nil {
		http.Error(w, "Material no encontrado", http.StatusNotFound)
		return
	}

	json.NewDecoder(r.Body).Decode(&material)
	config.DB.Save(&material)

	fmt.Println("Material actualizado correctamente")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(material)
}

// Eliminar un material
func EliminarMaterial(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, _ := strconv.Atoi(vars["id"])

	result := config.DB.Delete(&models.Material{}, id)
	if result.RowsAffected == 0 {
		http.Error(w, "Material no encontrado", http.StatusNotFound)
		return
	}

	fmt.Println("Material eliminado correctamente")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Material eliminado correctamente"))
}
