$level=$args[0]
$style=$args[1]

if($level -ne "low") {
    $level="high"
}

if($style -ne "styled") {
    $style="full"
}

Move-Item -Force -Path .\test\spec\js\events* -Destination .\test\spec\non-js\
if($level -eq "low") {
    Move-Item -Force -Path .\test\spec\non-js\events.js -Destination .\test\spec\js\
} else {
    Move-Item -Force -Path .\test\spec\non-js\events-empty.js -Destination .\test\spec\js\
}

if($IsWindows)
{
    .\provengo.bat analyze -f pdf --style $style test
} else {
    ./provengo analyze -f pdf --style $style test
}