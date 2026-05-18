Clear-Host

Write-Output ""
Write-Output "================================="
Write-Output "      SETUP DO PROJETO"
Write-Output "================================="
Write-Output ""

# =================================
# Instalar dependencias
# =================================

Write-Output "Instalando dependencias..."
Write-Output ""

npm install
npm install react-router-dom
npm install json-server --save-dev
npm install concurrently --save-dev

Write-Output ""
Write-Output "Dependencias instaladas!"
Write-Output ""

# =================================
# Ativar modo escuro do Windows
# =================================

Write-Output "Ativando modo escuro do Windows..."
Write-Output ""

Set-ItemProperty `
-Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" `
-Name AppsUseLightTheme `
-Value 0

Set-ItemProperty `
-Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Themes\Personalize" `
-Name SystemUsesLightTheme `
-Value 0

# Reiniciar explorer
Stop-Process -Name explorer -Force
Start-Process explorer

Write-Output "Modo escuro ativado!"
Write-Output ""

# =================================
# Instalar extensoes VS Code
# =================================

Write-Output "Instalando extensoes VS Code..."
Write-Output ""

code --install-extension PKief.material-icon-theme
code --install-extension unthrottled.doki-theme

Write-Output ""
Write-Output "Extensoes instaladas!"
Write-Output ""

# =================================
# Configurar tema automaticamente
# =================================

Write-Output "Configurando tema Astolfo..."
Write-Output ""

$settingsPath = "$env:APPDATA\Code\User\settings.json"

if (!(Test-Path $settingsPath)) {
    New-Item -ItemType File -Path $settingsPath -Force
}

$settings = @"
{
    "workbench.colorTheme": "Doki Theme: TypeMoon: Astolf",
    # "workbench.colorTheme": "Doki Theme TypeMoon Astolfo"
    "workbench.iconTheme": "material-icon-theme",
    "doki.sticker.path": "Astolfo",
    "doki.background.enabled": true,
    "doki.statusbar.name": "Astolfo",
    "doki.activitybar.name": "Astolfo"
}
"@

Set-Content -Path $settingsPath -Value $settings

Write-Output "Tema configurado!"
Write-Output ""

# =================================
# Abrir projeto no VS Code
# =================================

Write-Output "Abrindo projeto..."
Write-Output ""

code "Z:\2026\TCC\totalmed"

Write-Output ""
Write-Output "================================="
Write-Output "      SETUP CONCLUIDO!"
Write-Output "================================="
Write-Output ""

Pause