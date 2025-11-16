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

// esta función trae todos los alquimistas guardados en la base
func ObtenerAlquimistas(w http.ResponseWriter, r *http.Request) {
	var alquimistas []models.Alquimista    // aquí guardaremos los resultados
	result := config.DB.Find(&alquimistas) // pedimos todos los registros a la base

	//si ocurre algún error lo mostramos
	if result.Error != nil {
		http.Error(w, "Error al obtener los alquimistas", http.StatusInternalServerError)
		return
	}

	//si salió bien, devolvemos los alquimistas en formato JSON
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(alquimistas)
}

// Esta función sirve para crear un nuevo alquimista
func CrearAlquimista(w http.ResponseWriter, r *http.Request) {
	var alquimista models.Alquimista            //aquí se guardará lo que nos mande el usuario
	json.NewDecoder(r.Body).Decode(&alquimista) //convertimos el JSON recibido en un objeto Go

	//Guardamos en la base con GORM
	result := config.DB.Create(&alquimista)
	if result.Error != nil {
		http.Error(w, "No se pudo crear el alquimista", http.StatusInternalServerError)
		return
	}

	fmt.Println("Alquimista creado correctamente")
	w.WriteHeader(http.StatusCreated)
	json.NewEncoder(w).Encode(alquimista) //devolvemos el alquimista creado
}

// Esta función actualiza un alquimista ya existente
func ActualizarAlquimista(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)               //obtenemos los parámetros de la URL (por ejemplo, /alquimistas/1)
	id, _ := strconv.Atoi(vars["id"]) //convertimos el id de texto a número

	var alquimista models.Alquimista
	if err := config.DB.First(&alquimista, id).Error; err != nil {
		http.Error(w, "Alquimista no encontrado", http.StatusNotFound)
		return
	}

	//Actualizamos con los nuevos datos que llegan en el cuerpo de la petición
	json.NewDecoder(r.Body).Decode(&alquimista)
	config.DB.Save(&alquimista)

	fmt.Println("Alquimista actualizado correctamente")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(alquimista)
}

// Esta función elimina un alquimista de la base
func EliminarAlquimista(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r) // sacamos el ID de la URL
	id, _ := strconv.Atoi(vars["id"])

	// Buscamos y eliminamos el registro
	result := config.DB.Delete(&models.Alquimista{}, id)
	if result.RowsAffected == 0 {
		http.Error(w, "Alquimista no encontrado", http.StatusNotFound)
		return
	}

	fmt.Println("Alquimista eliminado correctamente")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Alquimista eliminado correctamente"))
}
