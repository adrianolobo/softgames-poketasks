import { Button } from "../ui/Button";
import { engine } from "../getEngine";
import { MainScreen } from "../screens/main/MainScreen";

// Button responsible for navigating back to MainMenuScreen
export class BackMainMenuButton extends Button {
  constructor() {
    super({
      text: "Main Menu",
      width: 200,
      height: 80,
      fontSize: 24,
    });

    const defaultPadding = 30;
    this.x = defaultPadding + (this.width * 0.5);
    this.y = defaultPadding + (this.height * 0.5);

    this.onPress.connect(() => {
      engine().navigation.showScreen(MainScreen);
    });
  }
}
