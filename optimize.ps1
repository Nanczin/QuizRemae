Add-Type -AssemblyName System.Drawing
$directory = "src/assets"
$files = Get-ChildItem -Path $directory -Filter "*.png"

foreach ($file in $files) {
    Write-Host "Checking $($file.Name)..."
    try {
        # Load image
        $img = [System.Drawing.Image]::FromFile($file.FullName)
        
        # Check if resize needed
        if ($img.Width -gt 800) {
            Write-Host "  Resizing $($file.Name) from $($img.Width)px..."
            
            # Calculate new dimensions
            $ratio = 800 / $img.Width
            $newWidth = 800
            $newHeight = [int]($img.Height * $ratio)
            
            # Create new bitmap
            $bmp = New-Object System.Drawing.Bitmap($newWidth, $newHeight)
            $graph = [System.Drawing.Graphics]::FromImage($bmp)
            
            # High quality settings
            $graph.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graph.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graph.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
            
            # Draw
            $graph.DrawImage($img, 0, 0, $newWidth, $newHeight)
            
            # Dispose old image to unlock file
            $img.Dispose()
            
            # Save to temp file
            $tempFile = "$($file.FullName).tmp"
            $bmp.Save($tempFile, [System.Drawing.Imaging.ImageFormat]::Png)
            
            # Cleanup
            $graph.Dispose()
            $bmp.Dispose()
            
            # Replace original
            Move-Item -Path $tempFile -Destination $file.FullName -Force
            Write-Host "  Success."
        } else {
            $img.Dispose()
            Write-Host "  Skipped (already small enough)."
        }
    } catch {
        Write-Host "  Error: $_"
        if ($img) { $img.Dispose() }
        if ($bmp) { $bmp.Dispose() }
        if ($graph) { $graph.Dispose() }
    }
}
Write-Host "Optimization complete."
