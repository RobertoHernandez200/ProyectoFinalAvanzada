package datos

import (
	"backend/config"
	"backend/models"
	"fmt"
)

// Esta función mete datos de prueba para ver si las tablas funcionan
func CargarDatos() {
	// Creamos un alquimista de ejemplo
	alquimista := models.Alquimista{
		Nombre:       "Edward Elric",
		Rango:        "Alquimista Estatal",
		Especialidad: "Alquimia de Metal",
	}

	// Creamos una misión sencilla
	mision := models.Mision{
		Titulo:       "Buscar piedra filosofal",
		Descripcion:  "Viajar por Amestris en busca de la piedra.",
		Estado:       "Pendiente",
		AlquimistaID: 1, // este número conecta con el alquimista
	}

	// Creamos un material
	material := models.Material{
		Nombre:      "Lingote de Hierro",
		Tipo:        "Metal",
		Cantidad:    5,
		Descripcion: "Usado en transmutaciones de metal.",
	}

	// Creamos una transmutación de ejemplo
	transmutacion := models.Transmutacion{
		Descripcion:  "Convertir hierro en espada.",
		Resultado:    "Espada metálica lista para usar.",
		Costo:        "2 lingotes de hierro",
		AlquimistaID: 1,
		MisionID:     1,
	}

	// Creamos una auditoría
	auditoria := models.Auditoria{
		Accion:      "Carga inicial",
		Entidad:     "Sistema",
		EntidadID:   0,
		Descripcion: "Datos de ejemplo cargados correctamente.",
	}

	// Guardamos todo en la base con GORM
	config.DB.Create(&alquimista)
	config.DB.Create(&mision)
	config.DB.Create(&material)
	config.DB.Create(&transmutacion)
	config.DB.Create(&auditoria)

	// Mostramos un mensaje para confirmar
	fmt.Println("Datos de prueba insertados correctamente")
}
