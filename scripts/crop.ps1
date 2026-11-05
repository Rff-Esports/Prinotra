Add-Type -AssemblyName System.Drawing

function Crop-Image($sourcePath, $targetFront, $targetBack) {
    $src = [System.Drawing.Bitmap]::FromFile($sourcePath)
    $w = $src.Width
    $h = $src.Height
    $halfW = [int]($w / 2)

    # Front (left half)
    $frontBmp = new-object System.Drawing.Bitmap $halfW, $h
    $gFront = [System.Drawing.Graphics]::FromImage($frontBmp)
    $srcRectFront = new-object System.Drawing.Rectangle 0, 0, $halfW, $h
    $dstRect = new-object System.Drawing.Rectangle 0, 0, $halfW, $h
    $gFront.DrawImage($src, $dstRect, $srcRectFront, [System.Drawing.GraphicsUnit]::Pixel)
    $gFront.Dispose()
    $frontBmp.Save($targetFront, [System.Drawing.Imaging.ImageFormat]::Png)
    $frontBmp.Dispose()

    # Back (right half)
    $backBmp = new-object System.Drawing.Bitmap $halfW, $h
    $gBack = [System.Drawing.Graphics]::FromImage($backBmp)
    $srcRectBack = new-object System.Drawing.Rectangle $halfW, 0, $halfW, $h
    $gBack.DrawImage($src, $dstRect, $srcRectBack, [System.Drawing.GraphicsUnit]::Pixel)
    $gBack.Dispose()
    $backBmp.Save($targetBack, [System.Drawing.Imaging.ImageFormat]::Png)
    $backBmp.Dispose()

    $src.Dispose()
    Write-Output "Cropped $sourcePath ($w x $h) into front and back ($halfW x $h)"
}

Crop-Image "$PSScriptRoot\..\assets\mockups\tshirt_crewneck.png" "$PSScriptRoot\..\assets\mockups\tshirt_crewneck_front.png" "$PSScriptRoot\..\assets\mockups\tshirt_crewneck_back.png"
Crop-Image "$PSScriptRoot\..\assets\mockups\tshirt_oversized.png" "$PSScriptRoot\..\assets\mockups\tshirt_oversized_front.png" "$PSScriptRoot\..\assets\mockups\tshirt_oversized_back.png"
Crop-Image "$PSScriptRoot\..\assets\mockups\hoodie.png" "$PSScriptRoot\..\assets\mockups\hoodie_front.png" "$PSScriptRoot\..\assets\mockups\hoodie_back.png"
