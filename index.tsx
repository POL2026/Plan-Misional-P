<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Plan Misional | Estaca Primavera</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;900&display=swap" rel="stylesheet">
    <style>
      body {
        font-family: 'Inter', sans-serif;
        background-color: #0f172a; /* Slate 900 to match app theme */
        margin: 0;
        padding: 0;
      }
      /* Custom scrollbar for table container */
      .custom-scrollbar::-webkit-scrollbar {
        height: 6px;
        width: 6px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: #f1f5f9;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background-color: #cbd5e1;
        border-radius: 10px;
      }
      #error-overlay {
        display: none;
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: white; z-index: 9999;
        padding: 2rem; color: red;
        font-family: monospace;
      }
      
      /* Initial Loading Spinner */
      .initial-loader {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: #0f172a;
        color: white;
        z-index: 50;
        transition: opacity 0.5s ease-out;
      }
      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-left-color: #3b82f6; /* Blue 500 */
        border-radius: 50%;
        animation: spin 1s cubic-bezier(0.55, 0.055, 0.675, 0.19) infinite;
        margin-bottom: 1.5rem;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loader-text {
        font-size: 0.875rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        font-weight: 600;
        opacity: 0;
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0% { opacity: 0.4; }
        50% { opacity: 1; }
        100% { opacity: 0.4; }
      }
    </style>
  <script type="importmap">
{
  "imports": {
    "react": "https://esm.sh/react@18.3.1",
    "react/": "https://esm.sh/react@18.3.1/",
    "react-dom": "https://esm.sh/react-dom@18.3.1",
    "react-dom/client": "https://esm.sh/react-dom@18.3.1/client",
    "lucide-react": "https://esm.sh/lucide-react@0.378.0",
    "firebase/app": "https://esm.sh/firebase@10.12.2/compat/app",
    "firebase/firestore": "https://esm.sh/firebase@10.12.2/compat/firestore",
    "react-dom/": "https://esm.sh/react-dom@^19.2.4/",
    "firebase/": "https://esm.sh/firebase@^12.9.0/"
  }
}
</script>
<link rel="stylesheet" href="/index.css">
</head>
  <body>
    <div id="root">
      <!-- Contenido de carga inicial visible antes de que React monte -->
      <div class="initial-loader">
        <div class="spinner"></div>
        <div class="loader-text">
          Cargando Plan Misional...
        </div>
      </div>
    </div>
    <div id="error-overlay"></div>
    <!-- Esta linea conecta tu HTML con tu código React -->
    <script type="module" src="/index.tsx"></script>
  </body>
</html>