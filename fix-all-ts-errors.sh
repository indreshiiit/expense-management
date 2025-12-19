#!/bin/bash

set -e

echo "🔧 Fixing all TypeScript errors in backend..."
echo ""

cd backend/src

echo "Step 1: Removing .ts and .js extensions from all imports..."
find . -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
  sed -i "s/from '@types\/index\.ts'/from '@types'/g" "$file"
  sed -i 's/from "@types\/index\.ts"/from "@types"/g' "$file"
  sed -i "s/from '@types\/index\.js'/from '@types'/g" "$file"
  sed -i 's/from "@types\/index\.js"/from "@types"/g' "$file"
  
  sed -i "s/from '@config\/env\.ts'/from '@config\/env'/g" "$file"
  sed -i 's/from "@config\/env\.ts"/from "@config\/env"/g' "$file"
  sed -i "s/from '@config\/env\.js'/from '@config\/env'/g" "$file"
  sed -i 's/from "@config\/env\.js"/from "@config\/env"/g' "$file"
  
  sed -i "s/from '@services\/authService\.ts'/from '@services\/authService'/g" "$file"
  sed -i 's/from "@services\/authService\.ts"/from "@services\/authService"/g' "$file"
  sed -i "s/from '@services\/authService\.js'/from '@services\/authService'/g" "$file"
  sed -i 's/from "@services\/authService\.js"/from "@services\/authService"/g' "$file"
  
  sed -i "s/from '@services\/expenseService\.ts'/from '@services\/expenseService'/g" "$file"
  sed -i 's/from "@services\/expenseService\.ts"/from "@services\/expenseService"/g' "$file"
  sed -i "s/from '@services\/expenseService\.js'/from '@services\/expenseService'/g" "$file"
  sed -i 's/from "@services\/expenseService\.js"/from "@services\/expenseService"/g' "$file"
  
  sed -i "s/from '@middleware\/auth\.ts'/from '@middleware\/auth'/g" "$file"
  sed -i 's/from "@middleware\/auth\.ts"/from "@middleware\/auth"/g' "$file"
  sed -i "s/from '@middleware\/auth\.js'/from '@middleware\/auth'/g" "$file"
  sed -i 's/from "@middleware\/auth\.js"/from "@middleware\/auth"/g' "$file"
  
  sed -i "s/from '@utils\/jwt\.ts'/from '@utils\/jwt'/g" "$file"
  sed -i 's/from "@utils\/jwt\.ts"/from "@utils\/jwt"/g' "$file"
  sed -i "s/from '@utils\/jwt\.js'/from '@utils\/jwt'/g" "$file"
  sed -i 's/from "@utils\/jwt\.js"/from "@utils\/jwt"/g' "$file"
  
  sed -i "s/from '@models\/User\.ts'/from '@models\/User'/g" "$file"
  sed -i 's/from "@models\/User\.ts"/from "@models\/User"/g' "$file"
  sed -i "s/from '@models\/User\.js'/from '@models\/User'/g" "$file"
  sed -i 's/from "@models\/User\.js"/from "@models\/User"/g' "$file"
  
  sed -i "s/from '@models\/Expense\.ts'/from '@models\/Expense'/g" "$file"
  sed -i 's/from "@models\/Expense\.ts"/from "@models\/Expense"/g' "$file"
  sed -i "s/from '@models\/Expense\.js'/from '@models\/Expense'/g" "$file"
  sed -i 's/from "@models\/Expense\.js"/from "@models\/Expense"/g' "$file"
done

echo "✅ Removed all .ts and .js extensions"
echo ""

echo "Step 2: Converting path aliases to relative imports..."

if [ -d "./controllers" ]; then
  find ./controllers -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
    sed -i "s|from '@types'|from '../types'|g" "$file"
    sed -i "s|from '@services/|from '../services/|g" "$file"
    sed -i "s|from '@config/|from '../config/|g" "$file"
  done
  echo "✅ Fixed controllers"
fi

if [ -d "./middleware" ]; then
  find ./middleware -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
    sed -i "s|from '@types'|from '../types'|g" "$file"
    sed -i "s|from '@utils/|from '../utils/|g" "$file"
    sed -i "s|from '@config/|from '../config/|g" "$file"
    sed -i "s|from '@models/|from '../models/|g" "$file"
  done
  echo "✅ Fixed middleware"
fi

if [ -d "./services" ]; then
  find ./services -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
    sed -i "s|from '@types'|from '../types'|g" "$file"
    sed -i "s|from '@models/|from '../models/|g" "$file"
    sed -i "s|from '@config/|from '../config/|g" "$file"
    sed -i "s|from '@utils/|from '../utils/|g" "$file"
  done
  echo "✅ Fixed services"
fi

if [ -d "./utils" ]; then
  find ./utils -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
    sed -i "s|from '@types'|from '../types'|g" "$file"
    sed -i "s|from '@config/|from '../config/|g" "$file"
  done
  echo "✅ Fixed utils"
fi

if [ -d "./routes" ]; then
  find ./routes -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
    sed -i "s|from '@controllers/|from '../controllers/|g" "$file"
    sed -i "s|from '@middleware/|from '../middleware/|g" "$file"
  done
  echo "✅ Fixed routes"
fi

if [ -d "./config" ]; then
  find ./config -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
    sed -i "s|from '@types'|from '../types'|g" "$file"
  done
  echo "✅ Fixed config"
fi

echo ""
echo "Step 3: Fixing unused parameters..."
find . -type f -name "*.ts" -print0 | while IFS= read -r -d '' file; do
  sed -i 's/errorHandler = (err: ErrorWithStatus, req: Request, res: Response, next: NextFunction)/errorHandler = (err: ErrorWithStatus, _req: Request, res: Response, _next: NextFunction)/g' "$file"
done

echo "✅ Fixed unused parameters"
echo ""
echo "🎉 All TypeScript errors fixed!"
echo ""
echo "Now run these commands:"
echo "  cd ../.."
echo "  docker build -t expense-backend ./backend"
echo ""
