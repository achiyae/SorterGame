Move-Item -Force -Path .\test\spec\js\events* -Destination .\test\spec\non-js\
Move-Item -Force -Path .\test\spec\non-js\events.js -Destination .\test\spec\js\

if($IsWindows)
{
    .\provengo.bat run -s products/run-source/ensemble.json test
} else {
    ./provengo run -s products/run-source/ensemble.json test
}