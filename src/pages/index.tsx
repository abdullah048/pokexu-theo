import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useMemo, useState } from "react";
import { getOptionsForVote } from "../utils/getRandompokemon";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
	const btn =
		"inline-flex items-center px-2.5 py-1.5 border border-gray-500 shadow-sm text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
	const [firstId, secondId] = useMemo(() => getOptionsForVote(), []);
	const [num1, setNum1] = useState<number | undefined>(0);
	const [num2, setNum2] = useState<number | undefined>(0);
	useEffect(() => {
		setNum1(firstId);
		setNum2(secondId);
	}, []);
	const firstPokemon = trpc.useQuery([
		"example.get-pokemon-by-id",
		{ id: num1! },
	]);
	const secondPokemon = trpc.useQuery([
		"example.get-pokemon-by-id",
		{ id: num2! },
	]);

	if (firstPokemon.isLoading || secondPokemon.isLoading) return null;

	const voteForRoundest = (selected: number) => {
		// TODO: Fire mutations to persist changes.
		setNum1(firstId);
		setNum2(secondId);
	};

	return (
		<div className="h-screen w-screen flex justify-center flex-col items-center">
			<Head>
				<title>Pokedux</title>
			</Head>
			<div className="text-2xl text-center pb-5">
				Which Pokemon is Roundest?
			</div>
			<div className="border rounded-md p-8 flex justify-between items-center max-w-2xl">
				<div className="w-35 h-35 flex flex-col items-center capitalize">
					<img
						src={`${firstPokemon.data?.sprites}`}
						alt={`${firstPokemon.data?.name}`}
						className="w-full"
					/>
					<div>{firstPokemon.data?.name}</div>
					<button className={btn} onClick={() => voteForRoundest(num1!)}>
						Roundest
					</button>
				</div>
				<div className="p-8">VS</div>
				<div className="w-35 h-35 flex flex-col items-center capitalize">
					<img
						src={`${secondPokemon.data?.sprites}`}
						alt={`${secondPokemon.data?.name}`}
						className="w-full"
					/>
					<div>{secondPokemon.data?.name}</div>
					<button className={btn} onClick={() => voteForRoundest(num2!)}>
						Roundest
					</button>
				</div>
			</div>
		</div>
	);
};

export default Home;
