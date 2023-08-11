import EncryptedStorage from 'react-native-encrypted-storage';
import {getWithAuth} from '../../../network/auth';
import {listbridges_url} from '../../../network/path';

/*
 * The `useBridges` hook provides a few utilities for manipulating bridges.
 *
 * MOT ID serves as the bridge identifier.
 *
 * allBridges: return a list of all known bridges (fetched and locally created)
 * bridgeList: return a list of bridges to be displayed on the Bridge List
 *   screen.
 * bridgeChoices: a list of bridges to choose from on the Bat Survey screen.
 * pullBridges: fetch a complete list of bridges from the server and store it
 *   locally.
 * updateBridgeLocally: save a bridge description locally, creating it or
 *   modifying existing one.  It should be available to the Bat Survey and
 *   Bridge List screens.
 * bridgeByMotId: get a bridge DTO by MOT ID.  In theory, this may involve
 *   querying the server.
 *
 * It is unclear how much flexibility is needed for pushing bridges.  Current
 * strategy is to push locally created bridges together with other locally
 * created records in one go from the Profile screen.  Hence no `pushBridges`
 * function is provided.
 *
 *
 *                            Current implementation
 *
 * pullBridges: retrieves a complete list of BridgeDto's and stores it locally.
 *   The set of locally created bridges is cleaned up.
 *   NOTE: This way all the bridges are available for offline editing.
 *   NOTE: May be too heavy on memory if there are a lot of bridges in
 *     the DB.  If no editing is needed, only MOT IDs and perhaps names should be
 *     sufficient.
 * allBridges: lists both loaded from the server and locally created bridges.
 * bridgeList: same as allBridges
 *   NOTE: this may amount to hundreds of bridges; are they all needed?
 * bridgeChoices: same as allBridges
 *   NOTE: too many bridges: this is most certainly inconvenient for the user.
 * updateBridgeLocally: stores a bridge DTO in local storage
 * bridgeByMotId: finds the DTO among fetched and locally created bridges.
 *
 *
 *                            Possible improvements
 *
 * UX: ideally, bridgeChoices should be a fairly short list like "favorite" or
 * "recently used".  The choice of the of the bridge on the Bat Survey screen
 * can be iterative:
 * - suggest bridgeChoices
 * - if the bridge is not there, press "More" to choose from allBridges
 * - if the bridge does not exist, press "Create" to create one.
 *
 * bridgeList: its function is unclear.  Maybe the user would be interested in
 * a shorter list of "favorite" bridges
 *
 * Memory: pullBridges may fetch only the bare minimum of info: name and MOT
 * ID.  This would restrict offline editing.  However, editing strategy may be
 * more or less like this:
 * - "favorite" bridges are editable offline
 * - other bridges are editable online: details are not stored locally but
 *   fetched on demand
 * What's more, once the favorite bridges are set up, the user may have no
 * interest in other bridges.
 *
 * UX: maybe visual cues may be provided to the user as for: locally
 * created/modified bridges, etc.
 */

// EncryptedStorage is used for local storage.  The data is accessible using
// the key ENCRYPTED_STORAGE_KEY.  The bridge storage is an object with the
// properties `fetched` (for data loaded from the server) and `local` (for
// locally created bridges).

const ENCRYPTED_STORAGE_KEY = 'bridges';

const getStoredBridges = async () => {
  const storage = await EncryptedStorage.getItem(ENCRYPTED_STORAGE_KEY);
  if (storage == null) {
    return {fetched: [], local: []};
  }
  return JSON.parse(storage);
};

const setStoredBridges = async newStorage => {
  const stringified = JSON.stringify(newStorage);
  await EncryptedStorage.setItem(ENCRYPTED_STORAGE_KEY, stringified);
};

const updateFetchedBridges = async fetched => {
  const currentStorage = await getStoredBridges();
  const newStorage = {...currentStorage, fetched};
  await setStoredBridges(newStorage);
};

const updateLocalBridges = async local => {
  const currentStorage = await getStoredBridges();
  const newStorage = {...currentStorage, local};
  await setStoredBridges(newStorage);
};

// hook API
const allBridges = async () => {
  const {fetched, local} = await getStoredBridges();
  // local bridges override fetched ones
  const localIds = new Set(local.map(({bridgeMotId}) => bridgeMotId));
  const isNotLocal = ({bridgeMotId}) => !localIds.has(bridgeMotId);
  const all = fetched.filter(isNotLocal).concat(local);
  return all.map(({bridgeName, bridgeMotId}) => ({bridgeName, bridgeMotId}));
};

const bridgeByMotId = async bridgeMotId => {
  const {fetched, local} = await getStoredBridges();
  const hasThisModId = bridge => bridge.bridgeMotId === bridgeMotId;
  // local bridges override fetched ones
  return local.find(hasThisModId) || fetched.find(hasThisModId);
};

// hook API
const bridgeList = allBridges;
// hook API
const bridgeChoices = allBridges;

// hook API
const updateBridgeLocally = async bridgeDto => {
  const {local} = await getStoredBridges();
  const newLocal = local.filter(
    ({bridgeMotId}) => bridgeMotId !== bridgeDto.bridgeMotId,
  );
  newLocal.push(bridgeDto);
  updateLocalBridges(newLocal);
};

const pullBridges = async () => {
  const [store, response] = await Promise.all([
    getStoredBridges(),
    getWithAuth(listbridges_url),
  ]);
  const newFetched = response.data.bridges;
  const {local} = store;
  const newFetchedIds = new Map(
    newFetched.map(({bridgeMotId, timestamp}) => [bridgeMotId, timestamp]),
  );
  const isNotNewlyFetched = ({bridgeMotId, timestamp}) =>
    !newFetchedIds.has(bridgeMotId) ||
    timestamp > newFetchedIds.get(bridgeMotId);
  const newLocal = local.filter(isNotNewlyFetched);
  await setStoredBridges({fetched: newFetched, local: newLocal});
};

export const useBridges = () => ({
  bridgeList, // () => List<{ bridgeName?: string, bridgeMotId: string }>
  allBridges, // () => List<{ bridgeName?: string, bridgeMotId: string }>
  bridgeChoices, // () => List<{ bridgeName?: string, bridgeMotId: string }>
  pullBridges, // async () => void
  updateBridgeLocally, // async (bridgeDto: BridgeDto) => void
  bridgeByMotId, // async (motId: string) => BridgeDto | null
});
