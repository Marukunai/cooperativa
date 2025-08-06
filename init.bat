@echo off
setlocal

:: Ruta del proyecto
set "PROJECT_DIR=C:\Users\mmape\Desktop\Cooperativa"

:: Crear carpetas base
mkdir "%PROJECT_DIR%"
cd "%PROJECT_DIR%"
mkdir backend
mkdir backend\routes
mkdir backend\controllers
mkdir backend\models
mkdir backend\utils
mkdir frontend
mkdir frontend\public
mkdir frontend\views

:: Crear archivos base
echo const express = require("express")> backend\server.js
echo const app = express();>> backend\server.js
echo require("dotenv").config();>> backend\server.js
echo app.use(express.json());>> backend\server.js
echo app.get("/", (req, res) => res.send("Página de inicio"));>> backend\server.js
echo const PORT = process.env.PORT || 3000;>> backend\server.js
echo app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));>> backend\server.js

echo PORT=3000> .env

:: Inicializar proyecto Node.js
cd backend
call npm init -y
call npm install express dotenv

echo Proyecto creado con éxito en: %PROJECT_DIR%
pause