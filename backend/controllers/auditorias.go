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

// Ver todas las auditorías
func ObtenerAuditorias(w http.ResponseWriter, r *http.Request) {
	var auds []models.Auditoria
	if err := config.DB.Find(&auds).Error; err != nil {
		http.Error(w, "Error al obtener auditorías", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(auds)
}

// Registrar una auditoría (esto lo puedes usar cuando quieras guardar un evento)
func CrearAuditoria(w http.ResponseWriter, r *http.Request) {
	var a models.Auditoria
	json.NewDecoder(r.Body).Decode(&a)

	if err := config.DB.Create(&a).Error; err != nil {
		http.Error(w, "No se pudo registrar la auditoría", http.StatusInternalServerError)
		return
	}

	fmt.Println("Auditoría registrada")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(a)
}

// Actualizar una auditoría
func ActualizarAuditoria(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, _ := strconv.Atoi(idStr)

	var a models.Auditoria
	if err := config.DB.First(&a, id).Error; err != nil {
		http.Error(w, "Auditoría no encontrada", http.StatusNotFound)
		return
	}

	json.NewDecoder(r.Body).Decode(&a)
	config.DB.Save(&a)

	fmt.Println("Auditoría actualizada")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(a)
}

// Borrar una auditoría
func EliminarAuditoria(w http.ResponseWriter, r *http.Request) {
	idStr := mux.Vars(r)["id"]
	id, _ := strconv.Atoi(idStr)

	tx := config.DB.Delete(&models.Auditoria{}, id)
	if tx.RowsAffected == 0 {
		http.Error(w, "Auditoría no encontrada", http.StatusNotFound)
		return
	}

	fmt.Println("Auditoría eliminada")
	w.Write([]byte("Auditoría eliminada correctamente"))
}
