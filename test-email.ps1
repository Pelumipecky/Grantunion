$emailData = @{
    to = 'pelumipecky@gmail.com'
    subject = 'Test Investment Approval - Grant Union Investment'
    type = 'investment_approval'
    templateData = @{
        userName = 'Pelumi Test User'
        plan = '7-Day Plan'
        capital = 500
        roi = 35
        bonus = 25
        duration = '7 days'
    }
} | ConvertTo-Json -Depth 10

Write-Host 'Sending test email with templateData...' -ForegroundColor Cyan
Write-Host 'Email data:' -ForegroundColor Yellow
Write-Host $emailData

$headers = @{
    'Content-Type' = 'application/json'
}

try {
    $response = Invoke-WebRequest -Uri 'http://localhost:3000/api/send-email' -Method POST -Headers $headers -Body $emailData -UseBasicParsing
    
    Write-Host 'Response status:' -ForegroundColor Green
    Write-Host $response.StatusCode
    Write-Host 'Response content:' -ForegroundColor Green
    Write-Host ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5)
} catch {
    Write-Host 'Error:' -ForegroundColor Red
    Write-Host $_.Exception.Message
    if ($_.Exception.Response) {
        $stream = $_.Exception.Response.GetResponseStream()
        $reader = New-Object System.IO.StreamReader($stream)
        $responseBody = $reader.ReadToEnd()
        Write-Host 'Response body:' -ForegroundColor Red
        Write-Host $responseBody
    }
}
