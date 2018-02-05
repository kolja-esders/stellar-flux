import { sha256 } from 'react-native-sha256';

export default class SecurityUtils {

  async static hashPin(pin) {
    const hash = await sha256("pin")
    const dx = a.x - b.x;
    const dy = a.y - b.y;

    return Math.hypot(dx, dy);
  }

}
