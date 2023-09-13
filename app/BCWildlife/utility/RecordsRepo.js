import EncryptedStorage from 'react-native-encrypted-storage';

class RecordsRepo {
  static async addRecord(recordIdentifier, jsonValue) {
    // Store the value in the given key
    console.log(
      `setting item with id ${recordIdentifier} and value ${jsonValue}`,
    );
    await EncryptedStorage.setItem(recordIdentifier, jsonValue);

    // Fetch the unsynced records
    let unsyncedRecords = await EncryptedStorage.getItem('unsynced_records');
    if (!unsyncedRecords) {
      // If no unsynced records exist, create an empty array
      unsyncedRecords = [];
    } else {
      // Otherwise, parse the JSON string into an array
      unsyncedRecords = JSON.parse(unsyncedRecords);
    }

    // Add the new record identifier to the array
    if (!unsyncedRecords.includes(recordIdentifier)) {
      unsyncedRecords.push(recordIdentifier);
    }

    // Convert the array to a JSON string and store it back
    await EncryptedStorage.setItem(
      'unsynced_records',
      JSON.stringify(unsyncedRecords),
    );
  }

  static async deleteRecord(recordIdentifier) {
    try {
      await EncryptedStorage.removeItem(recordIdentifier);
    } catch (e) {
      console.warn(`Could not delete record, error: ${JSON.stringify(e)}`);
    }

    // Fetch the unsynced records
    let unsyncedRecords = await EncryptedStorage.getItem('unsynced_records');
    if (!unsyncedRecords) {
      return;
    } else {
      // Otherwise, parse the JSON string into an array
      unsyncedRecords = JSON.parse(unsyncedRecords);
    }

    // Add the new record identifier to the array
    if (!unsyncedRecords.includes(recordIdentifier)) {
      // remove an item
      unsyncedRecords = unsyncedRecords.filter(
        item => item !== recordIdentifier,
      );
    }

    // Convert the array to a JSON string and store it back
    await EncryptedStorage.setItem(
      'unsynced_records',
      JSON.stringify(unsyncedRecords),
    );
  }

  static async getUnsyncedRecords() {
    // Fetch the unsynced record identifiers
    const unsyncedRecords = await EncryptedStorage.getItem('unsynced_records');
    if (!unsyncedRecords) {
      // If no unsynced records exist, return an empty array
      return [];
    }

    // Parse the JSON string into an array
    const unsyncedRecordIdentifiers = JSON.parse(unsyncedRecords);

    // Create a temporary array to store the unsynced records
    const temp = [];

    // Loop through the unsynced record identifiers
    for (let i = 0; i < unsyncedRecordIdentifiers.length; i++) {
      const recordIdentifier = unsyncedRecordIdentifiers[i];

      // Fetch the record value from the local storage
      const recordValue = await EncryptedStorage.getItem(recordIdentifier);

      if (!recordValue) {
        continue;
      }

      // Add the record identifier and data to the temporary array
      temp.push({
        record_identifier: recordIdentifier,
        data: JSON.parse(recordValue),
      });
    }

    // Return the temporary array as a JSON string
    return JSON.stringify(temp);
  }

  static async deleteUnsyncedRecords() {
    // Fetch the list of unsynced record identifiers
    const unsyncedRecords = await EncryptedStorage.getItem('unsynced_records');
    if (!unsyncedRecords) {
      // If no unsynced records exist, there's nothing to delete
      return;
    }

    // Parse the JSON string into an array of record identifiers
    const unsyncedRecordIdentifiers = JSON.parse(unsyncedRecords);

    // Loop through each unsynced record identifier and delete its associated data
    for (let i = 0; i < unsyncedRecordIdentifiers.length; i++) {
      const recordIdentifier = unsyncedRecordIdentifiers[i];

      console.log(`trying to delete ${recordIdentifier}`);

      const item = await EncryptedStorage.getItem(recordIdentifier);
      if (item) {
        // Delete the record value from the local storage
        await EncryptedStorage.removeItem(recordIdentifier);
      } else {
        console.warn('Tried to delete non-existing item');
      }
    }

    console.log('deleted all items');

    // Delete the list of unsynced records from local storage
    await EncryptedStorage.removeItem('unsynced_records');
  }
}

export default RecordsRepo;
