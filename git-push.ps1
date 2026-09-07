# ==============================================================================
# TaskFlow - Git Push & Release Helper (PowerShell UI/UX Edition)
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# Limpiar bloqueos de Git si quedaron huérfanos
function Clean-GitLocks {
    $lockPath = Join-Path (Get-Location) ".git\index.lock"
    if (Test-Path $lockPath) {
        $gitProcesses = Get-Process git -ErrorAction SilentlyContinue
        if (-not $gitProcesses) {
            Remove-Item -Force $lockPath -ErrorAction SilentlyContinue
            Write-Host "  [OK] Se elimino archivo de bloqueo huerfano (.git\index.lock)`n" -ForegroundColor DarkYellow
        }
    }
}

# Mostrar tabla estilizada de cambios
function Show-ChangesTable {
    Clean-GitLocks
    $rawStatus = git status --porcelain
    if (-not $rawStatus) {
        Write-Host "`n  [OK] No hay cambios pendientes. Tu arbol de trabajo esta limpio.`n" -ForegroundColor Green
        return
    }

    $items = @()
    $rawStatus | ForEach-Object {
        $line = $_
        if ($line.Length -ge 3) {
            $code = $line.Substring(0, 2).Trim()
            $file = $line.Substring(3).Trim()
            
            $statusText = switch -Wildcard ($code) {
                "M*" { "MODIFICADO" }
                "*M" { "MODIFICADO" }
                "A*" { "AGREGADO" }
                "D*" { "ELIMINADO" }
                "*D" { "ELIMINADO" }
                "??" { "NUEVO" }
                "R*" { "RENOMBRADO" }
                Default { $code }
            }

            $items += [PSCustomObject]@{
                Estado  = $statusText
                Archivo = $file
            }
        }
    }

    Write-Host ""
    Write-Host "  +---------------+--------------------------------------------------------------+" -ForegroundColor Cyan
    Write-Host "  | ESTADO        | ARCHIVO                                                      |" -ForegroundColor Cyan
    Write-Host "  +---------------+--------------------------------------------------------------+" -ForegroundColor Cyan
    
    foreach ($item in $items) {
        $color = switch ($item.Estado) {
            "MODIFICADO" { "Yellow" }
            "AGREGADO"   { "Green" }
            "NUEVO"      { "Cyan" }
            "ELIMINADO"  { "Red" }
            Default      { "White" }
        }
        $statePadded = $item.Estado.PadRight(13)
        $fileDisplay = if ($item.Archivo.Length -gt 60) { "..." + $item.Archivo.Substring($item.Archivo.Length - 57) } else { $item.Archivo.PadRight(60) }
        
        Write-Host "  | " -NoNewline -ForegroundColor Cyan
        Write-Host "$statePadded" -NoNewline -ForegroundColor $color
        Write-Host " | " -NoNewline -ForegroundColor Cyan
        Write-Host "$fileDisplay" -NoNewline -ForegroundColor White
        Write-Host " |" -ForegroundColor Cyan
    }
    Write-Host "  +---------------+--------------------------------------------------------------+" -ForegroundColor Cyan
    
    $modCount = ($items | Where-Object { $_.Estado -eq "MODIFICADO" }).Count
    $newCount = ($items | Where-Object { $_.Estado -eq "NUEVO" }).Count
    $delCount = ($items | Where-Object { $_.Estado -eq "ELIMINADO" }).Count
    Write-Host "  >> Resumen: $modCount Modificados | $newCount Nuevos | $delCount Eliminados (Total: $($items.Count))`n" -ForegroundColor DarkGray
}

