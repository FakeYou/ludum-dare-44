import isString from "lodash/isString";

function getProperty<T>(properties: Tiled.Property[] = [], name: string): T {
	const property = properties.filter(property => property.name === name)[0];

	if (!property) {
		throw new Error(`Did not find property ${name} in ${properties}`);
	}

	return (property.value as unknown) as T;
}

function getGroupLayer(
	map: Tiled.Map | Tiled.GroupLayer,
	name: string | RegExp
): Tiled.GroupLayer | null {
	for (let layer of map.layers) {
		if (layer.type === "group") {
			if ((isString(name) && layer.name === name) || layer.name.match(name)) {
				return layer;
			}
		}
	}

	return null;
}

function getTileLayer(
	map: Tiled.Map | Tiled.GroupLayer,
	name: string | RegExp
): Tiled.TileLayer | null {
	for (let layer of map.layers) {
		if (layer.type === "tilelayer") {
			if ((isString(name) && layer.name === name) || layer.name.match(name)) {
				return layer;
			}
		}
	}

	return null;
}

function getObjectGroupLayer(
	map: Tiled.Map | Tiled.GroupLayer,
	name: string | RegExp
): Tiled.ObjectGroupLayer | null {
	for (let layer of map.layers) {
		if (layer.type === "objectgroup") {
			if ((isString(name) && layer.name === name) || layer.name.match(name)) {
				return layer;
			}
		}
	}

	return null;
}

function getImageLayer(
	map: Tiled.Map | Tiled.GroupLayer,
	name: string | RegExp
): Tiled.ImageLayer | null {
	for (let layer of map.layers) {
		if (layer.type === "imagelayer") {
			if ((isString(name) && layer.name === name) || layer.name.match(name)) {
				return layer;
			}
		}
	}

	return null;
}

export {
	getProperty,
	getGroupLayer,
	getTileLayer,
	getObjectGroupLayer,
	getImageLayer
};
