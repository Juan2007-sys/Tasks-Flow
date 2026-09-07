#!/usr/bin/env bash

# ==============================================================================
# TaskFlow - Quick Start Script (Docker or Local)
# ==============================================================================

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}  ⚡ TaskFlow - Iniciar Ecosistema Completo           ${NC}"
echo -e "${BLUE}======================================================${NC}"
echo -e "Selecciona el modo de inicio:"
echo -e "  ${CYAN}1)${NC} Docker Compose (Recomendado: MongoDB + NestJS + Angular + Mongo Express)"
echo -e "  ${CYAN}2)${NC} Cargar datos de prueba (Seed Database en Backend)"
echo -e "  ${CYAN}3)${NC} Detener contenedores Docker"
echo -e "  ${CYAN}4)${NC} Salir"
echo ""
read -p "Elige una opción [1-4]: " OPTION

case $OPTION in
  1)
    echo -e "\n${YELLOW}🐳 Levantando contenedores con Docker Compose...${NC}"
    docker compose up --build -d
    echo -e "\n${GREEN}======================================================${NC}"
    echo -e "${GREEN}  ✅ ¡Servicios en ejecución!                         ${NC}"
    echo -e "${GREEN}======================================================${NC}"
    echo -e "  🌐 Frontend:      http://localhost"
    echo -e "  🚀 Backend API:   http://localhost:3000"
    echo -e "  📚 Swagger Docs:  http://localhost:3000/api/docs"
    echo -e "  🗄️  Mongo Express: http://localhost:8081"
    echo -e "\n  🔑 Cuenta Demo:   demo@taskflow.dev / Password123!\n"
    ;;
  2)
    echo -e "\n${YELLOW}🌱 Ejecutando Seeder de Base de Datos...${NC}"
    cd backend && npm run seed
    ;;
  3)
    echo -e "\n${YELLOW}🛑 Deteniendo contenedores Docker...${NC}"
    docker compose down
    echo -e "${GREEN}Contenedores detenidos correctamente.${NC}"
    ;;
  *)
    echo -e "\nSaliendo..."
    exit 0
    ;;
esac
