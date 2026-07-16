param(
  [string]$ProjectRoot = (Split-Path -Parent $PSScriptRoot)
)

$ErrorActionPreference = "Stop"
$imageDir = Join-Path $ProjectRoot "public\products"
$dataDir = Join-Path $ProjectRoot "data"
New-Item -ItemType Directory -Force -Path $imageDir, $dataDir | Out-Null

$sites = @(
  @{ Region = "US"; Domain = "www.amazon.com"; Language = "en-US,en;q=0.9"; Asins = @("B0GKFHPWBQ","B0DDK8RYT9","B0GKGGL6GX","B0GKFQSTZ8","B0B3DSSSFQ","B0FF4PTWKF","B0DK15L2B4","B0FD3MZBPP") },
  @{ Region = "CA"; Domain = "www.amazon.ca"; Language = "en-CA,en;q=0.9"; Asins = @("B0BSGKRK7P","B0B3DSSSFQ","B0DJLSYC22","B0BV2PWM3J","B0FPC54S4F","B0GHLJGLGB","B0FF4X1PCX","B0FPC7RHYK") },
  @{ Region = "MX"; Domain = "www.amazon.com.mx"; Language = "es-MX,es;q=0.9,en;q=0.8"; Asins = @("B0DDK8RYT9","B0DK15L2B4","B0FF4TCZBD","B0GKFGQGGW","B0GXTW6S14","B0GPPP1CTR","B0BSGKRK7P","B0BMXB13TR") },
  @{ Region = "JP"; Domain = "www.amazon.co.jp"; Language = "ja-JP,ja;q=0.9,en;q=0.7"; Asins = @("B0GRFZF32C","B0H25GFRQ8","B0GKFG61KS","B0FF4PTWKF","B0FD3L5NXH","B0GKFM1JN8","B0GKG7LVFW","B0GKG27KB5") },
  @{ Region = "DE"; Domain = "www.amazon.de"; Language = "de-DE,de;q=0.9,en;q=0.8"; Asins = @("B0B3DSSSFQ","B0BMXB13TR","B0BSGKRK7P","B0BV2PWM3J","B0DDK8RYT9","B0DK15L2B4","B0FF4PTWKF","B0FD3MZBPP") },
  @{ Region = "UK"; Domain = "www.amazon.co.uk"; Language = "en-GB,en;q=0.9"; Asins = @("B0B3DSSSFQ","B0BMXB13TR","B0BSGKRK7P","B0BV2PWM3J","B0DDK8RYT9","B0DK15L2B4","B0FF4PTWKF","B0FD3MZBPP") },
  @{ Region = "FR"; Domain = "www.amazon.fr"; Language = "fr-FR,fr;q=0.9,en;q=0.8"; Asins = @("B0B3DSSSFQ","B0BMXB13TR","B0BSGKRK7P","B0BV2PWM3J","B0DDK8RYT9","B0DK15L2B4","B0FF4PTWKF","B0FD3MZBPP") },
  @{ Region = "IT"; Domain = "www.amazon.it"; Language = "it-IT,it;q=0.9,en;q=0.8"; Asins = @("B0B3DSSSFQ","B0BMXB13TR","B0BSGKRK7P","B0BV2PWM3J","B0DDK8RYT9","B0DK15L2B4","B0FF4PTWKF","B0FD3MZBPP") },
  @{ Region = "ES"; Domain = "www.amazon.es"; Language = "es-ES,es;q=0.9,en;q=0.8"; Asins = @("B0B3DSSSFQ","B0BMXB13TR","B0BSGKRK7P","B0BV2PWM3J","B0DDK8RYT9","B0DK15L2B4","B0FF4PTWKF","B0FD3MZBPP") }
)

function Clean-Text([string]$Value) {
  if (-not $Value) { return "" }
  $plain = [System.Net.WebUtility]::HtmlDecode(($Value -replace "<[^>]+>", " "))
  return (($plain -replace "\s+", " ").Trim())
}

function Parse-ReviewCount([string]$Value) {
  if (-not $Value) { return 0 }
  $digits = $Value -replace "[^0-9]", ""
  if (-not $digits) { return 0 }
  return [int64]$digits
}

$results = New-Object System.Collections.Generic.List[object]

foreach ($site in $sites) {
  foreach ($asin in $site.Asins) {
    $url = "https://$($site.Domain)/dp/$asin"
    $headers = @{
      "User-Agent" = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36"
      "Accept-Language" = $site.Language
    }
    try {
      $html = (Invoke-WebRequest -Uri $url -Headers $headers -UseBasicParsing -MaximumRedirection 5 -TimeoutSec 30).Content
      $titleMatch = [regex]::Match($html, '<span id="productTitle"[^>]*>(.*?)</span>', 'Singleline')
      $reviewMatch = [regex]::Match($html, 'id="acrCustomerReviewText"[^>]*>(.*?)</span>', 'Singleline')
      $imageMatch = [regex]::Match($html, 'data-old-hires="([^"]+)"')
      if (-not $imageMatch.Success) { $imageMatch = [regex]::Match($html, '"hiRes":"([^"]+)"') }
      $title = Clean-Text $titleMatch.Groups[1].Value
      $reviewText = Clean-Text $reviewMatch.Groups[1].Value
      $imageUrl = $imageMatch.Groups[1].Value -replace "\\u0026", "&"
      $unavailable = $html -match 'Currently unavailable|Derzeit nicht verfügbar|Actuellement indisponible|Non disponibile|No disponible|現在在庫切れ|No disponible por el momento'
      $imageFile = Join-Path $imageDir "$asin.jpg"
      if ($imageUrl -and -not (Test-Path $imageFile)) {
        Invoke-WebRequest -Uri $imageUrl -Headers $headers -UseBasicParsing -OutFile $imageFile -TimeoutSec 30
      }
      $results.Add([PSCustomObject]@{
        region = $site.Region
        domain = $site.Domain
        asin = $asin
        url = $url
        title = $title
        reviewText = $reviewText
        reviewCount = Parse-ReviewCount $reviewText
        image = if (Test-Path $imageFile) { "/products/$asin.jpg" } else { "" }
        unavailable = [bool]$unavailable
        verified = [bool]($title -or $imageUrl)
      })
    } catch {
      $results.Add([PSCustomObject]@{
        region = $site.Region
        domain = $site.Domain
        asin = $asin
        url = $url
        title = ""
        reviewText = ""
        reviewCount = 0
        image = ""
        unavailable = $true
        verified = $false
        error = $_.Exception.Message
      })
    }
    Start-Sleep -Milliseconds 250
  }
}

$outputPath = Join-Path $dataDir "amazon-scrape.json"
$json = $results | ConvertTo-Json -Depth 5
[System.IO.File]::WriteAllText($outputPath, $json, (New-Object System.Text.UTF8Encoding($false)))
Write-Output $outputPath
