import { createBdd, DataTable } from 'playwright-bdd';

const { Given } = createBdd();

type EntityType = 'widget';
type EntityRows = DataTable;
type EntityArgs = [EntityType, EntityRows];

Given(/the following (widget)s exist:/, ({}, ...[entityType, rows]: EntityArgs) => {
  const parsedRows = rows.hashes();

  if (entityType !== 'widget') {
    throw new Error(`Unexpected entity type: ${entityType}`);
  }

  if (parsedRows.length !== 1) {
    throw new Error(`Expected one row, got ${parsedRows.length}`);
  }
});
