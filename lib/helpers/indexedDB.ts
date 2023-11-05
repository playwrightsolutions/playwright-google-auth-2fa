import fs from "fs";
const authSession = ".auth/playwrightsolutions.json";

// Save data to a JSON file
export async function saveToJSON(data) {
  const jsonString = JSON.stringify(data, null, 2);
  fs.writeFile(authSession, jsonString, (err) => {
    if (err) console.log("Error writing file", err);
  });
}

// Fetch data from IndexedDB
export async function fetchDataFromIndexedDB(page) {
  return page.evaluate(
    () =>
      new Promise((resolve, reject) => {
        const request = window.indexedDB.open("firebaseLocalStorageDb", 1);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(
            ["firebaseLocalStorage"],
            "readonly"
          );
          const objectStore = transaction.objectStore("firebaseLocalStorage");
          const cursorRequest = objectStore.openCursor();
          const data = [];

          cursorRequest.onerror = () => reject("Error opening cursor.");
          cursorRequest.onsuccess = (event) => {
            const cursor = event.target.result;
            if (cursor) {
              data.push(cursor.value);
              cursor.continue();
            } else {
              resolve(data);
            }
          };
        };

        request.onerror = () => reject("Error opening database.");
      })
  );
}

// Send data to IndexedDB
export async function sendDataToIndexedDB(page) {
  let dataToRestore;
  try {
    const rawData = fs.readFileSync(authSession, "utf8");
    dataToRestore = JSON.parse(rawData);
  } catch (err) {
    console.log(`Error reading file from disk: ${err}`);
  }

  return page.evaluate(
    (dataToRestore) =>
      new Promise((resolve, reject) => {
        const request = window.indexedDB.open("firebaseLocalStorageDb", 1);

        request.onsuccess = (event) => {
          const db = event.target.result;
          const transaction = db.transaction(
            ["firebaseLocalStorage"],
            "readwrite"
          );
          const objectStore = transaction.objectStore("firebaseLocalStorage");
          const clearRequest = objectStore.clear();

          clearRequest.onsuccess = () => {
            for (const item of dataToRestore) objectStore.add(item);

            transaction.oncomplete = () =>
              resolve("Data restored to IndexedDB successfully");
            transaction.onerror = (event) =>
              reject(`Error adding data to IndexedDB: ${event.target.error}`);
          };

          clearRequest.onerror = (event) =>
            reject(`Error clearing object store: ${event.target.error}`);
        };

        request.onerror = (event) =>
          reject(`Error opening database: ${event.target.error}`);
      }),
    dataToRestore
  );
}
