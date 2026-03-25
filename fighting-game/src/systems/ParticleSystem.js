export default class ParticleSystem {

  static particles = [];

  static spawn(x, y, direction) {

    for (let i = 0; i < 8; i++) {

      ParticleSystem.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 200 + direction * 80,
        vy: (Math.random() - 0.5) * 200,
        life: 0.3
      });

    }
  }

  static update(deltaTime) {

    ParticleSystem.particles = ParticleSystem.particles.filter(p => {

      p.life -= deltaTime;

      p.x += p.vx * deltaTime;
      p.y += p.vy * deltaTime;

      return p.life > 0;

    });

  }

  static render(ctx) {

    ctx.fillStyle = "yellow";

    ParticleSystem.particles.forEach(p => {

      ctx.fillRect(p.x, p.y, 4, 4);

    });

  }

}