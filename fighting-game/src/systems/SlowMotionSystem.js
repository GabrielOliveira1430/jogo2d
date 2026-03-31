export default class SlowMotionSystem {

  static time = 0;
  static factor = 1; // 🔥 começa normal

  // 🔥 USAR ESSE MÉTODO SEMPRE
  static set(factor = 1, duration = 0) {
    this.factor = factor;
    this.time = duration;
  }

  // 🔥 mantém compatibilidade com seu código antigo
  static trigger(duration = 0.2, slowFactor = 0.3) {
    this.time = duration;
    this.factor = slowFactor;
  }

  static update(deltaTime) {
    if (this.time > 0) {
      this.time -= deltaTime;

      // 🔥 quando acabar, volta ao normal automaticamente
      if (this.time <= 0) {
        this.time = 0;
        this.factor = 1;
      }
    }
  }

  static getDeltaTime(deltaTime) {
    // 🔥 proteção contra travamento
    if (typeof deltaTime !== "number" || deltaTime <= 0) {
      return 0.016; // ~60 FPS fallback
    }

    return deltaTime * this.factor;
  }
}