import MurmurHash2 from './mur-mur-hash-2';

export default function hashGenome(genome) {
  const str = genome.toString();
  const hash32 = MurmurHash2(str, 1256);
  const base36 = hash32.toString(36).toUpperCase();
  const padded = ('00000000' + base36).slice(-8);

  return '#' + padded;
}
