import MurmurHash2 from './mur-mur-hash-2';

export default function hashGenome(genome) {
  const str = genome.genesToString();
  const hash32 = MurmurHash2(str, 1256);
  const base36 = hash32.toString(36).toUpperCase();
  const padded = ('000000' + base36).slice(-7);

  return '#' + padded;
}
