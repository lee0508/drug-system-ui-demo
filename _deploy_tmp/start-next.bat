@echo off
set DATABASE_URL=postgresql://postgres:1234@localhost:5432/drug_system?schema=public
set NEXTAUTH_SECRET=drug-system-secret-key-min-32-chars-ok
set NEXTAUTH_URL=http://192.168.0.114:3000
set NODE_ENV=production
set PORT=3000
node "D:\xampp\htdocs\drug-system-ui-demo\node_modules\next\dist\bin\next" start >> "D:\xampp\htdocs\drug-system-ui-demo\logs\pm2-out.log" 2>> "D:\xampp\htdocs\drug-system-ui-demo\logs\pm2-error.log"
"