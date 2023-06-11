if($IsWindows)
{
    .\provengo.bat report -t testlog test
} else {
    ./provengo report -t testlog test
}
