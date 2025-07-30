import { FancyButton } from "@pixi/ui";
import { animate } from "motion";
import type { AnimationPlaybackControls } from "motion/react";
import type { Ticker } from "pixi.js";
import { Container } from "pixi.js";

import { engine } from "../../getEngine";
import { PausePopup } from "../../popups/PausePopup";
import { Button } from "../../ui/Button";
import { Card } from "./Card";


/** The screen that holds the app */
export class AceOfShadowsScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["ace-of-shadows"];

  public mainContainer: Container;

  private cards: Card[] = [];

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);
    this.sortableChildren = true;

    for (let index = 0; index < 141; index++) {
        const card = new Card();
        this.cards.push(card);
        this.mainContainer.addChild(card);
    }
  }

  /** Prepare the screen just before showing */
  public prepare() {}

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
    console.log(width);
    console.log(height);
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    
    console.log("resize");

    this.cards.forEach((card, index) => {
      const cardInitialBasePositionY = height * 0.2;
      const cardOffset = (index * 0.5);
      card.x = centerX + cardOffset;
      card.y = cardInitialBasePositionY + cardOffset;
      card.zIndex = index;
    });
  }

  /** Show screen with animations */
  public async show(): Promise<void> {
    console.log(this);
    const elementsToAnimate:Button[] = [
      /*
      this.pauseButton,
      this.settingsButton,
      this.addButton,
      this.removeButton,
      */
    ];
    console.log("show");
    let finalPromise!: AnimationPlaybackControls;
    for (const element of elementsToAnimate) {
      element.alpha = 0;
      finalPromise = animate(
        element,
        { alpha: 1 },
        { duration: 0.3, delay: 0.75, ease: "backOut" },
      );
    }
    for (let index = this.cards.length - 1; index >= 0; index--) {
      const card = this.cards[index];
      const offsetPosition = (this.cards.length - index) * 0.5;
      const cardFinalPositionY = (engine().renderer.height * 0.9) - (card.height * 0.5) + offsetPosition;
      const cardFinalPositionX = (engine().renderer.width * 0.5) + offsetPosition;
      
      /*
      const cardInitialBasePositionY = height * 0.2;
      const cardOffset = (index * 0.5);
      card.x = centerX + cardOffset;
      card.y = cardInitialBasePositionY + cardOffset;
      card.zIndex = index;
      */

      animate(
        card, 
        { y: cardFinalPositionY, x: cardFinalPositionX },
        { duration: 2, delay: this.cards.length - index, onUpdate: () => {
          if (card.y < engine().renderer.height * 0.5)
            return;
          card.zIndex = this.cards.length - index;
        }},
      );
    }

    await finalPromise;
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
