import { PrismaClient, Luminosidade } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Limpa a tabela antes de popular (garante a idempotência)
  await prisma.planta.deleteMany();

  // Insere as plantas de exemplo
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
        estoque: 0, // Estoque zero para testar a rota /esgotadas
        luminosidade: Luminosidade.MEIA_SOMBRA,
        petFriendly: true,
        regaACadaDias: 5,
      },
      {
        nome: "Suculenta Zebra",
        especie: "Haworthiopsis attenuata",
        preco: 1890,
        estoque: 0, // Estoque zero para testar a rota /esgotadas
        luminosidade: Luminosidade.SOL_PLENO,
        petFriendly: true,
        regaACadaDias: 14,
      },
    ],
  });

  console.log("🌱 Banco de dados populado com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });