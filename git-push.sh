#!/usr/bin/env bash

# ==============================================================================
# TaskFlow - Git Push & Release Helper Script (Bash Edition)
# ==============================================================================

set -e

# Colores para la consola
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
RED='\033[0;31m'
NC='\033[0m' # Sin color

# Limpiar bloqueos de Git huérfanos
clean_locks() {
  if [ -f ".git/index.lock" ]; then
    rm -f .git/index.lock
    echo -e "${YELLOW}  [OK] Se eliminó archivo de bloqueo huérfano (.git/index.lock)${NC}\n"
  fi
}

show_table() {
  clean_locks
  echo -e "${CYAN}  +---------------+--------------------------------------------------------------+${NC}"
  echo -e "${CYAN}  | ESTADO        | ARCHIVO                                                      |${NC}"
  echo -e "${CYAN}  +---------------+--------------------------------------------------------------+${NC}"

  git status --porcelain | while read -r line; do
    code=$(echo "$line" | cut -c1-2)
    file=$(echo "$line" | cut -c4-)
    
    state="MODIFICADO"
    color="$YELLOW"
    if [[ "$code" == "??" ]]; then
      state="NUEVO     "
      color="$CYAN"
    elif [[ "$code" == *"D"* ]]; then
      state="ELIMINADO "
      color="$RED"
    elif [[ "$code" == *"A"* ]]; then
      state="AGREGADO  "
      color="$GREEN"
    fi

    printf "  | ${color}%-13s${NC} | %-60s |\n" "$state" "${file:0:60}"
  done
  echo -e "${CYAN}  +---------------+--------------------------------------------------------------+${NC}\n"
}

clean_locks
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null || echo "main")
[ -z "$CURRENT_BRANCH" ] && CURRENT_BRANCH="main"

clear 2>/dev/null || true
echo -e "${CYAN}========================================================================${NC}"
echo -e "${CYAN}  ⚡ TASKFLOW - CONTROL DE VERSIONES Y PUSH A GITHUB                     ${NC}"
echo -e "${CYAN}========================================================================${NC}"
echo -e "${BLUE}  Rama activa: [${CURRENT_BRANCH}]  |  Repo: Juan2007-sys/Tasks-Flow${NC}\n"

show_table

echo -e "${YELLOW}  Selecciona una opción:${NC}"
echo -e "    ${GREEN}[1] Push Rápido (Commit por defecto y subir a GitHub)${NC}"
echo -e "    [2] Push Personalizado (Escribir tu propio mensaje de commit)"
echo -e "    ${CYAN}[3] Solo Sincronizar (git pull --rebase)${NC}"
echo -e "    ${RED}[4] Salir${NC}\n"

read -p "  Elige una opción [1-4]: " OPTION

case $OPTION in
  1)
    COMMIT_MSG="feat: terminacion de backend y frontend de taskflow con UI/UX Pro Max"
    ;;
  2)
    echo -e "\n${YELLOW}💬 Ingresa el mensaje de commit:${NC}"
    read -r COMMIT_MSG
    [ -z "$COMMIT_MSG" ] && COMMIT_MSG="feat: actualizacion general de componentes y tareas"
    ;;
  3)
    clean_locks
    echo -e "\n${YELLOW}🔄 Sincronizando con origin/${CURRENT_BRANCH}...${NC}"
    git pull --rebase origin "$CURRENT_BRANCH"
    exit 0
    ;;
  *)
    echo -e "\nOperación cancelada.\n"
    exit 0
    ;;
esac

# Flujo de subida
clean_locks
echo -e "\n${YELLOW}[1/4] Añadiendo archivos al stage (git add .)...${NC}"
git add .

echo -e "${YELLOW}[2/4] Creando commit: \"$COMMIT_MSG\"...${NC}"
git commit -m "$COMMIT_MSG" || echo "Sin cambios nuevos para commitear."

echo -e "${YELLOW}[3/4] Sincronizando con GitHub (git pull --rebase origin '$CURRENT_BRANCH')...${NC}"
git pull --rebase origin "$CURRENT_BRANCH" || true

echo -e "${YELLOW}[4/4] Subiendo cambios a la rama '${CURRENT_BRANCH}' en GitHub...${NC}"
git push origin "$CURRENT_BRANCH"

echo -e "\n${GREEN}========================================================================${NC}"
echo -e "${GREEN}  ✅ ¡PROYECTO SUBIDO EXITOSAMENTE A GITHUB!                             ${NC}"
echo -e "${GREEN}========================================================================${NC}"
echo -e "${BLUE}  🔗 https://github.com/Juan2007-sys/Tasks-Flow${NC}\n"
