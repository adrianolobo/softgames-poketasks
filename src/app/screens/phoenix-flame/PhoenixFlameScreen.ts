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

/** The screen that holds the app */
export class PhoenixFlameScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["phoenix-flame"];

  public mainContainer: Container;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);
  }

  /** Prepare the screen just before showing */
  public async prepare(): Promise<void> {
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
