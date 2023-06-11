$full=$args[0]

Move-Item -Force -Path .\test\spec\js\events* -Destination .\test\spec\non-js\
if($full -eq "full") {
    Move-Item -Force -Path .\test\spec\non-js\events.js -Destination .\test\spec\js\
} else {
    Move-Item -Force -Path .\test\spec\non-js\events-empty.js -Destination .\test\spec\js\
}

if($IsWindows)
{
    .\provengo.bat analyze -f pdf --style full test
} else {
    ./provengo analyze -f pdf test
}