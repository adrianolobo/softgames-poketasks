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

  public mainContainer: Container;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);
  }

  // ARRUMAR ISSO PLEO AMOR DE DEUS
  async urlToBase64(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // ✅ Needed for external URLs

      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context not available');

        ctx.drawImage(img, 0, 0);

        const base64 = canvas.toDataURL('image/png');
        resolve(base64);
      };

      img.onerror = () => reject(`Failed to load image from URL: ${url}`);
      img.src = url;
    });
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
    console.log("SHOW");
    const phrase = new HTMLText({
      text: `<strong>I admit</strong> <img src="${this.emojies.get('sad')}" width="30" height="30" /> the design of Cookie Crush is quite elegant in its simplicity.`,
      style: {
        fontFamily: 'Arial',
        fontSize: 32,
        fill: '#ff1010',
        align: 'center',
        breakWords: true,
        wordWrap: true,
        wordWrapWidth: engine().renderer.width - 50,
      }
    });

    this.addChild(phrase);
    phrase.x = 25;
    phrase.y = 100;

    const avatar = this.avatars.get('Sheldon');
    if (!avatar)
    {
      return;
    }

    this.addChild(avatar.sprite);
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
