import { animate } from "motion";
import { Container } from "pixi.js";
import { engine } from "../../getEngine";
import { Card } from "./Card";
import { BackMainMenuButton } from "../../globals/BackMainMenuButton";

// The Card Shuffle Ace Of Shaddow
export class AceOfShadowsScreen extends Container {
  // Assets bundles required by this screen
  public static assetBundles = ["ace-of-shadows"];

  // Container that will hold the deck
  public mainContainer: Container;
  // single card that will be animated
  private cards: Card[] = [];
  // the button responsible for going back to Main Menu
  private backToMainMenuButton: BackMainMenuButton;

  constructor() {
    super();

    // initializing backToMainMenu button
    this.backToMainMenuButton = new BackMainMenuButton();
    this.addChild(this.backToMainMenuButton);

    // initializing mainContainer
    this.mainContainer = new Container();
    this.addChild(this.mainContainer);
    this.sortableChildren = true;

    // initializing Cards in Deck
    const totalNumberOfCardsInDeck = 144;
    for (let index = 0; index < totalNumberOfCardsInDeck; index++) {
      const card = new Card();
      this.cards.push(card);
      this.mainContainer.addChild(card);
    }
  }

  // Resize the screen, fired whenever window size changes
  public resize(width: number, height: number) {
    const centerX = width * 0.5;
    // Reposition all screen cards
    this.cards.forEach((card, index) => {
      const cardInitialBasePositionY = height * 0.2;
      const cardOffset = index * 0.5;
      card.x = centerX + cardOffset;
      card.y = cardInitialBasePositionY + cardOffset;
      card.zIndex = index;
    });
  }

  // Showing the cards and animating them
  public async show(): Promise<void> {
    for (let index = this.cards.length - 1; index >= 0; index--) {
      const card = this.cards[index];
      const offsetPosition = (this.cards.length - index) * 0.5;
      const cardFinalPositionY =
        engine().renderer.height * 0.9 - card.height * 0.5 + offsetPosition;
      const cardFinalPositionX = engine().renderer.width * 0.5 + offsetPosition;

      animate(
        card,
        { y: cardFinalPositionY, x: cardFinalPositionX },
        {
          duration: 2,
          delay: this.cards.length - index,
          onUpdate: () => {
            // This is responsible for changing the card z-index from Top of the deck to bottom
            if (card.y < engine().renderer.height * 0.5) return;
            card.zIndex = this.cards.length - index;
          },
        },
      );
    }
  }
}
