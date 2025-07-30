import { HTMLText } from "pixi.js";

// The HTMLText that will show the conversation
export class NameText extends HTMLText {
  constructor(name: string, wordWarpWidthValue: number) {
    super({
      text: `<strong>${name}</strong>`,
      style: {
        fontFamily: "Arial",
        fontSize: 38,
        fill: "#3a45dfff",
        align: "center",
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: wordWarpWidthValue,
      },
    });

    this.anchor = { x: 0.5, y: 1 };
  }
}
