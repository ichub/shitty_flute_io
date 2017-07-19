export class InMemoryDataLayer {
    private dataStore: { [editToken: string]: any };

    constructor() {
        this.dataStore = {};
    }

    save(editToken: string, data: any) {
        this.dataStore[editToken] = data;
    }

    get(editToken: string) {
        return this.dataStore[editToken] || {};
    }
}