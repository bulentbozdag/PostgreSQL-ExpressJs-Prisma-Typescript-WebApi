import express from 'express'
import { PrismaClient } from '@prisma/client'
var bodyParser = require('body-parser');

const port = 3000;
const prisma = new PrismaClient()
const app = express();
app.use(bodyParser.json());


app.listen(port, () => {
  console.log(`App is running on port ${port}.`);
});


async function main() {

}

// Web API Methods
//# Base
app.get("/", async (_req, res) => {

  res.json(getStandardResponse(true, "succ", "Ok"));

});


//# User List
app.get("/users", async (_req, res) => {

  const allUsers = await getUsers();
  res.json(getStandardResponse(true, "succ", allUsers));

});


//# User Create
app.post("/adduser", async (req, res) => {

  await addUser(req.body);
  const allUsers = await getUsers();

  res.json(getStandardResponse(true, "succ", allUsers));

});


// Private Functions
async function addUser(model: any) {

  await prisma.user.create(model);

}

async function getUsers() {
  const allUsers = await prisma.user.findMany({
    include: {
      repos: true,
      profile: true,
    },
  })

  return allUsers;
}


//# Helper Functions
function getStandardResponse(status: boolean, message: string, data: any) {
  return {
    status: status,
    message: message,
    data: data
  }
}

main()
  .catch((e) => {
    throw e
  })
  .finally(async () => {
    await prisma.$disconnect()
  })