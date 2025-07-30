import { Sprite, Texture } from "pixi.js";

export class Card extends Sprite {

  constructor() {
    super({ texture: Texture.from("card-1.jpeg"), anchor: 0.5, scale: 0.35 });
  }
}
