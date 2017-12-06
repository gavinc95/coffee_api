export class CoffeeShop {
	name: string;
	address: string;
	id: string;
	latitude: string;
	longitude: string;

	constructor(id: string, name: string, address: string, latitude: string, longitude: string) {
		this.id = id;
		this.name = name;
		this.address = address;
		this.latitude = latitude;
		this.longitude = longitude;
	}

	get getAddressInfo(): string {
		return this.address;
	}

	get getCoordinates(): string[] {
		return [this.name, this.latitude, this.longitude];
	}
}
