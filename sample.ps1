Move-Item -Force -Path .\test\spec\js\events* -Destination .\test\spec\non-js\
Move-Item -Force -Path .\test\spec\non-js\events.js -Destination .\test\spec\js\

if($IsWindows)
{
    .\provengo.bat sample --delete-previous --size 500 test
} else {
    ./provengo sample --delete-previous --size 500 test
}