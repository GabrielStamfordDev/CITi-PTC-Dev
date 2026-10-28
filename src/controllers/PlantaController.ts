import { Request, Response } from "express";
import { Luminosidade } from "@prisma/client";
import * as PlantaRepository from "../repositories/PlantaRepository";

const validatePlantaFields = (fields: {
  nome?: unknown;
  especie?: unknown;
  preco?: unknown;
  estoque?: unknown;
  luminosidade?: unknown;
  petFriendly?: unknown;
  regaACadaDias?: unknown;
}): string | null => {
  const {
    nome,
    especie,
    preco,
    estoque,
    luminosidade,
    petFriendly,
    regaACadaDias,
  } = fields;

  if (
    nome !== undefined &&
    !(typeof nome === "string" && nome.trim() !== "")
  ) {
    return "O campo 'nome' deve ser um texto não vazio.";
  }

  if (
    especie !== undefined &&
    !(typeof especie === "string" && especie.trim() !== "")
  ) {
    return "O campo 'especie' deve ser um texto não vazio.";
  }

  if (
    preco !== undefined &&
    !(typeof preco === "number" && Number.isInteger(preco) && preco > 0)
  ) {
    return "O campo 'preco' deve ser um número inteiro maior que zero.";
  }

  if (
    estoque !== undefined &&
    !(typeof estoque === "number" && Number.isInteger(estoque) && estoque >= 0)
  ) {
    return "O campo 'estoque' deve ser um número inteiro maior ou igual a zero.";
  }

  if (
    luminosidade !== undefined &&
    !(
      typeof luminosidade === "string" &&
      Object.values(Luminosidade).includes(luminosidade as Luminosidade)
    )
  ) {
    return "O campo 'luminosidade' deve ser SOMBRA, MEIA_SOMBRA ou SOL_PLENO.";
  }

  if (petFriendly !== undefined && !(typeof petFriendly === "boolean")) {
    return "O campo 'petFriendly' deve ser um booleano (true ou false).";
  }

  if (
    regaACadaDias !== undefined &&
    !(
      typeof regaACadaDias === "number" &&
      Number.isInteger(regaACadaDias) &&
      regaACadaDias >= 1
    )
  ) {
    return "O campo 'regaACadaDias' deve ser um número inteiro maior ou igual a 1.";
  }

  return null;
};

export const createPlanta = async (req: Request, res: Response) => {
  try {
    const {
      nome,
      especie,
      preco,
      estoque,
      luminosidade,
      petFriendly,
      regaACadaDias,
    } = req.body;

    if (
      nome === undefined ||
      especie === undefined ||
      preco === undefined ||
      estoque === undefined ||
      luminosidade === undefined ||
      petFriendly === undefined ||
      regaACadaDias === undefined
    ) {
      return res.status(400).json({
        message:
          "Todos os campos (nome, especie, preco, estoque, luminosidade, petFriendly, regaACadaDias) são obrigatórios.",
      });
    }

    const validationError = validatePlantaFields({
      nome,
      especie,
      preco,
      estoque,
      luminosidade,
      petFriendly,
      regaACadaDias,
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const planta = await PlantaRepository.createPlanta({
      nome: nome,
      especie: especie,
      preco: preco,
      estoque: estoque,
      luminosidade: luminosidade,
      petFriendly: petFriendly,
      regaACadaDias: regaACadaDias,
    });

    return res.status(201).json(planta);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar planta." });
  }
};


export const readAllPlantas = async (req: Request, res: Response) => {
  try {
    const { luminosidade, petFriendly} = req.query;

    let ValidaLuminosidade: Luminosidade | undefined = undefined;

    let ValidapetFriendly: boolean | undefined = undefined;

    if (luminosidade !== undefined){
        if(!(typeof luminosidade === "string" && Object.values(Luminosidade).includes(luminosidade as Luminosidade))){
            return res.status(400).json({
            message:
            "Filtro 'luminosidade' inválido. Use SOMBRA, MEIA_SOMBRA ou SOL_PLENO.",
            });
        }
        ValidaLuminosidade = luminosidade as Luminosidade;
    }

    if (petFriendly !== undefined){
        if(!(typeof petFriendly === "string" && (petFriendly === "true" || petFriendly === "false"))){
            return res.status(400).json({
            message: "Filtro 'petFriendly' inválido. Use true ou false.",
            });
        }
        ValidapetFriendly = petFriendly === "true";
    }

    const plantas = await PlantaRepository.findAllPlantas({
        luminosidade: ValidaLuminosidade,
        petFriendly: ValidapetFriendly,
    });
    return res.status(200).json(plantas);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar plantas." });
  }
};

export const readPlantaById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!(Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: "O id informado deve ser um número inteiro positivo.",
      });
    }

    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    return res.status(200).json(planta);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao buscar planta" });
  }
};

export const updatePlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!(Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: "O id informado deve ser um número inteiro positivo.",
      });
    }

    const existingPlanta = await PlantaRepository.findPlantaById(id);
    if (!existingPlanta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    const {
      nome,
      especie,
      preco,
      estoque,
      luminosidade,
      petFriendly,
      regaACadaDias,
    } = req.body;

    const validationError = validatePlantaFields({
      nome,
      especie,
      preco,
      estoque,
      luminosidade,
      petFriendly,
      regaACadaDias,
    });

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const planta = await PlantaRepository.updatePlanta(id, {
      nome: nome,
      especie: especie,
      preco: preco,
      estoque: estoque,
      luminosidade: luminosidade,
      petFriendly: petFriendly,
      regaACadaDias: regaACadaDias,
    });

    return res.status(200).json(planta);
  } catch (error) {
    return res.status(500).json({ message: "Erro ao atualizar Planta" });
  }
};

export const deletePlanta = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (!(Number.isInteger(id) && id > 0)) {
      return res.status(400).json({
        message: "O id informado deve ser um número inteiro positivo.",
      });
    }

    const existingPlanta = await PlantaRepository.findPlantaById(id);
    if (!existingPlanta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    await PlantaRepository.deletePlanta(id);
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: "Erro ao deletar Planta" });
  }
};

export const venderPlanta = async (req: Request, res: Response) => {
    try{
        const id = Number(req.params.id);

        if (!(Number.isInteger(id) && id > 0)) {
        return res.status(400).json({
            message: "O id informado deve ser um número inteiro positivo.",
        });
        }

        const { quantidade } = req.body;

        if (!(Number.isInteger(quantidade) && quantidade > 0)) {
        return res.status(400).json({
        message:
          "O campo 'quantidade' é obrigatório e deve ser um número inteiro maior que zero.",
        });
    }

    const planta = await PlantaRepository.findPlantaById(id);

    if (!planta) {
      return res.status(404).json({ message: "Planta não encontrada." });
    }

    if (planta.estoque < quantidade) {
      return res.status(400).json({
        message: `Estoque insuficiente. Temos só ${planta.estoque} vasos disponíveis.`,
      });
    }
    const plantaAtualizada = await PlantaRepository.decrementaEstoque(
      id,
      quantidade
    );

    return res.status(200).json(plantaAtualizada);
    }
    catch{
        return res.status(500).json({ message: "Erro ao realizar venda da Planta" });
    }
}