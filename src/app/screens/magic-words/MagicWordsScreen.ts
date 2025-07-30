import { Container, Sprite } from "pixi.js";
import { HTMLText } from "pixi.js";
import { Assets } from "pixi.js";
import { Texture } from "pixi.js";

import { engine } from "../../getEngine";
import { Button } from "../../ui/Button";
import { clamp } from "../../../engine/utils/maths";
import { DialogueHelper } from "./DialogueHelper";
import { PhraseText } from "./PhraseText";
import { NameText } from "./NameText";

// Interface that defines a Phrase in a Dialogue
export interface IPhrase {
  name: string,
  text: string,
}

// Interface that defines the avatar
export interface IAvatar {
  position: string,
  sprite: Sprite,
}

/** The screen that holds the app */
export class MagicWordsScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["magic-words"];
  // The API to get the Dialogue
  public static APIURL = 'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords';

  // Map that stores emojies that come from the API
  private emojies: Map<string, string> = new Map();
  // Map that store the avatar data that come from the API
  private avatars: Map<string, IAvatar> = new Map();
  // Array containing all dialogues
  private dialogue: Array<IPhrase> = [];
  // Button responsible for advancing the conversation
  private nextConversationButton: Button;
  // Button responsible for returning to previous conversation
  private prevConversationButton: Button;
  // The current phrase index in a dialogue
  private currentPhraseIndex: number = 0;
  // the main container responsible for holding all dialogue
  public mainContainer: Container;

  constructor() {
    super();

    // initializing mainContainer
    this.mainContainer = new Container();
    this.addChild(this.mainContainer);

    // initializing nextConversationButton
    this.nextConversationButton = new Button({
      text: "Next",
      width: 150,
      height: 110,
    });

    this.nextConversationButton.onPress.connect(() => {
      this.nextPhrase();
    });

    this.addChild(this.nextConversationButton);

    // initializing preConversationButton
    this.prevConversationButton = new Button({
      text: "Prev",
      width: 150,
      height: 110,
    });

    this.prevConversationButton.onPress.connect(() => {
      this.previousPhrase();
    });

    this.addChild(this.prevConversationButton);

    // Managing buttons position and start visibility
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
    const response = await fetch(MagicWordsScreen.APIURL);
    if (!response.ok) {
      throw new Error('Error fetching from API');
    }
    const data = await response.json();

    if (!data.emojies) {
      throw new Error('Error, response data invalid, missing Emojies');
    }

    // Setup the Emojis from the API
    for (const emoji of data.emojies) {
      // create a texture from the emoji URL
      const texture = await Assets.load<Texture>({src: emoji.url, loadParser: 'loadTextures'});
      // save the emoji image as base64 data, so that it can be embeded inside the HTMLText
      const base64Texture = await engine().renderer.extract.base64(texture);
      this.emojies.set(emoji.name, base64Texture);
    }

    if (!data.avatars) {
      throw new Error('Error, response data invalid, missing Avatars');
    }

    // Setup the avatars from the API
    for (const avatar of data.avatars) {
      const texture = await Assets.load<Texture>({src: avatar.url, loadParser: 'loadTextures'});
      const sprite = new Sprite(texture);
      this.avatars.set(avatar.name, { position: avatar.position, sprite });
    }

    // Setup the dialogue data from the API
    if (!data.dialogue) {
      throw new Error('Error, response data invalid, missing Dialogue');
    }

    this.dialogue = data.dialogue;
  }

  // show the initial state of the screen
  public async show(): Promise<void> {
    // Start the Dialogue
    DialogueHelper.ShowPhrase(this.dialogue[this.currentPhraseIndex], this.mainContainer, this.emojies, this.avatars);
    this.updateButtonsState();
  }

  // update buttons state based on current Phrase Index
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

  // Go to next Phrase
  private nextPhrase() {
    this.currentPhraseIndex++;
    DialogueHelper.ShowPhrase(this.dialogue[this.currentPhraseIndex], this.mainContainer, this.emojies, this.avatars);
    this.updateButtonsState();
  }

  // Go to previous Phrase
  private previousPhrase() {
    this.currentPhraseIndex--;
    DialogueHelper.ShowPhrase(this.dialogue[this.currentPhraseIndex], this.mainContainer, this.emojies, this.avatars);
    this.updateButtonsState();
  }
}
