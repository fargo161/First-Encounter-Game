param([Parameter(Mandatory=$true)][string]$Library,[string]$Browser,[string]$Suite='all',[string]$PriorV12)
$rcArgs=@("$PSScriptRoot/run_tests.py",'--library',$Library,'--suite',$Suite)
if($Browser){$rcArgs+=@('--browser',$Browser)}
if($PriorV12){$rcArgs+=@('--prior-v12',$PriorV12)}
python @rcArgs
exit $LASTEXITCODE
