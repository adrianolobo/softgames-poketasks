import { Container } from "pixi.js";
import { engine } from "../../getEngine";
import { IAvatar, IPhrase } from "./MagicWordsScreen";
import { PhraseText } from "./PhraseText";
import { NameText } from "./NameText";
import { clamp } from "../../../engine/utils/maths";

export class DialogueHelper {
  // Parse the phrase text replacing {EMOJIS} with <IMG> tags
  public static GetParsedText(
    text: string,
    emojies: Map<string, string>,
  ): string {
    /* eslint-disable-next-line */
    return text.replace(/\{(\w+)\}/g, (_match, emojiName) => {
      const emojiBase64 = emojies.get(emojiName);
      if (!emojiBase64) {
        console.warn(`The emoji: ${emojiName} was not found!`);
        return "";
      } // fallback to original if not found

      return `<img src="${emojiBase64}" width="32" height="32" />`;
    });
  }

  // Set the avatar position acording to the value defined by the avatar API data
  public static SetAvatarPosition(
    avatar: IAvatar,
    textPadding: number,
    wordWarpWidthValue: number,
  ) {
    avatar.sprite.y = engine().screen.height * 0.5 - textPadding;

    if (avatar.position == "left") {
      avatar.sprite.anchor = { x: 0, y: 1 };
      avatar.sprite.x = engine().screen.width * 0.5 - wordWarpWidthValue * 0.5;
      return;
    }

    avatar.sprite.anchor = { x: 1, y: 1 };
    avatar.sprite.x = engine().screen.width * 0.5 + wordWarpWidthValue * 0.5;
  }

  // Show a specific phrase in a dialogue conversation
  public static ShowPhrase(
    phrase: IPhrase,
    mainContainer: Container,
    emojies: Map<string, string>,
    avatars: Map<string, IAvatar>,
  ) {
    mainContainer.removeChildren();
    const text = DialogueHelper.GetParsedText(phrase.text, emojies);

    const textPadding = 25;
    const maxWordWarpValue = 700;
    const minWordWarpValue = 500;
    // define the min and max width so that it renders well in multiple screen sizes
    const wordWarpWidthValue = clamp(
      engine().renderer.width - textPadding * 2,
      minWordWarpValue,
      maxWordWarpValue,
    );

    // Setting up PhraseText
    const phraseText = new PhraseText(text, wordWarpWidthValue);
    mainContainer.addChild(phraseText);

    // Setting up nameText
    const nameText = new NameText(phrase.name, wordWarpWidthValue);
    mainContainer.addChild(nameText);
    nameText.x = phraseText.x;
    nameText.y = phraseText.y - textPadding;

    // Check if the Avatar image is available.
    const avatar = avatars.get(phrase.name);
    if (!avatar) {
      console.warn(`Avatar is not available for ${phrase.name}`);
      return;
    }

    // setting up Avatar positions
    DialogueHelper.SetAvatarPosition(avatar, textPadding, wordWarpWidthValue);
    mainContainer.addChild(avatar.sprite);
  }
}
