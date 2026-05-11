# Add Recurring Transactions to Database
# Run this script to add sample recurring bills to the database

$mysqlPath = "mysql"  # Change this if MySQL is not in PATH
$database = "finance_db"
$username = "root"
$password = "root"
$sqlFile = ".\database\add_recurring_transactions.sql"

Write-Host "Adding recurring transactions to database..." -ForegroundColor Yellow

try {
    # Test if MySQL is accessible
    & $mysqlPath --version 2>$null
    
    if ($LASTEXITCODE -eq 0) {
        # Execute SQL file
        & $mysqlPath -u $username -p$password $database -e "source $sqlFile"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ Successfully added recurring transactions!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now see 'Upcoming Bills' in the dashboard:" -ForegroundColor Cyan
            Write-Host "  - Electricity bill - ₹120.00 (due Nov 21)" -ForegroundColor White
            Write-Host "  - Netflix subscription - ₹49.99 (due Nov 22)" -ForegroundColor White
            Write-Host "  - Internet bill - ₹15.00 (due Nov 23)" -ForegroundColor White
            Write-Host "  - Spotify Premium - ₹30.00 (due Nov 24)" -ForegroundColor White
        } else {
            Write-Host "✗ Failed to execute SQL. Error code: $LASTEXITCODE" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ MySQL not found in PATH" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please run the SQL file manually:" -ForegroundColor Yellow
        Write-Host "  1. Open MySQL Workbench or phpMyAdmin" -ForegroundColor White
        Write-Host "  2. Connect to 'finance_db' database" -ForegroundColor White
        Write-Host "  3. Execute: database\add_recurring_transactions.sql" -ForegroundColor White
    }
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "Manual Instructions:" -ForegroundColor Yellow
    Write-Host "Run this in MySQL:" -ForegroundColor White
    Get-Content $sqlFile
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
