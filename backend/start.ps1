# Financial Health Dashboard - Quick Start Guide

Write-Host "Financial Health Dashboard Backend - Setup" -ForegroundColor Green

# Check Java version
Write-Host "`nChecking Java installation..." -ForegroundColor Yellow
java -version

# Check Maven installation
Write-Host "`nChecking Maven installation..." -ForegroundColor Yellow
mvn -version

# Check MySQL status
Write-Host "`nMySQL should be running on localhost:3306" -ForegroundColor Yellow
Write-Host "Database: finance_db" -ForegroundColor Cyan
Write-Host "Username: root" -ForegroundColor Cyan
Write-Host "Password: hasanali7623" -ForegroundColor Cyan

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Choose an option:" -ForegroundColor Yellow
Write-Host "1. Build and Run (Maven)" -ForegroundColor Cyan
Write-Host "2. Run with Docker Compose" -ForegroundColor Cyan
Write-Host "3. Build only" -ForegroundColor Cyan
Write-Host "4. Run tests" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Green

$choice = Read-Host "Enter your choice (1-4)"

switch ($choice) {
    "1" {
        Write-Host "`nBuilding and running application with Maven..." -ForegroundColor Green
        mvn clean install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "`nStarting application..." -ForegroundColor Green
            mvn spring-boot:run
        }
    }
    "2" {
        Write-Host "`nStarting with Docker Compose..." -ForegroundColor Green
        docker-compose up --build
    }
    "3" {
        Write-Host "`nBuilding application..." -ForegroundColor Green
        mvn clean package
    }
    "4" {
        Write-Host "`nRunning tests..." -ForegroundColor Green
        mvn test
    }
    default {
        Write-Host "Invalid choice. Exiting..." -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Application Details:" -ForegroundColor Yellow
Write-Host "URL: http://localhost:8080" -ForegroundColor Cyan
Write-Host "Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor Cyan
Write-Host "API Docs: http://localhost:8080/api-docs" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Green
