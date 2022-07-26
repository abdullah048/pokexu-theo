import { PokemonClient } from "pokenode-ts";
import { prisma } from "../src/server/db/client";

const doDbFill = async () => {
	const pokiApi = new PokemonClient();
	const allPokemons = await pokiApi.listPokemons(0, 500);
	const formattedPokemons = allPokemons.results.map((p, index) => ({
		id: index + 1,
		name: <string>p.name,
		spriteUrl: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/${
			index + 1
		}.png`,
	}));
	console.log("Pokemon:", allPokemons);
	const creation = await prisma.pokemon.createMany({
		data: formattedPokemons,
	});
	console.log("creation:", creation);
};

doDbFill();
