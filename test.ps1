Write-Host "Sending test email..." -ForegroundColor Cyan

$json = '{"to":"test@grantunion.com","subject":"Investment Approval Test","type":"investment_approval","templateData":{"userName":"Test User","plan":"7-Day Plan","capital":500,"roi":35,"bonus":25,"duration":"7 days"}}'

try {
    $resp = Invoke-WebRequest -Uri 'http://localhost:3000/api/send-email' -Method POST -Headers @{'Content-Type'='application/json'} -Body $json
    Write-Host "SUCCESS!" -ForegroundColor Green
    Write-Host ($resp.Content | ConvertFrom-Json | ConvertTo-Json -Depth 2)
} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
}
