// Campaign registry: the six scenes in order, with metadata and draw fns.
import { drawReef, reefDifferences } from './scene-reef.js';
import { drawAlpine, alpineDifferences } from './scene-alpine.js';
import { drawSouk, soukDifferences } from './scene-souk.js';
import { drawWorkshop, workshopDifferences } from './scene-workshop.js';
import { drawFair, fairDifferences } from './scene-fair.js';
import { drawObservatory, observatoryDifferences } from './scene-observatory.js';

export const SCENES = [
  { id: 'reef', title: 'Coral Kingdom', subtitle: 'A reef full of small secrets', timeLimit: 300, hints: 3, seed: 1101, draw: drawReef, differences: reefDifferences },
  { id: 'alpine', title: 'Alpine Postcard', subtitle: 'Snow, chalets and one quiet lodge', timeLimit: 285, hints: 3, seed: 2202, draw: drawAlpine, differences: alpineDifferences },
  { id: 'souk', title: 'Souk at Dusk', subtitle: 'Lanterns, spices and a patient camel', timeLimit: 270, hints: 3, seed: 3303, draw: drawSouk, differences: soukDifferences },
  { id: 'workshop', title: 'Clockwork Workshop', subtitle: 'Gears, clocks and a small robot', timeLimit: 255, hints: 3, seed: 4404, draw: drawWorkshop, differences: workshopDifferences },
  { id: 'fair', title: 'Harvest Fair', subtitle: 'Pumpkins, bunting and a high wheel', timeLimit: 240, hints: 3, seed: 5505, draw: drawFair, differences: fairDifferences },
  { id: 'observatory', title: 'Starlight Observatory', subtitle: 'The darkest, subtlest hunt of all', timeLimit: 225, hints: 3, seed: 6606, draw: drawObservatory, differences: observatoryDifferences },
];
export function sceneByIndex(i) { return SCENES[Math.max(0, Math.min(SCENES.length - 1, i))]; }
