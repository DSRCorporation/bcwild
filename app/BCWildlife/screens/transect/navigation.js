import {createDefaultStandForm} from './StandForm';
import {createDefaultEncounterForm} from './EncounterForm';
import {createDefaultTransectForm} from './TransectForm';
import EncryptedStorage from 'react-native-encrypted-storage';

const stateStorageKey = 'TransectEditState';

export const loadState = async () => {
  const json = await EncryptedStorage.getItem(stateStorageKey);
  return JSON.parse(json);
};

export const saveState = async state => {
  EncryptedStorage.setItem(stateStorageKey, JSON.stringify(state));
};

export const clearState = async () =>
  EncryptedStorage.removeItem(stateStorageKey);

// Transect has three screens.  These are the routes associated with the screens.
const routeNames = {
  encounter: 'TransectEncounter',
  stand: 'TransectStand',
  transect: 'Transect',
};

// It is required that:
// - stands should be sequentially numbered
// - encounters should be sequentially numbered starting with 1 and not
//   restarting between stands.
const renumberStandsEncounters = state => {
  let encounterId = 1;
  let newTransect = {
    ...state.transect,
    stands: state.transect.stands.map((stand, idx) => ({
      ...stand,
      id: (idx + 1).toString(),
      encounters: stand.encounters.map(encounter => ({
        ...encounter,
        id: encounterId++,
      })),
    })),
  };
  return {
    ...state,
    transect: newTransect,
  };
};

// Helper functions for transect's stands

const updateStand = (transect, stand) => ({
  ...transect,
  stands: transect.stands.map(s => (s.id === stand.id ? stand : s)),
});

const addStand = (transect, stand) => ({
  ...transect,
  stands: [...transect.stands, stand],
});

const doneStand = (transect, stand) => {
  const isExisting = transect.stands.find(({id}) => id === stand.id);
  return isExisting ? updateStand(transect, stand) : addStand(transect, stand);
};

const deleteStand = (transect, standId) => ({
  ...transect,
  stands: transect.stands.filter(({id}) => id !== standId),
});

// Helper functions for stand's encounters

const updateEncounter = (stand, encounter) => ({
  ...stand,
  encounters: stand.encounters.map(enc =>
    enc.id === encounter.id ? encounter : enc,
  ),
});

const addEncounter = (stand, encounter) => ({
  ...stand,
  encounters: [...stand.encounters, encounter],
});

const doneEncounter = (stand, encounter) => {
  const isExisting = stand.encounters.find(({id}) => id === encounter.id);
  return isExisting
    ? updateEncounter(stand, encounter)
    : addEncounter(stand, encounter);
};

const deleteEncounter = (stand, encounterId) => ({
  ...stand,
  encounters: stand.encounters.filter(({id}) => id !== encounterId),
});

/*
 * When we edit a transect, we pass a "state" between screens.  The state is an
 * object with the following properties:
 * - defaultValues (for defaultValues)
 * - transect
 * - stand: currently edited stand or null
 * - encounter: currently edited encounter or null
 * - prevMode: null | "transect" | "stand" | "encounter" (for choosing between
 *   navigation.navigate and navigation.goBack)
 */

export const emptyState = defaultValues => ({
  defaultValues,
  transect: createDefaultTransectForm(defaultValues),
  stand: null,
  encounter: null,
});

const maxStandEncounterId = stand =>
  stand.encounters.reduce((acc, encounter) => Math.max(acc, encounter.id), 0);

export const nextEncounterId = state =>
  state.transect.stands.reduce(
    (acc, stand) => Math.max(acc, maxStandEncounterId(stand)),
    0,
  ) + 1;

const nextStandId = state =>
  (
    state.transect.stands.reduce(
      (acc, stand) => Math.max(acc, parseInt(stand.id, 10)),
      0,
    ) + 1
  ).toString();

// State update rules associated with transect operations

const transectUpdateStateOnAddStand = (transect, defaultValues) => state => ({
  ...state,
  prevMode: 'transect',
  transect,
  stand: createDefaultStandForm(nextStandId(state), defaultValues),
  encounter: null,
});

const transectUpdateStateOnEditStand = (transect, stand) => state => ({
  ...state,
  prevMode: 'transect',
  transect,
  stand,
  encounter: null,
});

// State update rules associated with stand operations

const standUpdateStateOnDone = stand => state => {
  return renumberStandsEncounters({
    ...state,
    prevMode: 'stand',
    transect: doneStand(state.transect, stand),
    stand: null,
    encounter: null,
  });
};

const standUpdateStateOnCancel = () => state => ({
  ...state,
  prevMode: 'stand',
  stand: null,
  encounter: null,
});

const standUpdateStateOnDelete = standId => state => {
  return renumberStandsEncounters({
    ...state,
    prevMode: 'stand',
    transect: deleteStand(state.transect, standId),
    stand: null,
    encounter: null,
  });
};

