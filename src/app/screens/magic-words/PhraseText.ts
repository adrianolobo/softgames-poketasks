import { HTMLText } from "pixi.js";
import { engine } from "../../getEngine";

// The HTMLText that will show the conversation
export class PhraseText extends HTMLText {
  constructor(text: string, wordWarpWidthValue: number) {
    super({
      text,
      style: {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "#e3e3e3",
        align: "center",
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: wordWarpWidthValue,
      },
    });

    this.x = engine().screen.width * 0.5;
    this.y = engine().screen.height * 0.5;
    this.anchor = { x: 0.5, y: 0 };
  }
}
