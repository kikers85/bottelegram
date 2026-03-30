@echo off
cd /d "C:\Users\kikers\Desktop\proyecto nuevo\bottelegram\securebot-server"
start "Backend" cmd /c "node dist\index.js"

cd /d "C:\Users\kikers\Desktop\proyecto nuevo\bottelegram\securebot-builder"
start "Frontend" cmd /c "npx vite preview --port 5173 --host"
