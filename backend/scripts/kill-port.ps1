# Libère le port 3001 (ancienne instance du backend Node)
$conns = Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
if (-not $conns) {
  Write-Host "Port 3001 deja libre."
  exit 0
}
$pids = $conns | Select-Object -ExpandProperty OwningProcess -Unique
foreach ($pid in $pids) {
  $proc = Get-Process -Id $pid -ErrorAction SilentlyContinue
  if ($proc) {
    Write-Host "Arret de $($proc.ProcessName) (PID $pid)..."
    Stop-Process -Id $pid -Force -ErrorAction SilentlyContinue
  }
}
Write-Host "Port 3001 libere."
