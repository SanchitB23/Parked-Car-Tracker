import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase('places.db');

export const init = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
          'CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, imageUri TEXT NOT NULL, address TEXT NOT NULL, lat REAL NOT NULL, lng REAL NOT NULL, note TEXT NOT NULL);',
          [],
          () => {
            resolve();
          },
          (_, err) => {
            reject(err);
          }
      );
    });
  });
};

export const insertPlace = (title, imageUri, address, lat, lng, note) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
          `INSERT INTO places (title, imageUri, address, lat, lng, note) VALUES (?, ?, ?, ?, ?,?);`,
          [title, imageUri, address, lat, lng, note],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
          }
      );
    });
  });
};

export const fetchPlaces = () => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
          'SELECT * FROM places',
          [],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
          }
      );
    });
  });
};

export const deletePlace = (id) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
          `DELETE FROM places WHERE id = ?`,
          [id],
          (_, result) => {
            resolve(result);
          },
          (_, err) => {
            reject(err);
          }
      );
    });
  });
};
