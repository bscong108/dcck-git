@echo off
REM Dong goi lai noi dung (bai, handout, anki) roi mo ung dung hoc.
REM Sua thu muc nguon trong cong-cu\cau-hinh.json
cd /d "%~dp0"
python cong-cu\dong_goi.py
if errorlevel 1 (
  echo Loi khi dong goi. Kiem tra Python 3 da cai chua.
  pause
  exit /b 1
)
start "" "%~dp0index.html"
