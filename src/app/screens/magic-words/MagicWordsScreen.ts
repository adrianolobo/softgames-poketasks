import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import { Container, Sprite } from "pixi.js";
import { HTMLText } from "pixi.js";
import { Assets } from "pixi.js";
import { Texture } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { Button } from "../../ui/Button";
import { clamp } from "../../../engine/utils/maths";

interface IPhrase {
  name: string,
  text: string,
}

/** The screen that holds the app */
export class MagicWordsScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["magic-words"];

  private emojies: Map<string, string> = new Map();
  private avatars: Map<string, { position: string, sprite: Sprite}> = new Map();
  private dialogue: Array<IPhrase> = [];
  private nextConversationButton: Button;
  private prevConversationButton: Button;
  private currentPhraseIndex: number = 0;

  public mainContainer: Container;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);

    this.nextConversationButton = new Button({
      text: "Next",
      width: 150,
      height: 110,
    });

    this.nextConversationButton.onPress.connect(() => {
      this.nextPhrase();
    });

    this.addChild(this.nextConversationButton);

    this.prevConversationButton = new Button({
      text: "Prev",
      width: 150,
      height: 110,
    });

    this.prevConversationButton.onPress.connect(() => {
      this.previousPhrase();
    });

    this.addChild(this.prevConversationButton);

    const ButtonsOffset = 30;
    this.nextConversationButton.y = engine().renderer.height * 0.8;
    this.nextConversationButton.x = (engine().renderer.width * 0.5) + (this.nextConversationButton.width * 0.5) + ButtonsOffset;
    this.nextConversationButton.visible = false;

    this.prevConversationButton.y = engine().renderer.height * 0.8;
    this.prevConversationButton.x = (engine().renderer.width * 0.5) - (this.prevConversationButton.width * 0.5) - ButtonsOffset;
    this.prevConversationButton.visible = false;
  }

  /** Prepare the screen just before showing */
  public async prepare(): Promise<void> {
    const response = await fetch('https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords');
    if (!response.ok)
    {
      throw new Error('Error fetching from API');
    }
    const data = await response.json();

    if (!data.emojies)
    {
      throw new Error('Error, response data invalid');
    }

    // ARRUMAR ISSO PELO AMOR DE DEUS
    for (const emoji of data.emojies) {
      const texture = await Assets.load<Texture>({src: emoji.url, loadParser: 'loadTextures'});
      const base64Texture = await engine().renderer.extract.base64(texture);
      this.emojies.set(emoji.name, base64Texture);
    }

    if (!data.avatars)
    {
      throw new Error('Error, response data invalid');
    }

    for (const avatar of data.avatars)
    {
      const texture = await Assets.load<Texture>({src: avatar.url, loadParser: 'loadTextures'});
      const sprite = new Sprite(texture);
      this.avatars.set(avatar.name, { position: avatar.position, sprite });
      console.log(texture);
    }

    if (!data.dialogue)
    {
      throw new Error('Error, response data invalid');
    }

    this.dialogue = data.dialogue;

    console.log(data);
  }

  /** Update the screen */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public update(_time: Ticker) {
  }

  /** Pause gameplay - automatically fired when a popup is presented */
  public async pause() {
    this.mainContainer.interactiveChildren = false;
  }

  /** Resume gameplay */
  public async resume() {
    this.mainContainer.interactiveChildren = true;
  }

  /** Fully reset */
  public reset() {}

  /** Resize the screen, fired whenever window size changes */
  public resize(width: number, height: number) {
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    this.showPhrase(this.dialogue[this.currentPhraseIndex]);
    this.updateButtonsState();
  }

  private showPhrase(phrase: IPhrase)
  {
    this.mainContainer.removeChildren();
    const text = phrase.text.replace(/\{(\w+)\}/g, (match, emojiName) => {
      const emojiBase64 = this.emojies.get(emojiName);
      if (!emojiBase64) {
        console.warn(`The emoji: ${emojiName} was not found!`);
        return '';
      }; // fallback to original if not found

      return `<img src="${emojiBase64}" width="32" height="32" />`;
    });

    const textPadding = 25;
    const maxWordWarpValue = 700;
    const minWordWarpValue = 500; 
    const wordWarpWidthValue = clamp(engine().renderer.width - (textPadding * 2), minWordWarpValue, maxWordWarpValue);
    console.log(wordWarpWidthValue);

    const phraseText = new HTMLText({
      text,
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: '#e3e3e3',
        align: 'center',
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: wordWarpWidthValue,
      }
    });

    this.mainContainer.addChild(phraseText);
    phraseText.x = engine().screen.width * 0.5;
    phraseText.y = engine().screen.height * 0.5;
    phraseText.anchor = { x: 0.5, y: 0 };

    const nameText = new HTMLText({
      text: `<strong>${phrase.name}</strong>`,
      style: {
        fontFamily: 'Arial',
        fontSize: 38,
        fill: '#3a45dfff',
        align: 'center',
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: wordWarpWidthValue,
      }
    });
    
    this.mainContainer.addChild(nameText);
    nameText.x = phraseText.x;
    nameText.y = phraseText.y - textPadding;
    nameText.anchor = { x: 0.5, y: 1 };

    const avatar = this.avatars.get(phrase.name);
    if (!avatar) {
      return;
    }

    avatar.sprite.y = engine().screen.height * 0.5 - textPadding;

    if (avatar.position == "left") {
      avatar.sprite.anchor = { x: 0, y: 1 };
      avatar.sprite.x = engine().screen.width * 0.5 - wordWarpWidthValue * 0.5;
    }
    else {
      avatar.sprite.anchor = { x: 1, y: 1 };
      avatar.sprite.x = engine().screen.width * 0.5 + wordWarpWidthValue * 0.5;
    }

    this.mainContainer.addChild(avatar.sprite);
  }

  private updateButtonsState() {
    this.prevConversationButton.visible = true;
    this.nextConversationButton.visible = true;

    if (this.currentPhraseIndex === 0) {
      this.prevConversationButton.visible = false;
      return;
    }

    if (this.currentPhraseIndex === this.dialogue.length - 1) {
      this.nextConversationButton.visible = false;
      return;
    }
  }

  private nextPhrase() {
    this.currentPhraseIndex++;
    this.showPhrase(this.dialogue[this.currentPhraseIndex]);
    this.updateButtonsState();
  }

  private previousPhrase() {
    this.currentPhraseIndex--;
    this.showPhrase(this.dialogue[this.currentPhraseIndex]);
    this.updateButtonsState();
  }

  /** Hide screen with animations */
  public async hide() {}

  /** Auto pause the app when window go out of focus */
  public blur() {
    if (!engine().navigation.currentPopup) {
      engine().navigation.presentPopup(PausePopup);
    }
  }
}
