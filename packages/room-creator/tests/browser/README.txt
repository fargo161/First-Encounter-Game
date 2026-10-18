Browser tests used for v0.13 (Python + Playwright + Chromium). They were written for the build machine
and use absolute paths under /home/claude/v13/ — change the paths at the top of each file to run them
elsewhere. make_city.py rebuilds the two City Block example files; previews.py takes the screenshots.
The folder legacy_v0_12_browser holds older browser tests from v0.10–v0.12; they target the old
interface and were not re-run for v0.13.
