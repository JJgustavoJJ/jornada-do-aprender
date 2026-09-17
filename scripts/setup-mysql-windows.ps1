$ErrorActionPreference = "Stop"

Write-Host "=== Configuração do MySQL - A Jornada do Aprender ===" -ForegroundColor Cyan
if (-not (Get-Command mysql -ErrorAction SilentlyContinue)) {
  throw "O comando mysql não foi encontrado. Instale o MySQL Server/Client e abra um novo PowerShell."
}
if (-not (Get-Command pnpm -ErrorAction SilentlyContinue)) {
  throw "O comando pnpm não foi encontrado. Instale Node.js e pnpm antes de continuar."
}

$rootPassword = Read-Host "Senha do usuário root do MySQL" -AsSecureString
$appPassword = Read-Host "Escolha uma senha para jornada_user" -AsSecureString
$rootPlain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPassword))
$appPlain = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($appPassword))

function SqlQuote([string]$value) { return $value.Replace("'", "''") }
$dbPasswordSql = SqlQuote $appPlain
$sql = @"
CREATE DATABASE IF NOT EXISTS jornada_aprender CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'jornada_user'@'localhost' IDENTIFIED BY '$dbPasswordSql';
ALTER USER 'jornada_user'@'localhost' IDENTIFIED BY '$dbPasswordSql';
GRANT ALL PRIVILEGES ON jornada_aprender.* TO 'jornada_user'@'localhost';
FLUSH PRIVILEGES;
"@

$tempSql = Join-Path $env:TEMP "jornada-aprender-setup.sql"
$sql | Set-Content -Path $tempSql -Encoding UTF8
try {
  $sqlArgs = @("-u", "root", "-p$rootPlain", "--protocol=tcp", "-h", "127.0.0.1", "-P", "3306")
  Get-Content $tempSql | & mysql @sqlArgs
  if ($LASTEXITCODE -ne 0) { throw "O MySQL recusou a criação do banco/usuário." }
} finally {
  Remove-Item $tempSql -Force -ErrorAction SilentlyContinue
}

$appEncoded = [Uri]::EscapeDataString($appPlain)
$connection = "mysql://jornada_user:$appEncoded@127.0.0.1:3306/jornada_aprender"
@"
DATABASE_URL=$connection
PORT=3000
NODE_ENV=development
"@ | Set-Content -Path ".env" -Encoding UTF8

pnpm db:push
pnpm run diagnose
Write-Host "Configuração concluída. Agora execute: pnpm run dev" -ForegroundColor Green
Write-Host "Nunca envie o arquivo .env ao GitHub." -ForegroundColor Yellow
