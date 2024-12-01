import { Far } from '@endo/far';

export const start = () => {
  const checks = new Map();

  checks.set("1", false)

  // const getRoomCount = () => rooms.size;
  const flip = id => {
    // let count = 0;
    checks.set(id, true);
    // return room;
  };

  const verify = id => {
    checks.get(id)
  }

  return {
    publicFacet: Far('RoomMaker', { verify, flip }),
  };
};

