@echo off
rem Gop ung dung thanh mot file Dao-Toan-Lop-2.html de chep sang may tinh bang
cd /d "%~dp0"
python cong-cu\dong-goi.py
if errorlevel 1 py cong-cu\dong-goi.py
pause
