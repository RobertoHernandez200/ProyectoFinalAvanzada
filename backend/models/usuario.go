package models

//este es el usuario del sistema ya sea alquimista o supervisor
//guardamos nombre, correo, contraseña cifrada y rol
type Usuario struct {
	ID       uint   `json:"ID" gorm:"primaryKey;autoIncrement"`
	Nombre   string `json:"Nombre"`
	Correo   string `json:"Correo" gorm:"unique"`
	Password string `json:"-"`   // se guarda cifrada
	Rol      string `json:"Rol"` // alquimista o supervisor
}
