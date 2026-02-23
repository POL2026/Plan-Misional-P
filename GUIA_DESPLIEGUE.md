rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // PERMISOS DE ACCESO
      // Actualmente la app gestiona la seguridad mediante contraseñas en el frontend (WardSelector).
      // Se permiten lecturas y escrituras públicas para que la app funcione sin Autenticación de Firebase.
      // Nota: Para mayor seguridad en el futuro, considera implementar Firebase Auth.
      allow read, write: if true;
    }
  }
}