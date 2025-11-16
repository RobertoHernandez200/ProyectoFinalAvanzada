package main

// Este archivo arranca el servidor HTTP, conecta la base de datos,
// registra todas las rutas y agrega CORS para que el frontend (Vite en 5173)
// pueda llamar al backend sin que el navegador bloquee la petición.

import (
	"backend/config"
	"backend/controllers"
	"backend/middleware"
	"log"
	"net/http"

	"github.com/gorilla/mux"
)

func main() {
	//Conexión a la base de datos y migraciones
	config.ConectarDB()
	config.Migrar()

	//Crear router principal
	r := mux.NewRouter()

	// Ruta de prueba para ver que el backend responde
	r.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("Servidor con JWT listo"))
	})

	// Rutas públicas (no requieren token)
	r.HandleFunc("/auth/registro", controllers.Registro).Methods("POST")
	r.HandleFunc("/auth/login", controllers.Login).Methods("POST")

	// Subrutas protegidas con JWT bajo /api
	api := r.PathPrefix("/api").Subrouter()
	api.Use(middleware.RequiereJWT)

	// CRUD de Alquimistas
	api.HandleFunc("/alquimistas", controllers.ObtenerAlquimistas).Methods("GET")
	api.HandleFunc("/alquimistas", controllers.CrearAlquimista).Methods("POST")
	api.HandleFunc("/alquimistas/{id}", controllers.ActualizarAlquimista).Methods("PUT")
	api.HandleFunc("/alquimistas/{id}", controllers.EliminarAlquimista).Methods("DELETE")

	// CRUD de Misiones
	api.HandleFunc("/misiones", controllers.ObtenerMisiones).Methods("GET")
	api.HandleFunc("/misiones", controllers.CrearMision).Methods("POST")
	api.HandleFunc("/misiones/{id}", controllers.ActualizarMision).Methods("PUT")
	api.HandleFunc("/misiones/{id}", controllers.EliminarMision).Methods("DELETE")

	// CRUD de Materiales
	api.HandleFunc("/materiales", controllers.ObtenerMateriales).Methods("GET")
	api.HandleFunc("/materiales", controllers.CrearMaterial).Methods("POST")
	api.HandleFunc("/materiales/{id}", controllers.ActualizarMaterial).Methods("PUT")
	api.HandleFunc("/materiales/{id}", controllers.EliminarMaterial).Methods("DELETE")

	// CRUD de Transmutaciones
	api.HandleFunc("/transmutaciones", controllers.ObtenerTransmutaciones).Methods("GET")
	api.HandleFunc("/transmutaciones", controllers.CrearTransmutacion).Methods("POST")
	api.HandleFunc("/transmutaciones/{id}", controllers.ActualizarTransmutacion).Methods("PUT")
	api.HandleFunc("/transmutaciones/{id}", controllers.EliminarTransmutacion).Methods("DELETE")

	// CRUD de Auditorías
	api.HandleFunc("/auditorias", controllers.ObtenerAuditorias).Methods("GET")
	api.HandleFunc("/auditorias", controllers.CrearAuditoria).Methods("POST")
	api.HandleFunc("/auditorias/{id}", controllers.ActualizarAuditoria).Methods("PUT")
	api.HandleFunc("/auditorias/{id}", controllers.EliminarAuditoria).Methods("DELETE")

	// Envolver el router con CORS para permitir llamadas desde Vite
	corsHandler := http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
		// Permitir al frontend que corre en http://localhost:5173
		w.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		// Permitir cabeceras que usamos (JSON y Authorization con el token)
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		// Métodos permitidos
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")

		// Las peticiones OPTIONS son de preflight (CORS), no llegan al handler real
		if req.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		// Si no es OPTIONS, pasamos la petición al router de mux
		r.ServeHTTP(w, req)
	})

	log.Println("Servidor corriendo en http://localhost:8080")

	// Iniciar servidor HTTP usando el handler con CORS
	if err := http.ListenAndServe(":8080", corsHandler); err != nil {
		log.Fatal(err)
	}
}
