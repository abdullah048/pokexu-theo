import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

import { PokemonClient } from "pokenode-ts";

export const exampleRouter = createRouter()
	.query("get-pokemon-by-id", {
		input: z.object({
			id: z.number(),
		}),
		async resolve({ input }) {
			const api = new PokemonClient();
			const pokemon = await api.getPokemonById(input.id);
			if (!pokemon) throw new Error(`Pokemon Not found!`);
			return { name: pokemon.name, sprites: pokemon.sprites.front_default };
		},
	})
	.mutation("vote-pokemon", {
		input: z.object({
			votedFor: z.number(),
			votedAgainst: z.number(),
		}),
		async resolve({ input }) {
			const getVoteInDb = await prisma.vote.create({
				data: {
					...input,
				},
			});
			return {
				success: true,
				vote: getVoteInDb,
			};
		},
	});
