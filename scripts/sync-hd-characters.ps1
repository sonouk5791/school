$ErrorActionPreference='Stop'
$workspace=Split-Path $PSScriptRoot -Parent
$release=Join-Path $workspace 'school-release'
$files=[Collections.Generic.List[string]]::new()
foreach($relative in @('AGENTS.md','index.html','css/official-characters.css','js/characters.js','js/animated-character.js','js/character-lipsync.js','characters/manifest.json','characters/README.md','characters/high-resolution-preview.html','scripts/build-hd-characters.cjs','scripts/extract-official-characters.py','scripts/sync-hd-characters.ps1','tests/official-character-assets.py','tests/official-characters.cjs','tests/character-actions.cjs','tests/high-resolution-preview.cjs','TODAY_WORK_REPORT.md','오늘_작업_일지_2026-09-21.md')){$files.Add($relative)}
foreach($folder in @('public/characters','characters/reference/high-resolution','characters/reference/legacy-lowres-20260921')){Get-ChildItem -LiteralPath (Join-Path $workspace $folder) -Recurse -File | ForEach-Object {$files.Add($_.FullName.Substring($workspace.Length+1))}}
foreach($relative in @('scripts/prepare-hd-inspection.cjs','scripts/inspect-hd-characters.cjs','scripts/mouth-inspection.cjs')){$files.Add($relative)}
foreach($pattern in @('high-resolution-*.png','official-characters-*.png','animated-character-*.png')){Get-ChildItem -Path (Join-Path $workspace "tests/$pattern") -File | ForEach-Object {$files.Add($_.FullName.Substring($workspace.Length+1))}}
foreach($id in @('kongi','tori','nabi','bori')){
 Get-ChildItem -LiteralPath (Join-Path $workspace "characters/$id") -File -Filter '*.png' | ForEach-Object {$files.Add($_.FullName.Substring($workspace.Length+1))}
 $files.Add("characters/$id/actions/${id}_idle.png")
}
Get-ChildItem -LiteralPath (Join-Path $workspace 'assets/images') -File -Filter 'friend-*.png' | ForEach-Object {$files.Add($_.FullName.Substring($workspace.Length+1))}
foreach($relative in ($files|Sort-Object -Unique)){
 $source=Join-Path $workspace $relative;$dest=Join-Path $release $relative
 if(!(Test-Path -LiteralPath $source)){throw "Missing source: $relative"}
 New-Item -ItemType Directory -Force -Path (Split-Path $dest -Parent) | Out-Null
 Copy-Item -LiteralPath $source -Destination $dest -Force
 if((Get-FileHash -LiteralPath $source).Hash -ne (Get-FileHash -LiteralPath $dest).Hash){throw "Mismatch: $relative"}
}
Write-Output "PASS: high-resolution assets, code, tests and work logs synchronized with SHA-256 verification."
