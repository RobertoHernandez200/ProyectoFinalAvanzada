package middleware

import (
	"encoding/json"
	"net/http"
	"strings"

	"github.com/golang-jwt/jwt/v5"
)

// Para no importar cruzado la repetimos aquí
var jwtSecret = []byte("clave_super")

// Este middleware revisa que la petición traiga un token válido.
// Si está todo bien, deja pasar; si no, responde con 401.
func RequiereJWT(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		auth := r.Header.Get("Authorization")
		if auth == "" || !strings.HasPrefix(auth, "Bearer ") {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Falta token (Authorization: Bearer <token>)"})
			return
		}

		tokenStr := strings.TrimPrefix(auth, "Bearer ")

		// Validamos el token
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			// Validamos que sea el método de firma correcto
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrTokenInvalidClaims
			}
			return jwtSecret, nil
		})

		if err != nil || !token.Valid {
			w.WriteHeader(http.StatusUnauthorized)
			json.NewEncoder(w).Encode(map[string]string{"error": "Token inválido o expirado"})
			return
		}

		// Si llegamos hasta acá, pasamos a la siguiente handler
		next.ServeHTTP(w, r)
	})
}
