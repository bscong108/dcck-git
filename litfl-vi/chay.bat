@echo off
REM Dong goi lai du lieu LITFL VI roi mo ung dung.
cd /d "%~dp0"
python cong-cu\dong_goi.py
if errorlevel 1 (
  echo Loi khi dong goi. Da chay cong-cu\tai_litfl.py chua? Python 3 da cai chua?
  pause
  exit /b 1
)
python cong-cu\chay.py
