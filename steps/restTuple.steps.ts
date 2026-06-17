import { expect } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

const { Given, Then } = createBdd();

type DataHash<T extends keyof Entities> = { hashes: () => Entities[T][] };
type Entities = {
  person: {
    Name: string,
    Age: number,
    Country: string
  },
  animal: {
    Name: string,
    Age: number,
    Species: string,
  }
};

type EntityArgs<T extends keyof Entities> ={[key in keyof Entities]: [key, DataHash<key>] }[T];

Given(/the following (person|animal)s exist:/, ({}, ...args: EntityArgs<keyof Entities>) => {
  const [type, list] = args;
  switch (type) {
    case 'person':
      handlePerson(list);
      break;
    case 'animal':
      handleAnimal(list);
      break;
    default:
      throw new Error(`Unknown entity type: ${args[0]}`);
  }
});

Then('everything is fine', () => {
  expect(true).toBe(true);
});

function handleAnimal(list: EntityArgs<'animal'>[1]) {
  const animals = list.hashes();
  console.log('Handling animals:', animals);
}

function handlePerson(list: EntityArgs<'person'>[1]) {
  const people = list.hashes();
  console.log('Handling people:', people);
}
