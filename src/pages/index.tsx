import type { NextPage } from 'next';
import Head from 'next/head';
import type React from 'react';
import { useEffect, useState } from 'react';
import { ThreeDots } from 'react-loader-spinner';
import { getOptionsForVote } from '../utils/getRandompokemon';

import { trpc } from '../utils/trpc';
import { inferQueryResponse } from './api/trpc/[trpc]';

import Image from 'next/image';
import Link from 'next/link';

const btn =
  'inline-flex items-center px-2.5 py-1.5 border border-gray-500 shadow-sm text-xs font-medium rounded-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';

const Home: NextPage = () => {
  const [ids, updateIds] = useState(() => getOptionsForVote());
  const [firstId, secondId] = ids;
  const [num1, setNum1] = useState<number | undefined>(0);
  const [num2, setNum2] = useState<number | undefined>(0);
  useEffect(() => {
    setNum1(firstId);
    setNum2(secondId);
  }, [firstId, secondId]);
  const firstPokemon = trpc.useQuery([
    'example.get-pokemon-by-id',
    { id: num1! },
  ]);
  const secondPokemon = trpc.useQuery([
    'example.get-pokemon-by-id',
    { id: num2! },
  ]);

  const voteMutation = trpc.useMutation(['example.vote-pokemon']);

  const voteForRoundest = (selected: number) => {
    if (selected === num1) {
      voteMutation.mutate({ votedFor: num1!, votedAgainst: num2! });
    } else {
      voteMutation.mutate({ votedFor: num2!, votedAgainst: num1! });
    }
    updateIds(getOptionsForVote());
  };

  return (
    <div>
      {firstPokemon.isLoading && secondPokemon.isLoading ? (
        <div className='flex items-center flex-col justify-center h-screen w-screen'>
          <>
            <ThreeDots
              height='80'
              width='80'
              radius='9'
              color='white'
              ariaLabel='three-dots-loading'
            />
            <div className='capitalize text-6xl'>Page is Loading... (SSR)</div>
          </>
        </div>
      ) : (
        <div className='h-screen w-screen flex justify-center flex-col items-center relative'>
          <Head>
            <title>Pokedux</title>
          </Head>
          <div className='text-2xl text-center pb-5'>
            Which Pokemon is Roundest?
          </div>
          <div className='border rounded-md p-8 flex justify-between items-center max-w-2xl'>
            {!firstPokemon.isLoading &&
              firstPokemon.data &&
              !secondPokemon.isLoading &&
              secondPokemon.data && (
                <>
                  <PokemonList
                    pokemon={firstPokemon.data}
                    vote={() => voteForRoundest(num1!)}
                  />
                  <div className='p-8'>VS</div>
                  <PokemonList
                    pokemon={secondPokemon.data}
                    vote={() => voteForRoundest(num2!)}
                  />
                </>
              )}
          </div>
          <div className='absolute bottom-0 w-full text-xl text-center pb-5'>
            <Link
              className={`${btn}`}
              href='https://craftzfox-biolinks.netlify.app/'>
              Bio-Links
            </Link>
            {' | '}
            <Link className={`${btn}`} href='/results'>
              Results
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

type PokemonFromServer = inferQueryResponse<'example.get-pokemon-by-id'>;

const PokemonList: React.FC<{
  pokemon: PokemonFromServer;
  vote: () => void;
}> = props => {
  return (
    <div className='flex flex-col items-center '>
      <Image
        src={`${props.pokemon.spriteUrl}`}
        alt={`${props.pokemon.name}`}
        width={100}
        height={100}
        // className="w-35 h-35"
      />
      {/* <div>{props.pokemon.name}</div> */}
      <button className={`${btn} capitalize`} onClick={() => props.vote()}>
        {props.pokemon.name}
      </button>
    </div>
  );
};

export default Home;
