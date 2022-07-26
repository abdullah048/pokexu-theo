import { createRouter } from "./context";
import { z } from "zod";
import { prisma } from "../db/client";

export const exampleRouter = createRouter()
	.query("get-pokemon-by-id", {
		input: z.object({
			id: z.number(),
		}),
		async resolve({ input }) {
			const pokemon = await prisma.pokemon.findFirst({
				where: { id: input.id },
			});
			if (!pokemon) throw new Error("lol doesn't exists!");
			return pokemon;
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
					votedAgainstId: input.votedAgainst,
					votedForId: input.votedFor,
				},
			});
			return {
				success: true,
				vote: getVoteInDb,
			};
		},
	});
