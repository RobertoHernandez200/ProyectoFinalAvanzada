package config

import (
	"backend/models"
	"fmt"
)

// GORM las crea si no existen, o las ajusta si cambió la estructura.
func Migrar() {
	DB.AutoMigrate(&models.Alquimista{})
	DB.AutoMigrate(&models.Mision{})
	DB.AutoMigrate(&models.Material{})
	DB.AutoMigrate(&models.Transmutacion{})
	DB.AutoMigrate(&models.Auditoria{})
	DB.AutoMigrate(&models.Usuario{})
	fmt.Println("Tablas listas ")
}
