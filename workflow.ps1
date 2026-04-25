# workflow.ps1
# Opens Windows Terminal with 4 tabs for a dev session.

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
$repoName = Split-Path -Leaf $repoRoot

$escapedRoot = $repoRoot -replace '"', '\"'

function Encode-Command($cmd) {
    $bytes = [System.Text.Encoding]::Unicode.GetBytes($cmd)
    return [Convert]::ToBase64String($bytes)
}

# Fix: Explicitly include BOTH node.exe path and the npm globals path.
# This ensures that both the .ps1 files and the node engine itself are found.
$nodePath = "C:\Program Files\nodejs"
$npmPath  = "C:\Users\PURUSHOTH\AppData\Roaming\npm"
$setup    = "`$env:Path = '$nodePath;$npmPath;' + `$env:Path; . `"$PROFILE`"; cls"

$devServerCmd = Encode-Command "$setup; Write-Host 'Dev Server - run your start command here' -ForegroundColor Cyan"
$clearCmd     = Encode-Command "$setup"
$claudeCmd    = Encode-Command "$setup; claude"
$geminiCmd    = Encode-Command "$setup; gemini"

$psPath = "$PSHOME\powershell.exe"

$wtCmd  = "new-tab --suppressApplicationTitle --title `"Dev Server`" --startingDirectory `"$escapedRoot`" -- `"$psPath`" -NoExit -EncodedCommand $devServerCmd"
$wtCmd += " ; new-tab --suppressApplicationTitle --title `"$repoName`" --startingDirectory `"$escapedRoot`" -- `"$psPath`" -NoExit -EncodedCommand $clearCmd"
$wtCmd += " ; new-tab --suppressApplicationTitle --tabColor `"#c15f3c`" --title `"Claude`" --startingDirectory `"$escapedRoot`" -- `"$psPath`" -NoExit -EncodedCommand $claudeCmd"
$wtCmd += " ; new-tab --suppressApplicationTitle --tabColor `"#4992EA`" --title `"Gemini`" --startingDirectory `"$escapedRoot`" -- `"$psPath`" -NoExit -EncodedCommand $geminiCmd"

Start-Process "wt.exe" -ArgumentList $wtCmd