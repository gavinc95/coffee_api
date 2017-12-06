"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CoffeeShop_1 = require("../CoffeeShop");
const GreatCircleDistance_1 = require("../GreatCircleDistance");
const csv = require("fast-csv");
const fetch = require('node-fetch');
const request = require('request');
const rp = require('request-promise');
const appRoot = process.cwd();
const API_KEY = "AIzaSyCmY2GZJTOLC-CZ8GRggVHN_eBFzkYkMT4";
var coffeeMap = new Map();
var addressMap = new Map(); //Maps addresses to name/lat/long
class CoffeeRouter {
    constructor() {
        this.router = express_1.Router();
        this.init();
        CoffeeRouter.loadData();
    }
    //set up endpoints
    init() {
        this.router.get('/', this.loadData);
        this.router.get('/:id', this.getShop);
        this.router.post('/create', this.addShop);
        this.router.post('/find/', this.findNearestShop);
        this.router.put('/update', this.updateShop);
        this.router.delete('/delete/:id', this.deleteShop);
    }
    static loadData() {
        csv
            .fromPath(appRoot + '/src/locations.csv')
            .on("data", function (data) {
            data = data.toString().split(',').filter(x => x != ' ');
            const id = data[0];
            const name = data[1];
            const address = data[2];
            const lat = data[3];
            const long = data[4];
            if (!coffeeMap.has(id)) {
                const newShop = new CoffeeShop_1.CoffeeShop(id, name, address, lat, long);
                coffeeMap.set(id, newShop);
            }
        })
            .on("end", function () {
            console.log("Done loading location data.");
        });
    }
    loadData(req, res, next) {
        CoffeeRouter.loadData();
    }
    /**
     * READ example: curl http://localhost:3000/api/v1/coffee/1
     */
    getShop(req, res, next) {
        const id = String(req.params.id);
        if (coffeeMap.has(id)) {
            var shop = coffeeMap.get(id);
            return res.send('Cafe with id ' + id + ' - ' + JSON.stringify(shop, null, 3));
        }
        else {
            res.status(404)
                .send({
                message: 'No coffee shop found with the given id: ' + id,
                status: res.status
            });
        }
    }
    /**
     * CREATE example: curl --data "name=Chronic Coffee&address=New York, New York&latitude=123123&longitude=-999" http://localhost:3000/api/v1/coffee/create
     */
    addShop(req, res, next) {
        const id = String(coffeeMap.size + 10);
        const shopInfo = req.body;
        const newShop = new CoffeeShop_1.CoffeeShop(id, req.body.name, req.body.address, req.body.latitude, req.body.longitude);
        coffeeMap.set(id, newShop);
        res.send('You just created a new cafe: ' + JSON.stringify(coffeeMap.get(id), null, 3));
    }
    /**
     * UPDATE: example: curl -X PUT -d name=CatCafe -d address=California -d id=2 http://localhost:3000/api/v1/coffee/update/
     */
    updateShop(req, res, next) {
        const shopInfo = req.body;
        const id = shopInfo.id;
        if (coffeeMap.has(id)) {
            //get original info
            const originalShop = coffeeMap.get(id);
            const updatedShop = Object.assign({}, originalShop, shopInfo);
            coffeeMap.set(id, updatedShop);
            res.send('You just updated coffee shop with id: ' + id + '. ' + JSON.stringify(coffeeMap.get(id), null, 3));
            return;
        }
        else {
            res.status(404)
                .send({
                message: 'No coffee shop found with the given id: ' + id,
                status: res.status
            });
        }
    }
    /**
     * DELETE: example: curl http://localhost:3000/api/v1/coffee/1
     */
    deleteShop(req, res, next) {
        const id = req.params.id;
        if (coffeeMap.has(id)) {
            const originalShop = coffeeMap.get(id);
            coffeeMap.delete(id);
            res.send('You just deleted coffee shop with id: ' + id + '. ' + JSON.stringify(originalShop, null, 3));
        }
        else {
            res.status(404)
                .send({
                message: 'No coffee shop found with the given id: ' + id,
                status: res.status
            });
        }
    }
    /**
     * example: curl --data "address=252 Guerrero St, San Francisco, CA 94103, USA" http://localhost:3000/api/v1/coffee/find
     */
    findNearestShop(req, res, next) {
        var minDistance = 9999999;
        var closestShop = "";
        //populate addressMap
        CoffeeRouter.processAddresses(coffeeMap);
        //go through addressMap and calculate distances
        const reqAddr = req.body.address;
        const getCoords = CoffeeRouter.getCoords(reqAddr);
        var coords = {};
        getCoords.then((result) => {
            coords = result;
            // console.log('coords', coords);
            return coords;
        }, (err) => {
            console.log(err);
        })
            .then((body) => {
            var obj = body["results"][0].geometry.location;
            coords = [String(obj.lat), String(obj.lng)];
            console.log('location: ', coords);
            addressMap.forEach((loc, addr) => {
                const name = addressMap.get(addr)[0];
                const lat2 = addressMap.get(addr)[1];
                const lon2 = addressMap.get(addr)[2];
                const dist = GreatCircleDistance_1.GreatCircleDistance.getDistanceFromLatLonInKm(Number(coords[0]), Number(coords[1]), Number(lat2), Number(lon2));
                if (dist < minDistance) {
                    minDistance = dist;
                    closestShop = name;
                }
            });
            console.log('The closest shop is: ' + closestShop);
        });
    }
    static getCoords(address) {
        const options = {
            uri: 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + API_KEY,
            method: 'get',
            json: true
        };
        return new Promise((resolve, reject) => {
            request(options, (err, res, body) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(body);
                }
            });
        });
    }
    static processAddresses(coffeeMap) {
        coffeeMap.forEach((shopInfo, id) => {
            const address = coffeeMap.get(id).getAddressInfo;
            const coords = coffeeMap.get(id).getCoordinates;
            if (!addressMap.has(address)) {
                addressMap.set(address, coords);
            }
        });
    }
}
exports.CoffeeRouter = CoffeeRouter;
// Create the CoffeeRouter, and export its configured Express.Router
const coffeeRoutes = new CoffeeRouter();
coffeeRoutes.init();
exports.default = coffeeRoutes.router;