const standUpdateStateOnAddEncounter = (stand, defaultValues) => state => ({
  ...state,
  prevMode: 'stand',
  stand,
  encounter: createDefaultEncounterForm({
    id: nextEncounterId(state),
    standId: stand.id,
    defaultValues,
  }),
});

const standUpdateStateOnEditEncounter = (stand, encounter) => state => ({
  ...state,
  prevMode: 'stand',
  stand,
  encounter,
});

// State update rules associated with encounter operations

const encounterUpdateStateOnDone = encounter => state => {
  const updatedStand = doneEncounter(state.stand, encounter);
  return renumberStandsEncounters({
    ...state,
    prevMode: 'encounter',
    transect: doneStand(state.transect, updatedStand),
    stand: updatedStand,
    encounter: null,
  });
};

const encounterUpdateStateOnCancel = () => state => ({
  ...state,
  prevMode: 'encounter',
  encounter: null,
});

const encounterUpdateStateOnDelete = encounterId => state => {
  const updatedStand = deleteEncounter(state.stand, encounterId);
  return renumberStandsEncounters({
    ...state,
    prevMode: 'encounter',
    transect: doneStand(state.transect, updatedStand),
    stand: updatedStand,
    encounter: null,
  });
};

// Machinery for translating state updates to callbacks

/*
 * When we invoke a callback function, we want the following:
 * - the new state is computed according to a specific rule (state transform)
 * - an action associated with the new state is performed (typically, navigate
 *   to another screen)
 * If we want to build a callback from a state transform, we have to supply the
 * original state and a function
 *   onState: (state: State) => void
 * to be applied to the resulting state.  Thus, although a state transform rule
 * cannot be transformed to a callback, it can be transformed to a function
 * with the signature
 *   (onState: (state: State) => void) => (state: State) => Callback
 * Let us call such functions "state callbacks".  Given "onState" and initial
 * state, the state callback yields a callback.
 */

// The following definition is a bit tricky, but it's easy to use, see below.
// Basically, when a callback instance is created, the value of
// "applyToCurrentState" will be a function aware of the current state and
// what to do with the new state; it takes a state transform, computes the new
// state and performs the action.

// applyToCurrentStateToCallback: (applyToCurrentState: (stateTransform: (state: State) => State)) => Callback

const updatersToStateCallback =
  applyToCurrentStateToCallback => onState => state => {
    const applyToCurrentState = async updateState => {
      const updatedState = updateState(state);
      await onState(updatedState);
    };
    return applyToCurrentStateToCallback(applyToCurrentState);
  };

const encounterStateCallback = updatersToStateCallback(applyToCurrentState => ({
  onDone: async encounter =>
    applyToCurrentState(encounterUpdateStateOnDone(encounter)),
  onCancel: async () => applyToCurrentState(encounterUpdateStateOnCancel()),
  onDelete: async encounterId =>
    applyToCurrentState(encounterUpdateStateOnDelete(encounterId)),
}));

const standStateCallback = updatersToStateCallback(applyToCurrentState => ({
  onAddEncounter: async (stand, defaultValues) => {
    applyToCurrentState(standUpdateStateOnAddEncounter(stand, defaultValues));
  },
  onEditEncounter: async (stand, encounter) =>
    applyToCurrentState(standUpdateStateOnEditEncounter(stand, encounter)),
  onDone: async stand => applyToCurrentState(standUpdateStateOnDone(stand)),
  onCancel: async () => applyToCurrentState(standUpdateStateOnCancel()),
  onDelete: async standId =>
    applyToCurrentState(standUpdateStateOnDelete(standId)),
}));

const transectStateCallback = updatersToStateCallback(applyToCurrentState => ({
  onAddStand: async (transect, defaultValues) =>
    applyToCurrentState(transectUpdateStateOnAddStand(transect, defaultValues)),
  onEditStand: async (transect, stand) =>
    applyToCurrentState(transectUpdateStateOnEditStand(transect, stand)),
}));

// In practice, when we get a new state, we want to navigate to a new screen
// taking the state as a param.
// Afterthought: "goBack" is used for encounter => stand and stand => transect.
// This is signaled by returned null.
const routeNameForState = state => {
  const {prevMode} = state;
  if (state.encounter != null) {
    return routeNames.encounter;
  }
  if (state.stand != null) {
    if (prevMode === 'encounter') {
      return null; // encounter => stand: goBack
    }
    return routeNames.stand;
  }
  // stand is null
  if (prevMode === 'stand') {
    return null; // stand => transect: goBack
  }
  return routeNames.transect;
};

const navigateOnState = navigation => async state => {
  await saveState(state);
  const routeName = routeNameForState(state);
  if (routeName == null) {
    console.debug('navigate back')
    navigation.goBack();
  } else {
    console.debug('navigate to', routeName)
    navigation.navigate(routeName);
  }
};

const navCallback =
  stateCallback =>
  ({navigation, state}) =>
    stateCallback(navigateOnState(navigation))(state);

export const encounterNavCallback = navCallback(encounterStateCallback);
export const standNavCallback = navCallback(standStateCallback);
export const transectNavCallback = navCallback(transectStateCallback);
