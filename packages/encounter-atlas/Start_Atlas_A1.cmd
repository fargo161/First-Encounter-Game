@echo off
pushd "%~dp0"
echo Opening Atlas A1. Leave this window open while using Atlas.
echo Press Ctrl+C in this window to stop the local reader.
python scripts\serve-atlas-a1.py --open
popd
pause
