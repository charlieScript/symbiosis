const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan')

const app = express();

const PORT = process.env.PORT || 3000;

// middlwares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))


app.listen(PORT, () =>
  console.log(`************SERVER STARTED AT ${PORT}*************`),
);

// routes
const userRoutes = require('./routes/UserRoutes')

app.use('/api/v1/users', userRoutes)

async function main() {
  
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
