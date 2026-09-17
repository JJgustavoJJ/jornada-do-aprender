$ErrorActionPreference = "Stop"

$ruleName = "Jornada do Aprender 3000"
$existingRule = Get-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue

if ($null -eq $existingRule) {
  New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Action Allow -Protocol TCP -LocalPort 3000 -Profile Private | Out-Null
  Write-Host "Regra criada: porta TCP 3000 liberada para redes privadas." -ForegroundColor Green
} else {
  Write-Host "A regra '$ruleName' já existe." -ForegroundColor Yellow
}

Write-Host "Se outros computadores ainda não acessarem, confirme que esta rede está marcada como Privada no Windows." -ForegroundColor Cyan
