$baseDir = "c:\Users\andre\Desktop\ESPE\SEMESTRE 5\WEB AVANZADO\Group Repository"
$deliveryCodeDir = "$baseDir\AWD30716-SHARKHUB\06Code"

Write-Host "=== Iniciando Sincronizacion Selectiva ==="

# 1. Eliminar carpetas obsoletas
Write-Host "Eliminando carpetas obsoletas..."
if (Test-Path "$deliveryCodeDir\barbershopsharkhub") {
    Remove-Item -Path "$deliveryCodeDir\barbershopsharkhub" -Recurse -Force | Out-Null
    Write-Host "[OK] Eliminado: barbershopsharkhub"
}
if (Test-Path "$deliveryCodeDir\sharkhub-backend") {
    Remove-Item -Path "$deliveryCodeDir\sharkhub-backend" -Recurse -Force | Out-Null
    Write-Host "[OK] Eliminado: sharkhub-backend"
}

# 2. Agregar el repositorio de persistencia (que falta)
Write-Host "Copiando repositorio de persistencia que falta..."
robocopy "$baseDir\pandabwbarbershop_persistence" "$deliveryCodeDir\pandabwbarbershop_persistence" /E /XD ".git" "__pycache__" "node_modules" ".venv" /R:1 /W:1 | Out-Null
Write-Host "[OK] Copiado: pandabwbarbershop_persistence"

# 3. Actualizar selectivamente el Frontend (sharkhub-frontend)
Write-Host "Actualizando archivos modificados en sharkhub-frontend..."
New-Item -ItemType Directory -Force -Path "$deliveryCodeDir\sharkhub-frontend\src\pages" | Out-Null

Copy-Item -Path "$baseDir\pandabwbarbershop_frontEnd\Caddyfile" -Destination "$deliveryCodeDir\sharkhub-frontend\Caddyfile" -Force
Copy-Item -Path "$baseDir\pandabwbarbershop_frontEnd\docker-compose.yml" -Destination "$deliveryCodeDir\sharkhub-frontend\docker-compose.yml" -Force
Copy-Item -Path "$baseDir\pandabwbarbershop_frontEnd\.env" -Destination "$deliveryCodeDir\sharkhub-frontend\.env" -Force
Copy-Item -Path "$baseDir\pandabwbarbershop_frontEnd\src\pages\LandingPage.tsx" -Destination "$deliveryCodeDir\sharkhub-frontend\src\pages\LandingPage.tsx" -Force
Write-Host "[OK] Actualizado: sharkhub-frontend (Caddyfile, docker-compose.yml, .env, LandingPage.tsx)"

# 4. Actualizar selectivamente la API de Reglas de Negocio (pandabwbarbershop_API_businessRules)
Write-Host "Actualizando archivos modificados en pandabwbarbershop_API_businessRules..."
Copy-Item -Path "$baseDir\pandabwbarbershop_API_businessRules\Caddyfile" -Destination "$deliveryCodeDir\pandabwbarbershop_API_businessRules\Caddyfile" -Force
Copy-Item -Path "$baseDir\pandabwbarbershop_API_businessRules\docker-compose.yml" -Destination "$deliveryCodeDir\pandabwbarbershop_API_businessRules\docker-compose.yml" -Force
Copy-Item -Path "$baseDir\pandabwbarbershop_API_businessRules\.env" -Destination "$deliveryCodeDir\pandabwbarbershop_API_businessRules\.env" -Force
Write-Host "[OK] Actualizado: pandabwbarbershop_API_businessRules (Caddyfile, docker-compose.yml, .env)"

Write-Host "=== Sincronizacion Completada Exitosamente ==="
