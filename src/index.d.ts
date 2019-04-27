declare namespace Game {
	type Metal = "gold" | "silver" | "bronze";
}

declare namespace Tiled {
	type Map = {
		/** Hex-formatted color (#RRGGBB or #AARRGGBB) (optional) */
		backgroundcolor: string;
		/** Number of tile rows */
		height: number;
		/** Length of the side of a hex tile in pixels */
		hexsidelength: number;
		/** Whether the map has infinite dimensions */
		infinite: boolean;
		/** Array of Layers */
		layers: Layer[];
		/** Auto-increments for each layer */
		nextlayerid: number;
		/** Auto-increments for each placed object */
		nextobjectid: number;
		/** orthogonal, isometric, staggered or hexagonal */
		orientation: string;
		/** A list of properties (name, value, type). */
		properties: Property[];
		/** Rendering direction (orthogonal maps only) */
		renderorder: string;
		/** x or y (staggered / hexagonal maps only) */
		staggeraxis: string;
		/** odd or even (staggered / hexagonal maps only) */
		staggerindex: string;
		/** The Tiled version used to save the file */
		tiledversion: string;
		/** Map grid height */
		tileheight: number;
		/** Array of Tilesets */
		tilesets: Tileset[];
		/** Map grid width */
		tilewidth: number;
		/** map (since 1.0) */
		type: "map";
		/** The JSON format version */
		version: number;
		/** Number of tile columns */
		width: number;
	};

	interface ILayer {
		/** Row count. Same as map height for fixed-size maps. */
		height: number;
		/** Incremental id - unique across all layers */
		id: number;
		/** Name assigned to this layer */
		name: string;
		/** Horizontal layer offset in pixels (default: 0) */
		offsetx: number;
		/** Vertical layer offset in pixels (default: 0) */
		offsety: number;
		/** Value between 0 and 1 */
		opacity: number;
		/** A list of properties (name, value, type). */
		properties: Property[];
		/** tilelayer, objectgroup, imagelayer or group */
		type: "tilelayer" | "objectgroup" | "imagelayer" | "group";
		/** Whether layer is shown or hidden in editor */
		visible: boolean;
		/** Column count. Same as map width for fixed-size maps. */
		width: number;
		/** Horizontal layer offset in tiles. Always 0. */
		x: number;
		/** Vertical layer offset in tiles. Always 0. */
		y: number;
	}

	type GroupLayer = ILayer & {
		type: "group";
		/** Array of layers. */
		layers: Layer[];
	};

	type TileLayer = ILayer & {
		type: "tilelayer";
		/** Array of chunks (optional). */
		chunks?: Chunk[];
		/** zlib, gzip or empty (default). */
		compression: string;
		/** Array of unsigned int (GIDs) or base64-encoded data. */
		data: number[];
		/** csv (default) or base64. */
		encoding: "default" | "base64";
	};

	type ImageLayer = ILayer & {
		type: "imagelayer";
		/** Image used by this layer. */
		image: string;
		/** Hex-formatted color (#RRGGBB) */
		transparentcolor?: string;
	};

	type ObjectGroupLayer = ILayer & {
		type: "objectgroup";
		/** Array of objects. */
		objects?: Object[];
		/** topdown (default) or index. */
		draworder: "topdown" | "index";
	};

	type Layer = TileLayer | GroupLayer | ImageLayer | ObjectGroupLayer;

	type Chunk = {
		/** Array of unsigned int (GIDs) or base64-encoded data */
		data: number[];
		/** Height in tiles */
		height: number;
		/** Width in tiles */
		width: number;
		/** X coordinate in tiles */
		x: number;
		/** Y coordinate in tiles */
		y: number;
	};

	type Object = {
		/** Used to mark an object as an ellipse */
		ellipse: boolean;
		/** GID, only if object comes from a Tilemap */
		gid: number;
		/** Height in pixels. Ignored if using a gid. */
		height: number;
		/** Incremental id - unique across all objects */
		id: number;
		/** String assigned to name field in editor */
		name: string;
		/** Used to mark an object as a point */
		point: boolean;
		/** A list of x,y coordinates in pixels */
		polygon?: [{ x: number; y: number }];
		/** A list of x,y coordinates in pixels */
		polyline?: [{ x: number; y: number }];
		/** A list of properties (name, value, type) */
		properties: Property[];
		/** Angle in degrees clockwise */
		rotation: number;
		/** Reference to a template file, in case object is a template instance */
		template?: string;
		/** String key-value pairs */
		text: object;
		/** String assigned to type field in editor */
		type: string;
		/** Whether object is shown in editor. */
		visible: boolean;
		/** Width in pixels. Ignored if using a gid. */
		width: number;
		/** X coordinate in pixels */
		x: number;
		/** Y coordinate in pixels */
		y: number;
	};

	type Tileset = {
		/** The number of tile columns in the tileset */
		columns: number;
		/** GID corresponding to the first tile in the set */
		firstgid: number;
		/** Image used for tiles in this set */
		image: string;
		/** Width of source image in pixels */
		imagewidth: number;
		/** Height of source image in pixels */
		imageheight: number;
		/** Buffer between image edge and first tile (pixels) */
		margin: number;
		/** Name given to this tileset */
		name: string;
		/** A list of properties (name, value, type). */
		properties: unknown;
		/** Spacing between adjacent tiles in image (pixels) */
		spacing: number;
		/** The number of tiles in this tileset */
		tilecount: number;
		/** Maximum height of tiles in this set */
		tileheight: number;
		/** See <tileoffset> (optional) */
		tileoffset: object;
		/** Array of Tiles (optional) */
		tiles: Tile[];
		/** Maximum width of tiles in this set */
		tilewidth: number;
		/** Hex-formatted color (#RRGGBB) (optional) */
		transparentcolor: string;
		/** tileset (for tileset files, since 1.0) */
		type: string;
	};

	type Tile = {
		/** Array of Frames */
		animation: Frame[];
		/** Local ID of the tile */
		id: number;
		/** Image representing this tile (optional) */
		image: string;
		/** Height of the tile image in pixels */
		imageheight: number;
		/** Width of the tile image in pixels */
		imagewidth: number;
		/** Layer with type objectgroup (optional) */
		objectgroup: Layer;
		/** A list of properties (name, value, type) */
		properties: Property[];
		/** Index of terrain for each corner of tile */
		terrain: number[];
		/** The type of the tile (optional) */
		type: string;
	};

	type Frame = {
		/** Frame duration in milliseconds */
		duration: number;
		/** Local tile ID representing this frame */
		tileid: number;
	};

	type Property =
		| {
				name: string;
				type: "string" | "file" | "color";
				value: string;
		  }
		| {
				name: string;
				type: "bool";
				value: boolean;
		  }
		| {
				name: string;
				type: "float" | "int";
				value: number;
		  };
}
