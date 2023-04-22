const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { PrismaClient, Prisma } = require("@prisma/client");

const prismaClient = new PrismaClient();

const server = express();
server.use(cors());

// adiciona users para teste
server.post("/users", async (req, res) => {
  const data = {
    id: 1,
    name: "teste",
    email: "teste@email.com",
    password: "123456",
  };
  const newUser = await prismaClient.user.create({
    data,
  });
  res.json(newUser);
});

// retorna users
server.get("/users", async (req, res) => {
  const users = await prismaClient.user.findMany();
  res.json(users);
});

// remover users
server.delete("/users", async (req, res) => {
  const users = await prismaClient.user.deleteMany();
  res.json(users);
});

// Configuração do multer para salvar as imagens no diretório "uploads"
const storage = multer.diskStorage({
  destination: "./uploads",
  filename: (req, file, callback) => {
    callback(null, `${Date.now()} - ${file.originalname}`);
  },
});
const upload = multer({ storage });

// Rota para receber a imagem e salvar no banco de dados
server.post("/users/:id/image", upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const { buffer } = req.file;

  try {
    const updatedUser = await prismaClient.user.update({
      where: { id: Number(id) },
      data: { image: buffer },
    });
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const PORT = 3000;
server.listen(PORT, () => console.log(`Server running at ${PORT}`));
