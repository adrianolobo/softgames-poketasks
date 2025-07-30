import { FancyButton } from "@pixi/ui";
import { Container } from "pixi.js";
import { engine } from "../../getEngine";
import { Button } from "../../ui/Button";

import { AceOfShadowsScreen } from "../ace-of-shadows/AceOfShadowsScreen";
import { MagicWordsScreen } from "../magic-words/MagicWordsScreen";

/** The screen that holds the app */
export class MainScreen extends Container {
  /** Assets bundles required by this screen */
  public static assetBundles = ["main"];

  // The main container that holds all buttons
  public mainContainer: Container;
  // The Ace Of Shadow button that go to AceOfShadow screen
  private aceOfShadowsButton: FancyButton;
  // The MagicWordsButton button that go to MagicWords screen
  private magicWordsButton: FancyButton;

  constructor() {
    super();

    this.mainContainer = new Container();
    this.addChild(this.mainContainer);

    // Setup aceOfShadows button
    this.aceOfShadowsButton = new Button({
      text: "Ace of Shadows",
      width: 250,
      height: 110,
    });

    this.aceOfShadowsButton.onPress.connect(() => {
      engine().navigation.showScreen(AceOfShadowsScreen);
    });

    this.mainContainer.addChild(this.aceOfShadowsButton);

    // Setup magicWords button
    this.magicWordsButton = new Button({
      text: "Magic Words",
      width: 250,
      height: 110,
    });

    this.magicWordsButton.onPress.connect(() => {
      engine().navigation.showScreen(MagicWordsScreen);
    });

    this.mainContainer.addChild(this.magicWordsButton);
  }

  // Resize the screen, fired whenever window size changes
  // Postion main menu buttons
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    const centerY = height * 0.5;
    const buttonsPadding = 60;

    this.mainContainer.x = centerX;
    this.mainContainer.y = centerY;

    this.aceOfShadowsButton.y =
      -(this.aceOfShadowsButton.height * 0.5) - buttonsPadding;
  }
}
