$imagePath = "C:\Users\Pichau\Desktop\KaiaLPV\KaiaLPV\frontend\public\avatar-woman.jpg"

# Converter imagem para base64
$imageData = [Convert]::ToBase64String([IO.File]::ReadAllBytes($imagePath))
$base64String = "data:image/jpeg;base64,$imageData"

# Salvar em um arquivo temporário para referência
$base64String | Out-File "C:\Users\Pichau\Desktop\KaiaLPV\avatar-base64.txt"

Write-Host "✅ Imagem convertida para base64!"
Write-Host "Arquivo salvo em: C:\Users\Pichau\Desktop\KaiaLPV\avatar-base64.txt"

# Copiar para clipboard
$base64String | Set-Clipboard
Write-Host "✅ Base64 copiado para clipboard!"
