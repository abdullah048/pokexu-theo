import React from "react";
import { prisma } from "../server/db/client";
import type { GetStaticProps } from "next";
import { AsyncReturnType } from "../utils/aysncReturnType";
import Image from "next/image";

type pokemonQueryResult = AsyncReturnType<typeof getPokemonInOrder>;

const generateCountPercentage = (pokemon: pokemonQueryResult[number]) => {
	const { VoteFor, VoteAgainst } = pokemon._count;
	if (VoteFor + VoteAgainst === 0) return 0;
	return (VoteFor / (VoteFor + VoteAgainst)) * 100;
};

const VotingResults: React.FC<{ pokemon: pokemonQueryResult[number] }> = ({
	pokemon,
}) => {
	return (
		<div className="flex border-b p-2 items-center justify-between">
			<div className="flex items-center p-3 ">
				<Image
					src={`${pokemon.spriteUrl}`}
					alt={pokemon.name}
					width={64}
					height={64}
					layout="fixed"
				/>
				<div className="capitalize">{pokemon.name}</div>
			</div>
			<div>{generateCountPercentage(pokemon) + "%"}</div>
		</div>
	);
};

const getPokemonInOrder = async () => {
	return await prisma.pokemon.findMany({
		orderBy: {
			VoteFor: {
				_count: "desc",
			},
		},
		select: {
			id: true,
			name: true,
			spriteUrl: true,
			_count: {
				select: {
					VoteFor: true,
					VoteAgainst: true,
				},
			},
		},
	});
};

const ResultPage: React.FC<{
	pokemon: pokemonQueryResult;
}> = ({ pokemon }) => {
	return (
		<div className="flex flex-col items-center">
			<h2 className="text-4xl text-center p-5">Results</h2>
			<div className="flex flex-col w-full max-w-2xl border rounded-xl p-5">
				{pokemon
					.sort(
						(a, b) => generateCountPercentage(b) - generateCountPercentage(a)
					)
					.map((poki, index) => (
						<VotingResults pokemon={poki} key={index} />
					))}
			</div>
		</div>
	);
};

export const getStaticProps: GetStaticProps = async (props) => {
	const pokemonOrdered = await getPokemonInOrder();
	return {
		props: {
			pokemon: pokemonOrdered,
		},
		revalidate: 60,
	};
};

export default ResultPage;
