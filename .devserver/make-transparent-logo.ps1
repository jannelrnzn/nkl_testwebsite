Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\doloj\Claude\nkl-website\assets\images\NKL_Logo.JPEG"
$logoOut = "C:\Users\doloj\Claude\nkl-website\assets\images\logo.png"
$faviconOut = "C:\Users\doloj\Claude\nkl-website\assets\images\favicon.png"

$src = [System.Drawing.Bitmap]::FromFile($srcPath)
$w = $src.Width
$h = $src.Height

$bmp = New-Object System.Drawing.Bitmap $w, $h, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h

$srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$dstData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$srcStride = $srcData.Stride
$dstStride = $dstData.Stride
$srcBytes = New-Object byte[] ($srcStride * $h)
$dstBytes = New-Object byte[] ($dstStride * $h)
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $srcBytes, 0, $srcBytes.Length)

for ($y = 0; $y -lt $h; $y++) {
  $srcRow = $y * $srcStride
  $dstRow = $y * $dstStride
  for ($x = 0; $x -lt $w; $x++) {
    $sIdx = $srcRow + $x * 3
    $b = $srcBytes[$sIdx]
    $g = $srcBytes[$sIdx + 1]
    $r = $srcBytes[$sIdx + 2]

    $whiteness = ($r + $g + $b) / 3.0
    if ($whiteness -ge 250) {
      $alpha = 0
    } elseif ($whiteness -ge 210) {
      $alpha = [int](255 * (250 - $whiteness) / (250 - 210))
    } else {
      $alpha = 255
    }

    $dIdx = $dstRow + $x * 4
    $dstBytes[$dIdx] = $b
    $dstBytes[$dIdx + 1] = $g
    $dstBytes[$dIdx + 2] = $r
    $dstBytes[$dIdx + 3] = $alpha
  }
}

[System.Runtime.InteropServices.Marshal]::Copy($dstBytes, 0, $dstData.Scan0, $dstBytes.Length)
$src.UnlockBits($srcData)
$bmp.UnlockBits($dstData)
$src.Dispose()

$bmp.Save($logoOut, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved transparent logo: $logoOut ($w x $h)"

# Favicon: fit the WHOLE logo (not just a crop) into a square canvas,
# centered, keeping its aspect ratio, with transparent padding top/bottom.
$favSize = 128
$scale = [Math]::Min($favSize / $w, $favSize / $h)
$drawW = [int]($w * $scale)
$drawH = [int]($h * $scale)
$offsetX = [int](($favSize - $drawW) / 2)
$offsetY = [int](($favSize - $drawH) / 2)

$favicon = New-Object System.Drawing.Bitmap $favSize, $favSize, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g3 = [System.Drawing.Graphics]::FromImage($favicon)
$g3.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g3.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g3.Clear([System.Drawing.Color]::Transparent)
$g3.DrawImage($bmp, $offsetX, $offsetY, $drawW, $drawH)
$g3.Dispose()
$favicon.Save($faviconOut, [System.Drawing.Imaging.ImageFormat]::Png)
Write-Host "Saved favicon: $faviconOut ($favSize x $favSize), logo drawn at $drawW x $drawH"

$bmp.Dispose()
$favicon.Dispose()
