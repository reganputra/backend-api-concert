
## Setup

### Clone the repository
```bash
git clone https://github.com/reganputra/api-concert.git
```
### Install dependecies
```bash
npm install
```

### Prisma Init
```bash
npx prisma init
``````

### Databae migrations
```bash
npx prisma migrate dev --name <migration_name>
````

### add in a .env file
```bash
PORT= YOUR_PORT
DATABASE_URL= YOUR_DATABASE_URL
JWT_SECRET= YOUR_JWT_SECRET
JWT_EXPIRATION= YOUR_JWT_EXPIRATION
NODE_ENV=development

DIRECT_URL= YOUR_DIRECT_URL #for migration (using supabase)
 ```
### Run the app
```bash
npm run dev
```