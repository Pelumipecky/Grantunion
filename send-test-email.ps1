Write-Host "Starting test email send..." -ForegroundColor Cyan
Write-Host ""

# Email data as JSON
$emailJson = @{
    to = "test@grantunion.com"
    subject = "Test Investment Approval"
    type = "investment_approval"
    templateData = @{
        userName = "Test User"
        plan = "7-Day Plan"
        capital = 500
        roi = 35
        bonus = 25
        duration = "7 days"
    }
} | ConvertTo-Json -Depth 10

Write-Host "📧 Email Details:" -ForegroundColor Yellow
Write-Host "To: test@grantunion.com"
Write-Host "Plan: 7-Day Plan"
Write-Host "Capital: $500"
Write-Host "ROI: $35"
Write-Host ""

try {
    Write-Host "Sending via http://localhost:3000/api/send-email..." -ForegroundColor Cyan
    
    $response = Invoke-WebRequest `
        -Uri 'http://localhost:3000/api/send-email' `
        -Method POST `
        -ContentType 'application/json' `
        -Body $emailJson `
        -TimeoutSec 30 `
        -ErrorAction Stop
    
    $responseData = $response.Content | ConvertFrom-Json
    
    Write-Host ""
    Write-Host "✅ SUCCESS!" -ForegroundColor Green
    Write-Host "Status Code: $($response.StatusCode)"
    Write-Host ""
    Write-Host "Response:" -ForegroundColor Green
    Write-Host ($responseData | ConvertTo-Json -Depth 2)
    
    if ($responseData.messageId) {
        Write-Host ""
        Write-Host "Message ID: $($responseData.messageId)" -ForegroundColor Cyan
    }
    
} catch {
    Write-Host ""
    Write-Host "ERROR" -ForegroundColor Red
    Write-Host "Message: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = [System.IO.StreamReader]::new($stream)
            $body = $reader.ReadToEnd()
            Write-Host ""
            Write-Host "Response Body:" -ForegroundColor Red
            Write-Host $body
        } catch {}
    }
}
