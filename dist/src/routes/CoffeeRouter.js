"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const fs = require('fs');
var csv = require("fast-csv");
const appRoot = process.cwd();
let coffeeMap = new Map();
class CoffeeRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
    }
    init() {
        this.router.get('/', this.getAllLocations);
    }
    static loadData() {
        csv
            .fromPath(appRoot + '/src/locations.csv')
            .on("data", function (data) {
            data = data.toString().split(',');
            console.log(data[1]);
            // let split_line = line_str.split(',');
            // const id: number = line
        })
            .on("end", function () {
            console.log("Done.");
        });
    }
    getAllLocations(req, res, next) {
        CoffeeRouter.loadData();
        // res.send()
    }
    getAll(req, res, next) {
        res.send('hello i am groot.');
    }
}
exports.CoffeeRouter = CoffeeRouter;
// Create the CoffeeRouter, and export its configured Express.Router
const coffeeRoutes = new CoffeeRouter();
coffeeRoutes.init();
exports.default = coffeeRoutes.router;
