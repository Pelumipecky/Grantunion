# Send test emails for investment approval and withdrawal notification

Write-Host "Testing PRODUCTION website: https://grantunion.vercel.app" -ForegroundColor Yellow
Write-Host "Waiting for server to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Test 1: Investment Approval Email
Write-Host "`nSending Investment Approval Email..." -ForegroundColor Cyan
$investmentBody = @{
    to = "pelumipecky@gmail.com"
    subject = "Investment Approved - Test"
    type = "investment_approved"
    templateData = @{
        userName = "Pelumi Pecky"
        plan = "Premium Plan"
        amount = "5000"
        roi = "25%"
        bonus = "500"
        duration = "90 days"
        dailyROI = "41.67"
    }
} | ConvertTo-Json -Depth 10

try {
    $response1 = Invoke-RestMethod -Uri "https://grantunion.vercel.app/api/send-email" -Method POST -Body $investmentBody -ContentType "application/json"
    Write-Host "✅ Investment Approval Email Sent!" -ForegroundColor Green
    Write-Host ($response1 | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to send Investment Approval Email" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Start-Sleep -Seconds 2

# Test 2: Withdrawal Notification Email
Write-Host "`nSending Withdrawal Notification Email..." -ForegroundColor Cyan
$withdrawalBody = @{
    to = "pelumipecky@gmail.com"
    subject = "Withdrawal Notification - Test"
    type = "withdrawal_notification"
    templateData = @{
        userName = "Pelumi Pecky"
        amount = "2500"
        status = "approved"
        transactionId = "WD-TEST-12345"
        method = "Bank Transfer"
    }
} | ConvertTo-Json -Depth 10

try {
    $response2 = Invoke-RestMethod -Uri "https://grantunion.vercel.app/api/send-email" -Method POST -Body $withdrawalBody -ContentType "application/json"
    Write-Host "✅ Withdrawal Notification Email Sent!" -ForegroundColor Green
    Write-Host ($response2 | ConvertTo-Json) -ForegroundColor Gray
} catch {
    Write-Host "❌ Failed to send Withdrawal Notification Email" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

Write-Host "`nDone! Check pelumipecky@gmail.com inbox." -ForegroundColor Yellow
