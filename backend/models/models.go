package models

import "time"

// Esta tabla es para los Alquimistas
type Alquimista struct {
	ID           uint      `gorm:"primaryKey"` // id
	Nombre       string    // nombre del alquimista
	Rango        string    // rango dentro del ejército
	Especialidad string    // tipo de alquimia que maneja
	CreadoEn     time.Time // fecha en la que fue creado
}

// Esta tabla es para las Misiones
type Mision struct {
	ID           uint   `gorm:"primaryKey"`
	Titulo       string // nombre de la misión
	Descripcion  string // explicación de la misión
	Estado       string // puede ser: pendiente, en progreso o completada
	AlquimistaID uint   // el id del alquimista que tiene la misión
	CreadoEn     time.Time
}

// Esta tabla es para los Materiales alquímicos
type Material struct {
	ID          uint   `gorm:"primaryKey"`
	Nombre      string // nombre del material
	Tipo        string // tipo de material (por ejemplo: metal, piedra, etc)
	Cantidad    int    // cuántas unidades hay
	Descripcion string // información adicional
	CreadoEn    time.Time
}

// Esta tabla es para las Transmutaciones
type Transmutacion struct {
	ID           uint   `gorm:"primaryKey"`
	Descripcion  string // explica qué tipo de transmutación es
	Resultado    string // qué se obtuvo al hacerla
	Costo        string // qué se gastó o usó
	AlquimistaID uint   // id del alquimista que la hizo
	MisionID     uint   // id de la misión donde se usó
	CreadoEn     time.Time
}

// Esta tabla es para las Auditorías del sistema
type Auditoria struct {
	ID          uint   `gorm:"primaryKey"`
	Accion      string // qué acción se hizo (crear, borrar, etc)
	Entidad     string // a qué tabla pertenece la acción
	EntidadID   uint   // id del registro afectado
	Descripcion string // explicación de lo que se hizo
	CreadoEn    time.Time
}
