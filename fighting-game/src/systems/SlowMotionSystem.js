export default class SlowMotionSystem {

  static time = 0;
  static factor = 0.3;

  static trigger(duration = 0.2, slowFactor = 0.3) {
    this.time = duration;
    this.factor = slowFactor;
  }

  static update(deltaTime) {
    if (this.time > 0) {
      this.time -= deltaTime;
    }
  }

  static getDeltaTime(deltaTime) {
    if (this.time > 0) {
      return deltaTime * this.factor;
    }
    return deltaTime;
  }
}