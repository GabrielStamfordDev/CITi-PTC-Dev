import { PrismaClient, Luminosidade } from "@prisma/client";

const prisma = new PrismaClient();

try {
  // Limpa a tabela antes de popular para garantir idempotência 
  // ao rodar o seed várias vezes
  await prisma.planta.deleteMany();

  await prisma.planta.createMany({
    data: [
      {
        nome: "Costela-de-Adão",
        especie: "Monstera deliciosa",
        preco: 8500,
        estoque: 12,
        luminosidade: Luminosidade.MEIA_SOMBRA,
        petFriendly: false,
        regaACadaDias: 4,
      },
      {
        nome: "Espada-de-São-Jorge",
        especie: "Dracaena trifasciata",
        preco: 3500,
        estoque: 20,
        luminosidade: Luminosidade.SOL_PLENO,
        petFriendly: false,
        regaACadaDias: 15,
      },
      {
        nome: "Maranta Calathea",
        especie: "Calathea orbifolia",
        preco: 6200,
        estoque: 8,
        luminosidade: Luminosidade.SOMBRA,
        petFriendly: true,
        regaACadaDias: 3,
      },
      {
        nome: "Palmeira Areca",
        especie: "Dypsis lutescens",
        preco: 12000,
        estoque: 0,
        luminosidade: Luminosidade.MEIA_SOMBRA,
        petFriendly: true,
        regaACadaDias: 5,
      },
      {
        nome: "Suculenta Zebra",
        especie: "Haworthiopsis attenuata",
        preco: 1890,
        estoque: 0,
        luminosidade: Luminosidade.SOL_PLENO,
        petFriendly: true,
        regaACadaDias: 14,
      },
    ],
  });
} catch (error) {
  console.error(error);
} finally {
  await prisma.$disconnect();
}