# Ejecutar proceso completo de push
function Invoke-GitPush([string]$commitMessage) {
    Clean-GitLocks

    $currentBranch = (git branch --show-current).Trim()
    if ([string]::IsNullOrWhiteSpace($currentBranch)) {
        $currentBranch = "main"
    }

    Write-Host "`n[1/4] Anadiendo archivos al stage (git add .)..." -ForegroundColor Yellow
    git add .
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Error en git add. Revisa los permisos." -ForegroundColor Red
        return
    }

    Write-Host "[2/4] Creando commit: '$commitMessage'..." -ForegroundColor Yellow
    git commit -m "$commitMessage"

    Write-Host "[3/4] Sincronizando con GitHub (git pull --rebase origin $currentBranch)..." -ForegroundColor Yellow
    git pull --rebase origin $currentBranch

    Write-Host "[4/4] Subiendo cambios a la rama $currentBranch (git push origin $currentBranch)..." -ForegroundColor Yellow
    git push origin $currentBranch

    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================================================" -ForegroundColor Green
        Write-Host "  [EXITO] Proyecto subido correctamente a GitHub                        " -ForegroundColor Green
        Write-Host "========================================================================" -ForegroundColor Green
        Write-Host "  Repositorio: https://github.com/Juan2007-sys/Tasks-Flow`n" -ForegroundColor Cyan
    } else {
        Write-Host ""
        Write-Host "  [ERROR] No se pudo completar el push a GitHub. Revisa los mensajes." -ForegroundColor Red
    }
}

# ==============================================================================
# Bucle Principal del Menú
# ==============================================================================
Clean-GitLocks

$currentBranch = (git branch --show-current).Trim()
if ([string]::IsNullOrWhiteSpace($currentBranch)) {
    $currentBranch = "main"
}

Clear-Host
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  ⚡ TASKFLOW - CONTROL DE VERSIONES Y PUSH A GITHUB                     " -ForegroundColor Cyan
Write-Host "========================================================================" -ForegroundColor Cyan
Write-Host "  Rama activa: [$currentBranch]  |  Repo: Juan2007-sys/Tasks-Flow" -ForegroundColor DarkCyan
Write-Host ""

# Mostrar tabla inicial de cambios
Show-ChangesTable

Write-Host "  Selecciona una opcion:" -ForegroundColor Yellow
Write-Host "    [1] Push Rapido (Commit por defecto y subir a GitHub)" -ForegroundColor Green
Write-Host "    [2] Push Personalizado (Escribir tu propio mensaje de commit)" -ForegroundColor White
Write-Host "    [3] Solo Sincronizar (git pull --rebase)" -ForegroundColor Cyan
Write-Host "    [4] Ver Tabla Detallada de Cambios" -ForegroundColor Magenta
Write-Host "    [5] Reparar Bloqueo de Git (Eliminar .git/index.lock)" -ForegroundColor DarkYellow
Write-Host "    [6] Salir" -ForegroundColor Red
Write-Host ""

$option = Read-Host "  Elige una opcion [1-6]"

switch ($option) {
    "1" {
        $msg = "feat: terminacion de backend y frontend de taskflow con UI/UX Pro Max"
        Invoke-GitPush -commitMessage $msg
    }
    "2" {
        Write-Host ""
        $userMsg = Read-Host "  Escribe tu mensaje de commit"
        if ([string]::IsNullOrWhiteSpace($userMsg)) {
            $userMsg = "feat: actualizacion de componentes y tareas de taskflow"
        }
        Invoke-GitPush -commitMessage $userMsg
    }
    "3" {
        Clean-GitLocks
        Write-Host "`nSincronizando con origin/$currentBranch..." -ForegroundColor Yellow
        git pull --rebase origin $currentBranch
    }
    "4" {
        Clear-Host
        Write-Host "=== TABLA DE ARCHIVOS DETALLADA ===" -ForegroundColor Cyan
        Show-ChangesTable
    }
    "5" {
        Clean-GitLocks
        Write-Host "Bloqueos verificados y limpiados." -ForegroundColor Green
    }
    Default {
        Write-Host "`nOperacion cancelada. Hasta luego!`n" -ForegroundColor DarkGray
    }
}
