import { readFile } from 'fs/promises';

const skins = await readFile("src/utils/skinids", "utf-8");
const stickers = await readFile("src/utils/stickerids", "utf-8");

const pricesDict = {};
const skinIDs = {};

await (async function formatIDs() {
	stickers.split("\n").forEach((line) => {
		const parts = line.split(",");
		if (parts.length === 3) {
			const stickerId = parts[0].trim();
			const stickerName = parts[1].trim();
			const stickerPrice = parseFloat(parts[2].trim());
			pricesDict[stickerName] = stickerPrice;
		}
	});
	skins.split("\n").forEach((line) => {
		const parts = line.split(";");
		const skinId = parts[0].trim();
		const skinName = parts[1].trim();
		skinIDs[skinName] = skinId;
	});
})()

export { pricesDict, skinIDs }