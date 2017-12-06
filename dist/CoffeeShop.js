"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CoffeeShop {
    constructor(id, name, address, latitude, longitude) {
        this.id = id;
        this.name = name;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    get getAddressInfo() {
        return this.address;
    }
    get getCoordinates() {
        return [this.name, this.latitude, this.longitude];
    }
}
exports.CoffeeShop = CoffeeShop;
