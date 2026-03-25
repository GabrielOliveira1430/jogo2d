export default class FreezeSystem {

  static time = 0;

  static trigger(duration = 0.05) {
    this.time = duration;
  }

  static update(deltaTime) {
    if (this.time > 0) {
      this.time -= deltaTime;
    }
  }

  static isFrozen() {
    return this.time > 0;
  }

}