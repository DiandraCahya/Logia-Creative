Add-Type -AssemblyName System.Drawing
$srcPath = Join-Path $PSScriptRoot "..\public\Group 3.png"
$dstPath = Join-Path $PSScriptRoot "..\public\logia-white.png"

$img = [System.Drawing.Bitmap]::FromFile($srcPath)
$newImg = New-Object System.Drawing.Bitmap($img.Width, $img.Height)

for ($x = 0; $x -lt $img.Width; $x++) {
    for ($y = 0; $y -lt $img.Height; $y++) {
        $c = $img.GetPixel($x, $y)
        if ($c.A -gt 0) {
            $newImg.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, 255, 255, 255))
        }
    }
}

$img.Dispose()
$newImg.Save($dstPath, [System.Drawing.Imaging.ImageFormat]::Png)
$newImg.Dispose()
Write-Output "Successfully generated logia-white.png"
