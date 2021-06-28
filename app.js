const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan')
const dotenv = require('dotenv')

const app = express();

const PORT = process.env.PORT || 3000;

dotenv.config()

// middlwares
app.use(cors());
app.use(express.static('./public'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'))


app.listen(PORT, () =>
  console.log(`************SERVER STARTED AT ${PORT}*************`),
);

// routes
const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')

app.use('/api/v1/users', authRoutes)
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
