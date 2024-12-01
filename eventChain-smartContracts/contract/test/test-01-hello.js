import '@endo/init';
import { E } from '@endo/far';
// eslint-disable-next-line import/no-unresolved -- https://github.com/avajs/ava/issues/2951
import test from 'ava';
import * as state from '../src/hello-world.js';

test('state', async t => {
    const { publicFacet } = state.start();
    // const actual = await E(publicFacet).verify("1");
    // t.is(actual, false);
    await E(publicFacet).flip("1");
    const changed = await E(publicFacet).verify("1");
    t.is(changed, true);
    // t.is(await E(publicFacet).getRoomCount(), 1);
  });