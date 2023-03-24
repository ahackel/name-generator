import test from 'ava';
import { NameGen } from '../js/namegen.js';

test('randomInt returns a random integer within the given range', t => {
  const nameGen = new NameGen();
  const min = 1;
  const max = 10;
  const randomInt = nameGen.randomInt(min, max);
  t.true(randomInt >= min && randomInt <= max);
});