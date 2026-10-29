import {Luminosidade, Prisma, Planta} from "@prisma/client"
import prisma from "@database"

export const createPlanta = async (data: Prisma.PlantaCreateInput) => {
    return await prisma.planta.create({
        data: data
    });
};

export const findAllPlantas = async (
filtros?: {
    luminosidade?: Luminosidade;
    petFriendly?: boolean;
    nome?: string;
}) => {
    return await prisma.planta.findMany({
        where: {
            luminosidade: filtros?.luminosidade,
            petFriendly: filtros?.petFriendly,
            ...(filtros?.nome && {nome:{
                contains: filtros.nome,
                mode: "insensitive"
            }})
        },
    });
};

export const findPlantaById = async (id: number) => {
    return await prisma.planta.findUnique({
        where:{id:id}
    });
};

export const updatePlanta = async (id: number, data: Prisma.PlantaUpdateInput) => {
    return await prisma.planta.update({
        where: {id:id},
        data: data
    });
};

export const deletePlanta = async (id: number) => {
    return await prisma.planta.delete({
        where: {id:id}
    });
};

export const decrementaEstoque = async (id: number, quantidade: number) => {
  // Cria a região crítica
  return await prisma.$transaction(async (tx) => {
    // LOCK
    const plantas = await tx.$queryRaw<Planta[]>`
      SELECT * FROM "Planta" WHERE "id" = ${id} FOR UPDATE
    `;

    const planta = plantas[0];

    if (!planta) {
      return { status: "NAO_ENCONTRADO", data: null };
    }

    if (planta.estoque < quantidade) {
      return { status: "ESTOQUE_INSUFICIENTE", data: planta };
    }

    const plantaAtualizada = await tx.planta.update({
      where: { id },
      data: { estoque: { decrement: quantidade } },
    });

    // Libera o lock automaticamente ao retornar
    return { status: "SUCESSO", data: plantaAtualizada };
  });
};

export const findPlantasPrecoEEstoque = async () => {
  return await prisma.planta.findMany({
    select: {
      preco: true,
      estoque: true,
    },
  });
};