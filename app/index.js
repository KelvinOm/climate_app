import "../assets/styles/styles.scss";
import Chart from "./chart/";
import Controls from "./controls/";

const TEMPERATURE = require("json/temperature.json");
const PRECIPITATION = require("json/precipitation.json");

class App {
    
    constructor({elem}) {
        this._elem = elem;

        this._IDBSetting = {
            name: "climateDB",
            version: 1,
            tables: [
                {
                    tableName: "temperature",
                    autoIncrement: false
                }, {
                    tableName: "precipitation",
                    autoIncrement: false
                }
            ]
        };

        this.transaction = false;

        this._initDB();
        this.getData("temperature");
        this._render();

        // this._deleteDB();
    }

    _initDB() {
        let request = indexedDB.open(this._IDBSetting.name, this._IDBSetting.version);

        request.onsuccess = () => {
            console.log("indexedDB open success");
        };

        request.onerror = () => {
            console.log("indexedDB open fail");
        };

        request.onupgradeneeded = event => {
            console.log("init onupgradeneeded indexedDB");

            let db = event.target.result;

            if (!db.objectStoreNames.length) {
                for (let i = 0; i < this._IDBSetting.tables.length; i++) {
                    db.createObjectStore(this._IDBSetting.tables[i].tableName, {
                        autoIncrement: this._IDBSetting.tables[i].autoIncrement
                    });
                }
            }
        }
    }

    _deleteDB() {
        let request = indexedDB.deleteDatabase(this._IDBSetting.name);
        
        request.onsuccess = () => {
            console.log("Deleted indexedDB success");
        };

        request.onerror = () => {
            console.log("Couldn't delete indexedDB");
        };

        request.onblocked = () => {
            console.log("Couldn't delete indexedDB due to the operation being blocked");
        };
    }

    _addData(table) {
        let request = indexedDB.open(this._IDBSetting.name, this._IDBSetting.version);
        let getData = this.getData.bind(this);

        let data = this._createStructureForDb(table);

        request.onsuccess = () => {
            try {
                console.log("addData indexedDB open success");

                let db = request.result;
                let transaction = db.transaction([table], "readwrite");
                let objectStore = transaction.objectStore(table);
                let year = 1881;

                let addNext = function() {
                    if (year <= 2006) {
                        objectStore.add(data[year], data[year].year).onsuccess = addNext;
                        ++year;
                    } else {
                        console.log("populate complete");
                        getData(table);
                    }
                }

                addNext();

            } catch (e) {
                console.log(e);
            }
        };

        request.onerror = () => {
            console.log("addData indexedDB open fail");
        };
    }

    _createStructureForDb(table) {
        let data = {};

        let initialJSON = table === "temperature" ? TEMPERATURE : PRECIPITATION;

        for (let i = 0; i < initialJSON.length; i++) {
            let year = initialJSON[i].t.slice(0, -6);
            let month = initialJSON[i].t.slice(5).slice(0, -3);

            data[year] = data[year] ? data[year] : {};
            data[year].year = year;
            data[year][month] = data[year][month] ? data[year][month] : [];
            data[year][month].push(initialJSON[i]);
        }

        return data;
    }

    getData(table) {
        let request = indexedDB.open(this._IDBSetting.name, this._IDBSetting.version);

        this.table = table;

        request.onsuccess = () => {
            try {
                console.log("getData indexedDB open success");

                let array = [];
                let db = request.result;
                let transaction = this.transaction = db.transaction([table], "readonly");
                let objectStore = transaction.objectStore(table);

                let countRequest = objectStore.count();

                countRequest.onsuccess = () => {
                    if (!countRequest.result) {
                        console.log("can't get count");

                        this._addData(table);
                    }
                }

                countRequest.onerror = () => {
                    console.log("onerror count");
                }

                let lower = this._firstYear ? this._firstYear : "1881";
                let upper = this._lastYear ? this._lastYear : "2006";

                objectStore.openCursor(IDBKeyRange.bound(lower, upper)).onsuccess = (event) => {
                    let cursor = event.target.result;
                    if (cursor) {
                        array.push(cursor.value);
                        cursor.continue();
                    } else {
                        console.log("array load finish or cursor null");

                        db.close();
                        this.transaction = false;
                        this._getDataCallback(array, this.table);
                    }
                }
            } catch (e) {
                console.log(e);

                this.transaction = false;
                this._addData(table);
            }
        };
        
        request.onerror = () => {
            console.log("getData indexedDB open fail");
        };
    }

    _getDataCallback(array, table) {
        if (array.length) {
            this.Chart.drawChart(array, table);
        }
    }

    _render() {
        let container = this._elem.querySelector("[data-container]");

        let controls = this.controls = new Controls();
        container.appendChild(controls.getElem());

        let chart = this.Chart = new Chart();
        container.appendChild(chart.getElem());

        controls.getElem().addEventListener("get-data", (event) => {
            if (this.transaction) {
                this.transaction.abort();
            }
            chart._showPreloader();
            let table = event.detail.value;
            this.getData(table);
        });

        controls.getElem().addEventListener("change-year", (event) => {
            if (this.transaction) {
                this.transaction.abort();
            }
            chart._showPreloader();
            this._firstYear = event.detail.firstYear;
            this._lastYear = event.detail.lastYear;
            this.getData(this.table);
        });
    }
}

new App({
    elem: document.body
});
